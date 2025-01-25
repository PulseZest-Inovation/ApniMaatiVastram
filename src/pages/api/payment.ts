import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import axios from 'axios';
import { fetchPaymentDetails } from '@/utils/fetchPaymentSetting';


type PaymentRequestBody = {
  user_id: string;
  price: number;
  phone: string;
  name: string;
};

const newPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const { user_id, price, phone, name }: PaymentRequestBody = req.body;

      // Fetch Payment details from Firestore
      const paymentDetails = await fetchPaymentDetails();

      if (!paymentDetails) {
        return res.status(500).send({
          message: 'Failed to fetch payment settings.',
          success: false,
        });
      }

      const { saltKey, merchantId, keyIndex } = paymentDetails;

      const merchantTransactionId = 'M' + Date.now();
      const data = {
        merchantId: merchantId,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: 'MUID' + user_id,
        name: name,
        amount: price * 100, // Convert to paise
        redirectUrl: `http://localhost:3001/api/v1/status/${merchantTransactionId}`,
        redirectMode: 'POST',
        mobileNumber: phone,
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
      };

      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      const string = payloadMain + '/pg/v1/pay' + saltKey;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + keyIndex;

      const prod_URL = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
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

      const response = await axios.request(options);
      return res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
    } else {
      return res.status(405).send({
        message: 'Method Not Allowed',
        success: false,
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Now TypeScript knows that 'error' is an instance of the Error class
      console.error('Error processing payment:', error.message);
      return res.status(500).send({
        message: error.message,
        success: false,
      });
    }
    
    // Fallback for non-Error objects
    console.error('Unknown error:', error);
    return res.status(500).send({
      message: 'An unexpected error occurred.',
      success: false,
    });
  }
};

export default newPayment;
