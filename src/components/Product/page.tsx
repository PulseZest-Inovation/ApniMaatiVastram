"use client";

import React, { useEffect, useState } from "react";
import { getDataByDocName } from "@/service/Firebase/getFirestore";
import { ProductType } from "@/Types/data/ProductType";
import ProductDetails from "./ProductDetails";
import CustomerReviews from "./CustomerReviews";
import { Col, Row } from "antd";
import ImageGallery from "./ProductImageGallery/ProductImages";
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
    // add variation feture image and all thing
  const [selectedVariation, setSelectedVariation] = useState<any>(null);  


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
            ...(fetchedProduct.videoUrl ? [fetchedProduct.videoUrl] : []),
          ];
          setCombinedImages(combined); // Set the combined array
            setSelectedVariation(null);
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
    // Correct toggle logic to handle null (unselect)
  const handleColorSelect = (variation: any | null) => {
    if (!variation) {
      // When null is passed → reset everything
      setSelectedVariation(null);
      setCombinedImages([
        product?.featuredImage || "",
        ...(product?.galleryImages || []),
        ...(product?.videoUrl ? [product.videoUrl] : []),
      ]);
      return;
    }

    // Otherwise select new variation
    setSelectedVariation(variation);
    setCombinedImages([
      variation.image || product?.featuredImage,
      ...(product?.galleryImages || []),
      ...(product?.videoUrl ? [product.videoUrl] : []),
    ]);
  };

// added new
  const handleSizeSelect = (size: string) => {
  if (!selectedVariation) return; 
  setSelectedVariation(prev => ({ ...prev, selectedSize: size }));// add size to variation
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner color="warning" />
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

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Row gutter={16} align="top">
          {/* Left Section: Gallery and Main Image */}
          <Col xs={24} md={12} lg={14} className=" lg:sticky lg:top-20">
            <div className="flex gap-4">
              <ImageGallery
                galleryImages={combinedImages}
                initialSelectedImage={combinedImages[0]}
                videoUrl={product.videoUrl}
                videoCoverImage={combinedImages[0]}
              />
            </div>
          </Col>

          {/* Right Section: Product Details */}
          <Col xs={24} md={12} lg={10}>
            {/* <ProductDetails product={product} /> */}
              {/*  Pass selectedVariation and handler to ProductDetails */}
            <ProductDetails product={product} selectedVariation={selectedVariation} onColorSelect={handleColorSelect} onSizeSelect={handleSizeSelect}/>

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
      <Divider className="mt-3" />
      <RelatedProduct category={product.categories} />
    </div>
  );
};

export default ProductView;
