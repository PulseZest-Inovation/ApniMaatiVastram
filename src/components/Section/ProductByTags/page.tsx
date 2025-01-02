'use client';

import React, { useEffect, useState } from 'react';
import { fetchProductsGroupedByTags, ProductsByTag } from './fetchProductByCategory';
import Image from 'next/image';

export default function DisplayProductByTags() {
  const [productsByTags, setProductsByTags] = useState<ProductsByTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await fetchProductsGroupedByTags();
      setProductsByTags(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-700">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      {productsByTags.map(({ tagName, products }) => (
        <div key={tagName} className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 uppercase text-center">
            {tagName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map(product => (
              <div
                key={product.slug}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-2 sm:p-4  lg:h-96 w-full max-w-xs mx-auto"
              >
                <Image
                  height={150}
                  width={150}
                  src={product.featuredImage}
                  alt={product.slug}
                  className="rounded-t-lg w-full h-40 lg:h-96 sm:h-64 object-cover mb-2 sm:mb-4"
                />
                <h3 className="text-sm sm:text-base text-gray-800 truncate mb-1 sm:mb-2">
                  {product.id}
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm">
                  <div>
                    {product.salePrice ? (
                      <div className="flex space-x-1 sm:space-x-2 items-center justify-center">
                        <div className="font-bold">RS {product.salePrice}</div>
                        <div className="line-through text-gray-500">
                          RS {product.regularPrice}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-800 font-bold">
                        {product.regularPrice || 'N/A'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
