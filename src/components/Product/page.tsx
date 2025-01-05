"use client";

import React, { useEffect, useState } from "react";
import { getDataByDocName } from "@/service/Firebase/getFirestore";
import { ProductType } from "@/Types/data/ProductType";
import ProductDetails from "./ProductDetails";
import ExpandableSection from "./ExpandableSection";
import CustomerReviews from "./CustomerReviews";
import { Col, Row } from "antd";
import ImageGallery from "./ProductImages";
import Head from "next/head"; // Import the Head component for SEO

interface ProductViewProps {
  slug: string;
}

const ProductView: React.FC<ProductViewProps> = ({ slug }) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
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
          setSelectedImage(fetchedProduct.featuredImage);

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
        Loading...
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
  const description = product.description[0]?.content || "Best product available on our platform.";

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
          <Col xs={24} md={12}>
            <div className="flex gap-4">
              <ImageGallery galleryImages={combinedImages} initialSelectedImage={combinedImages[0]} />
            </div>
          </Col>

          {/* Right Section: Product Details */}
          <Col xs={24} md={12}>
            <ProductDetails product={product} />

            {["specifications", "shipping", "moreInfo", "needHelp"].map(
              (section) => (
                <ExpandableSection
                  key={section}
                  title={section.replace(/([A-Z])/g, " $1")}
                  content={
                    product.description.find(
                      (d) => d.heading.toLowerCase() === section
                    )?.content || ""
                  }
                />
              )
            )}

            <CustomerReviews />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductView;
