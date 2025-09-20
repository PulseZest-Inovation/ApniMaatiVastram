'use client';

import React, { useState, useEffect } from 'react';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { handleOnlineOrder } from '../online/online';
import { handleCodOrder } from '../cod/cod';
import { generateOrderId } from '../genrateOrderId';
import DesktopPaymentMethod from './DesktopPyament';
import MobilePaymentMethod from './MobilePayment';

interface PaymentMethodProps {
  formData: {
    fullName: string;
    state: string;
    address: string;
    apartment: string;
    city: string;
    pinCode: string;
    phoneNumber: string;
    email: string;
    customerId: string;
  };
  totalAmount: number;
  isCouponApplied: boolean;
  couponCode?: string;
}


const PaymentMethod: React.FC<PaymentMethodProps> = ({ formData, totalAmount: initialTotalAmount, isCouponApplied, couponCode }) => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>('online');
  const [loading, setLoading] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(initialTotalAmount);
  const [showDeliveryChargeMessage, setShowDeliveryChargeMessage] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (paymentMethod === 'cod' && initialTotalAmount <= 499) {
      setShowDeliveryChargeMessage(true);
      setTotalAmount(initialTotalAmount + 49); // Add delivery charge
    } else {
      setShowDeliveryChargeMessage(false);
      setTotalAmount(initialTotalAmount); // Reset total amount
    }
  }, [paymentMethod, initialTotalAmount]);

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmitOrder = async () => {
    const requiredFields = [
      "fullName",
      "state",
      "address",
      "city",
      "pinCode",
      "phoneNumber",
      "email",
    ];
  
    // Track Facebook Pixel "InitiateCheckout" event
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "InitiateCheckout");
    }
  
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`${field} is required.`);
        return;
      }
    }
  
    const orderId = generateOrderId();
    setLoading(true);
  
    try {
      let success = false;
  
      if (paymentMethod === "online") {
        success = await handleOnlineOrder(formData, totalAmount, orderId, isCouponApplied, couponCode);
        if (success) {
          toast.success("Redirecting to payment page...");
        } else {
          toast.error("Online payment initiation failed.");
        }
      } else if (paymentMethod === "cod") {
        success = await handleCodOrder(formData, totalAmount, orderId, setLoading, isCouponApplied, couponCode);
      }
  
      if (success) {
        // ✅ Track Facebook Pixel "Purchase" Event (for both COD & Online)
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Purchase", {
            value: totalAmount, // Use totalAmount since order is not defined
            currency: "INR",
            content_type: "product",
          });
        }
  
        toast.success("Order placed successfully!");
        setTimeout(() => {
          router.push("/orders"); // Redirect to /orders page
        }, 2000);
      }
    } catch (error) {
      toast.error("An error occurred while placing the order. Please try again.");
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <DesktopPaymentMethod
        paymentMethod={paymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
        totalAmount={totalAmount}
        loading={loading}
        showDeliveryChargeMessage={showDeliveryChargeMessage}
        handleSubmitOrder={handleSubmitOrder}
      />
      <MobilePaymentMethod
        paymentMethod={paymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
        totalAmount={totalAmount}
        loading={loading}
        showDeliveryChargeMessage={showDeliveryChargeMessage}
        handleSubmitOrder={handleSubmitOrder}
      />
    </div>
  );
};

export default PaymentMethod;
