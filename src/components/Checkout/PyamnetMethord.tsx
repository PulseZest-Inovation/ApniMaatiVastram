import React, { useState } from 'react';
import { RadioGroup, Radio } from "@nextui-org/react";
import { Typography } from 'antd';
import Image from 'next/image';
import { Button } from "@nextui-org/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  };
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ formData }) => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const validateFields = () => {
    const missingFields: string[] = [];

    if (!formData.fullName) missingFields.push('Full Name');
    if (!formData.country) missingFields.push('Country');
    if (!formData.state) missingFields.push('State');
    if (!formData.address) missingFields.push('Address');
    if (!formData.apartment) missingFields.push('Apartment');
    if (!formData.houseNumber) missingFields.push('House Number');
    if (!formData.city) missingFields.push('City');
    if (!formData.pinCode) missingFields.push('Pin Code');
    if (!formData.phoneNumber) missingFields.push('Phone Number');
    if (!paymentMethod) missingFields.push('Payment Method');

    if (missingFields.length > 0) {
      toast.error(`Please fill the following fields: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmitOrder = () => {
    if (validateFields()) {
      // Submit order logic
      console.log('Order Submitted with Data:', formData);
      console.log('Selected Payment Method:', paymentMethod);
      toast.success('Order submitted successfully!');
    }
  };

  return (
    <div>
      <ToastContainer />
      {/* Payment Method Section */}
      <RadioGroup label="Select Payment Method" value={paymentMethod} onChange={handlePaymentMethodChange}>
        <Radio value="online">
          <div className="flex items-center">
            <Typography className='font-bold'>Online</Typography>
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
          <Typography className='font-bold'>Cash on Delivery (COD)</Typography>
        </Radio>
      </RadioGroup>

      <Button
        color={paymentMethod === 'cod' ? "primary" : "warning"}
        className="mt-4"
        onClick={handleSubmitOrder}
      >
        {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
      </Button>
    </div>
  );
};

export default PaymentMethod;
