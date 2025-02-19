'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDataFromSubCollection } from '@/service/Firebase/getFirestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';  
import { Button, Modal, Select, Spin, Timeline, Upload } from 'antd';
import OrderReturnModal from './returnOrder';

export default function OrderId() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [orderReturnModel, setOrderReturnModel] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<null| string>('')

  useEffect(() => {
    const fetchOrderData = async (userUid: string) => {
      try {
        const data = await getDataFromSubCollection(
          'customers',
          userUid,
          'orders',
          orderId
        );

        setOrderData(data);
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        setLoading(false);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchOrderData(user.uid);
        setUserId(user.uid);
      } else {
        console.error('No authenticated user found.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
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

  const statusTimeline = [
    { label: 'Pending', dateKey: 'pendingAt' },
    { label: 'Confirmed', dateKey: 'confirmedAt' },
    { label: 'Processing', dateKey: 'processingAt' },
    { label: 'Dispatched', dateKey: 'dispatchedAt' },
    { label: 'Delivered', dateKey: 'deliveredAt' },
  ];

  const returnRefundStatuses = [
    'RequestReturned', 'AcceptReturned', 'RejectReturned', 'Returned',
    'RequestRefund', 'AcceptedRefund', 'RejectedRefund', 'Refunded'
  ];

  const returnRefundTimeline = returnRefundStatuses.map((status) => ({
    label: status,
    isActive: orderData.status === status,
  }));

  let filteredTimeline = statusTimeline;
  if (orderData.status === 'Cancelled') {
    filteredTimeline = statusTimeline.filter((step) => step.label === 'Pending' || step.label === 'Confirmed');
  }

  const isReturnOrRefundActive = returnRefundStatuses.includes(orderData.status);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <p><strong>Order ID:</strong> {orderData.id}</p>
      <p><strong>Status:</strong> {orderData.status}</p>
      <p><strong>Total:</strong> ₹{orderData.totalAmount}</p>
      {!isReturnOrRefundActive && (
        <p><strong>Created At:</strong> {new Date(orderData.createdAt.seconds * 1000).toLocaleString()}</p>
      )}

      {!isReturnOrRefundActive && (
        <>
          <h2 className="text-xl font-semibold mt-6">Order Timeline</h2>
          <Timeline className="mt-4">
            {filteredTimeline.map((step, index) => (
              <Timeline.Item
                key={index}
                color={
                  step.label === orderData.status ||
                  filteredTimeline.findIndex((s) => s.label === orderData.status) >= index
                    ? 'green'
                    : 'gray'
                }
              >
                <p className="font-semibold">{step.label}</p>
                {orderData[step.dateKey] && (
                  <p className="text-sm text-gray-600">
                    {new Date(orderData[step.dateKey].seconds * 1000).toLocaleString()}
                  </p>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        </>
      )}

      {isReturnOrRefundActive && (
        <>
          <h2 className="text-xl font-semibold mt-6">Return & Refund Status</h2>
          <Timeline className="mt-4">
            {returnRefundTimeline.map((step, index) => (
              <Timeline.Item key={index} color={step.isActive ? 'green' : 'gray'}>
                <p className="font-semibold">{step.label}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        </>
      )}

      <h2 className="text-xl font-semibold mt-6">Items:</h2>
      <ul>
        {orderData.orderDetails?.map((item: any) => (
          <li key={item.id} className="border-b py-2">
            <p><strong>Product:</strong> {item.productTitle}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Total:</strong> ₹{(item.price * item.quantity).toFixed(2)}</p>
          </li>
        ))}
      </ul>

      {orderData.status === 'Delivered' && (
        <div className='p-3 flex justify-end'>
          <Button onClick={() => setOrderReturnModel(true)}>Return</Button>
        </div>
      )}

      <OrderReturnModal open={orderReturnModel} onClose={() => setOrderReturnModel(false)} orderId={orderId} userUid={userId || ''} />
    </div>
  );
}
