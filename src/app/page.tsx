"use client";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageCarousle from "@/components/Carousel/page";
import CategoriesDisplay from "@/components/Categories/page";
import DisplayProductByTags from "@/components/Section/ProductByTags/page";
import ProductByVideos from "@/components/Section/ProductByVideos/page";
import Testimonials from "@/components/Testimonials/page";
import DisplayProductByCategories from "@/components/Section/ProductByCategoires/DisplayProductByCategories";
import HomeLayout from "./home/layout";


export default function Home() {
  return (
    <div>
      
   


         {/* Image Carousel */}
      <motion.div
        initial={{ opacity: 0, x: -50 }} // Start slightly left
        animate={{ opacity: 1, x: 0 }} // Slide to original position
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ImageCarousle />
      </motion.div>

      {/* Categories Display */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Start slightly above
        animate={{ opacity: 1, y: 0 }} // Slide to original position
        transition={{ duration: 0.5 }}
      >
        <CategoriesDisplay />
      </motion.div>

      {/* DispalyProductByCategories */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Start slightly above
        animate={{ opacity: 1, y: 0 }} // Slide to original position
        transition={{ duration: 0.5 }}
      >
        <DisplayProductByCategories />
      </motion.div>

      {/* Products by Videos */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Start slightly below
        animate={{ opacity: 1, y: 0 }} // Slide to original position
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <ProductByVideos />
      </motion.div>

      {/* Products by Tags */}
      <motion.div
        initial={{ opacity: 0, x: 50 }} // Start slightly right
        animate={{ opacity: 1, x: 0 }} // Slide to original position
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <DisplayProductByTags />
      </motion.div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, x: -50 }} // Start slightly left
        animate={{ opacity: 1, x: 0 }} // Slide to original position
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Testimonials />
      </motion.div>
      
     
    </div>
  );
}
