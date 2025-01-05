'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';  // For page navigation
import Image from 'next/image';

interface HorizontalCarouselProps {
  images: { imageURL: string; pageURL: string }[];  // Updated to include pageURL
  onImageClick: (pageURL: string) => void;
  autoplayDirection?: 'left' | 'right';
}

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  images,
  autoplayDirection = 'right',
}) => {
  const router = useRouter();  // Use Next.js router to navigate

  // Handle image click and navigate to the associated page
  const handleImageClick = (pageURL: string) => {
    router.push(pageURL); // Navigate to the specified page
  };

  return (
    <div className="horizontal-carousel w-full overflow-hidden">
      <Swiper
        direction="horizontal"
        slidesPerView={3}
        spaceBetween={10}
        autoplay={{
          delay: 3000,
          reverseDirection: autoplayDirection === 'left',
        }}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <Image
            height={100} width={100}
              src={image.imageURL}
              alt={`Slide ${index + 1}`}
              className="rounded-md w-full h-auto shadow object-cover cursor-pointer"
              onClick={() => handleImageClick(image.pageURL)}  // Add click handler
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HorizontalCarousel;