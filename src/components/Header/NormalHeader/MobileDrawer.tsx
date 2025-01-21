'use client';

import React from "react";
import { MdClose } from "react-icons/md";
import { ApplicationLogo } from "./NavBar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { name: string; slug: string }[];
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, categories }) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={onClose} // Close when clicking the overlay
    >
      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-white shadow-lg p-4 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside the drawer
      >
        {/* Close Button */}
        <div className="flex justify-between items-center mb-4">
            <ApplicationLogo/>
          <MdClose className="text-2xl cursor-pointer" onClick={onClose} />
        </div>

        {/* Categories */}
        <div className="flex flex-col space-y-5 mt-10">
          {categories.map((category) => (
            <a
              key={category.slug}
              href={`/collection/${category.slug}`}
              className="text-gray-700 text-2xl hover:text-black font-medium uppercase tracking-wide"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
