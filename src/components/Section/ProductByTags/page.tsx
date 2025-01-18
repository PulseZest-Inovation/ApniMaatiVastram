"use client";

import React, { useEffect, useState,  useRef } from "react";
import {
  fetchProductsGroupedByTags,
  ProductsByTag,
} from "./fetchProductByTags";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {  Spinner } from "@nextui-org/react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
              products: products.slice(0, 10), // Fetch more for scrolling
            };
          }
          return null;
        })
        .filter((tag): tag is ProductsByTag => tag !== null);

      setProductsByTags(filteredData);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const scrollContainerRef = useRef<Record<string, HTMLDivElement | null>>({});

  const handleScroll = (tagName: string, direction: "left" | "right") => {
    const container = scrollContainerRef.current[tagName];
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300; // Adjust scroll amount
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg text-gray-700">
        <Spinner color="warning" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {productsByTags.map(({ tagName, products }) => (
        <div key={tagName} className="mb-12 ">
  
          <div className="flex justify-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 uppercase relative inline-block px-4 py-2 bg-gray-200 rounded-md shadow-md">
            {tagName}
          </h2>
        </div>


          <div className="relative">
            {/* Scrollable Container */}
            <div
              ref={(el) => {
                (scrollContainerRef.current[tagName] = el)
              }}
              className="flex space-x-4 overflow-x-auto scrollbar-hide p-2"
            >
              {products.map((product) => (
                <div
                  key={product.slug}
                  className="flex-shrink-0 w-48 rounded-lg hover:shadow-lg transition-shadow p-2 sm:p-4 relative cursor-pointer"
                  onClick={() =>
                    Router.push(
                      `/collection/${product.categories[0]}`
                    )
                  }
                >
                  {/* Image Container */}
                  <div className="relative w-full overflow-hidden rounded-md">
                    <Image
                      src={product.featuredImage}
                      alt={product.slug}
                      layout="responsive"
                      width={500}
                      height={800}
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

            {/* Scroll Buttons */}
            <button
              onClick={() => handleScroll(tagName, "left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={() => handleScroll(tagName, "right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-100 p-2 rounded-full shadow-md hover:bg-gray-200"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
