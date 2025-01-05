'use client';

import React, { useEffect, useState, useRef } from "react";
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
    <div className="relative">
      <div className="relative">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full p-3 z-10"
          onClick={scrollLeft}
        >
          <FaChevronLeft className="text-gray-700 text-lg" />
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-hidden gap-4 py-4"
        >
          {categories.map((category) => (
            <div
              key={category.cid}
              className="flex-shrink-0 flex flex-col items-center w-20 sm:w-32"
            >
              <div
                className="w-16 h-16 sm:w-28 sm:h-28 bg-gray-200 rounded-full overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-110"
              >
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
                className="text-xs sm:text-md font-semibold mt-2 sm:mt-3 text-center cursor-pointer"
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
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full p-3 z-10"
          onClick={scrollRight}
        >
          <FaChevronRight className="text-gray-700 text-lg" />
        </button>
      </div>
    </div>
  );
}
