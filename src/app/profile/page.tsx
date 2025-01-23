'use client';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Spinner } from '@nextui-org/react';
import { fetchUserData, updateUserProfile } from './profile'; // Assuming you put the functions here
import { userProfileType } from '@/Types/data/userProfileType';

export default function UserProfilePage() {
  const [userData, setUserData] = useState<userProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<userProfileType>({
    fullName: '',
    email: '',
    phoneNumber: '',
    country: 'india',
    houseNumber: '',
    apartment: '',
    address: '',
    city: '',
    pinCode: '',
  });

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Fetch user data on component mount
  useEffect(() => {
    if (currentUser) {
      fetchUserData(currentUser.uid, setUserData, setFormData, setLoading); // Pass the setters here
    }
  }, [currentUser]);

  // Function to save the form data
  const saveChanges = async () => {
    if (currentUser) {
      const { fullName, email, phoneNumber, address, city, pinCode, country, houseNumber, apartment } = formData;
      try {
        // Update fields if they are different
        if (name !== userData?.fullName) {
          await updateUserProfile(currentUser.uid, 'name', fullName);
        }
        if (country !== userData?.country) {
          await updateUserProfile(currentUser.uid, 'country', country);
        }
        if (houseNumber !== userData?.houseNumber) {
          await updateUserProfile(currentUser.uid, 'houseNumber', houseNumber);
        }
        if (apartment !== userData?.apartment) {
          await updateUserProfile(currentUser.uid, 'apartment', apartment);
        }
        if (email !== userData?.email) {
          await updateUserProfile(currentUser.uid, 'email', email);
        }
        if (phoneNumber !== userData?.phoneNumber) {
          await updateUserProfile(currentUser.uid, 'phoneNumber', phoneNumber);
        }
        if (address !== userData?.address) {
          await updateUserProfile(currentUser.uid, 'address', address);
        }
        if (city !== userData?.city) {
          await updateUserProfile(currentUser.uid, 'city', city);
        }
        if (pinCode !== userData?.pinCode) {
          await updateUserProfile(currentUser.uid, 'pinCode', pinCode);
        }

        // Update user data state immediately after changes
        setUserData({
          fullName,
          email,
          country,
          apartment,
          houseNumber,
          phoneNumber,
          address,
          city,
          pinCode,
        });

        // Reset formData with the updated values from userData
        setFormData({
          ...userData!,
        });

        // Close the editing mode after saving
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    }
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submit to update user data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveChanges();
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500"><Spinner color='warning' /></div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-6 py-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">User Profile</h1>

      {userData && !isEditing ? (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{userData.fullName || 'Enter your Name'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{userData.email || 'youremail@example.com'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Phone:</span>
            <span>{userData.phoneNumber || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">City:</span>
            <span>{userData.city || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Address:</span>
            <span>{userData.address || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">House Number:</span>
            <span>{userData.houseNumber || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Apartment:</span>
            <span>{userData.apartment || 'N/A'}</span>
          </div>
        
          <div className="flex justify-between">
            <span className="font-medium">Pin Code:</span>
            <span>{userData.pinCode || 'N/A'}</span>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Apartment</label>
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">House Number:</label>
            <input
              type="text"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
      
          <div>
            <label className="block text-sm font-semibold">Pin Code</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
