import { CouponsType } from "@/Types/data/CouponsType";

export const handleApplyCoupon = (
  couponCode: string,
  totalAmount: number,
  validCoupons: CouponsType[],
  setIsCouponApplied: (value: boolean) => void,
  setDiscountMessage: (value: string) => void,
  setPrice: (value: number) => void,
  isCouponApplied: boolean // Added parameter to check if coupon is already applied
) => {
  // Prevent reapplying the coupon
  if (isCouponApplied) {
    setDiscountMessage("Coupon already applied!");
    return;
  }

  // Early return if no valid coupons exist
  if (!validCoupons || validCoupons.length === 0) {
    setDiscountMessage("No available coupons at the moment.");
    return;
  }

  // Trim and make coupon code case-insensitive
  const trimmedCode = couponCode.trim().toLowerCase();

  if (!trimmedCode) {
    setDiscountMessage("Please enter a valid coupon code.");
    return;
  }

  // Find the coupon with the matching code (case-insensitive)
  const coupon = validCoupons.find((c) => c.code.toLowerCase() === trimmedCode);

  // If no coupon was found
  if (!coupon) {
    setDiscountMessage("Invalid coupon code. Please try again.");
    return;
  }

  // Check if the totalAmount meets the minimum purchase requirement
  if (totalAmount < coupon.minimumAmount) {
    setDiscountMessage(`Minimum purchase of ₹${coupon.minimumAmount} required.`);
    return;
  }

  // Calculate the discount
  const discount =
    coupon.discountType === "percentage"
      ? (totalAmount * coupon.amount) / 100
      : coupon.amount;

  // Calculate the discounted price
  const discountedPrice = totalAmount - discount;

  // Apply the coupon
  setIsCouponApplied(true);
  setDiscountMessage(`Coupon applied! You saved ₹${discount.toFixed(2)}.`);
  setPrice(discountedPrice);
};