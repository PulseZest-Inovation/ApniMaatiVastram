'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@nextui-org/react';
import { placeOrder } from '@/components/Checkout/placeOrder';
import { fetchEmailDetails } from '@/utils/getSendingEmail';
import { toast } from 'react-toastify';
import { getAllDocsFromSubCollection } from '@/service/Firebase/getFirestore';
import { ApplicationConfig } from '@/config/ApplicationConfig';

const OrderStatus = () => {
  const params = useParams();
  const merchantId = Array.isArray(params?.merchantId) ? params.merchantId[0] : params?.merchantId;  
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!merchantId) {
      setError('Merchant ID is missing.');
      setLoading(false);
      return;
    }

    const fetchOrderStatus = async () => {
      try {
        setError(null);
        const transactionId = merchantId;
        // Fetch payment status
        const response = await fetch(`${ApplicationConfig.baseUrl}/api/status/${transactionId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error('Payment failed. Please try again.');
        }

        // Retrieve order details from localStorage
        const storedOrderData = localStorage.getItem('orderDetails');
        if (!storedOrderData) {
          throw new Error('No order details found in localStorage.');
        }

        const orderFromLocalStorage = JSON.parse(storedOrderData);
        if (!orderFromLocalStorage?.orderId) {
          throw new Error('Order details are missing or invalid.');
        }

        // Combine order details with payment response
        const combinedOrderData = { ...orderFromLocalStorage, ...data };

          // Fetch email details
          const emailDetail = await fetchEmailDetails();
          if (!emailDetail || !emailDetail.isEnabled) {
            toast.error('Email service is disabled or email details are missing.');
          }

        // Fetch cart details
        const cartDetails = await getAllDocsFromSubCollection('customers', combinedOrderData.customerId, 'cart');

        // Prepare email request body
        const emailRequestBody = {
          orderDetails: {
            orderId: combinedOrderData.orderId,
            customerEmail: combinedOrderData.email,
            totalAmount: combinedOrderData.totalAmount,
            cartItems: cartDetails,
            fullName: combinedOrderData.fullName,
            phoneNumber: combinedOrderData.phoneNumber,
            address: combinedOrderData.address,
          },
          emailDetails: emailDetail,
          emailType: 'Confirmed',
        };

        // Send email
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailRequestBody),
        });

          if (!emailResponse.ok) {
            const error = await emailResponse.json();
            console.error('Email sending failed:', error);
            toast.error(`Failed to send email: ${error.message}`);
            
          }

        // Place the order
        const orderPlaced = await placeOrder(combinedOrderData);
        if (!orderPlaced) {
          throw new Error('Order placement failed.');
        }

        // Remove order details from localStorage
        localStorage.removeItem('orderDetails');

        // Navigate to the order confirmation page
        router.push(`/orders/${combinedOrderData.orderId}`);
      } catch (err: any) {
        console.error('Error:', err.message || err);
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [merchantId, router]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      {loading ? (
        <Spinner color="warning" />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Spinner color="success" />
      )}
    </div>
  );
};

export default OrderStatus;
