'use client';

import React, { useState, useEffect } from 'react';
import { RadioGroup, Radio } from '@nextui-org/react';
import { Typography } from 'antd';
import Image from 'next/image';
import { Button, Spinner } from '@nextui-org/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { handleCodOrder } from './cod/cod';
import { handleOnlineOrder } from './online/online';
import { generateOrderId } from './genrateOrderId';

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
      {/* Desktop UI */}
      <div className="hidden md:block">
        <RadioGroup label="Select Payment Method" value={paymentMethod} onChange={handlePaymentMethodChange}>
          <Radio value="online">
            <div className="flex items-center">
              <Typography className="font-bold">Online</Typography>
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fphonepe.png?alt=media&token=b162c09c-86b4-41b8-8afa-b97bed7f13fb"
                alt="phonepe"
                height={20}
                width={20}
                className="ml-2 mr-2"
              />
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fgoogle-pay.png?alt=media&token=20b78cef-cf9d-4496-978a-1785680f5a3e"
                alt="google-pay"
                height={20}
                width={20}
                className="mr-2"
              />
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fpaytm.png?alt=media&token=63aaf82a-9999-4554-9725-0566dbb8e97d"
                alt="paytm"
                height={20}
                width={20}
              />
            </div>
          </Radio>
          <Radio value="cod">
            <Typography className="font-bold">Cash on Delivery (COD)</Typography>
          </Radio>
        </RadioGroup>

        {showDeliveryChargeMessage && (
          <Typography className="text-red-500 mt-2">
            Your order value is less than ₹500. ₹49 delivery charges will be added to the total.
          </Typography>
        )}

        <Button
          color={paymentMethod === 'cod' ? 'primary' : 'success'}
          className="mt-4 text-white"
          onPress={handleSubmitOrder}
          disabled={loading}
        >
          {loading ? (
            <Spinner color="success" />
          ) : paymentMethod === 'cod' ? (
            `Place Order ₹${totalAmount}`
          ) : (
            `Pay Online Safe & Secure ₹${totalAmount}`
          )}
        </Button>
      </div>

      {/* Mobile UI */}
      <div className="block md:hidden">
        <div className="p-4">
          <h3 className="text-lg font-bold mb-4">Payment Method</h3>
          <RadioGroup label="Select Payment Method" value={paymentMethod} onChange={handlePaymentMethodChange}>
            <Radio value="online">
              <div className="flex items-center">
                <Typography className="font-bold">Online</Typography>
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fphonepe.png?alt=media&token=b162c09c-86b4-41b8-8afa-b97bed7f13fb"
                  alt="phonepe"
                  height={20}
                  width={20}
                  className="ml-2 mr-2"
                />
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fgoogle-pay.png?alt=media&token=20b78cef-cf9d-4496-978a-1785680f5a3e"
                  alt="google-pay"
                  height={20}
                  width={20}
                  className="mr-2"
                />
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fpaytm.png?alt=media&token=63aaf82a-9999-4554-9725-0566dbb8e97d"
                  alt="paytm"
                  height={20}
                  width={20}
                />
              </div>
            </Radio>
            <Radio value="cod">
              <Typography className="font-bold">Cash on Delivery (COD)</Typography>
            </Radio>
          </RadioGroup>

          {showDeliveryChargeMessage && (
            <Typography className="text-red-500 mt-2">
              Your order value is less than ₹500. ₹49 delivery charges will be added to the total.
            </Typography>
          )}
        </div>

        {/* Sticky Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
          <Button
            color={paymentMethod === 'cod' ? 'primary' : 'success'}
            className="w-full text-white"
            onPress={handleSubmitOrder}
            disabled={loading}
          >
            {loading ? (
              <Spinner color="success" />
            ) : paymentMethod === 'cod' ? (
              `Place Order ₹${totalAmount}`
            ) : (
              `Pay Online Safe & Secure ₹${totalAmount}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
