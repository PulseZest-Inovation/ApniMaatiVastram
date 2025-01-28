'use client';

import React from 'react';
import { RadioGroup, Radio } from '@nextui-org/react';
import { Typography } from 'antd';
import Image from 'next/image';
import { Button, Spinner } from '@nextui-org/react';

interface MobilePaymentMethodProps {
  paymentMethod: string | null;
  handlePaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalAmount: number;
  loading: boolean;
  showDeliveryChargeMessage: boolean;
  handleSubmitOrder: () => void;
}

const MobilePaymentMethod: React.FC<MobilePaymentMethodProps> = ({
  paymentMethod,
  handlePaymentMethodChange,
  totalAmount,
  loading,
  showDeliveryChargeMessage,
  handleSubmitOrder
}) => {
  return (
    <div className="block md:hidden">
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">Payment Method</h3>
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
  );
};

export default MobilePaymentMethod;
