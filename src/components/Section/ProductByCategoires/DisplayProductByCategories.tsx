'use client'

import React, { useEffect, useState, useMemo } from "react";
import { ProductType } from "@/Types/data/ProductType";
import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import { CategoryType } from "@/Types/data/CategoryType";
import { Spinner } from "@nextui-org/react";
import DesktopProductList from "./DesktopProductView";
import MobileProductList from "./MobileProductView";

export interface ProductsByCategory {
  categoryName: string;
  categoryId: string;
  products: ProductType[];
}

export default function DisplayProductByCategories() {
  const [productsByCategories, setProductsByCategories] = useState<ProductsByCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductsGroupedByCategories = async (): Promise<ProductsByCategory[]> => {
    try {
      const categories: Array<CategoryType & { id: string }> = await getAllDocsFromCollection<CategoryType>("categories");

      const visibleCategories = categories
        .filter((category) => category.isVisible && category.isPosition)
        .sort((a, b) => Number(a.isPosition) - Number(b.isPosition));

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
              categoryId: category.cid,
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
      {memoizedProductsByCategories.map(({ categoryName, categoryId, products }) => (
        <div key={categoryName} className="mb-12">
         

          <DesktopProductList products={products} categoryId={categoryId} categoryName={categoryName} />
          <MobileProductList products={products} categoryId={categoryId}  categoryName={categoryName}/>
        </div>
      ))}
    </div>
  );
}
