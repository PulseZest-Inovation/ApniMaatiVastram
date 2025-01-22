'use client';
import React, { useEffect, useState } from 'react';
import CheckoutProductReview from '@/components/Checkout/CheckoutProductReview';
import CheckoutOrderDetails from '@/components/Checkout/CheckoutOrderDetails';
import { isUserLoggedIn } from '@/service/isUserLogin';
import { Spinner } from '@nextui-org/react';
import PhoneLoginModel from '@/components/Login/PhoneLoginModel';

export default function CheckoutPage() {
  const [isUserLoggedInState, setIsUserLoggedInState] = useState<boolean | null>(null); // null for initial loading state
  const [isPhoneLoginModalOpen, setIsPhoneLoginModalOpen] = useState(true); // Initial state for modal

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await isUserLoggedIn();
        setIsUserLoggedInState(loggedIn);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsUserLoggedInState(false); // Handle error as not logged in
      }
    };

    checkLoginStatus();
  }, []);

  if (isUserLoggedInState === false) {
    return (
      <PhoneLoginModel
        isOpen={isPhoneLoginModalOpen}
        onOpenChange={() => setIsPhoneLoginModalOpen(false)}
      />
    );
  }

  if (isUserLoggedInState === null) {
    return (
      <div className="text-center">
        <Spinner color="warning" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row container mx-auto p-4">
      {/* Left Section */}
      <CheckoutOrderDetails />

      {/* Right Section (Visible only on Desktop) */}
      <CheckoutProductReview />
    </div>
  );
}
