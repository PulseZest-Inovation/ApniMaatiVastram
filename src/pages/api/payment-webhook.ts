import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { setDocWithCustomId } from '@/service/Firebase/postFirestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const receivedData = req.body;
    console.log("📩 Webhook Received Data:", receivedData);

    // ✅ Extract proper data
    const paymentData = receivedData?.data?.data;
    if (!paymentData) {
      return res.status(400).json({ success: false, message: "Invalid data format" });
    }

    const { merchantTransactionId, transactionId } = paymentData;
    
    if (!merchantTransactionId || !transactionId) {
      return res.status(400).json({ success: false, message: "Missing transaction ID" });
    }

    // ✅ Verify Checksum (Corrected)
    const secretKey = "89952abe-9680-447b-9dcf-18f2b31d923b"; // Replace with actual key
    const payloadString = JSON.stringify(receivedData);
    const expectedChecksum = crypto.createHash("sha256").update(payloadString + secretKey).digest("hex");

    if (req.headers["x-verify"] !== expectedChecksum) {
      return res.status(400).json({ success: false, message: "Invalid checksum" });
    }

  
    await setDocWithCustomId('payments', transactionId, paymentData);

    console.log(`✅ Transaction ${merchantTransactionId} saved in Firestore`);

    return res.json({ success: true, message: "Payment status received" });
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
