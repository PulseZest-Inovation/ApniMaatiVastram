import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import axios from 'axios';

const checkStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { txnId } = req.query;

    // Validate transaction ID
    if (!txnId || Array.isArray(txnId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing transaction ID.',
      });
    }

    // Load payment settings from environment variables
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const keyIndex = process.env.PHONEPE_KEY_INDEX;

    // Validate environment variables
    if (!merchantId || !saltKey || !keyIndex) {
      return res.status(500).json({
        success: false,
        message: 'Payment configuration is missing. Please check your environment variables.',
      });
    }

    const merchantTransactionId = txnId;

    // Generate the checksum
    const stringToHash = `/pg/v1/status/${merchantId}/${merchantTransactionId}${saltKey}`;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const checksum = `${sha256}###${keyIndex}`;

    const options = {
      method: 'GET',
      url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId,
      },
    };

    // Make the request to PhonePe to check the payment status
    const response = await axios.request(options);

    console.log('PhonePe API Response:', response.data); // Log for debugging

    if (response.data.success === true) {
      return res.status(200).json({
        success: true,
        message: 'Payment Success',
        data: response.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment Failure',
        data: response.data,
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while checking the payment status.',
        error: err.message,
      });
    }
    console.error('Unknown error:', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred.',
    });
  }
};

export default checkStatus;
