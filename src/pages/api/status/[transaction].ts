import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import axios from 'axios';

const checkStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { transaction } = req.query;

    // Debug log for transaction ID
    console.log('Received transaction ID:', transaction);

    // Validate transaction ID
    if (!transaction || Array.isArray(transaction)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing transaction ID.',
      });
    }

    // Load payment settings from environment variables
    const merchantId = "M22FSTSDU1CZW";
    const saltKey = "89952abe-9680-447b-9dcf-18f2b31d923b";
    const keyIndex = "1";

    // Validate environment variables
    if (!merchantId || !saltKey || !keyIndex) {
      return res.status(500).json({
        success: false,
        message: 'Payment configuration is missing. Please check your environment variables.',
      });
    }

    const merchantTransactionId = transaction;

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
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking the payment status.',
    });
  }
};

export default checkStatus;
