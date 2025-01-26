"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import Image from "next/image";
import OtpModal from "@/components/Login/PhoneLoginModel";
import CartDrawer from "@/components/Cart/page";
import { useRouter } from "next/navigation";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import { fetchCategories } from "./fetchCategories";
import { isUserLoggedIn } from "@/service/isUserLogin";
import MobileDrawer from "./MobileDrawer";
import Link from "next/link";
import { SearchIcon } from "lucide-react";

interface Category {
  name: string;
  slug: string;
}

export const ApplicationLogo = React.memo(() => (
  <Link href="/">
    <Image
      src={ApplicationConfig.applicationLogo}
      height={150}
      width={150}
      alt={ApplicationConfig.applicationName}
      className="rounded"
    />
  </Link>
));

ApplicationLogo.displayName = "Apni Maati Vastram"; // Adding display name

const NavBar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isUserLoggedInState, setIsUserLoggedInState] = useState(false);
  const router = useRouter();

  // Fetch categories and user status on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    const checkUserStatus = async () => {
      const userLoggedIn = await isUserLoggedIn();
      setIsUserLoggedInState(userLoggedIn);
    };

    loadCategories();
    checkUserStatus();
  }, []);

  // Memoize categories
  const memoizedCategories = useMemo(() => categories, [categories]);

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
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-0">
        {/* Top Row */}
        <div className="flex  justify-between py-2">
          {/* Logo */}
          <div className="flex items-center">
            <ApplicationLogo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4 flex-1">
            {memoizedCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/collection/${category.slug}`}
                className="text-gray-700 hover:text-black font-medium uppercase tracking-wide text-sm leading-tight"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <FaUser
              className="text-lg cursor-pointer"
              onClick={handleUserIconClick}
            />
            <FaShoppingCart
              className="text-lg cursor-pointer"
              onClick={openCartDrawer}
            />
            {/* Mobile Menu Toggle */}
            <FaBars
              className="text-lg cursor-pointer sm:hidden"
              onClick={toggleDrawer}
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="relative sm:hidden mb-2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          {/* Search Icon */}
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <SearchIcon size={18} />
          </span>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={toggleDrawer}
        categories={memoizedCategories}
      />

      <OtpModal isOpen={isModalOpen} onOpenChange={closeModal} />
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onOpenChange={setIsCartDrawerOpen}
      />
    </nav>
  );
};

NavBar.displayName = "Apni Maati Vastram"; // Adding display name

export default NavBar;
