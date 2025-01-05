'use client';

import React, { useEffect, useState } from 'react';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { ProductType } from '@/Types/data/ProductType';

const ProductByVideos = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllDocsFromCollection<ProductType>('products');
        const filteredProducts = data.filter(
          (product) => product.videoUrl && product.videoUrl.trim() !== ''
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="w-full h-[400px] bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center text-gray-500">No products available with videos.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Grid with responsive layout and reduced gap on larger screens */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 lg:gap-1 xl:gap-2 cursor-pointer">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden relative h-[450px] w-full md:w-[80%] lg:w-[60%] xl:w-[70%]"
          >
            {/* Video Section */}
            {product.videoUrl && (
              <div className="relative h-[75%] w-full rounded-t-lg overflow-hidden">
                <video
                  className="w-full h-full object-cover rounded-t-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={product.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {/* Product Details */}
            <div className="p-4 text-center h-[20%] flex flex-col justify-center">
            <h2 className="font-semibold text-sm">
              {product.productTitle?.length > 16
                ? product.productTitle.substring(0, 16) + '...'
                : product.productTitle || 'Untitled Product'}
            </h2>

              <p className="text-gray-700 text-sm mt-1 font-serif">₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductByVideos;
