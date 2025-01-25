import crypto from 'crypto';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApplicationConfig } from '@/config/ApplicationConfig';

interface PaymentRequestBody {
  user_id: string;
  price: number;
  phone: string;
  name: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { user_id, price, phone, name } = req.body as PaymentRequestBody;

      // Check if the required fields are provided
      if (!user_id || !price || !phone || !name) {
        console.error('Missing required fields:', { user_id, price, phone, name });
        return res.status(400).json({ message: 'Missing required fields', success: false });
      }

      // Generate a unique merchant transaction ID
      const merchantTransactionId = 'M' + Date.now();

      // Construct payment data
      const data = {
        merchantId: process.env.MERCHANT_ID as string,
        merchantTransactionId,
        merchantUserId: 'MUID' + user_id,
        name,
        amount: price * 100, // Price in paise
        redirectUrl: `${ApplicationConfig.baseUrl}/api/status/${merchantTransactionId}`, // Callback URL for status
        redirectMode: 'POST',
        mobileNumber: phone,
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
      };

      console.log('Payment Data:', data); // Log payment data for debugging

      // Convert data to base64
      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      console.log('Base64 Payload:', payloadMain); // Log base64 encoded payload

      // Generate checksum
      const keyIndex = 1;
      const string = payloadMain + '/pg/v1/pay' + (process.env.SALT_KEY as string);
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = `${sha256}###${keyIndex}`;
      console.log('Checksum:', checksum); // Log checksum for debugging

      // API call to PhonePe (ensure using correct URL for environment)
      const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"; // For sandbox

      const options = {
        method: 'POST',
        url: prod_URL,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
        data: {
          request: payloadMain,
        },
      };

      // Make the request to PhonePe
      const response = await axios.request(options);

      console.log('PhonePe API Response:', response.data); // Log response for debugging

      // Check if PhonePe API response contains the redirect URL
      if (
        response.data &&
        response.data.data &&
        response.data.data.instrumentResponse &&
        response.data.data.instrumentResponse.redirectInfo
      ) {
        return res.json({ success: true, paymentUrl: response.data.data.instrumentResponse.redirectInfo.url });
      } else {
        return res.status(400).json({ success: false, message: 'Failed to get redirect URL from PhonePe' });
      }
    } catch (error) {
      console.error('Error in /api/payment:', error);
      res.status(500).json({
        message: 'An error occurred while initiating the payment',
        success: false,
        error: (error as Error).message,
      });
    }
  } else {
    // Handle methods other than POST
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
