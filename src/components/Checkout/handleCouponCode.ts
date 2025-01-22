// components/Checkout/handleCouponCode.ts
export const handleApplyCoupon = (
    couponCode: string,
    totalAmount: number,
    setIsCouponApplied: (value: boolean) => void,
    setDiscountMessage: (value: string) => void,
    setPrice: (value: number) => void
  ) => {
    if (couponCode.trim() === 'DISCOUNT10') {
      const discount = totalAmount * 0.1; // 10% discount
      const discountedPrice = totalAmount - discount;
  
      setIsCouponApplied(true);
      setDiscountMessage('Coupon applied! You saved 10%.');
      setPrice(discountedPrice); // Update the total amount
    } else {
      setDiscountMessage('Invalid coupon code. Please try again.');
    }
  };
  