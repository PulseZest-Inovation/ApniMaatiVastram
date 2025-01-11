"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  fetchProductsGroupedByTags,
  ProductsByTag,
} from "./fetchProductByTags";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";

export default function DisplayProductByTags() {
  const [productsByTags, setProductsByTags] = useState<ProductsByTag[]>([]);
  const [loading, setLoading] = useState(true);
  const Router = useRouter();

  // Fetch products grouped by tags
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await fetchProductsGroupedByTags();

      // Only include tags with 4 or more products and slice to show up to 4 products
      const filteredData = data
        .map(({ tagName, products }) => {
          if (products.length >= 4) {
            return {
              tagName,
              products: products.slice(0, 4), // Only show up to 4 products per tag
            };
          }
          return null; // Exclude tags with fewer than 4 products
        })
        .filter((tag): tag is ProductsByTag => tag !== null); // Filter out null values

      setProductsByTags(filteredData);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Memoize the productsByTags to avoid recalculating it on every render
  const memoizedProductsByTags = useMemo(
    () => productsByTags,
    [productsByTags]
  );

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg text-gray-700">
        <Spinner color="warning" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {memoizedProductsByTags.map(({ tagName, products }) => (
        <div key={tagName} className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 uppercase text-center">
            {tagName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div
                key={product.slug}
                className="rounded-lg hover:shadow-lg transition-shadow p-2 sm:p-4 w-full max-w-xs mx-auto relative cursor-pointer"
                onClick={() =>
                  Router.push(
                    `/collection/${product.categories[0]}/product/${product.slug}`
                  )
                }
              >
                {/* Image Container with Portrait aspect ratio */}
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={product.featuredImage}
                    alt={product.slug}
                    layout="responsive"
                    width={400} // Example width
                    height={600} // Example height to maintain portrait aspect ratio
                    objectFit="cover"
                    className="rounded-t-lg transition-transform transform hover:scale-110 duration-300"
                  />
                </div>
                <h3 className="text-sm sm:text-base text-gray-800 truncate mb-1 sm:mb-2 capitalize text-center">
                  {product.productTitle}
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm">
                  <div className="flex justify-center">
                    {product.salePrice ? (
                      <div className="flex space-x-1 sm:space-x-2 items-center justify-center">
                        <div className="font-bold">₹ {product.salePrice}</div>
                        <div className="line-through text-gray-500">
                          ₹ {product.regularPrice}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-800 font-bold">
                        ₹ {product.regularPrice || "N/A"}
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
