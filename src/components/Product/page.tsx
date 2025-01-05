"use client";

import React, { useEffect, useState } from "react";
import { getDataByDocName } from "@/service/Firebase/getFirestore";
import { ProductType } from "@/Types/data/ProductType";
import ProductDetails from "./ProductDetails";
import ExpandableSection from "./ExpandableSection";
import CustomerReviews from "./CustomerReviews";
import { Col, Row } from "antd";
import ImageGallery from "./ProductImages";

interface ProductViewProps {
  slug: string;
}

const ProductView: React.FC<ProductViewProps> = ({ slug }) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

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

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Row gutter={16} align="top">
          {/* Left Section: Gallery and Main Image */}
          <Col xs={24} md={12}>
            <div className="flex gap-4">
            <ImageGallery galleryImages={product.galleryImages} initialSelectedImage={product.galleryImages[0]} />
              
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
