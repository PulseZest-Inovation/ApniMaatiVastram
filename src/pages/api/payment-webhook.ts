import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { setDocWithCustomId } from "@/service/Firebase/postFirestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const receivedData = req.body;
    console.log("📩 Webhook Received Data:", receivedData);

    // ✅ Extract data correctly
    const paymentData = receivedData?.data;
    if (!paymentData) {
      return res.status(400).json({ success: false, message: "Invalid data format" });
    }

    const { merchantTransactionId, transactionId } = paymentData;
    if (!merchantTransactionId || !transactionId) {
      return res.status(400).json({ success: false, message: "Missing transaction ID" });
    }

    // ✅ Verify Checksum Correctly
    const secretKey = "89952abe-9680-447b-9dcf-18f2b31d923b"; // Store in ENV
    const receivedChecksum = (req.headers["x-verify"] as string) || "";

    const payloadBase64 = Buffer.from(JSON.stringify(receivedData)).toString("base64");
    const expectedHash = crypto.createHash("sha256").update(payloadBase64 + "/pg/v1/pay" + secretKey).digest("hex");
    const expectedChecksum = `${expectedHash}###1`;
    
    if (receivedChecksum !== expectedChecksum) {
      console.error("❌ Invalid checksum. Expected:", expectedChecksum, "Received:", receivedChecksum);
      return res.status(400).json({ success: false, message: "Invalid checksum" });
    }
    

    // ✅ Store transaction in Firestore
    console.log("Saving to Firestore:", paymentData);
    await setDocWithCustomId("payments", transactionId, paymentData);

    console.log(`✅ Transaction ${merchantTransactionId} saved in Firestore`);
    return res.json({ success: true, message: "Payment status received" });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
