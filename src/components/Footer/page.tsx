'use client'
import { useEffect, useState } from "react";
import {
  fetchFooterCategories,
  fetchFooterData,
  fetchFooterSocialMedia,
} from "./fetchFooterData";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import BrandSection from "./BrandSection";
import InstantLinks from "./InstantLinks";
import PopularCategories from "./PopularCategories";
import EmailSubscription from "./EmailSubscription";
import SocialMediaLinks from "./SocialMediaLinks";
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
          <BrandSection footerData={footerData} />
          <InstantLinks pages={footerCategories.pages} />
          <PopularCategories categories={footerCategories.categories} />
        </div>

        {/* Email Subscription and Social Media */}
        <div className="flex flex-wrap justify-between items-center gap-6 mt-8">
          <EmailSubscription />
          <SocialMediaLinks socialMedia={socialMedia ?? {}} />
        </div>

        {/* Copyright Section */}
        <div className="text-center font-light text-slate-500 mt-5">
          <p>&copy; {new Date().getFullYear()} {ApplicationConfig.applicationName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
