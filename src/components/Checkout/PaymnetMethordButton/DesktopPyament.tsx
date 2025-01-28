'use client';

import React from 'react';
import { RadioGroup, Radio } from '@nextui-org/react';
import { Typography } from 'antd';
import Image from 'next/image';
import { Button, Spinner } from '@nextui-org/react';

interface DesktopPaymentMethodProps {
  paymentMethod: string | null;
  handlePaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalAmount: number;
  loading: boolean;
  showDeliveryChargeMessage: boolean;
  handleSubmitOrder: () => void;
}

const DesktopPaymentMethod: React.FC<DesktopPaymentMethodProps> = ({
  paymentMethod,
  handlePaymentMethodChange,
  totalAmount,
  loading,
  showDeliveryChargeMessage,
  handleSubmitOrder
}) => {
  return (
    <div className="hidden md:block">
      <RadioGroup label="Select Payment Method" value={paymentMethod} onChange={handlePaymentMethodChange}>
        <Radio value="online">
          <div className="flex items-center">
            <Typography className="font-bold">Online</Typography>
            <Image src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fphonepe.png?alt=media&token=b162c09c-86b4-41b8-8afa-b97bed7f13fb" alt="phonepe" height={20} width={20} className="ml-2 mr-2" />
            <Image src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fgoogle-pay.png?alt=media&token=20b78cef-cf9d-4496-978a-1785680f5a3e" alt="google-pay" height={20} width={20} className="mr-2" />
            <Image src="https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fpaytm.png?alt=media&token=11ae36c6-4b14-4770-8599-33397bb922cc" alt="paytm" height={20} width={20} />
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
        className="mt-4 text-white rounded-full py-3 px-8 text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50"
        onPress={handleSubmitOrder}
        disabled={loading}
        aria-label={`${
          paymentMethod === 'cod' ? 'Place Order' : 'Pay Online Safe & Secure'
        } ₹${totalAmount}`}
      >
        {loading ? (
          <Spinner color="white" size="sm" />
        ) : paymentMethod === 'cod' ? (
          `Place Order ₹${totalAmount}`
        ) : (
          `Pay Online Safe & Secure ₹${totalAmount}`
        )}
      </Button>
    </div>
  );
};

export default DesktopPaymentMethod;
