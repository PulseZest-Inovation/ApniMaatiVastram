"use client";

import React, { useEffect, useState } from "react";
import { getDataByDocName } from "@/service/Firebase/getFirestore";
import { ProductType } from "@/Types/data/ProductType";
import ProductDetails from "./ProductDetails";
import CustomerReviews from "./CustomerReviews";
import { Col, Row } from "antd";
import ImageGallery from "./ProductImages";
import Head from "next/head"; // Import the Head component for SEO
import Image from "next/image";
import { Divider, Spinner } from "@nextui-org/react";
import RelatedProduct from "../Section/RelatedProduct/page";

interface ProductViewProps {
  slug: string;
}

const ProductView: React.FC<ProductViewProps> = ({ slug }) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [combinedImages, setCombinedImages] = useState<string[]>([]); // New state for combined images

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getDataByDocName<ProductType>(
          "products",
          slug
        );
        setProduct(fetchedProduct);
        if (fetchedProduct) {
          
          // Combine gallery images, featured image, and video URL
          const combined = [
            fetchedProduct.featuredImage, 
            ...(fetchedProduct.galleryImages || []),
            ...(fetchedProduct.videoUrl ? [fetchedProduct.videoUrl] : [])
          ];
          setCombinedImages(combined); // Set the combined array
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
         <Spinner color="warning"/>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Product not found
      </div>
    );
  }

  // Set dynamic title and meta description for SEO
  const title = product.productSubtitle ? `${product.productTitle} - Buy Now` : "Product Details";
  const description = product.shortDescription || "Best product available on our platform.";

  return (
    <div className="p-6 bg-white min-h-screen">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={product.featuredImage} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={product.featuredImage} />
      </Head>

      <div className="max-w-7xl mx-auto">
        <Row gutter={16} align="top">
          {/* Left Section: Gallery and Main Image */}
          <Col xs={24} md={12} lg={14} className=" lg:sticky lg:top-20">
            <div className="flex gap-4">
              <ImageGallery galleryImages={combinedImages} initialSelectedImage={combinedImages[0]} videoUrl={product.videoUrl} videoCoverImage={combinedImages[0]}/>
            </div>
          </Col>

          {/* Right Section: Product Details */}
          <Col xs={24} md={12} lg={10}>
          
            <ProductDetails product={product} />


            <div className="w-full flex justify-center">
              <Image
                src="/trust.avif"
                alt="Trust image representing security and reliability"
                height={700}
                width={700}
                className="mt-3 object-contain sm:w-full md:w-auto"
                priority={true}  
              />
            </div>

          

            <CustomerReviews />
          </Col>
        </Row>
      </div>
      <Divider className="mt-3"/>
      <RelatedProduct category={product.categories}/>
    </div>
  );
};

export default ProductView;
