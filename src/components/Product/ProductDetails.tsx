import React from "react";
import { Button } from "@nextui-org/react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { ProductType } from "@/Types/data/ProductType";
import { HeartTwoTone } from "@ant-design/icons";

interface ProductDetailsProps {
  product: ProductType;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => (
  <div className="relative flex flex-col md:space-y-2">

      {/* Product  title */}
      <h1
        className="text-2xl font-normal text-gray-500 capitalize break-words"
        style={{
          wordBreak: "break-word",
          whiteSpace: "normal",
          lineHeight: "1.2",
        }}
      >
        {product.productTitle}
      </h1>

      {/* Product subtitle */}
      <h2
        className="text-1xl text-gray-500 capitalize break-words font-thin mt-2"
        style={{
          wordBreak: "break-word",
          whiteSpace: "normal",
          lineHeight: "1.2",
        }}
      >
        {product.productSubtitle}
      </h2>

   
     
      


      {/* Price Section */}
      <div className="mt-2 mb-2">
      <div className="flex items-center space-x-4">
        {product.regularPrice && (
          <span className="text-xl text-gray-500 line-through">
            ₹{product.regularPrice}
          </span>
        )}
        <span className="text-3xl font-bold text-gray-700">₹{product.price}</span>
      
      </div>
      <p
        className="text-1xl text-gray-500 capitalize break-words font-thin"
        style={{
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
      >
        Inclusive of All Taxes
      </p>
      </div>
     

  
     

      {/* Short Description */}
      <p className="text-gray-700 mt-5">{product.shortDescription}</p>
   

    {/* Sticky Footer for Action Buttons (Mobile Only) */}
    <div className="p-4 bg-white flex flex-col md:flex-row md:space-x-2 space-y-4 md:space-y-0 md:items-center md:static fixed bottom-0 left-0 right-0 z-10">
  <Button
    endContent={<ShoppingCartOutlined />}
    className="px-6 py-2 text-white hover:opacity-90"
    style={{
      backgroundColor: "#FF6A00",
      color: "#000000",
      border: "2px solid #000",
      borderRadius: "4px",
      transition: "background-color 0.3s, transform 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#D35400";
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#FF6A00";
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    <p className="capitalize" style={{ letterSpacing: "0.2em" }}>
      ADD   TO   CART
    </p>
  </Button>

  <Button
    className="px-6 py-2 text-white"
    endContent={<HeartTwoTone twoToneColor="#eb2f96" />}
    style={{
      backgroundColor: "#c9c6bb",
      color: "#000000",
      borderRadius: "4px",
      border: "none",
    }}
  >
    W h i s h l i s t
  </Button>
</div>

  </div>
);

export default ProductDetails;
