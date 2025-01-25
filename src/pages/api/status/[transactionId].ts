import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchPaymentDetails } from '@/utils/fetchPaymentSetting';

interface CallbackData {
  status: string;
  orderId?: string;
  amount?: number;
  [key: string]: any; // Allow for additional dynamic properties
}

// Helper function to calculate checksum
const calculateChecksum = (data: string, saltKey: string): string => {
  return crypto.createHash('sha256').update(data + saltKey).digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Extract transactionId from the query string
      const { transactionId } = req.query;
      if (!transactionId || Array.isArray(transactionId)) {
        return res.status(400).json({ success: false, message: 'Missing or invalid transaction ID' });
      }

      // Extract `data` from the request body
      const { data }: { data: CallbackData } = req.body;
      if (!data) {
        return res.status(400).json({ success: false, message: 'Missing data in the request body' });
      }

      console.log('Received callback for transaction:', transactionId);
      console.log('Callback data:', data);

      // Fetch payment details (merchantId, secretKey, keyIndex)
      const paymentDetails = await fetchPaymentDetails();
      if (!paymentDetails) {
        return res.status(500).json({ success: false, message: 'Failed to fetch payment settings' });
      }

      // Extract secretKey and saltKey
      const { saltKey } = paymentDetails;

      // Normalize headers to avoid case-sensitivity issues
      const headers = Object.keys(req.headers).reduce((acc, key) => {
        const headerValue = req.headers[key];

        // Ensure headerValue is a string (or join if it's an array)
        if (Array.isArray(headerValue)) {
          acc[key.toLowerCase()] = headerValue.join(', '); // Join array elements as a string
        } else {
          acc[key.toLowerCase()] = headerValue; // If it's a single string, directly assign it
        }

        return acc;
      }, {} as Record<string, string | undefined>);

      const expectedChecksum = headers['x-verify'];
      if (!expectedChecksum) {
        return res.status(400).json({ success: false, message: 'Missing checksum in the headers' });
      }

      // Generate payload and compute checksum
      const payload = JSON.stringify(data);
      const computedChecksum = calculateChecksum(payload, saltKey);

      // Manually compare checksum with the provided checksum
      if (expectedChecksum !== computedChecksum) {
        console.error('Checksum verification failed');
        return res.status(400).json({ success: false, message: 'Checksum verification failed' });
      }

      // Process the payment status
      switch (data.status) {
        case 'SUCCESS':
          console.log(`Payment successful for transaction: ${transactionId}`);
          return res.json({ success: true, message: 'Payment processed successfully' });
        case 'FAILED':
          console.error(`Payment failed for transaction: ${transactionId}`);
          return res.status(400).json({ success: false, message: 'Payment failed' });
        case 'PENDING':
          console.warn(`Payment is pending for transaction: ${transactionId}`);
          return res.status(202).json({ success: false, message: 'Payment is pending' });
        default:
          console.error(`Unknown payment status for transaction: ${transactionId}`);
          return res.status(400).json({ success: false, message: 'Unknown payment status' });
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error in payment status callback:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the payment status',
        error: err.message,
        stack: err.stack,
      });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
