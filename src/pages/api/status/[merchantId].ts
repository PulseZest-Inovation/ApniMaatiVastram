import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { ApplicationConfig } from '@/config/ApplicationConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { merchantId } = req.query;

  if (req.method === 'GET') {
    try {
      // Example: Fetching payment status from some external API
      const response = await axios.get(`${ApplicationConfig.baseUrl}/api/payment-status/${merchantId}`);
      
      if (!response.data.success) {
        return res.status(400).json({ success: false, message: 'Payment failed' });
      }

      return res.status(200).json({ success: true, data: response.data });

    } catch (error) {
      console.error('Error fetching payment status:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
