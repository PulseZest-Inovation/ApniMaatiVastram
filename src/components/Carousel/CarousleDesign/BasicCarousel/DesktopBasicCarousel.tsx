import Image from 'next/image';
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles

interface DesktopBasicCarouselProps {
  images: { imageURL: string; pageURL: string }[];
  onImageClick: (pageURL: string) => void;
}

const DesktopBasicCarousel: React.FC<DesktopBasicCarouselProps> = ({ images, onImageClick }) => {
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
          <div key={index} onClick={() => onImageClick(image.pageURL)} className="cursor-pointer">
            <Image
              src={image.imageURL}
              alt={`Carousel Image ${index}`}
              width={1920}  // High-resolution width
              height={1080} // High-resolution height
              quality={85}  // Improve image quality
              className="w-full h-auto object-cover"
              priority={true} // Ensures the first image is preloaded
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default DesktopBasicCarousel;
