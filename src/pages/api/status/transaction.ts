import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import axios from 'axios';
import { fetchPaymentDetails } from '@/utils/fetchPaymentSetting';


const checkStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { txnId } = req.query; // Use req.query for dynamic parameters in Next.js

    if (!txnId || Array.isArray(txnId)) {
      return res.status(400).send({
        success: false,
        message: 'Invalid or missing transaction ID.',
      });
    }

    // Fetch Payment details (Optional: If you want to fetch settings from Firebase)
    const paymentDetails = await fetchPaymentDetails();

    if (!paymentDetails) {
      return res.status(500).send({
        success: false,
        message: 'Failed to fetch payment settings.',
      });
    }

    const { saltKey, merchantId, keyIndex } = paymentDetails;

    const merchantTransactionId = txnId;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

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

    // Check payment status
    const response = await axios.request(options);

    if (response.data.success === true) {
      console.log(response.data);
      return res.status(200).send({
        success: true,
        message: 'Payment Success',
      });
    } else {
      return res.status(400).send({
        success: false,
        message: 'Payment Failure',
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({
        success: false,
        message: err.message,
      });
    }
    console.error('Unknown error:', err);
    return res.status(500).send({
      success: false,
      message: 'An unexpected error occurred.',
    });
  }
};

export default checkStatus;
