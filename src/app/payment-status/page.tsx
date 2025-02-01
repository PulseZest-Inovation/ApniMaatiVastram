"use client"; // Agar app router (app directory) use kar rahe ho

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function PaymentStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams?.get("transactionId") || ""; // ✅ Null safety handle

  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    if (transactionId) {
      const fetchStatus = async () => {
        try {
          const response = await axios.get(`/api/payment-status?transactionId=${transactionId}`);
          if (response.data.success && response.data.code === "PAYMENT_SUCCESS") {
            setStatus("Payment Successful!");
            setTimeout(() => router.push("/success-page"), 3000);
          } else if (response.data.code === "PAYMENT_PENDING") {
            setStatus("Payment is still pending. Please wait...");
          } else {
            setStatus("Payment Failed.");
            setTimeout(() => router.push("/failure-page"), 3000);
          }
        } catch {
          setStatus("Error fetching payment status.");
        }
      };

      fetchStatus();
      const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
      return () => clearInterval(interval); // Cleanup interval
    }
  }, [transactionId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl">{status}</h1>
    </div>
  );
}
