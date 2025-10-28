'use client';

import React, { useState, useEffect } from 'react';
import { indianStates } from '@/utils/indiastate';
import { getDataByDocName } from '@/service/Firebase/getFirestore';
import { getAuth } from 'firebase/auth';
import PaymentMethod from './PaymnetMethordButton/PyamnetMethord';

interface CheckoutOrderDetailsProps {
  totalAmount: number;
  isCouponApplied: boolean;
  couponCode?: string;
}

export default function CheckoutOrderDetails({ totalAmount, isCouponApplied, couponCode }: CheckoutOrderDetailsProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    state: '',
    address: '',
    apartment: '',
    city: '',
    pinCode: '',
    phoneNumber: '',
    altPhoneNumber: '',
    email: '',
    customerId: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        const collectionName = 'customers';
        const docName = userId;

        const data = await getDataByDocName<typeof formData>(collectionName, docName);

        if (data) {
          setFormData({
            fullName: data.fullName || '',
            state: data.state || '',
            address: data.address || '',
            apartment: data.apartment || '',
            city: data.city || '',
            pinCode: data.pinCode || '',
            phoneNumber: data.phoneNumber || '',
            altPhoneNumber: data.altPhoneNumber || '',
            email: data.email || '',
            customerId: docName,
          });
        }
      } else {
        console.log('No user is signed in.');
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const validateEmail = (email: string) =>
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

 

  const validatePinCode = (pinCode: string) =>
    /^[1-9][0-9]{5}$/.test(pinCode);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-large font-bold mb-4">Delivery Details</h3>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        

        <div>
          <label className="block text-sm font-semibold mb-2">State</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
          <label className="block text-sm font-semibold mb-2">City</label>
          <input
            type="text"
            placeholder="Enter your city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Address</label>
          <input
            type="text"
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Apartment, Suite (optional)</label>
          <input
            type="text"
            placeholder="Enter additional address info"
            value={formData.apartment}
            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
 
        <div>
          <label className="block text-sm font-semibold mb-2">PIN Code</label>
          <input
            type="text"
            placeholder="Enter your PIN code"
            value={formData.pinCode}
            onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
            required
            className={`w-full p-2 border ${validatePinCode(formData.pinCode) ? 'border-gray-300' : 'border-red-500'} rounded`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Phone Number</label>
          <input
            type="text"
            placeholder="+91 Enter your phone number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            required
           
            className="w-full p-2 border border-gray-300 rounded"

          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Alternative Phone </label>
          <input
            type="text"
            placeholder="+91 Enter your alternative phone number"
            value={formData.altPhoneNumber}
            onChange={(e) => setFormData({ ...formData, altPhoneNumber: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded"

          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            // onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            readOnly
            className={`w-full p-2 border ${validateEmail(formData.email) ? 'border-gray-300' : 'border-red-500'} rounded`}
          />
        </div>
      </form>

      <PaymentMethod formData={formData} totalAmount={totalAmount} isCouponApplied ={isCouponApplied} couponCode={couponCode} />
    </div>
  );
}
