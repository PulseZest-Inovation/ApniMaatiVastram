"use client";

import React, { useEffect, useState } from "react";
import { FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import { HeartTwoTone } from "@ant-design/icons";
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
import { CategoryType } from "@/Types/data/CategoryType";
import { handleAddToWishlist } from "@/utils/handleAddToWishlist";
import { Spinner } from "@nextui-org/react";
import { ProductType } from "@/Types/data/ProductType";

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

ApplicationLogo.displayName = "ApplicationLogo";

interface NavBarProps {
  onSearchQueryChange: (query: string) => void;
  wishlistProduct?: ProductType; // Optional product to add to wishlist
}

const NavBar: React.FC<NavBarProps> = ({onSearchQueryChange, wishlistProduct }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isUserLoggedInState, setIsUserLoggedInState] = useState(false);
  const [loading, setLoading] = useState({ wishlist: false });
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        const rearrangedCategories = [...fetchedCategories].sort((a, b) => {
          if (a.isPosition && b.isPosition) {
            return String(a.isPosition).localeCompare(String(b.isPosition));
          }
          return 0;
        });
        setCategories(rearrangedCategories);
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
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const handleUserIconClick = async() => {
    if (isUserLoggedInState) {
      router.push("/account");
    } else {
      openModal();
    }
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // Wishlist click handler
  const handleWishlistClick = () => {
    // Navigate to the wishlist page
    router.push("/wishlist");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      {/* First Row */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Left: Search Field */}
          <div className="hidden sm:block w-1/3">
            <SearchBar onQueryChange={onSearchQueryChange} />
          </div>

          {/* Center: Application Logo */}
         <div className="w-1/3 flex justify-center">
  <ApplicationLogo />
</div>

{/* Right: Icons (User, Wishlist, Cart, Menu) */}
<div className="flex items-center justify-end w-1/4">
  {/* Icons Group */}
  <div className="flex items-center space-x-3 sm:space-x-4">
    {/* User Icon */}
    <FaUser
      className="cursor-pointer text-base sm:text-lg md:text-xl"
      onClick={handleUserIconClick}
    />

    {/* Wishlist */}
    <div
      className="cursor-pointer flex items-center justify-center"
      onClick={handleWishlistClick}
    >
      {loading.wishlist ? (
        <Spinner color="primary" size="sm" />
      ) : (
        <HeartTwoTone
          twoToneColor="#eb2f96"
          style={{ fontSize: "1.2rem" }}
          className="sm:!text-xl md:!text-2xl"
        />
      )}
    </div>

    {/* Cart */}
    <FaShoppingCart
      className="cursor-pointer text-base sm:text-lg md:text-xl"
      onClick={openCartDrawer}
    />
  </div>

  {/* Mobile Menu Icon */}
  <FaBars
    className="cursor-pointer text-base sm:text-lg md:hidden ml-3"
    onClick={toggleDrawer}
  />
 

         
         
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="py-2">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <DesktopCategories categories={categories} />
          <div className="sm:hidden">
            <SearchBar onQueryChange={onSearchQueryChange} />
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
