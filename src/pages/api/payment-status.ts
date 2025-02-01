import { getDataByDocName } from '@/service/Firebase/getFirestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { transactionId } = req.query;
    if (!transactionId) {
      return res.status(400).json({ success: false, message: "Transaction ID is required" });
    }

    // ✅ Fetch payment status from Firestore
    const paymentData = await getDataByDocName('payments', transactionId.toString());

    if (!paymentData) {
      return res.status(404).json({ success: false, code: 'TRANSACTION_NOT_FOUND', message: 'No Transaction found with the given details.', data: {} });
    }

    return res.json({ success: true, message: "Transaction found", data: paymentData });
  } catch (error) {
    console.error('❌ Error fetching transaction:', error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
