'use client';

import React, { useState } from 'react';
import { RadioGroup, Radio } from '@nextui-org/react';
import { Typography } from 'antd';
import Image from 'next/image';
import { Button } from '@nextui-org/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'; // Import useRouter
import { handleCodOrder } from './cod/cod';
import { handleOnlineOrder } from './online/online';

interface PaymentMethodProps {
  formData: {
    fullName: string;
    country: string;
    state: string;
    address: string;
    apartment: string;
    houseNumber: string;
    city: string;
    pinCode: string;
    phoneNumber: string;
    email: string;
  };
  totalAmount: number;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ formData, totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>('online');
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const router = useRouter(); // Initialize useRouter

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const validateFields = () => {
    const missingFields: string[] = [];

    if (!formData.fullName) missingFields.push('Full Name');
    if (!formData.country) missingFields.push('Country');
    if (!formData.state) missingFields.push('State');
    if (!formData.address) missingFields.push('Address');
    if (!formData.houseNumber) missingFields.push('House Number');
    if (!formData.city) missingFields.push('City');
    if (!formData.pinCode) missingFields.push('Pin Code');
    if (!formData.phoneNumber) missingFields.push('Phone Number');
    if (!formData.email) missingFields.push('Email');
    if (!paymentMethod) missingFields.push('Payment Method');

    if (missingFields.length > 0) {
      toast.error(`Please fill the following fields: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmitOrder = () => {
    if (validateFields()) {
      if (paymentMethod === 'online') {
        handleOnlineOrder(formData, totalAmount, setLoading)
          .then(() => {
            toast.success('Online payment successful!');
            setTimeout(() => {
              router.push('/orders'); // Redirect to /orders page
            }, 2000);
          })
          .catch((error) => {
            toast.error('Error processing online payment. Please try again later.');
            console.error('Error with online payment:', error);
          });
      } else if (paymentMethod === 'cod') {
        handleCodOrder(formData, totalAmount, setLoading)
          .then(() => {
            toast.success('COD order placed successfully!');
            setTimeout(() => {
              router.push('/orders'); // Redirect to /orders page
            }, 2000);
          })
          .catch((error) => {
            toast.error('Error placing COD order. Please try again later.');
            console.error('Error placing COD order:', error);
          });
      }
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
        <Button
          color={paymentMethod === 'cod' ? 'primary' : 'success'}
          className="mt-4 text-white"
          onPress={handleSubmitOrder}
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Placing Order...' : paymentMethod === 'cod' ? 'Place Order' : `Pay Online Safe & Secure ₹${totalAmount}`}
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
        </div>

        {/* Sticky Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
          <Button
            color={paymentMethod === 'cod' ? 'primary' : 'success'}
            className="w-full text-white"
            onPress={handleSubmitOrder}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Placing Order...' : paymentMethod === 'cod' ? 'Place Order' : `Pay Online Safe & Secure ₹${totalAmount}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
