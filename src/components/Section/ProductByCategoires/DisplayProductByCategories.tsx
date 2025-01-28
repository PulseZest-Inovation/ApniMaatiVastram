import React, { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductType } from "@/Types/data/ProductType";
import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import { CategoryType } from "@/Types/data/CategoryType";
import { Spinner } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ProductsByCategory {
  categoryName: string;
  products: ProductType[];
}

export default function DisplayProductByCategories() {
  const [productsByCategories, setProductsByCategories] = useState<ProductsByCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const Router = useRouter();

  const fetchProductsGroupedByCategories = async (): Promise<ProductsByCategory[]> => {
    try {
      const categories: Array<CategoryType & { id: string }> = await getAllDocsFromCollection<CategoryType>("categories");

      const visibleCategories = categories
        .filter((category) => category.isVisible && category.isPosition)
        .sort((a, b) => {
          const positionA = Number(a.isPosition);
          const positionB = Number(b.isPosition);
          return positionA - positionB;
        });

      if (visibleCategories.length === 0) {
        return [];
      }

      const products: Array<ProductType & { id: string }> = await getAllDocsFromCollection<ProductType>("products");

      const productsByCategories: ProductsByCategory[] = visibleCategories
        .map((category) => {
          const productsForCategory = products.filter((product) => product.categories.includes(category.cid));

          if (productsForCategory.length >= 4) {
            return {
              categoryName: category.name,
              products: productsForCategory.slice(0, 10),
            };
          }
          return null;
        })
        .filter((category): category is ProductsByCategory => category !== null);

      return productsByCategories;
    } catch (error) {
      console.error("Error fetching products grouped by categories:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const productsByCategory = await fetchProductsGroupedByCategories();
      setProductsByCategories(productsByCategory);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const scrollContainer = (container: HTMLDivElement, direction: "left" | "right") => {
    const scrollAmount = direction === "left" ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const memoizedProductsByCategories = useMemo(() => productsByCategories, [productsByCategories]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg text-gray-700">
        <Spinner color="warning" />
      </div>
    );
  }

  return (
    <div className="sm:p-6">
      {memoizedProductsByCategories.map(({ categoryName, products }) => (
        <div key={categoryName} className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 uppercase text-center">
            {categoryName}
          </h2>

          <div className="relative">
            {/* Desktop - Horizontal Scroll with Arrows */}
            <div className="hidden sm:block relative">
              <button
                className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10 hover:bg-gray-700"
                onClick={(e) => {
                  const container = e.currentTarget.nextSibling as HTMLDivElement;
                  if (container) scrollContainer(container, "left");
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <div
                className="overflow-x-auto h-80 scrollbar-hide flex space-x-4"
                ref={(div) => {
                  if (div) div.classList.add("scroll-snap-x");
                }}
              >
                {products.map((product) => (
                  <div
                    key={product.slug}
                    className="rounded-lg hover:shadow-lg transition-shadow p-4 w-64 h-64 flex-none cursor-pointer bg-white"
                    onClick={() =>
                      Router.push(`/collection/${product.categories[0]}/product/${product.slug}`)
                    }
                  >
                    <div className="relative w-full h-full overflow-hidden mb-2">
                      <Image
                        src={product.featuredImage}
                        alt={product.slug}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform transform hover:scale-110 duration-300"
                      />
                    </div>
                    <h3 className="text-sm sm:text-base text-gray-800 truncate mb-0 capitalize text-center">
                      {product.productTitle}
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm mt-1">
                      <div className="flex justify-center">
                        {product.salePrice ? (
                          <div className="flex space-x-1 sm:space-x-2 items-center justify-center">
                            <div className="font-bold">₹ {product.salePrice}</div>
                            <div className="line-through text-gray-500">₹ {product.regularPrice}</div>
                          </div>
                        ) : (
                          <div className="text-gray-800 font-bold">₹ {product.regularPrice || "N/A"}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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

            {/* Mobile - Grid for 2 products per row, show "View All" if more than 4 */}
            <div className="block sm:hidden">
              <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map((product) => (
                  <div
                    key={product.slug}
                    className="rounded-lg hover:shadow-lg transition-shadow p-2 sm:p-4 w-full max-w-xs mx-auto relative cursor-pointer"
                    onClick={() =>
                      Router.push(`/collection/${product.categories[0]}/product/${product.slug}`)
                    }
                  >
                    <div className="relative w-full h-40 mb-2">
                      <Image
                        src={product.featuredImage}
                        alt={product.slug}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform transform hover:scale-110 duration-300"
                      />
                    </div>
                    <h3 className="text-sm sm:text-base text-gray-800 truncate mb-0 capitalize text-center">
                      {product.productTitle}
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm mt-1">
                      <div className="flex justify-center">
                        {product.salePrice ? (
                          <div className="flex space-x-1 sm:space-x-2 items-center justify-center">
                            <div className="font-bold">₹ {product.salePrice}</div>
                            <div className="line-through text-gray-500">₹ {product.regularPrice}</div>
                          </div>
                        ) : (
                          <div className="text-gray-800 font-bold">₹ {product.regularPrice || "N/A"}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {products.length > 4 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => Router.push(`/collection/${products[0].categories[0]}`)}
                    className="text-blue-500 font-semibold"
                  >
                    View All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}