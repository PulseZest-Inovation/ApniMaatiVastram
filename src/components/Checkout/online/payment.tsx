// pages/paymentPage.tsx
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { handleOnlineOrder } from './online';

const PaymentPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { orderId, amount } = router.query;

    if (orderId && amount) {
      // Trigger the payment gateway here (redirect to payment platform)
      // On successful payment, you will get the transaction ID (Assume it's from the gateway)
      const transactionId = 'sampleTransactionId123';  // Replace with actual transaction ID from the payment gateway

      // Call the function to handle success
      handleOnlineOrder({ orderId, transactionId });
    }
  }, [router.query]);

  return <div>Payment Page</div>;
};

export default PaymentPage;
