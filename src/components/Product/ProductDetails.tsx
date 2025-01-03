import React from 'react';
import { Button } from 'antd';
import { ShoppingCartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ProductType } from '@/Types/data/ProductType';

interface ProductDetailsProps {
  product: ProductType;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => (
  <div className="md:w-2/5 space-y-6">
    <h1 className="text-4xl font-bold text-gray-800">{product.id}</h1>
    <div className="flex items-center space-x-4">
      {product.regularPrice && (
        <span className="text-xl text-gray-500 line-through">₹{product.regularPrice}</span>
      )}
      <span className="text-3xl font-bold text-gray-700">₹{product.price}</span>
    </div>
    <p className="text-gray-700">{product.shortDescription}</p>
    <div className="mt-4 flex space-x-4">
      <Button icon={<ShoppingCartOutlined />} className="px-6 py-2 bg-blue-600 text-white">
        Add to Cart
      </Button>
      <Button icon={<CheckCircleOutlined />} className="px-6 py-2 bg-green-600 text-white">
        Buy Now
      </Button>
    </div>
  </div>
);

export default ProductDetails;
