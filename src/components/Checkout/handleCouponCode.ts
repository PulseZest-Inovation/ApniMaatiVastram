import { CartItem } from "@/Types/data/CartItemType";
import { CouponsType } from "@/Types/data/CouponsType";

export const handleApplyCoupon = (
  couponCode: string,
  totalAmount: number,
  validCoupons: CouponsType[],
  setIsCouponApplied: (value: boolean) => void,
  setDiscountMessage: (value: string) => void,
  setPrice: (value: number) => void,
  isCouponApplied: boolean,// Added parameter to check if coupon is already applied
    // add cart item and setter update cart
  cartItems?: CartItem[],
  setCartItems?: (items: CartItem[]) => void,
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
  const coupon = validCoupons.find(c => c.code.trim().toLowerCase() === trimmedCode);
    
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

  const hasMatchingItem =
    cartItems &&
    cartItems.some(item => {
        // Match product IDs (use productId if available)
      const categoryMatch =
        Array.isArray(item.categories) &&
        (coupon.productCategories || []).some(couponCat =>
          item.categories
            .map(prodCat => prodCat.trim().toLowerCase())
            .includes(couponCat.trim().toLowerCase())
        );

      const productMatch =
        Array.isArray(coupon.productsId) &&
        coupon.productsId
          .map(id => id.toLowerCase())
          .includes((item.productId || item.id || "").toLowerCase());

      return productMatch || categoryMatch;
    });

  if (!hasMatchingItem) {
    setDiscountMessage("This coupon is not valid for selected items.");
    return;
  }

  // Calculate the discount
  const discount =
    coupon.discountType === "percentage"
      ? (totalAmount * coupon.amount) / 100
      : coupon.amount;

      // Calculate the discounted price
      const discountedPrice = totalAmount - discount;

  // Update cart items with applied coupon
  if (cartItems && setCartItems) {
    const updated = cartItems.map(item => {
      const productMatch =
        Array.isArray(coupon.productsId) &&
        coupon.productsId
          .map(id => id.toLowerCase())
          .includes((item.productId || item.id || "").toLowerCase());
            //coupon.productsId.includes(item.id);
      const categoryMatch =
        Array.isArray(item.categories) &&
        (coupon.productCategories || []).some(couponCat =>
          item.categories
            .map(prodCat => prodCat.trim().toLowerCase())
            .includes(couponCat.trim().toLowerCase())
        );

      if (productMatch || categoryMatch) {
        return { ...item, appliedCouponCode: coupon.code };
      }
      return item;
    });

    setCartItems(updated);
  }

  // Apply the coupon
  setIsCouponApplied(true);
  setDiscountMessage(
    `Coupon ${coupon.code} applied! You saved ₹${discount.toFixed(2)}.`
  );
  setPrice(discountedPrice);
  
};
