'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CategoryType } from "@/Types/data/CategoryType";
import { Image } from "antd";

const DesktopCategories: React.FC<{ categories: CategoryType[] }> = ({ categories }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const parentCategories = categories.filter(
    (category) => category.parent === "none" && category.isHeaderVisible
  );

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
              <div className="absolute left-0 top-full bg-white border shadow-lg rounded-md w-64  z-50 min-w-max">
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
                      <Image
                      height={20}
                      width={20}
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
