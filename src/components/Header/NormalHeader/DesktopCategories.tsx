import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CategoryType } from "@/Types/data/CategoryType";

const DesktopCategories: React.FC<{ categories: CategoryType[] }> = ({ categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    console.log("Categories received in DesktopCategories:", categories);
  }, [categories]);

  // Filtering only parent categories that should be visible in the header
  const parentCategories = categories.filter(
    (category) => category.parent === "none" && category.isHeaderVisible
  );

  console.log("Parent Categories:", parentCategories); // Debugging

  return (
    <div className="hidden sm:flex justify-center space-x-6 relative">
      {parentCategories.map((parentCategory) => {
        // Get all subcategories (always show them, even if isHeaderVisible is false)
        const subCategories = categories.filter(
          (subCategory) => subCategory.parent === parentCategory.cid
        );

        console.log(`Subcategories for ${parentCategory.name}:`, subCategories); // Debugging

        return (
          <div
            key={parentCategory.slug}
            className="relative group"
            onMouseEnter={() => setHoveredCategory(parentCategory.cid)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* Parent Category Link */}
            <Link
              href={`/collection/${parentCategory.slug}`}
              className="text-gray-700 hover:text-black font-bold uppercase tracking-wide text-2sm leading-tight"
            >
              {parentCategory.name}
            </Link>

            {/* Dropdown for Subcategories (always visible) */}
            {subCategories.length > 0 && hoveredCategory === parentCategory.cid && (
              <div className="absolute left-0 top-full bg-white border shadow-lg rounded-md w-64 py-2 z-50 min-w-max">
                {subCategories.map((subCategory) => (
                  <div key={subCategory.slug} className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-200">
                    {/* Subcategory Link */}
                    <Link
                      href={`/collection/${subCategory.slug}`}
                      className="flex-1 text-sm font-medium"
                    >
                      {subCategory.name}
                    </Link>

                    {/* Subcategory Image */}
                    {subCategory.image && (
                      <img
                        src={subCategory.image}
                        alt={subCategory.name}
                        className="w-8 h-8 object-cover rounded-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DesktopCategories;
