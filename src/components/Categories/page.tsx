'use client';

import React, { useEffect, useState, useRef, useMemo } from "react";
import { fetchCategories } from "./getCategories";
import { CategoryType } from "@/Types/data/CategoryType";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CategoriesDisplay() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const Router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      
      // Filter categories where parent is 'none' and sort by 'isPosition'
      const filteredCategories = fetchedCategories
        .filter(category => category.parent === "none")
        .sort((a, b) => a.isPosition - b.isPosition);

      setCategories(filteredCategories);
    };

    loadCategories();
  }, []);

  const memoizedCategories = useMemo(() => categories, [categories]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -150, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex py-6 bg-gray-50 w-full">
      <div className="relative w-full mx-auto px-0">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 z-10 hover:scale-105"
          onClick={scrollLeft}
        >
          <FaChevronLeft className="text-gray-700 text-lg" />
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto py-4 w-full justify-start scrollbar-hide"
        >
          {memoizedCategories.map((category) => (
            <div
              key={category.cid}
              className="flex-shrink-0 flex flex-col items-center mx-2"
            >
              <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 bg-gray-200 rounded-full overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-110">
                <Image
                  height={120}
                  width={120}
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onClick={() => {
                    Router.push(`collection/${category.cid}`);
                  }}
                />
              </div>
              <h2
                className="text-xs sm:text-sm font-semibold mt-2 text-center cursor-pointer"
                onClick={() => {
                  Router.push(`collection/${category.cid}`);
                }}
              >
                {category.name}
              </h2>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 z-10 hover:scale-105"
          onClick={scrollRight}
        >
          <FaChevronRight className="text-gray-700 text-lg" />
        </button>
      </div>
    </div>
  );
}
