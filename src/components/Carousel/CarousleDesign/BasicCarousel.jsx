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
    <div className="basic-carousel w-full relative overflow-hidden"> {/* Added overflow-hidden */}
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="carousel-item flex justify-center items-center w-full">
            <Image
              src={image.imageURL}
              alt={`Slide ${index + 1}`}
              width={600} // Set a fixed width
              height={400} // Set a fixed height
              className="w-full h-auto object-cover cursor-pointer"
              onClick={() => onImageClick(image.pageURL)}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BasicCarousel;
