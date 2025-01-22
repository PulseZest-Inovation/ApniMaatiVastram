

export default function handler(req, res) {
 
    if (req.method === "POST") {
        const { transaction_id, amount, status } = req.body;

        if (!transaction_id || !amount || !status) {
            console.error("Invalid Request Body");
            return res.status(400).json({ message: "Invalid Request" });
        }

        res.status(200).json({
            status: "success",
            message: "Transaction received successfully",
            received: { transaction_id, amount, status },
        });
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
