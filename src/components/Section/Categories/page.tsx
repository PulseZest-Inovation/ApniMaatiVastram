'use client';

import React, { useEffect, useState, useRef } from "react";
import { fetchCategories } from "./getCategories";
import { CategoryType } from "@/Types/data/CategoryType";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CategoriesDisplay() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <div className="relative ">
      <div className="relative">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full p-2 z-10"
          onClick={scrollLeft}
        >
          <FaChevronLeft className="text-gray-700" />
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-hidden gap-4 py-2"
        >
          {categories.map((category) => (
            <div
              key={category.cid}
              className="flex-shrink-0 flex flex-col items-center w-24"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                <Image
                  height={100}
                  width={100}
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-sm font-semibold mt-2 text-center">
                {category.name}
              </h2>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow rounded-full p-2 z-10"
          onClick={scrollRight}
        >
          <FaChevronRight className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
