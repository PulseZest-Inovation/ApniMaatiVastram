'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { ProductType } from '@/Types/data/ProductType';
import ProductViewModal from './VideoModal';

const ProductByVideos = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllDocsFromCollection<ProductType>('products');
        setProducts(data);  // Store all products without filtering
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Memoize the filtered products to avoid recalculating on every render
  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.videoUrl && product.videoUrl.trim() !== '');
  }, [products]);

  // Memoize the current product to avoid recalculating on every render
  const currentProduct = useMemo(() => filteredProducts[currentIndex], [filteredProducts, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredProducts.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredProducts.length - 1 : prevIndex - 1
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
          <div key={index} className="w-full h-[400px] bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (filteredProducts.length === 0) {
    return <div className="text-center text-gray-500">No products available with videos.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide cursor-pointer">
        {filteredProducts.map((product, index) => (
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
                  ? product.productTitle.substring(0, 16) + '...'
                  : product.productTitle || 'Untitled Product'}
              </h2>
              <p className="text-gray-700 text-sm mt-1 font-serif">₹{product.price}</p>
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
