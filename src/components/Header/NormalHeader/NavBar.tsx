'use client';

import React, { useEffect, useState } from "react";
import { FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import Image from "next/image";
import OtpModal from "@/components/Login/PhoneLoginModel";
import CartDrawer from "@/components/Cart/page";
import { useRouter } from "next/navigation";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import { fetchCategories } from "./fetchCategories";
import { isUserLoggedIn } from "@/service/isUserLogin";
import MobileDrawer from "./MobileDrawer";

interface Category {
  name: string;
  slug: string;
}

export const ApplicationLogo = () => (
  <a href="/">
    <Image
      src={ApplicationConfig.applicationLogo}
      height={150}
      width={150}
      alt={ApplicationConfig.applicationName}
      className="rounded"
    />
  </a>
);

export default function NavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isUserLoggedInState, setIsUserLoggedInState] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    loadCategories();

    const checkUserStatus = async () => {
      const userLoggedIn = await isUserLoggedIn();
      setIsUserLoggedInState(userLoggedIn);
    };

    checkUserStatus();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openCartDrawer = () => setIsCartDrawerOpen(true);

  const handleUserIconClick = async () => {
    if (isUserLoggedInState) {
      router.push("/account");
    } else {
      openModal();
    }
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <ApplicationLogo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-6 flex-1">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`/collection/${category.slug}`}
                className="text-gray-700 hover:text-black font-medium uppercase tracking-wide"
              >
                {category.name}
              </a>
            ))}

            {/* Search Field */}
            <div className="relative w-full max-w-md">
  <input
    type="text"
    placeholder="Search..."
    className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
  />
  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 4a7 7 0 100 14 7 7 0 000-14zm10 10l-4.35-4.35"
      />
    </svg>
  </span>
</div>

          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <FaUser className="text-lg cursor-pointer" onClick={handleUserIconClick} />
            <FaShoppingCart className="text-lg cursor-pointer" onClick={openCartDrawer} />
            {/* Mobile Menu Toggle */}
            <FaBars className="text-lg cursor-pointer sm:hidden" onClick={toggleDrawer} />
          </div>
        </div>

        {/* Search for Mobile */}
        <div className=" sm:hidden mb-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-black"
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={toggleDrawer}
        categories={categories}
      />

      <OtpModal isOpen={isModalOpen} onOpenChange={closeModal} />
      <CartDrawer isOpen={isCartDrawerOpen} onOpenChange={setIsCartDrawerOpen} />
    </nav>
  );
}
