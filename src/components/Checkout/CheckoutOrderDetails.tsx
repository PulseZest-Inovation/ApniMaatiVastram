import React, { useState } from 'react';
import { Button } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { indianStates } from '@/utils/indiastate';
import { Typography } from 'antd';
import Image from 'next/image';



export default function CheckoutOrderDetails() {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  return (
    <div className="md:w-2/3 p-4">
      <h3 className="text-lg font-bold mb-4">Delivery </h3>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delivery Details */}
        <div>
          <label className="block text-sm font-semibold mb-2">First Name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Last Name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Country</label>
          <input
            type="text"
            value="India"
            readOnly
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">State</label>
          <select
            id="state"
            name="state"
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>Select your state</option>
            {indianStates.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Address</label>
          <input
            type="text"
            placeholder="Enter your address"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Apartment, suite, etc. (optional)</label>
          <input
            type="text"
            placeholder="Enter additional address info"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">City</label>
          <input
            type="text"
            placeholder="Enter your city"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">PIN Code</label>
          <input
            type="text"
            placeholder="Enter your PIN code"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Phone</label>
          <input
            type="text"
            placeholder="+91 Enter your phone number"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
 

        {/* Payment Method Section */}
        <RadioGroup label="Select Payment Method">
          <Radio value="online" onChange={() => setPaymentMethod('online')}>
         
            <div className="flex items-center">
                <Typography className='font-bold'>Online </Typography>
               <Image src='https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fphonepe.png?alt=media&token=b162c09c-86b4-41b8-8afa-b97bed7f13fb' alt='phonepe' height={20} width={20} className='ml-2 mr-2'/>
               <Image src='https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fgoogle-pay.png?alt=media&token=20b78cef-cf9d-4496-978a-1785680f5a3e' alt='google-pay' height={20} width={20} className='mr-2'/>
               <Image src='https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fcard.png?alt=media&token=413dd589-566d-4f47-baa9-6e4f56e34605' alt='card' height={20} width={20} className='mr-2'/>
               <Image src='https://firebasestorage.googleapis.com/v0/b/ecommerce-with-pulsezest.firebasestorage.app/o/pulsezest-assets%2Fatm-card.png?alt=media&token=af9d880b-d452-4e20-8a98-5268ce35b0cd' alt='atm-card' height={20} width={20} className='mr-2'/>
            </div>
          </Radio>
          <Radio value="cod" onChange={() => setPaymentMethod('cod')}>
            COD
          </Radio>
        </RadioGroup>

        {/* Conditional Payment Buttons */}
        {paymentMethod === 'online' && (
          <div className="mt-4">
            <Button
              className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg w-full"
              radius="full"
            >
              Pay Now
            </Button>
          </div>
        )}
        {paymentMethod === 'cod' && (
          <div className="mt-4">
            <Button color="primary" className="w-full">
              Place Order
            </Button>
          </div>
        )}
      </form>

  
    </div>
  );
}
