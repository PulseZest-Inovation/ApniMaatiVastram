'use client'
import { ProductType } from "@/Types/data/ProductType";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import Image from "next/image";

interface RelatedProductProps {
  category: string[]; // Categories of the current product
}

export default function RelatedProduct({ category }: RelatedProductProps) {
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const Router = useRouter();

  // Fetch all products and filter related ones
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const allProducts = await getAllDocsFromCollection<ProductType>("products"); // Fetch all products
      const filteredProducts = allProducts.filter((product) =>
        product.categories.some((cat) => category.includes(cat)) // Match categories
      );
      setRelatedProducts(filteredProducts);
    };

    fetchRelatedProducts();
  }, [category]);

  // Scroll handler
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300; // Adjust bulk scroll value
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative py-4">
      <h2 className="text-2xl text-center mb-4">Related Products</h2>

      {/* Scroll Arrows */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-2 z-10 shadow"
      >
        &#8592;
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 hover:bg-gray-400 rounded-full p-2 z-10 shadow"
      >
        &#8594;
      </button>

      {/* Scrollable Product List */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto flex space-x-4 items-center scrollbar-hide scroll-smooth"
      >
        {relatedProducts.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 bg-white rounded-md shadow-md p-4 w-48 cursor-pointer"
            onClick={()=>{Router.push(`/collection/${item.categories[0]}/product/${item.slug}`)}}
          >
            {/* Featured Image */}
            <div className="w-full h-42 rounded-md overflow-hidden">
              <Image
                src={item.featuredImage}
                alt={item.productTitle}
                width={150}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Title */}
            <h2 className="mt-2 text-sm font-semibold text-gray-800 text-center">
              {item.productTitle}
            </h2>

            {/* Product Price */}
            <div className="flex justify-center mt-2">
              {item.salePrice ? (
                <div className="flex space-x-1 items-center">
                  <div className="font-bold text-orange-600">
                    ₹ {item.salePrice}
                  </div>
                  <div className="line-through text-gray-500">
                    ₹ {item.regularPrice}
                  </div>
                </div>
              ) : (
                <div className="text-gray-800 font-bold">
                  ₹ {item.regularPrice || "N/A"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
