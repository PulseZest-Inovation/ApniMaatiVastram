'use client'
import { ProductType } from '@/Types/data/ProductType';
import React from 'react';
import { IoIosCash } from "react-icons/io";
import { FaVanShuttle } from "react-icons/fa6";
import { FaRedoAlt, FaRegClock,  FaGift } from 'react-icons/fa';

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg font-sans">

      {/* Shipping Details */}
      {product.isShippingCharge ? (
        <div className="flex items-center gap-3 mb-4">
          <FaVanShuttle className="text-orange-500 text-xl" />
          <p className="text-gray-600">Shipping charges: Rs. {product.shipping_taxable}</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 mb-4">
          <FaGift className="text-xl" />
          <p className="text-gray-600">Free shipping on domestic orders above Rs. 1,499</p>
        </div>
      )}

      {/* Return Period */}
      {product.isReturn && (
        <div className="flex items-center gap-3 mb-4">
          <FaRedoAlt className=" text-xl" />
          <p className="text-gray-600"> {product.returnPeriod}</p>
        </div>
      )}

      {/* Delivery Time */}
      <div className="flex items-center gap-3 mb-4">
        <FaRegClock className=" text-xl" />
        <p className="text-gray-600">{product.deliveryTimePeriod}</p>
      </div>

      {/* Cash on Delivery */}
      {product.isCashOnDelivery && (
        <div className="flex items-center gap-3">
          <IoIosCash className="  text-xl" />
          <p className="text-gray-600">Cash on delivery is available</p>
        </div>
      )}
    </div>
  );
}
