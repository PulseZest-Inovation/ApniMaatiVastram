import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductType } from "@/Types/data/ProductType";
import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore"; // Assume this is the helper function for fetching data
import { CategoryType } from "@/Types/data/CategoryType";
import { Spinner } from "@nextui-org/react";

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
      // Fetch all categories from the categories collection
      const categories: Array<CategoryType & { id: string }> = await getAllDocsFromCollection<CategoryType>("categories");
  
      // Filter categories where isVisible and isPosition are true, then sort by isPosition in ascending order
      const visibleCategories = categories
        .filter((category) => category.isVisible && category.isPosition)
        .sort((a, b) => {
          const positionA = Number(a.isPosition); // Convert to number
          const positionB = Number(b.isPosition); // Convert to number
          return positionA - positionB; // Now this will work since positionA and positionB are numbers
        });

      if (visibleCategories.length === 0) {
        return [];
      }
  
      // Fetch all products from the products collection
      const products: Array<ProductType & { id: string }> = await getAllDocsFromCollection<ProductType>("products");
  
      // Group products by category name
      const productsByCategories: ProductsByCategory[] = visibleCategories
        .map((category) => {
          const productsForCategory = products.filter((product) => product.categories.includes(category.cid)); // Check if the category id exists in the product's categories array
  
          // Only include categories with 4 or more products
          if (productsForCategory.length >= 4) {
            return {
              categoryName: category.name,
              products: productsForCategory.slice(0, 10), // Show up to 10 products
            };
          }
          return null; // Exclude categories with fewer than 4 products
        })
        .filter((category): category is ProductsByCategory => category !== null); // Filter out null and assert the correct type
  
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

  const memoizedProductsByCategories = useMemo(() => productsByCategories, [productsByCategories]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg text-gray-700">
        <Spinner color="warning" />
      </div>
    );
  }

  return (
    <div className=" sm:p-6">
      {memoizedProductsByCategories.map(({ categoryName, products }) => (
        <div key={categoryName} className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 uppercase text-center">
            {categoryName}
          </h2>

          <div className="relative">
            {/* Desktop - Horizontal Scroll for more than 5 products */}
            <div className="hidden sm:block overflow-x-auto h-80 scrollbar-hide">
              <div className="flex space-x-4">
                {products.map((product) => (
                  <div
                    key={product.slug}
                    className="rounded-lg hover:shadow-lg transition-shadow p-4 w-60 h-60 cursor-pointer" // Fixed size container for desktop
                    onClick={() =>
                      Router.push(`/collection/${product.categories[0]}/product/${product.slug}`)
                    }
                  >
                    <div className="relative w-full h-full overflow-hidden mb-2">
                      <Image
                        src={product.featuredImage}
                        alt={product.slug}
                        layout="fill"
                        objectFit="cover" // Ensures the image fills the space without distortion
                        className="transition-transform transform hover:scale-110 duration-300"
                      />
                    </div>
                    <h3 className="text-sm sm:text-base text-gray-800 truncate mb-0 capitalize text-center mt-4">
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
                        objectFit="cover" // Keeps image ratio consistent without stretching
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
