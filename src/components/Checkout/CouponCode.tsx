import React from "react";

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
  const applyCoupon = () => {
    handleApplyCoupon(couponCode, totalAmount);
  };

  return (
    <div className="my-4 p-4 border rounded-md">
      {/* Input for Coupon Code */}
      <label
        htmlFor="couponCode"
        className="block text-sm font-medium text-gray-700"
      >
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

      {/* Apply Button */}
      <button
        onClick={applyCoupon}
        disabled={isCouponApplied}
        className={`mt-4 w-full px-4 py-2 text-white font-semibold rounded-md ${
          isCouponApplied
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
        }`}
      >
        Apply
      </button>

      {/* Discount Message */}
      {discountMessage && (
        <p className="mt-2 text-sm text-gray-600">{discountMessage}</p>
      )}

      {/* Congratulatory Message */}
      {isCouponApplied && (
        <div className="mt-4 p-2 text-center bg-yellow-100 border border-yellow-400 rounded-md">
          <p className="text-lg font-bold text-green-700">
            🎉 Congratulations! Your coupon has been applied successfully! 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponCode;
