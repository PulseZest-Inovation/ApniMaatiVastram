'use client';
import React, { useEffect, useState, useRef } from 'react';
import CheckoutProductReview from '@/components/Checkout/CheckoutProductReview';
import CheckoutOrderDetails from '@/components/Checkout/CheckoutOrderDetails';
import { isUserLoggedIn } from '@/service/isUserLogin';
import { getAllDocsFromSubCollection, getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { getAuth } from 'firebase/auth';
import { Spinner } from '@nextui-org/react';
import PhoneLoginModel from '@/components/Login/PhoneLoginModel';
import { CartItem } from '@/Types/data/CartItemType';
import CouponCode from '@/components/Checkout/CouponCode';
import { handleApplyCoupon } from '@/components/Checkout/handleCouponCode';
import Confetti from 'react-confetti';
import { CouponsType } from '@/Types/data/CouponsType';

export default function CheckoutPage() {
  const [isUserLoggedInState, setIsUserLoggedInState] = useState<boolean | null>(null);
  const [isPhoneLoginModalOpen, setIsPhoneLoginModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [discountMessage, setDiscountMessage] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [validCoupons, setValidCoupons] = useState<CouponsType[]>([]); // Added validCoupons state
  const containerRef = useRef<HTMLDivElement | null>(null); // Ref for the confetti container

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await isUserLoggedIn();
        setIsUserLoggedInState(loggedIn);
        if (!loggedIn) setIsPhoneLoginModalOpen(true);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsUserLoggedInState(false);
      }
    };

    const fetchCartItems = async () => {
      try {
        const auth = getAuth();
        const docId = auth.currentUser?.uid;

        if (!docId) {
          setIsUserLoggedInState(false);
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
        console.error('Error fetching cart items:', error);
      }
    };

    const fetchCoupons = async () => {
      try {
        const fetchedCoupons = await getAllDocsFromCollection<CouponsType>('coupons');
        setValidCoupons(fetchedCoupons);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };

    const initialize = async () => {
      setIsLoading(true);
      await checkLoginStatus();
      await fetchCartItems();
      await fetchCoupons(); // Fetch valid coupons
      setIsLoading(false);
    };

    initialize();
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems.reduce((sum, item) => {
        const readyToWearCharges = item.isReadyToWear
          ? Number(item.readyToWearCharges)
          : 0;
        const itemPrice = Number(item.price);
        const quantity = Number(item.quantity);

        return sum + (itemPrice + readyToWearCharges) * quantity;
      }, 0);

      setPrice(total);
    };

    calculateTotal();
  }, [cartItems]);

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner color="warning" />
      </div>
    );
  }

  if (isUserLoggedInState === false) {
    return (
      <PhoneLoginModel
        isOpen={isPhoneLoginModalOpen}
        onOpenChange={() => setIsPhoneLoginModalOpen(false)}
      />
    );
  }

  return (
    <div className="container mx-auto p-4" ref={containerRef}>
      {/* Mobile */}
      <div className="block md:hidden">
        <div className="flex flex-col">
          <CheckoutOrderDetails totalAmount={price} />

          <CouponCode
            totalAmount={price}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            isCouponApplied={isCouponApplied}
            handleApplyCoupon={(code, amount) =>
              handleApplyCoupon(code, amount, validCoupons, setIsCouponApplied, setDiscountMessage, setPrice,  isCouponApplied)
            }
            discountMessage={discountMessage}
          />

          <CheckoutProductReview totalAmount={price} cartItems={cartItems} />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex gap-1 mx-auto sticky top-2">
        <div className="md:w-[70%] flex-shrink-0">
          <CheckoutOrderDetails totalAmount={price} />
        </div>
        <div className="md:w-[30%] flex flex-col gap-2">
          <div className="p-4 border rounded-md">
            <CheckoutProductReview totalAmount={price} cartItems={cartItems} />
          </div>
          <CouponCode
            totalAmount={price}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            isCouponApplied={isCouponApplied}
            handleApplyCoupon={(code, amount) =>
              handleApplyCoupon(code, amount, validCoupons, setIsCouponApplied, setDiscountMessage, setPrice,  isCouponApplied)
            }
            discountMessage={discountMessage}
          />
        </div>
      </div>

      {/* Confetti Animation */}
      {isCouponApplied && containerRef.current && (
        <Confetti
          width={containerRef.current.offsetWidth}
          height={containerRef.current.offsetHeight}
          recycle={false}
          numberOfPieces={200}
          confettiSource={{
            x: 0,
            y: 0,
            w: containerRef.current.offsetWidth,
            h: containerRef.current.offsetHeight,
          }}
        />
      )}
    </div>
  );
}
