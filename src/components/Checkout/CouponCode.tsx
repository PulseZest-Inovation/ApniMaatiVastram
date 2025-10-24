'use client';
import React, { useEffect, useRef, useState } from 'react';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  amount: number;
  description: string;
}

interface CouponCodeProps {
  couponCode: string;
  setCouponCode: (value: string) => void;
  isCouponApplied: boolean;
  handleApplyCoupon: (code: string, totalAmount: number) => void;
  discountMessage: string;
  totalAmount: number;
}

const CouponCode: React.FC<CouponCodeProps> = ({
  couponCode,
  setCouponCode,
  isCouponApplied,
  handleApplyCoupon,
  discountMessage,
  totalAmount,
}) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);  

  useEffect(() => {
    const fetchCoupons = async () => {
      const data = await getAllDocsFromCollection<Coupon>('coupons');
      setCoupons(data);
    };
    fetchCoupons();
  }, []);

  const applyCoupon = (code: string) => {
    setCouponCode(code);
    handleApplyCoupon(code, totalAmount);
  };

  const scrollContainer = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="my-4 p-4 border rounded-md">
      {/* Coupon Code Input */}
      <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700">
        Coupon Code
      </label>
      <input
        type="text"
        id="couponCode"
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
      
      {/* Apply Coupon Button */}
      <button
        onClick={() => applyCoupon(couponCode)}
        disabled={isCouponApplied}
        className={`mt-4 w-full px-4 py-2 text-white font-semibold rounded-md transition ${
          isCouponApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500'
        }`}
      >
        Apply
      </button>

      {/* Discount Message */}
      {discountMessage && <p className="mt-2 text-sm text-gray-600">{discountMessage}</p>}

      {/* Coupon Applied Message */}
      {isCouponApplied && (
        <div className="mt-4 p-2 text-center bg-yellow-100 border border-yellow-400 rounded-md">
          <p className="text-lg font-bold text-green-700">🎉 Coupon Applied Successfully! 🎉</p>
        </div>
      )}

      {/* Coupon Carousel */}
      {coupons.length > 0 && (
        <div className="relative mt-6">
          {/* Scroll Left Button */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10 hover:bg-gray-600"
            onClick={() => scrollContainer('left')}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Coupons List */}
          <div ref={scrollRef} className="overflow-x-auto scrollbar-hide flex space-x-4 p-2">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="p-4 w-40 h-24 bg-gray-100 rounded-md text-center cursor-pointer border border-gray-300 hover:border-green-500 transition"
                onClick={() => applyCoupon(coupon.code)}
              >
                <p className="text-sm font-bold text-gray-800">{coupon.code}</p>
                <p className="text-xs text-gray-600">{coupon.description}</p>
                <p className="text-green-600 font-semibold">{coupon.amount}% OFF</p>
              </div>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full z-10 hover:bg-gray-600"
            onClick={() => scrollContainer('right')}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponCode;
