import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const PhonePePaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Extract query params (orderId, status, etc.) from the callback URL
  useEffect(() => {
    if (searchParams) {
      const orderId = searchParams.get('orderId');
      const status = searchParams.get('status');

      if (orderId && status) {
        // Handle the callback response from PhonePe
        handlePaymentCallback(orderId, status);
      } else {
        setLoading(false);
        toast.error('Invalid payment response. Please try again.');
        router.push('/cart'); // Redirect to cart on error
      }
    } else {
      setLoading(false);
      toast.error('Unable to process payment response. Please try again.');
      router.push('/cart');
    }
  }, [searchParams, router]);

  const handlePaymentCallback = async (orderId: string, status: string) => {
    try {
      setLoading(true);

      // Simulate backend verification of the payment status
      const response = await fetch(`/api/verifyPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Payment successful! Order placed successfully.');
        router.push('/orders'); // Redirect to the orders page
      } else {
        toast.error(result.message || 'Payment verification failed.');
        router.push('/cart'); // Redirect to cart on failure
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('An error occurred while verifying the payment.');
      router.push('/cart'); // Redirect to cart on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? (
        <div className="text-center">
          <h1 className="text-lg font-bold">Processing Payment...</h1>
          <p className="text-gray-500">Please wait while we verify your payment.</p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-lg font-bold">Payment Failed</h1>
          <p className="text-gray-500">Something went wrong. Redirecting you to the cart...</p>
        </div>
      )}
    </div>
  );
};

export default PhonePePaymentPage;
