const crypto = require('crypto');

const generateChecksum = (data, merchantId, saltKey) => {
  if (!data || !merchantId || !saltKey) {
    throw new Error('All parameters (data, merchantId, and saltKey) are required');
  }

  const payload = JSON.stringify(data); // Convert the data to a string
  const combinedString = `${payload}${merchantId}${saltKey}`; // Concatenate data, merchantId, and saltKey
  const checksum = crypto.createHash('sha256').update(combinedString).digest('hex'); // Generate SHA-256 hash

  return checksum;
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { data, merchantId, saltKey } = req.body;

      // Validate inputs
      if (!data || !merchantId || !saltKey) {
        return res.status(400).json({
          success: false,
          message: 'Missing data, merchantId, or saltKey in the request body',
        });
      }

      // Generate checksum
      const checksum = generateChecksum(data, merchantId, saltKey);

      // Respond with the checksum
      return res.status(200).json({
        success: true,
        checksum,
      });
    } catch (error) {
      console.error('Error generating checksum:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed',
    });
  }
}
