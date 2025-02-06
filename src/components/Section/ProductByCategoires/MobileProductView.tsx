import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductType } from "@/Types/data/ProductType";

interface MobileProductListProps {
  products: ProductType[];
  categoryId: string;
  categoryName: string;
}

export default function MobileProductList({ products, categoryId, categoryName }: MobileProductListProps) {
  const Router = useRouter();

  return (
    <div className="block sm:hidden">
         <h2 
        className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 uppercase text-center" 
        onClick={() => Router.push(`/collection/${categoryId}`)}
      >
        {categoryName}
      </h2>
      
      <div className="grid grid-cols-2 gap-4">

     

        {products.slice(0, 4).map((product) => (
          <div
            key={product.slug}
            className="rounded-lg hover:shadow-lg transition-shadow p-2 sm:p-4 w-full max-w-xs mx-auto relative cursor-pointer"
            onClick={() => Router.push(`/collection/${categoryId}/product/${product.slug}`)}
          >
            <div className="relative w-full h-40">
              <Image
                src={product.featuredImage}
                alt={product.slug}
                fill={true}
                style={{ objectFit: "cover" }}
                className="transition-transform transform hover:scale-110 duration-300"
              />
            </div>
            <h3 className="text-sm sm:text-base text-gray-800 truncate mb-0 capitalize text-center">
              {product.productTitle}
            </h3>
          </div>
        ))}
      </div>

      {products.length > 4 && (
        <div className="text-center mt-4">
          <button
            onClick={() => Router.push(`/collection/${categoryId}`)}
            className="text-blue-500 font-semibold"
          >
            View All
          </button>
        </div>
      )}
    </div>
  );
}
