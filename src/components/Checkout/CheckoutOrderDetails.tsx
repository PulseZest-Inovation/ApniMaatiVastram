'use client'
import React, { useState, useEffect } from 'react';
import { indianStates } from '@/utils/indiastate';
import { getDataByDocName } from '@/service/Firebase/getFirestore';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth to get the current user
import PaymentMethod from './PyamnetMethord';
import { CartItem } from '@/Types/data/CartItemType';

interface CheckoutOrderDeatils{
  cartItems: CartItem[]
  totalAmount: number;
}

export default function CheckoutOrderDetails({cartItems, totalAmount}: CheckoutOrderDeatils) {
  const [formData, setFormData] = useState({
    fullName: '',
    country: 'India',
    state: '',
    address: '',
    apartment: '',
    houseNumber: '',
    city: '',
    pinCode: '',
    phoneNumber: '',
    email: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      // Get the current authenticated user's UID from Firebase Auth
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const userId = user.uid; // Get the current user's UID
        
        const collectionName = 'customers'; // Collection name
        const docName = userId; // Use the current user's UID as the document name

        // Fetch data using getDataByDocName function
        const data = await getDataByDocName<typeof formData>(collectionName, docName);

        // If data exists, update formData with the fetched values
        if (data) {
          setFormData({
            fullName: data.fullName || '',
            country: data.country || 'India',
            state: data.state || '',
            address: data.address || '',
            apartment: data.apartment || '',
            houseNumber: data.houseNumber || '',
            city: data.city || '',
            pinCode: data.pinCode || '',
            phoneNumber: data.phoneNumber || '',
            email: data.email || ''
          });
        }
      } else {
        console.log('No user is signed in.');
      }
    };

    fetchData();
  }, []); // Run this effect only once when the component is mounted

  return (
    <div className="p-4">
      <h3 className="text-large font-bold mb-4">Delivery Details</h3>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delivery Details */}
        <div>
          <label className="block text-sm font-semibold mb-2">First Name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Country</label>
          <input
            type="text"
            value={formData.country}
            readOnly
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
          <label className="block text-sm font-semibold mb-2">Apartment, suite, etc</label>
          <input
            type="text"
            placeholder="Enter additional address info"
            value={formData.apartment}
            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">House Number</label>
          <input
            type="text"
            placeholder="Enter House Number"
            value={formData.houseNumber}
            onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
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
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Phone</label>
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
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="text"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </form>

      {/* Pass formData as props to PaymentMethod component */}
      <PaymentMethod formData={formData} totalAmount={totalAmount} />
    </div>
  );
}
