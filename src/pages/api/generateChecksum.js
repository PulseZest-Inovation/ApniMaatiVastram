import crypto from 'crypto';

const calculateChecksum = (data, saltKey) => {
  return crypto.createHash('sha256').update(data + saltKey).digest('hex');
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Your provided values
      const merchantId = 'M22FSTSDU1CZW';
      const saltKey = '89952abe-9680-447b-9dcf-18f2b31d923b';

      // Extract data from the body of the request
      const { status, orderId, amount } = req.body;

      // Prepare payload
      const payload = JSON.stringify({ status, orderId, amount, merchantId });

      // Generate checksum
      const checksum = calculateChecksum(payload, saltKey);

      // Send checksum in the response
      return res.status(200).json({ checksum });
    } catch (error) {
      console.error('Error generating checksum:', error);
      return res.status(500).json({ success: false, message: 'An error occurred' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
