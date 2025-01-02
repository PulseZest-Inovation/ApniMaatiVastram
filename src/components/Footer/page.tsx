"use client";

import { useEffect, useState } from "react";
import { fetchFooterData } from "./fetchFooterData";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import Image from "next/image";
import Link from "next/link";
import { Divider, Input } from "@nextui-org/react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

// Define types for Category and Page
type Category = {
  slug: string;
  name: string;
};

type Page = {
  slug: string;
  name: string;
};

export function Footer() {
  const [footerData, setFooterData] = useState<{ categories: Category[]; pages: Page[] }>({
    categories: [],
    pages: [],
  });

  useEffect(() => {
    async function getData() {
      const data = await fetchFooterData();
      setFooterData(data);
    }
    getData();
  }, []);

  return (
    <footer>
      <Divider />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Top Section */}
        <div className="flex flex-wrap justify-between items-start space-y-6 sm:space-y-0">
          {/* Brand Section */}
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <Link href={ApplicationConfig.baseUrl} className="flex items-center">
              <Image
                src={ApplicationConfig.applicationLogo}
                height={100}
                width={100}
                alt={ApplicationConfig.applicationName}
              />
              <span className="text-xl font-semibold ml-3">
                {ApplicationConfig.applicationName}
              </span>
            </Link>
            <p className="mt-4">
              Stay connected with us for updates and exclusive offers.
            </p>
          </div>

          {/* Instant Links */}
          <div className="w-full sm:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Instant Links</h3>
            <ul className="space-y-2">
              {footerData.pages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} className="hover:text-blue-400">
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="w-full sm:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              {footerData.categories.slice(0, 5).map((category) => (
                <li key={category.slug}>
                  <Link href={`/categories/${category.slug}`} className="hover:text-blue-400">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Email Subscription and Social Media */}
        <div className="flex flex-wrap justify-between items-center">
          {/* Email Subscription */}
          <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
            <div className="flex items-center space-x-4">
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                className="text-white"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="w-full sm:w-1/2 flex justify-end space-x-4">
            <Link
              href="https://facebook.com"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <FaFacebookF size={24} />
            </Link>
            <Link
              href="https://instagram.com"
              className="text-gray-400 hover:text-pink-800 transition"
            >
              <FaInstagram size={24} />
            </Link>
            <Link
              href="https://twitter.com"
              className="text-gray-400 hover:text-black transition"
            >
              <FaTwitter size={24} />
            </Link>
          </div>
        </div>

        <hr className="my-6 border-gray-600" />

        {/* Copyright Section */}
        <div className="text-center">
          <p>
            &copy; {new Date().getFullYear()} {ApplicationConfig.applicationName}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
