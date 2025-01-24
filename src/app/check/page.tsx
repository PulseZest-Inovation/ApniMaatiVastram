'use client'

import { useState } from 'react';

const Payment = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const paymentData = {
      user_id: '12345', 
      price: 500, 
      phone: '9876543210',
      name: 'John Doe',
    };

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const responseData = await response.json();

        // Check if paymentUrl exists in the response data
        if (responseData.success && responseData.paymentUrl) {
          // Redirect the user to the payment URL
          window.location.href = responseData.paymentUrl;
        } else {
          alert('Failed to get payment URL');
        }
      } else {
        alert('Payment initiation failed');
      }
    } catch (error) {
      alert('Error initiating payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing Payment...' : 'Pay with PhonePe'}
      </button>
    </div>
  );
};

export default Payment;
