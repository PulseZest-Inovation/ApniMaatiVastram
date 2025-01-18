import { ProductType } from '@/Types/data/ProductType';
import { Spinner } from '@nextui-org/react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Image from 'next/image';
import React from 'react'
interface MobileVideoProduct {
  product: ProductType
  handleCartClick: () => void;
 loading: boolean;
}

export default function MobileVideoModel({product,   handleCartClick,loading,}: MobileVideoProduct) {
  return (
    <div className="absolute bottom-4 left-0 w-full md:hidden flex flex-col items-center justify-between px-4">
    <div className="flex items-center space-x-3 mb-4 w-full max-w-[380px] rounded-md py-3 bg-white shadow-md">
      {product.galleryImages.slice(0, 1).map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={product.productTitle}
          width={50}
          height={50}
          className="rounded-full"
        />
      ))}
      <span className="text-sm font-semibold pl-2 pr-2 text-gray-800">{product.productTitle}</span>
    </div>

    {/* Cart Icon */}
    <button
      onClick={handleCartClick}
      disabled={loading}
      className="bg-orange-500 text-black px-6 py-3 rounded-full flex items-center justify-center"
      style={{
        border: "2px solid #000",
        transition: "background-color 0.3s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#D35400';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#FF6A00';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {loading ? (
        <Spinner color="white" size="sm" />
      ) : (
        <ShoppingCartOutlined style={{ fontSize: "24px" }} />
      )}
    </button>
  </div>
  )
}
