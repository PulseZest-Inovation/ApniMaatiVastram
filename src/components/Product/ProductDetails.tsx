import React from "react";
import { Button } from "antd";
import { ShoppingCartOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { ProductType } from "@/Types/data/ProductType";

interface ProductDetailsProps {
  product: ProductType;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => (
  <div className=" space-y-6">
    {/* Product Title */}
    <h1
      className="text-2xl font-bold text-gray-800 capitalize break-words"
      style={{
        wordBreak: "break-word",
        whiteSpace: "normal",
        lineHeight: "1.2",
      }}
    >
      {product.productTitle}
    </h1>
    <h1
      className="text-1xl font-bold text-gray-800 capitalize break-words"
      style={{
        wordBreak: "break-word",
        whiteSpace: "normal",
        lineHeight: "1.2",
      }}
    >
      {product.productSubtitle}
    </h1>

    {/* Price Section */}
    <div className="flex items-center space-x-4">
      {product.regularPrice && (
        <span className="text-xl text-gray-500 line-through">
          ₹{product.regularPrice}
        </span>
      )}
      <span className="text-3xl font-bold text-gray-700">₹{product.price}</span>
    </div>

    {/* Short Description */}
    <p className="text-gray-700">{product.shortDescription}</p>

    {/* Action Buttons */}
    <div className="mt-4 flex space-x-4">
      <Button
        icon={<ShoppingCartOutlined />}
        className="px-6 py-2 bg-blue-600 text-white"
        style={{ border: "none", borderRadius: "4px" }}
      >
        Add to Cart
      </Button>
      <Button
        icon={<CheckCircleOutlined />}
        className="px-6 py-2 bg-green-600 text-white"
        style={{ border: "none", borderRadius: "4px" }}
      >
        Buy Now
      </Button>
    </div>
  </div>
);

export default ProductDetails;
