'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spinner } from '@nextui-org/react';
import axios from 'axios';
import { placeOrder } from '@/components/Checkout/placeOrder';
import { fetchEmailDetails } from '@/utils/getSendingEmail';
import { toast } from 'react-toastify';
import { getAllDocsFromSubCollection } from '@/service/Firebase/getFirestore';
import { handleConfirmedStatusUpdate } from '@/service/shiprocket/handleConfirmedStatusUpdate';

const OrderStatus = () => {
  const params = useParams();
  const Router = useRouter();
  const merchantId = params?.merchantId || null;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (merchantId) {
      const fetchOrderStatus = async () => {
        try {
          setLoading(true);
          setError(null);

          // Fetch payment status from server-side API
          const response = await axios.get(`/api/status/${merchantId}`);
          if (!response.data.success) {
            throw new Error('Payment failed. Please try again.');
          }

          // Retrieve order details from localStorage
          const storedOrderData = localStorage.getItem('orderDetails');
          if (!storedOrderData) {
            throw new Error('No order details found in localStorage.');
          }

          const orderFromLocalStorage = JSON.parse(storedOrderData);
          if (!orderFromLocalStorage || !orderFromLocalStorage.orderId) {
            throw new Error('Order details are missing or invalid.');
          }

          // Combine the localStorage order details with payment response
          const combinedOrderData = {
            ...orderFromLocalStorage,
            ...response.data,
          };

          // Place the order in Firestore
          const orderPlaced = await placeOrder(combinedOrderData);
          if (!orderPlaced) {
            throw new Error('Order placement failed.');
          }

          // Fetch cart details from Firebase
          const cartDetails = await getAllDocsFromSubCollection(
            'customers',
            combinedOrderData.customerId,
            'cart'
          );

          // Fetch email details
          const emailDetail = await fetchEmailDetails();
          if (!emailDetail || !emailDetail.isEnabled) {
            toast.error('Email service is disabled or email details are missing.');
          }

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

          // Send email notification
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailRequestBody),
          });

          if (!emailResponse.ok) {
            const error = await emailResponse.json();
            console.error('Email sending failed:', error);
            toast.error(`Failed to send email: ${error.message}`);
          }

          // **Call Shiprocket API to insert order details**
          const shiprocketOrderCreated = await handleConfirmedStatusUpdate(combinedOrderData);
          if (!shiprocketOrderCreated) {
            throw new Error('Failed to create Shiprocket order.');
          }

          toast.success('Order successfully placed and sent to Shiprocket!');

          // Remove order details from localStorage
          localStorage.removeItem('orderDetails');

          // Navigate to the order confirmation page
          Router.push(`/orders/${combinedOrderData.orderId}`);
        } catch (err: any) {
          console.error('Error:', err.message || err);
          setError(err.message || 'An unknown error occurred.');
        } finally {
          setLoading(false);
        }
      };

      fetchOrderStatus();
    } else {
      setError('Merchant ID is missing.');
    }
  }, [merchantId, Router]);

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
