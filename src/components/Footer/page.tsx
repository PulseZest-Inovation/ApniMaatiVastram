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
import { MdEmail } from "react-icons/md";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaWhatsapp,
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
   <footer className="bg-gray-100 py-8 ml-5 mr-5 mb-5">
  <div className="container mx-auto px-4">
    {/* Top Section */}
    <div className="flex flex-wrap justify-between items-start gap-8 mt-6">
      {/* Brand Section */}
      <div className="w-full md:w-1/4">
        <Link href={ApplicationConfig.baseUrl} className="flex items-center">
          <Image
            src={ApplicationConfig.applicationLogo}
            height={200}
            width={200}
            alt={ApplicationConfig.applicationName}
          />
        
        </Link>
        <p className="mt-4 text-gray-600 text-justify leading-relaxed tracking-wide font-bold">
        Apni Maati Vastram was born from a dream to revolutionize how you wear sarees!
        </p>
        <ul className="mt-4 space-y-2 text-gray-600">
          <li className="flex items-center space-x-2">
            <FaWhatsapp className="text-green-500" />
            <span>{footerData?.whatsappNumber}</span>
          </li>
          <li className="flex items-center space-x-2">
            <MdEmail className="text-blue-500" />
            <span>{footerData?.email}</span>
          </li>
        </ul>
      </div>

      {/* Instant Links */}
      <div className="w-full md:w-1/4">
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
      <div className="w-full md:w-1/4">
        <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
        <ul className="space-y-2">
          {footerCategories.categories.slice(0, 5).map((category) => (
            <li key={category.slug}>
              <Link
                href={`/collection/${category.slug}`}
                className="hover:text-blue-400"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

   
    </div>

    {/* Email Subscription and Social Media */}
    <div className="flex flex-wrap justify-between items-center gap-6 mt-8">
      
    <div className="w-full sm:w-1/2">
  <h3 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
      Email
    </label>
    <div className="flex items-center space-x-4">
      <Input
        id="email"
        placeholder="Enter your email"
        type="email"
        className="w-3/4 sm:w-2/3 flex-grow shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-all duration-300"
      >
        Send
      </button>
    </div>
  </div>
</div>



          {/* Payment Methods */}
          <div className="w-full md:w-1/4">
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
    {/* Copyright Section */}
    <div className="text-center font-light text-slate-500 mt-5">
      <p>&copy; {new Date().getFullYear()} {ApplicationConfig.applicationName}. All rights reserved.</p>
    </div>
  </div>
</footer>

  );
}
