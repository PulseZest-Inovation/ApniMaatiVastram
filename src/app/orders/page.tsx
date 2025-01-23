'use client';

import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getAllDocsFromSubCollection } from '@/service/Firebase/getFirestore';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';

interface Order {
  id: string;
  orderId: string;
  status: string;
  totalAmount: number;
  createdAt: Timestamp;
  [key: string]: any; // Other order fields
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error('User not authenticated');
          return;
        }

        const userId = user.uid;
        const fetchedOrders = await getAllDocsFromSubCollection<Order>(
          'customers',
          userId,
          'orders'
        );

        // Sort the orders by `createdAt` in descending order (latest first)
        const sortedOrders = fetchedOrders.sort((a, b) => 
          b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
        );

        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-400 border-solid rounded-full animate-spin"></div>
        <p className="ml-4 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border p-4 rounded-lg hover:shadow-md cursor-pointer"
              onClick={() => handleOrderClick(order.orderId)}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Order ID: {order.orderId}</h2>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    order.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">Total: ₹{order.totalAmount}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(order.createdAt?.toDate()).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
