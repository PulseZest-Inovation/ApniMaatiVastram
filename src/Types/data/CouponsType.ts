import { Timestamp } from "firebase/firestore";

export interface CouponsType{
    amount: number;
    code: string;
    couponSubtitle: string;
    couponTitle: string;
    createdAt: Timestamp;
    dateExpire: Timestamp;
    dateModifiedAt: Timestamp;
    discountType: string;
    excludeSaleItems: boolean;
    freeShipping: false;
    slug: string;
    minimumAmount: number;
    productCategories: string[];
    productsId: string[];
    usageLimitPerUser: number;
}