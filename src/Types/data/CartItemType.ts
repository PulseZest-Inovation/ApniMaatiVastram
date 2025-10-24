export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    productTitle: string;
    isReadyToWear: boolean;   
    readyToWearCharges: number;
    // new add
    categories: string[];
    productId: string;
    // to show applied coupon under product
    appliedCouponCode: string;
  }