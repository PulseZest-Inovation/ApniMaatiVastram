'use client';

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';

const BasicCarousel = ({ images, onImageClick }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="basic-carousel w-full relative overflow-hidden">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="carousel-item flex justify-center items-center w-full">
            <div className="relative w-full h-64 sm:h-80 md:h-96">
              <Image
                src={image.imageURL}
                alt={`Slide ${index + 1}`}
                layout="fill" // Makes the image fill the container while preserving its aspect ratio
                objectFit="cover" // Ensures the image covers the space without stretching
                className="cursor-pointer"
                onClick={() => onImageClick(image.pageURL)}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BasicCarousel;
