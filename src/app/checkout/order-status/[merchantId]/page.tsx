'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Using useParams from next/navigation
import axios from 'axios';
import { placeOrder } from '@/components/Checkout/placeOrder';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { fetchEmailDetails } from '@/utils/getSendingEmail';

const OrderStatus = () => {
  // Get merchantId from URL params. Type it as possibly null or undefined
  const params = useParams();
  const Router = useRouter();
  const merchantId = params?.merchantId || null;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // To handle errors

  useEffect(() => {
    if (merchantId) {
      // Make the API request when merchantId is available
      const fetchOrderStatus = async () => {
        try {
          setLoading(true);
          setError(null); // Reset error state before API call
          const response = await axios.get(`/api/status/${merchantId}`); // Adjust your API route accordingly

          if (response.data.success) {
            // If payment is successful, combine order data from localStorage with response data
            const storedOrderData = localStorage.getItem('orderDetails');
            if (storedOrderData) {
              const orderFromLocalStorage = JSON.parse(storedOrderData);

              // Ensure orderDetails exist in localStorage
              if (orderFromLocalStorage && orderFromLocalStorage.orderId) {
                // Combine the data from localStorage with the response data
                const combinedOrderData = {
                  ...orderFromLocalStorage,
                  ...response.data, // Assuming response.data contains relevant info
                };

                // Call the placeOrder function with combined data
                const orderPlaced = await placeOrder(combinedOrderData);

                if (orderPlaced) {
                  // Redirect to the order page after placing the order
                   const emailDetail = await fetchEmailDetails();
                  
                        await fetch("/api/send-email", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json", // Set the request content type as JSON
                          },
                          body: JSON.stringify({
                            orderDetails: orderFromLocalStorage, // Include order data as the body of the request
                            emailDetails: emailDetail, // Include email configuration details
                            emailType: "Pending", // The type of email (e.g., 'order-received', 'order-shipped', etc.)
                          }),
                        });
                      

                  const orderId = combinedOrderData.orderId;
                  Router.push(`/orders/${orderId}`);
                } else {
                  setError('Order placement failed.');
                }
              } else {
                setError('Order details are missing from localStorage.');
              }
            } else {
              setError('No order details found in localStorage.');
            }
          } else {
            setError('Payment failed. Please try again.');
          }
        } catch (error) {
          console.error('Error fetching order status:', error);
          setError('Error fetching order status. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchOrderStatus();
    } else {
      setError('Merchant ID is missing.');
    }
  }, [merchantId, Router]); // Trigger effect when merchantId or Router changes

  return (
    <div className="min-h-screen justify-center items-center flex">
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
