'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getCarousle } from '@/service/theme/getCarousle';
import { ImageCarousleType } from '@/Types/Theme/ImageCarouselType';
// Different carousel components
import BasicCarousel from './CarousleDesign/BasicCarousel';
import ThumbnailCarousel from './CarousleDesign/ThumbnailCarousel';
import HorizontalCarousel from './CarousleDesign/HorizontalCarousel';
import { useRouter } from 'next/navigation';  // To handle navigation

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
    return <div className="justify-center">
     {/* <LinearProgress  /> */}
  </div>;
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
          <BasicCarousel
            images={carouselData.images.map((image) => ({
              imageURL: image.imageURL,
              pageURL: image.pageURL,
            }))}
            onImageClick={handleImageClick} // Pass the onImageClick function to the BasicCarousel
          />
        );
      case 'Thumbnail Image Carousel':
        return (
          <ThumbnailCarousel
            images={carouselData.images.map((image) => ({
              imageURL: image.imageURL,
              pageURL: image.pageURL,
            }))}
            // onImageClick={handleImageClick}
          />
        );
      case 'Horizontal Image Carousel':
        return (
          <HorizontalCarousel
            images={carouselData.images.map((image) => ({
              imageURL: image.imageURL,
              pageURL: image.pageURL,
            }))}
            onImageClick={handleImageClick}
          />
        );
      default:
        return <div> </div>;
    }
  };

  return <div className="image-carousel cursor-pointer py-3">{renderCarousel()}</div>;
};

export default ImageCarousle;