// MobileBasicCarousel.tsx
import Image from 'next/image';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

interface MobileBasicCarouselProps {
  images: { imageURL: string; pageURL: string }[];
  onImageClick: (pageURL: string) => void;
}

const MobileBasicCarousel: React.FC<MobileBasicCarouselProps> = ({ images, onImageClick }) => {
  return (
    <div className="w-full mx-auto">
      <Carousel
        showArrows={true}
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        dynamicHeight={false}
        interval={3000}
      >
        {images.map((image, index) => (
          <div key={index} onClick={() => onImageClick(image.pageURL)}>
            <Image
              src={image.imageURL}
              alt={`Carousel Image ${index}`}
              width={400}  // Mobile image size
              height={225} // Mobile image size
              className="w-full h-auto object-cover" // Ensures images are responsive
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MobileBasicCarousel;
