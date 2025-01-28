"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import { ProductType } from "@/Types/data/ProductType";
import ProductViewModal from "./VideoModal";
import { getDataByDocName } from "@/service/Firebase/getFirestore"; // Assuming this is the correct path

const ProductByVideos = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductsWithVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Fetch the video settings document
        const videoData = await getDataByDocName<{ isEnable: boolean; videos: { id: string; productTitle: string; videoUrl: string; }[] }>(
          "theme-settings",
          "videoOnWebsite"
        );

        if (!videoData || !videoData.isEnable) {
          setError("Video display is not enabled.");
          return;
        }

        // Step 2: Extract product IDs from the videos array
        const productIds = videoData.videos.map((video) => video.id);

        // Step 3: Fetch all products
        const allProducts = await getAllDocsFromCollection<ProductType>("products");

        // Step 4: Filter products based on the fetched product IDs
        const filteredProducts = allProducts.filter((product) =>
          productIds.includes(product.id)
        );

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products with videos:", error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithVideos();
  }, []);

  // Memoize the current product to avoid recalculating on every render
  const currentProduct = useMemo(() => products[currentIndex], [
    products,
    currentIndex,
  ]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="w-full h-[400px] bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No products available with videos.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide cursor-pointer">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden relative h-[400px] w-[200px] flex-shrink-0"
            onClick={() => openModal(index)}
          >
            {product.videoUrl && (
              <div className="relative h-[75%] w-full rounded-t-lg overflow-hidden">
                <video
                  className="w-full h-full object-cover rounded-t-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={product.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="p-4 text-center h-[20%] flex flex-col justify-center">
              <h2 className="font-semibold text-sm">
                {product.productTitle?.length > 16
                  ? product.productTitle.substring(0, 16) + "..."
                  : product.productTitle || "Untitled Product"}
              </h2>
              <p className="text-gray-700 text-sm mt-1 font-serif">
                ₹{product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      <ProductViewModal
        product={currentProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default ProductByVideos;
