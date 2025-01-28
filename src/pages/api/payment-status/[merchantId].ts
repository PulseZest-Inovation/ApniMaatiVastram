import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { ApplicationConfig } from '@/config/ApplicationConfig';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { merchantId } = req.query;

  if (req.method === 'GET') {
    try {
      // Fetch payment status from the actual payment service (PhonePe or other service)
      const response = await axios.get(`${ApplicationConfig.baseUrl}/api/status/${merchantId}`);

      // Check if payment was successful
      if (!response.data.success) {
        return res.status(400).json({ success: false, message: 'Payment failed' });
      }

      // If payment is successful, redirect to the order status page
      // Note: You can append any necessary parameters to this URL
      return res.redirect(302, `/checkout/order-status/${merchantId}`);

    } catch (error) {
      console.error('Error fetching payment status:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
