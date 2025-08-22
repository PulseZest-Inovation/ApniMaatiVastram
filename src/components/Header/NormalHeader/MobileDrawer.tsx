'use client';

import React, { useState, useEffect } from "react";
import { MdClose, MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { ApplicationLogo } from "./NavBar";
import { CategoryType } from "@/Types/data/CategoryType";
import Link from "next/link";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryType[];
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, categories }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    // Lock scroll when drawer is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    if (!isOpen) return;

    // Close drawer on scroll
    const handleScroll = () => {
      onClose();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  const parentCategories = categories.filter((category) => category.parent === "none");

  const getSubCategories = (parentCid: string) => {
    return categories.filter((category) => category.parent === parentCid);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 overflow-y-auto"
      onClick={onClose}
      style={{ touchAction: "none" }}
    >
      <div
        id="mobile-drawer"
        className="fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg p-4 transform transition-transform duration-300 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center mb-4">
          <ApplicationLogo />
          <MdClose className="text-2xl cursor-pointer" onClick={onClose} />
        </div>

        {/* Categories */}
        <div className="flex flex-col space-y-5 mt-10">
          {parentCategories.map((parentCategory) => {
            const subCategories = getSubCategories(parentCategory.cid);

            return (
              <div key={parentCategory.slug}>
                {/* Parent Category Link */}
                <button
                  className="flex items-center justify-between text-gray-700 text-sm hover:text-black font-medium uppercase tracking-wide w-full text-left"
                  onClick={() =>
                    setOpenCategory(openCategory === parentCategory.cid ? null : parentCategory.cid)
                  }
                >
                  <Link href={`/collection/${parentCategory.slug}`} onClick={onClose}>
                    {parentCategory.name}
                  </Link>
                  {subCategories.length > 0 && (
                    <span>
                      {openCategory === parentCategory.cid ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
                    </span>
                  )}
                </button>

                {/* Dropdown for Subcategories */}
                {openCategory === parentCategory.cid && subCategories.length > 0 && (
                  <div className="pl-4 mt-2 space-y-2 flex flex-col">
                    {subCategories.map((subCategory) => (
                      <Link
                        key={subCategory.slug}
                        href={`/collection/${subCategory.slug}`}
                        className="block text-gray-600 text-sm hover:text-black font-sans tracking-wide"
                        onClick={onClose}
                      >
                        {subCategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
