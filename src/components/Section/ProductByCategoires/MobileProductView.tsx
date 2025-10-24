import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductType } from "@/Types/data/ProductType";

interface MobileProductListProps {
  products: ProductType[];
  categoryId: string;
  categoryName: string;
}

export default function MobileProductList({
  products,
  categoryId,
  categoryName,
}: MobileProductListProps) {
  const Router = useRouter();

  return (
    <div className="block sm:hidden">
      {/* Category Heading */}
      <h2
        className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 uppercase text-center cursor-pointer"
        onClick={() => Router.push(`/collection/${categoryId}`)}
      >
        {categoryName}
      </h2>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.slice(0, 4).map((product) => (
          <div
            key={product.slug}
            className="rounded-lg hover:shadow-lg transition-shadow p-2 sm:p-4 w-full max-w-xs mx-auto relative cursor-pointer bg-white"
            onClick={() =>
              Router.push(`/collection/${categoryId}/product/${product.slug}`)
            }
          >
            {/* ✅ Image container with diagonal ribbon */}
            <div className="relative w-full h-40 sm:h-56 overflow-hidden mb-2 rounded-md">
              {product.tagForImage && (
                <div className="absolute top-2 -left-8 z-10 rotate-[-45deg]">
                  <span className="bg-red-500 text-white text-xs font-semibold px-10 py-1 shadow-md">
                    {product.tagForImage}
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

            {/* Title */}
            <h3 className="text-sm sm:text-base text-gray-800 truncate mb-1 capitalize text-center">
              {product.productTitle}
            </h3>

            {/* Price Section */}
            <div className="flex items-center justify-center gap-2">
              {product.regularPrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{product.regularPrice}
                </span>
              )}
              <span className="text-xs sm:text-sm text-gray-800 font-semibold">
                ₹{product.salePrice}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {products.length > 4 && (
        <div className="text-center mt-4">
          <button
            onClick={() => Router.push(`/collection/${categoryId}`)}
            className="text-blue-500 font-semibold hover:underline"
          >
            View All
          </button>
        </div>
      )}
    </div>
  );
}
