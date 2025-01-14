"use client";

import { useEffect, useState } from "react";
import {
  fetchFooterCategories,
  fetchFooterData,
  fetchFooterSocialMedia,
} from "./fetchFooterData";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import Image from "next/image";
import Link from "next/link";
import { Divider, Input } from "@nextui-org/react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { SocialMediaType } from "@/Types/Theme/SocialMediaType";
import { FooterType } from "@/Types/Theme/footerType";

type Category = {
  slug: string;
  name: string;
};

type Page = {
  slug: string;
  name: string;
};

export function Footer() {
  const [footerCategories, setFooterCategories] = useState<{
    categories: Category[];
    pages: Page[];
  }>({
    categories: [],
    pages: [],
  });
  const [socialMedia, setSocialMedia] = useState<null | SocialMediaType>(null);
  const [footerData, setFooterData] = useState<null | FooterType>(null);

  useEffect(() => {
    async function getData() {
      const categories = await fetchFooterCategories();
      const socialMediaData = await fetchFooterSocialMedia();
      const footerData = await fetchFooterData();
      setSocialMedia(socialMediaData ?? null);
      setFooterData(footerData ?? null);
      setFooterCategories(categories);
    }
    getData();
  }, []);

  return (
    <footer>
      <Divider />
      <div className="container mx-auto px-4 ">
        {/* Top Section */}
        <div className="flex flex-wrap justify-between items-start space-y-8 sm:space-y-0 mt-3">
          {/* Brand Section */}
          <div className="w-full sm:w-1/4">
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
            <p className="mt-4 text-gray-600">{footerData?.content}</p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li><strong>Address:</strong> {footerData?.address}</li>
              <li><strong>Contact:</strong> {footerData?.contactNumber}</li>
              <li><strong>WhatsApp:</strong> {footerData?.whatsappNumber}</li>
              <li><strong>Email:</strong> {footerData?.email}</li>
            </ul>
          </div>

          {/* Instant Links */}
          <div className="w-full sm:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Instant Links</h3>
            <ul className="space-y-2">
              {footerCategories.pages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/${page.slug}`} className="hover:text-blue-400">
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="w-full sm:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              {footerCategories.categories.slice(0, 5).map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="hover:text-blue-400"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="w-full sm:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Safe & Secure Payment</h3>
            <div className="flex flex-wrap gap-4">
              <Image src="/icons/phonepe.png" alt="PhonePe" height={40} width={40} />
              <Image src="/icons/google-pay.png" alt="Google Pay" height={40} width={40} />
              <Image src="/icons/paytm.png" alt="Paytm" height={40} width={40} />
              <Image src="/icons/bank.png" alt="Bank" height={40} width={40} />
              <Image src="/icons/upi.png" alt="UPI" height={40} width={80} />
              <Image src="/icons/visa.png" alt="Visa" height={40} width={40} />
              <Image src="/icons/card.png" alt="Credit/Debit Card" height={40} width={40} />
              <Image src="/icons/atm-card.png" alt="ATM Card" height={40} width={40} />
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Email Subscription and Social Media */}
        <div className="flex flex-wrap justify-between items-center z-0">
          <div className="w-full sm:w-1/2 mb-5 sm:mb-0">
            <h3 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
            <div className="flex items-center space-x-4">
              <Input label="Email" placeholder="Enter your email" type="email" />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Send
              </button>
            </div>
          </div>

          <div className="w-full sm:w-1/2 flex justify-end space-x-4">
            {socialMedia?.facebook && (
              <Link
                href={socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition"
              >
                <FaFacebookF size={24} />
              </Link>
            )}
            {socialMedia?.instagram && (
              <Link
                href={socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-800 transition"
              >
                <FaInstagram size={24} />
              </Link>
            )}
            {socialMedia?.twitter && (
              <Link
                href={socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FaTwitter size={24} />
              </Link>
            )}
            {socialMedia?.linkedin && (
              <Link
                href={socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition"
              >
                <FaLinkedin size={24} />
              </Link>
            )}
            {socialMedia?.youtube && (
              <Link
                href={socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-600 transition"
              >
                <FaYoutube size={24} />
              </Link>
            )}
          </div>
        </div>


        {/* Copyright Section */}
        <div className="text-center font-light text-slate-500 mt-5">
          <p>&copy; {new Date().getFullYear()} {ApplicationConfig.applicationName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
