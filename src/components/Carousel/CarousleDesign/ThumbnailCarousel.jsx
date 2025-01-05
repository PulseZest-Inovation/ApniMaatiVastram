'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // For page navigation
import Image from 'next/image';

const ThumbnailCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter(); // Use Next.js router for navigation

  // Handle main image click and navigate to the corresponding page
  const handleImageClick = (pageURL) => {
    router.push(pageURL); // Navigate to the specified page
  };

  // Handle thumbnail click and update the current index
  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="thumbnail-carousel w-full max-w-screen-lg mx-auto p-4">
      {/* Main image display */}
      <div className="main-image-container mb-6 relative w-full">
        <div
          onClick={() => handleImageClick(images[currentIndex].pageURL)}
          className="cursor-pointer hover:opacity-80 transition-opacity w-full"
        >
          <Image
            src={images[currentIndex].imageURL}
            alt={`Main image - ${currentIndex + 1}`}
            layout="responsive"
            width={1200} // Set a high width for full-width display
            height={800} // Adjust height accordingly to maintain aspect ratio
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            loading="lazy"
          />
        </div>
      </div>

      {/* Thumbnails display */}
      <div className="thumbnail-slider flex overflow-x-auto space-x-3 mt-4 pb-4 w-full">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`thumbnail-item cursor-pointer transform transition-transform duration-200 hover:scale-105 ${
              index === currentIndex ? 'border-4 border-blue-500' : 'border-2 border-gray-300'
            } rounded-lg`}
          >
            <Image
              src={image.imageURL}
              alt={`Thumbnail ${index + 1}`}
              width={100} // Adjust as needed
              height={100} // Adjust as needed
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThumbnailCarousel;
