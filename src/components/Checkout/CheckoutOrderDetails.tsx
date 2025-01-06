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

        <div className="flex items-center">
          <input type="checkbox" id="newsletter" className="mr-2" />
          <label htmlFor="newsletter" className="text-sm">
            Text me with news and offers
          </label>
        </div>

        {/* Payment Method Section */}
        <RadioGroup label="Select Payment Method">
          <Radio value="online" onChange={() => setPaymentMethod('online')}>
         
            <div className="flex items-center">
                <Typography className='font-bold'>Online </Typography>
               <Image src='/icons/phonepe.png' alt='phonepe' height={20} width={20} className='ml-2 mr-2'/>
               <Image src='/icons/google-pay.png' alt='google-pay' height={20} width={20} className='mr-2'/>
               <Image src='/icons/card.png' alt='card' height={20} width={20} className='mr-2'/>
               <Image src='/icons/atm-card.png' alt='atm-card' height={20} width={20} className='mr-2'/>
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

      <p className="text-sm mt-4">
        By signing up via text, you agree to receive recurring automated marketing messages, including cart reminders, at the phone number provided. Consent is not a condition of purchase. Reply STOP to unsubscribe. Reply HELP for help. Message frequency varies. Msg & data rates may apply. View our{" "}
        <a href="#" className="text-blue-500">Terms</a> and <a href="#" className="text-blue-500">Privacy Policy</a>.
      </p>
    </div>
  );
}
