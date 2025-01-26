import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import Image from 'next/image';
import { motion } from 'framer-motion'; // Import Framer Motion

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
        interval={2000}
        transitionTime={500} // Optional: Controls the speed of the image transition
      >
        {images.map((image, index) => (
          <div key={index} onClick={() => onImageClick(image.pageURL)} className="cursor-pointer">
            {/* Framer Motion div for animating the image */}
            <motion.div
              initial={{ opacity: 0 }}    // Initially hidden
              animate={{ opacity: 1 }}    // Fade in when it becomes active
              exit={{ opacity: 0 }}       // Fade out when the image leaves
              transition={{ duration: 0.5 }} // Animation duration
            >
              <Image
                src={image.imageURL}
                alt={`Carousel Image ${index}`}
                width={1920}  // High-resolution width
                height={1080} // High-resolution height
                quality={85}  // Improve image quality
                className="w-full h-auto object-cover"
                priority={true} // Ensures the first image is preloaded
              />
            </motion.div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default DesktopBasicCarousel;
