'use client'
import React from "react";
import { useRouter } from "next/navigation";

const UserProfilePage: React.FC = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path); // Navigates to the specified path
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">

      {/* User Info Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-10 p-6 bg-gray-50 shadow rounded-lg">
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          <div className="mr-8 mb-4 lg:mb-0">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xl font-bold text-white">JD</span> {/* Placeholder for user avatar */}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">John Doe</h2>
            <p className="text-lg text-gray-600">johndoe@example.com</p>
          </div>
        </div>
        <button
          onClick={() => handleNavigation("/edit-profile")}
          className="mt-4 lg:mt-0 text-blue-500 hover:underline text-lg"
        >
          Edit Profile
        </button>
      </div>

      {/* Section List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="p-6 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
          onClick={() => handleNavigation("/order-history")}
        >
          <h3 className="text-2xl font-semibold text-gray-800">Order History</h3>
          <p className="text-gray-600">View your past orders and track your purchases.</p>
        </div>

        <div
          className="p-6 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
          onClick={() => handleNavigation("/wishlist")}
        >
          <h3 className="text-2xl font-semibold text-gray-800">Wishlist</h3>
          <p className="text-gray-600">View your saved items and wishlist for later.</p>
        </div>

        <div
          className="p-6 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
          onClick={() => handleNavigation("/cart")}
        >
          <h3 className="text-2xl font-semibold text-gray-800">Shopping Cart</h3>
          <p className="text-gray-600">View the items you’ve added to your cart.</p>
        </div>

        <div
          className="p-6 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
          onClick={() => handleNavigation("/addresses")}
        >
          <h3 className="text-2xl font-semibold text-gray-800">Addresses</h3>
          <p className="text-gray-600">Manage your shipping and billing addresses.</p>
        </div>

        <div
          className="p-6 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
          onClick={() => handleNavigation("/payment-methods")}
        >
          <h3 className="text-2xl font-semibold text-gray-800">Payment Methods</h3>
          <p className="text-gray-600">Add or update your payment methods for easy checkout.</p>
        </div>

        <div
          className="p-6 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
          onClick={() => handleNavigation("/logout")}
        >
          <h3 className="text-2xl font-semibold text-red-600">Logout</h3>
          <p className="text-gray-600">Sign out of your account.</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
