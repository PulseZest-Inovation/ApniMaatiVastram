import { Timestamp } from "firebase/firestore";

export interface ProductType {
  id: string;
  productTitle: string,
  productSubtitle: string;
  slug: string;
  permalink: string;
  createdAt: Timestamp;
  ModifiedAt: Timestamp;

  isReadyToWear: boolean;
  readyToWearCharges: number;
  readyToWear?: {
    wrist: number;
    length: number;
    hip: number;
  };

  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: { heading: string; content: string }[];
  shortDescription: string;
  videoUrl: string;
  sku: string;
  price: string;
  regularPrice: string;
  salePrice: string;
  dateOnSaleTo: Timestamp | null;
  dateOnSaleFrom: Timestamp | null;
  price_html: string;
  onSale: boolean;
  purchaseSale: boolean;
  totalSales: number;
  manageStatus: boolean;
  stockQuantity: number;
  stockStatus: string;
  backorders: boolean;
  backordersAllowed: boolean;
  shipping_taxable: string;
  reviewsAllowed: boolean;
  averageRating: string;
  ratingCount: number;
  categories: string[];
  tags: string[];
  featuredImage: string;
  galleryImages: string[];
  variation: VariationType[];
  attributes: AttributeType[];
  menuOrder: number;
  metaData: MetaDataType[];
}

export interface VariationType {
  id: string;
  name: string;
  value: string;
}

export interface AttributeType {
  name: string;
  options: string[];
  visible: boolean;
}

export interface MetaDataType {
  key: string;
  value: string | number | boolean | object | null;
}