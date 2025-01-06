'use client'
import React from 'react';
import CheckoutProductReview from '@/components/Checkout/CheckoutProductReview';
import CheckoutOrderDetails from '@/components/Checkout/CheckoutOrderDetails';

export default function CheckoutPage() {
 

  return (
    <div className="flex flex-col md:flex-row container mx-auto p-4">
      {/* Left Section */}
    <CheckoutOrderDetails/>  


      {/* Right Section (Visible only on Desktop) */}
    <CheckoutProductReview/>

    </div>
  );
}
