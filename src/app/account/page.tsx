'use client'
import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { message } from "antd";

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Modal state for logout confirmation

  const handleNavigation = (path: string) => {
    router.push(path); // Navigates to the specified path
  };

  
  const handleLogout = async () => {
    const auth = getAuth(); // Get the Firebase authentication instance

    message.loading("Logging out..We Miss You 🥲")

    try {
      await signOut(auth); // Sign the user out
      console.log("User logged out successfully");

      // Redirect to login page or homepage after logout
      router.push("/"); // You can change this to "/" if you want to navigate to the homepage
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };


  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg mb-5">
      {/* User Info Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-10 p-6 bg-gray-50 shadow rounded-lg">
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          <div className="mr-8 mb-4 lg:mb-0">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xl font-bold text-white">JD</span> {/* Placeholder for user avatar */}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 text-center">John Doe</h2>
            <p className="text-lg text-gray-600">johndoe@example.com</p>
          </div>
        </div>
        <button
          onClick={() => handleNavigation("/profile")}
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
          onClick={() => handleNavigation("/addresses")}
        >
          <h3 className="text-2xl font-semibold text-gray-800">Addresses</h3>
          <p className="text-gray-600">Manage your shipping and billing addresses.</p>
        </div>

        <div
          className="p-6 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
          onClick={openLogoutModal} // Open the logout confirmation modal
        >
          <h3 className="text-2xl font-semibold text-red-600">Logout</h3>
          <p className="text-gray-600">Sign out of your account.</p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to log out?</h3>
            <div className="flex justify-between">
              <button
                onClick={handleLogout} // Proceed with logout
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
              >
                Yes, Log Out
              </button>
              <button
                onClick={closeLogoutModal} // Close the modal
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
