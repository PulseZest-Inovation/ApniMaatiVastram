'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getCarousle } from '@/service/theme/getCarousle';
import { ImageCarousleType } from '@/Types/Theme/ImageCarouselType';
import { useRouter } from 'next/navigation'; // To handle navigation

// Import the new mobile and desktop carousel components
import MobileBasicCarousel from './CarousleDesign/BasicCarousel/MobileBasicCarousel';
import DesktopBasicCarousel from './CarousleDesign/BasicCarousel/DesktopBasicCarousel';

const ImageCarousle: React.FC = () => {
  const [carouselData, setCarouselData] = useState<ImageCarousleType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Memoize fetchCarouselData to avoid re-fetching on every render
  const fetchCarouselData = useMemo(() => {
    return async () => {
      try {
        const data = await getCarousle();
        setCarouselData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching carousel data:', error);
      }
    };
  }, []);

  useEffect(() => {
    fetchCarouselData(); // Call memoized function once when the component mounts
  }, [fetchCarouselData]);

  if (isLoading) {
    return <div className="justify-center"> {/* Loading spinner or other loading indicator */} </div>;
  }

  if (!carouselData || !carouselData.isEnable) {
    return null; // Return nothing if the carousel is disabled or data is not found
  }

  // Handle navigation on image click
  const handleImageClick = (pageURL: string) => {
    router.push(pageURL); // Navigate to the page when an image is clicked
  };

  // Render the appropriate carousel based on the selectedType
  const renderCarousel = () => {
    switch (carouselData.selectedType) {
      case 'Basic Image Slider':
        return (
          <>
            {/* Mobile Carousel (visible on small screens) */}
            <div className="block sm:hidden">
              <MobileBasicCarousel
                images={carouselData.mobileImages.map((image) => ({
                  imageURL: image.imageURL,
                  pageURL: image.pageURL,
                }))}
                onImageClick={handleImageClick} // Pass the onImageClick function to the MobileCarousel
              />
            </div>

            {/* Desktop Carousel (visible on large screens) */}
            <div className="hidden sm:block">
              <DesktopBasicCarousel
                images={carouselData.desktopImages.map((image) => ({
                  imageURL: image.imageURL,
                  pageURL: image.pageURL,
                }))}
                onImageClick={handleImageClick} // Pass the onImageClick function to the DesktopCarousel
              />
            </div>
          </>
        );

      default:
        return <div> </div>;
    }
  };

  return <div className="image-carousel cursor-pointer">{renderCarousel()}</div>;
};

export default ImageCarousle;
