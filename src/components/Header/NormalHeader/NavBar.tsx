"use client";

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
import Link from "next/link";
import SearchBar from "./SearchBar";
import DesktopCategories from "./DesktopCategories";
import { CategoryType } from "@/Types/data/CategoryType"; // Use correct import

export const ApplicationLogo = React.memo(() => (
  <Link href="/">
    <Image
      src={ApplicationConfig.applicationLogo}
      height={200}
      width={200}
      alt={ApplicationConfig.applicationName}
      className="rounded items-center"
    />
  </Link>
));

ApplicationLogo.displayName = "ApplicationLogo"; // Corrected displayName


interface NavBarProps {
  onSearchQueryChange: (query: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({onSearchQueryChange }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
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

    const checkUserStatus = async () => {
      const userLoggedIn = await isUserLoggedIn();
      setIsUserLoggedInState(userLoggedIn);
    };

    loadCategories();
    checkUserStatus();
  }, []);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false); // Fix state handling

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

      {/* First Row */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Left: Search Field */}
          <div className="hidden sm:block w-1/3">
            <SearchBar 
            onQueryChange={(query) => {
            onSearchQueryChange(query);  
          }}
            
            />
          </div>

          {/* Center: Application Logo */}
          <div className="w-1/3 flex justify-center">
            <ApplicationLogo />
          </div>

          {/* Right: Icons */}
          <div className="flex justify-end items-center space-x-4 w-1/4">
            <FaUser className="text-lg cursor-pointer" onClick={handleUserIconClick} />
            <FaShoppingCart className="text-lg cursor-pointer" onClick={openCartDrawer} />
            <FaBars className="text-lg cursor-pointer sm:hidden" onClick={toggleDrawer} />
          </div>
        </div>
      </div>

      {/* Second Row (Desktop: Categories | Mobile: Search Field) */}
      <div className="py-2">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop: Categories */}
          <DesktopCategories  categories={categories} />

          {/* Mobile: Search Field */}
          <div className="sm:hidden">
          <SearchBar 
            onQueryChange={(query) => {
            onSearchQueryChange(query);  
          }}
            
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} categories={categories} />

      <OtpModal isOpen={isModalOpen} onOpenChange={closeModal} />
      <CartDrawer isOpen={isCartDrawerOpen} onOpenChange={closeCartDrawer} />
    </nav>
  );
};

NavBar.displayName = "NavBar";

export default NavBar;
