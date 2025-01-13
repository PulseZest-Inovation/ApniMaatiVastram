// DesktopBasicCarousel.tsx
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
          <div key={index} onClick={() => onImageClick(image.pageURL)}>
            <img
              src={image.imageURL}
              alt={`Carousel Image ${index}`}
              width={800}  // Desktop image size
              height={450} // Desktop image size
              className="w-full h-auto object-cover" // Ensures images are responsive
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default DesktopBasicCarousel;
