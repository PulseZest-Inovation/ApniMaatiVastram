'use client';
import React, { useState, useEffect } from "react";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { getDataByDocName } from "@/service/Firebase/getFirestore";
import { useRouter } from "next/navigation";
import { message } from "antd";
import PhoneLoginModel from "@/components/Login/PhoneLoginModel";
import { isUserLoggedIn } from "@/service/isUserLogin";
import { Spinner } from "@nextui-org/react";
import { userProfileType } from "@/Types/data/userProfileType";

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPhoneLoginModalOpen, setIsPhoneLoginModalOpen] = useState(false);  
  const [isUserLoggedInState, setIsUserLoggedInState] = useState<boolean | null>(null);
  const [user, setUser] = useState<userProfileType | null>(null); // Define the type properly

  // Check if the user is authenticated
  useEffect(() => {
    const checkUserLogin = async () => {
      const loggedIn = await isUserLoggedIn(); // Use the isUserLoggedIn function
      setIsUserLoggedInState(loggedIn); // Update the login status

      // Get user data from Firebase Auth
      const auth = getAuth();
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const uid = currentUser.uid; // Get the UID of the logged-in user
          const userDoc = await getDataByDocName<userProfileType>('customers', uid); // Fetch user data using UID
          
          setUser(userDoc); // Set the user state
        } else {
          setUser(null); // Clear user state if no user is logged in
        }
      });
    };

    checkUserLogin();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path); // Navigates to the specified path
  };

  const handleLogout = async () => {
    const auth = getAuth(); // Get the Firebase authentication instance

    message.loading("Logging out..We Miss You 🥲");

    try {
      await signOut(auth); // Sign the user out
      console.log("User logged out successfully");

      // Redirect to login page or homepage after logout
      window.location.reload();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  // If user is not logged in, show the phone login modal
  if (isUserLoggedInState === false) {
    console.log(isPhoneLoginModalOpen)
    return <PhoneLoginModel isOpen={true} onOpenChange={() => setIsPhoneLoginModalOpen(false)} />;
  }

  // If login status is unknown (still loading), we can return null or a loading indicator
  if (isUserLoggedInState === null) {
    return <div className="text-center">
      <Spinner color="warning"/>
    </div>; // You can show a loading spinner here if needed
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg mb-5">
      {/* User Info Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-10 p-6 bg-gray-50 shadow rounded-lg">
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              {user?.fullName || "User Name"} {/* Display user name or fallback */}
            </h2>
            <p className="text-lg text-gray-600">
              {user?.email || "Add your Email"} {/* Display user email or fallback */}
            </p>
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
          onClick={() => handleNavigation("/order")}
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
