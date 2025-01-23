'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Import the `useParams` hook
import { getDataFromSubCollection } from '@/service/Firebase/getFirestore';
import { getAuth } from 'firebase/auth'; // Firebase Auth
import { Spin } from 'antd';

export default function OrderId() {
    const params = useParams();
  const orderId = params?.orderId as string; 
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Get the current user using Firebase Auth
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error('No authenticated user found.');
          setLoading(false);
          return;
        }

        const userDocId = user.uid; // Use the user's UID as the document ID
        const data = await getDataFromSubCollection(
          'customers', // Main collection
          userDocId, // Current user document ID
          'orders', // Subcollection name
          orderId // Order ID as the document name
        );

        setOrderData(data);
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <p><strong>Order ID:</strong> {orderData.id}</p>
      <p><strong>Status:</strong> {orderData.status}</p>
      <p><strong>Created At:</strong> {new Date(orderData.createdAt.seconds * 1000).toLocaleString()}</p>
      <h2 className="text-xl font-semibold mt-6">Items:</h2>
      <ul>
        {orderData.items?.map((item: any) => (
          <li key={item.id} className="border-b py-2">
            <p><strong>Product:</strong> {item.productTitle}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Total:</strong> ₹{(item.price * item.quantity).toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
