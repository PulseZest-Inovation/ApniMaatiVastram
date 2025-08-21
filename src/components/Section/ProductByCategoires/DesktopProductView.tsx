"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductType } from "@/Types/data/ProductType";

interface DesktopProductListProps {
  products: ProductType[];
  categoryId: string;
  categoryName: string;
}

export default function DesktopProductList({
  products,
  categoryId,
  categoryName,
}: DesktopProductListProps) {
  const Router = useRouter();

  const scrollContainer = (
    container: HTMLDivElement,
    direction: "left" | "right"
  ) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative hidden sm:block">
      <h2
        className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 uppercase text-center cursor-pointer"
        onClick={() => Router.push(`/collection/${categoryId}`)}
      >
        {categoryName}
      </h2>

      {/* Left Scroll Button */}
      <button
        className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
        onClick={(e) => {
          const container = e.currentTarget.nextSibling as HTMLDivElement;
          if (container) scrollContainer(container, "left");
        }}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Products Row */}
      <div className="overflow-x-auto h-80 scrollbar-hide flex space-x-4">
        {products.map((product: ProductType) => (
          <div
            key={product.slug}
            className="relative rounded-lg hover:shadow-lg transition-shadow p-4 w-64 h-80 flex-none cursor-pointer bg-white flex flex-col"
            onClick={() =>
              Router.push(`/collection/${categoryId}/product/${product.slug}`)
            }
          >
            {/* Product Image */}
            <div className="relative w-full h-56 overflow-hidden mb-2 rounded-md">
              {/* 🔹 TagForImage Badge */}
              {product.tagForImage && (
                <div className="absolute top--1 left--3 z-10">
                  <span className="relative inline-block bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-md shadow-md">
                    {product.tagForImage}
                    {/* little triangle tail */}
                    <span className="absolute -bottom-1 left-2 w-2 h-2 bg-purple-600 rotate-45"></span>
                  </span>
                </div>
              )}

              <Image
                src={
                  product.featuredImage
                    ? product.featuredImage
                    : "/images/placeholder.png"
                }
                alt={product.slug}
                fill={true}
                style={{ objectFit: "cover" }}
                className="transition-transform transform hover:scale-110 duration-300"
              />
            </div>

            {/* Product Title */}
            <h3 className="text-sm sm:text-base text-gray-800 truncate mb-1 capitalize text-center">
              {product.productTitle}
            </h3>
          </div>
        ))}

        {/* View All Card */}
        <div
          className="rounded-lg hover:shadow-lg transition-shadow p-4 w-64 h-72 flex-none cursor-pointer bg-gray-200 flex items-center justify-center"
          onClick={() => Router.push(`/collection/${categoryId}`)}
        >
          <h3 className="text-lg font-bold text-gray-800">View All</h3>
        </div>
      </div>

      {/* Right Scroll Button */}
      <button
        className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
        onClick={(e) => {
          const container = e.currentTarget.previousSibling as HTMLDivElement;
          if (container) scrollContainer(container, "right");
        }}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
