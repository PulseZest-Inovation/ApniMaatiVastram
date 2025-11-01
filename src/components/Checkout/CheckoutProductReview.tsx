'use client';
import React from 'react';
import { Card } from '@nextui-org/react';
import Image from 'next/image';
import { CartItem } from '@/Types/data/CartItemType';
import { useRouter } from 'next/navigation';
import { CouponsType } from '@/Types/data/CouponsType';


interface CheckoutProductReviewProps {
  cartItems: CartItem[];
  totalAmount: number;
   appliedCoupon?: CouponsType;
}

export default function CheckoutProductReview({
  cartItems,
  totalAmount,
}: CheckoutProductReviewProps) {
  const router = useRouter();
  return (
    <div className="hidden md:block">
      <h3 className="text-lg font-bold mb-4">Order Summary</h3>
      <Card className="space-y-4 p-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-2 relative cursor-pointer hover:bg-gray-50 rounded-md p-2 transition"
            onClick={() =>
              router.push(`/collection/category/product/${item.id}`)
            }
          >
            <div className="relative">
              {/* Quantity Badge */}
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                {item.quantity}
              </div>
              {/* Product Image */}
              <Image
                src={item.image}
                alt={item.productTitle}
                height={50}
                width={50}
                className="rounded-md object-cover"
              />
              {/* show coupon applied  */}
              {item.appliedCouponCode && (
                <p className='text-green-600 text-xs mt-1  text-center'>
                  Coupon: {item.appliedCouponCode}
                </p>
              )}
            </div>
            <div className="flex-1 ml-3">
              <p className="font-semibold line-clamp-1">{item.productTitle}</p>
              {item.isReadyToWear && (
                <p className="text-sm text-gray-500">
                  Ready to Wear Charges: ₹{item.readyToWearCharges}
                </p>
              )}
            </div>
            <p className="font-semibold whitespace-nowrap">
              ₹
              {Number(item.price) +
                Number(item.isReadyToWear ? item.readyToWearCharges : 0)}
            </p>
          </div>
        ))}
        {/* Total Amount */}
        <div className="flex justify-between items-center mt-4">
          <p className="font-semibold">Total</p>
          <p className="font-semibold">₹{totalAmount}</p>
        </div>
      </Card>
    </div>
  );
}
