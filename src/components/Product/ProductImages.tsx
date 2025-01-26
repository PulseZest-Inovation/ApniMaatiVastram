"use client";
import React, { useState, useEffect, useRef } from "react";
import { ScrollShadow } from "@nextui-org/react";
import Image from "next/image";

interface ImageGalleryProps {
  galleryImages: string[];
  initialSelectedImage?: string;
  videoUrl?: string;
  videoCoverImage?: string; // Thumbnail image for the video
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  galleryImages,
  initialSelectedImage,
  videoUrl,
  videoCoverImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    videoUrl || initialSelectedImage || galleryImages[0]
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [startTouch, setStartTouch] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStart = e.touches[0].clientX;
    setStartTouch(touchStart);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startTouch === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const swipeThreshold = 50;

    // Combine video and gallery images for swipe handling
    const combinedGallery = videoUrl ? [videoUrl, ...galleryImages] : galleryImages;

    const distance = startTouch - touchEnd;

    if (Math.abs(distance) > swipeThreshold) {
      const currentIndex = combinedGallery.indexOf(selectedImage || "");
      const nextIndex =
        distance > 0
          ? (currentIndex + 1) % combinedGallery.length
          : (currentIndex - 1 + combinedGallery.length) % combinedGallery.length;
      setSelectedImage(combinedGallery[nextIndex]);
    }

    setStartTouch(null); // Reset touch position
  };

  const combinedGallery = videoUrl ? [videoUrl, ...galleryImages] : galleryImages;

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {isMobile ? (
        <div className="relative" ref={galleryRef}>
          {videoUrl && selectedImage === videoUrl ? (
            <div className="w-full mb-4">
              <video
                controls={false} // Hide video controls
                autoPlay // Auto play video
                muted // Mute video (optional)
                loop // Loop the video (optional)
                className="rounded-lg shadow-lg w-full"
                src={videoUrl}
                poster={videoCoverImage} // Set video thumbnail/cover image
              />
            </div>
          ) : selectedImage ? (
            <div
              className="w-full"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={(e) => e.preventDefault()} // Prevent default scrolling on touch move
            >
              <Image
                className="rounded-lg shadow-lg"
                src={selectedImage}
                alt="Selected Product"
                layout="responsive"
                width={1000}
                height={800}
                objectFit="contain"
              />
            </div>
          ) : (
            <div className="text-gray-500 text-center">Image not available</div>
          )}

          <div className="flex justify-center mt-4 space-x-2">
            {combinedGallery.map((item, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full cursor-pointer ${
                  selectedImage === item ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          <ScrollShadow className="max-h-[450px] flex flex-row md:flex-col md:w-1/5 gap-2 overflow-y-auto  ">
            {combinedGallery.map((item, index) => (
              <div key={index}>
                {item === videoUrl ? (
                  <div
                    onClick={() => setSelectedImage(videoUrl)}
                    className={`h-30 w-24 rounded-lg shadow-md cursor-pointer transition-transform duration-200 ${
                      selectedImage === videoUrl ? "border-2 border-blue-600" : ""
                    }`}
                  >
                    <Image
                      src={videoCoverImage || "/placeholder.png"}
                      alt="Video Thumbnail"
                      height={100}
                      width={100}
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <Image
                    src={item}
                    alt={`Gallery Image ${index}`}
                    height={100}
                    width={100}
                    className={`h-24 w-24 object-cover rounded-lg shadow-md cursor-pointer transition-transform duration-200 ${
                      selectedImage === item ? "border-2 border-blue-600" : ""
                    }`}
                    onClick={() => setSelectedImage(item)}
                  />
                )}
              </div>
            ))}
          </ScrollShadow>

          <div className="flex-1">
            {videoUrl && selectedImage === videoUrl ? (
              <div className="w-full mb-4">
                <video
                  controls={false}
                  autoPlay
                  muted
                  loop
                  className="rounded-lg shadow-lg w-full"
                  src={videoUrl}
                  poster={videoCoverImage} // Set video thumbnail
                />
              </div>
            ) : selectedImage ? (
              <Image
                className="rounded-lg shadow-lg"
                src={selectedImage}
                alt="Selected Product"
                layout="responsive"
                width={1000}
                height={800}
                objectFit="contain"
              />
            ) : (
              <div className="text-gray-500 text-center">Image not available</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageGallery;
