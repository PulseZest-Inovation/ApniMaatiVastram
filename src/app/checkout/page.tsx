'use client';
import React, { useEffect, useState } from 'react';
import CheckoutProductReview from '@/components/Checkout/CheckoutProductReview';
import CheckoutOrderDetails from '@/components/Checkout/CheckoutOrderDetails';
import { isUserLoggedIn } from '@/service/isUserLogin';
import { getAllDocsFromSubCollection } from '@/service/Firebase/getFirestore';
import { getAuth } from 'firebase/auth';
import { Spinner } from '@nextui-org/react';
import PhoneLoginModel from '@/components/Login/PhoneLoginModel';
import { CartItem } from '@/Types/data/CartItemType';
import CouponCode from '@/components/Checkout/CouponCode'; // Import CouponCode component

export default function CheckoutPage() {
  const [isUserLoggedInState, setIsUserLoggedInState] = useState<boolean | null>(null);
  const [isPhoneLoginModalOpen, setIsPhoneLoginModalOpen] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>(''); // Coupon code state
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false); // Coupon applied state
  const [discountMessage, setDiscountMessage] = useState<string>(''); // Discount message
  const [price, setPrice] = useState<number>(0);

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

    const fetchCartItems = async () => {
      try {
        const auth = getAuth();
        const docId = auth.currentUser?.uid;

        if (!docId) {
          console.error('User not authenticated');
          return;
        }

        const userDoc = docId.toString();

        const fetchedCartItems = await getAllDocsFromSubCollection<CartItem>(
          'customers',
          userDoc,
          'cart'
        );

        setCartItems(fetchedCartItems);
      } catch (error) {
        console.error('Error fetching cart items: ', error);
      }
    };

    const calculateTotal = async() => {
      const price = cartItems.reduce((total, item) => {
        const readyToWearCharges = item.isReadyToWear
          ? Number(item.readyToWearCharges)
          : 0;
        const price = Number(item.price);
        const quantity = Number(item.quantity);
  
        return total + (price + readyToWearCharges) * quantity;
      }, 0);
  
      setPrice(price);
    };

    checkLoginStatus();
    fetchCartItems();
    calculateTotal();
  }, );

  const handleApplyCoupon = () => {
    if (couponCode.trim() === 'DISCOUNT10') {
      setIsCouponApplied(true);
      setDiscountMessage('Coupon applied! You saved 10%.');
    } else {
      setDiscountMessage('Invalid coupon code. Please try again.');
    }
  };

  if (isUserLoggedInState === false) {
    return (
      <PhoneLoginModel
        isOpen={isPhoneLoginModalOpen}
        onOpenChange={() => setIsPhoneLoginModalOpen(false)}
      />
    );
  }

  if (isUserLoggedInState === null || cartItems.length === 0) {
    return (
      <div className="text-center">
        <Spinner color="warning" />
      </div>
    );
  }

 

  return (
    <div className="container mx-auto p-4">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex flex-col">
          {/* Left Section */}
          <CheckoutOrderDetails cartItems={cartItems} totalAmount={price} />

          {/* Coupon Code Field */}
          <CouponCode
           totalAmount={price}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            isCouponApplied={isCouponApplied}
            handleApplyCoupon={handleApplyCoupon}
            discountMessage={discountMessage}
          />

          {/* Right Section */}
          <CheckoutProductReview totalAmount={price} cartItems={cartItems} />
        </div>
      </div>

      {/* -------Desktop Layout */}
      <div className="hidden md:flex gap-1 mx-auto sticky top-2">
        {/* Left Section */}
        <div className="md:w-[70%] flex-shrink-0">
          <CheckoutOrderDetails cartItems={cartItems}  totalAmount={price}/>
        </div>

        {/* Right Section */}
        <div className="md:w-[30%] flex flex-col gap-2">
          {/* CheckoutProductReview */}
          <div className="p-4 border rounded-md">
            <CheckoutProductReview totalAmount={price} cartItems={cartItems} />
          </div>

          {/* Coupon Code */}
          <CouponCode
             totalAmount={price}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            isCouponApplied={isCouponApplied}
            handleApplyCoupon={handleApplyCoupon}
            discountMessage={discountMessage}
          />
        </div>
      </div>
    </div>
  );
}
