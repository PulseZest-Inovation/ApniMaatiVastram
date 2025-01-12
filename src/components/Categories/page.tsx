"use client";

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
      setCategories(fetchedCategories);
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
    <div className="relative flex justify-center items-center py-6 bg-gray-50 w-full">
      <div className="relative w-full max-w-screen-xl mx-auto">
        {/* Left Arrow - only visible on mobile */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 z-10 hover:scale-105 sm:block lg:hidden"
          onClick={scrollLeft}
        >
          <FaChevronLeft className="text-gray-700 text-lg" />
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex sm:gap-4 lg:gap-3 items-center overflow-x-auto sm:overflow-x-auto lg:overflow-x-hidden scrollbar-hidden py-3 pl-2 px-1 lg:px-0 w-full max-w-full scrollbar-hide"
        >
          {memoizedCategories.map((category) => (
            <div
              key={category.cid}
              className="flex-shrink-0 flex flex-col items-center w-32 sm:w-36 lg:w-44 xl:w-56 2xl:w-64 xl:pl-8"
            >
              <div className="w-full h-32 sm:w-32 sm:h-32 lg:w-64 lg:h-64 bg-gray-200 rounded-full overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-110">
                <Image
                  height={256} // Use a fixed height that matches the size of the circle
                  width={256} // Use a fixed width to ensure the image fills the circle without clipping
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onClick={() => {
                    Router.push(`collection/${category.cid}`);
                  }}
                />
              </div>
              <h2
                className="text-xs sm:text-sm font-semibold mt-2 text-center cursor-pointer font-sans"
                onClick={() => {
                  Router.push(`collection/${category.cid}`);
                }}
              >
                {category.name}
              </h2>
            </div>
          ))}
        </div>

        {/* Right Arrow - only visible on mobile */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 z-10 hover:scale-105 sm:block lg:hidden"
          onClick={scrollRight}
        >
          <FaChevronRight className="text-gray-700 text-lg" />
        </button>
      </div>
    </div>
  );
}
