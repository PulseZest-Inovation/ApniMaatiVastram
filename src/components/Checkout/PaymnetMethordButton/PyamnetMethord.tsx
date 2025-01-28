'use client';

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { handleOnlineOrder } from '../online/online';
import { handleCodOrder } from '../cod/cod';
import { generateOrderId } from '../genrateOrderId';
import DesktopPaymentMethod from './DesktopPyament';
import MobilePaymentMethod from './MobilePayment';

interface PaymentMethodProps {
  formData: {
    fullName: string;
    country: string;
    state: string;
    address: string;
    apartment: string;
    city: string;
    pinCode: string;
    phoneNumber: string;
    email: string;
    customerId: string;
  };
  totalAmount: number;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ formData, totalAmount: initialTotalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>('online');
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(initialTotalAmount);
  const [showDeliveryChargeMessage, setShowDeliveryChargeMessage] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (paymentMethod === 'cod' && initialTotalAmount <= 499) {
      setShowDeliveryChargeMessage(true);
      setTotalAmount(initialTotalAmount + 49); // Add delivery charge
    } else {
      setShowDeliveryChargeMessage(false);
      setTotalAmount(initialTotalAmount); // Reset total amount
    }
  }, [paymentMethod, initialTotalAmount]);

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmitOrder = async () => {
    const orderId = generateOrderId();

    setLoading(true);
    try {
      let success = false;

      if (paymentMethod === 'online') {
        success = await handleOnlineOrder(formData, totalAmount, orderId);
        if (success) {
          toast.success('Redirecting to payment page...');
        } else {
          toast.error('Online payment initiation failed.');
        }
      } else if (paymentMethod === 'cod') {
        success = await handleCodOrder(formData, totalAmount, orderId, setLoading);
        toast.success('COD order placed successfully!');
        setTimeout(() => {
          router.push('/orders'); // Redirect to /orders page
        }, 2000);
      }
    } catch (error) {
      toast.error('An error occurred while placing the order. Please try again.');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <DesktopPaymentMethod
        paymentMethod={paymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
        totalAmount={totalAmount}
        loading={loading}
        showDeliveryChargeMessage={showDeliveryChargeMessage}
        handleSubmitOrder={handleSubmitOrder}
      />
      <MobilePaymentMethod
        paymentMethod={paymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
        totalAmount={totalAmount}
        loading={loading}
        showDeliveryChargeMessage={showDeliveryChargeMessage}
        handleSubmitOrder={handleSubmitOrder}
      />
    </div>
  );
};

export default PaymentMethod;
