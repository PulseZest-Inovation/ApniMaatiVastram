// components/NavBar.tsx

'use client';

import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import { fetchCategories } from "./fetchCategories";
import Image from "next/image";
import OtpModal from "@/components/Login/PhoneLoginModel";
import CartDrawer from "@/components/Cart/page";
import { useRouter } from "next/navigation";  
import { isUserLoggedIn } from "@/service/isUserLogin";

interface Category {
  name: string;
  slug: string;
}

const ApplicationLogo = () => (
  <Link  href="/">
    <Image
    src={ApplicationConfig.applicationLogo}
    height={150}
    width={150}
    alt={ApplicationConfig.applicationName}
    className="rounded"
  />
  </Link>

);

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false); // Cart drawer state
  const [isUserLoggedInState, setIsUserLoggedInState] = useState(false); // State to store user login status
  const router = useRouter(); // Next.js Router to navigate to /account

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

    // Check if the user is logged in
    const checkUserStatus = async () => {
      const userLoggedIn = await isUserLoggedIn();
      console.log(userLoggedIn, "status of the user")
      setIsUserLoggedInState(userLoggedIn);
    };

    checkUserStatus();
  }, []);

  // Toggle modal visibility
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false); // Close modal function

  const openCartDrawer = () => setIsCartDrawerOpen(true);

  const handleUserIconClick = async () => {
    if (isUserLoggedInState) {
      router.push("/account"); // Navigate to /account if the user is logged in

    } else {
      // Open modal if the user is not logged in
      openModal(); 

    }
  };

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      {/* Mobile Menu Toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      {/* Center Content */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <ApplicationLogo />
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navbar */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <ApplicationLogo />
        </NavbarBrand>
        {categories.map((category) => (
          <NavbarItem key={category.slug}>
            <Link color="foreground" href={`/collection/${category.slug}`}>
              {category.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right Section: Icons */}
      <NavbarContent justify="end">
        <NavbarItem>
            <FaUser className="text-lg cursor-pointer"  onClick={handleUserIconClick}/> {/* User Icon */}
        </NavbarItem>
        <NavbarItem>
            <FaShoppingCart className="text-lg cursor-pointer" onClick={openCartDrawer} /> {/* Cart Icon */}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {categories.map((category) => (
          <NavbarMenuItem key={category.slug}>
            <Link className="w-full" color="foreground" href={`/${category.slug}`} size="lg">
              {category.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

     
      <OtpModal isOpen={isModalOpen} onOpenChange={closeModal} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartDrawerOpen} onOpenChange={setIsCartDrawerOpen} />
    </Navbar>
  );
}
