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
import UserModel from "@/components/Login/page"; // Updated to UserModel

interface Category {
  name: string;
  slug: string;
}

const ApplicationLogo = () => (
  <Image
    src={ApplicationConfig.applicationLogo}
    height={150}
    width={150}
    alt={ApplicationConfig.applicationName}
    className="rounded"
  />
);

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

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
  }, []);

  // Toggle modal visibility
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
            <Link color="foreground" href={`/${category.slug}`}>
              {category.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right Section: Icons */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Link href="#" onClick={openModal}>
            <FaUser className="text-lg" /> {/* User Icon */}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#">
            <FaShoppingCart className="text-lg" /> {/* Cart Icon */}
          </Link>
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

      {/* User Modal */}
      <UserModel isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </Navbar>
  );
}
