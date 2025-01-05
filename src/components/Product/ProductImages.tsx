import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

interface ImageGalleryProps {
  galleryImages: string[];
  initialSelectedImage?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  galleryImages,
  initialSelectedImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    initialSelectedImage || galleryImages[0]
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

  // Handle touch swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStart = e.touches[0].clientX;
    setStartTouch(touchStart);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startTouch === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const swipeThreshold = 50;

    if (startTouch - touchEnd > swipeThreshold) {
      // Swipe left (next image)
      const currentIndex = galleryImages.indexOf(selectedImage || "");
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex]);
    } else if (touchEnd - startTouch > swipeThreshold) {
      // Swipe right (previous image)
      const currentIndex = galleryImages.indexOf(selectedImage || "");
      const prevIndex =
        (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex]);
    }

    setStartTouch(null); // Reset touch position
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {isMobile ? (
        <div className="relative" ref={galleryRef}>
          {/* Main Image Section */}
          {selectedImage ? (
            <div
              className="w-full"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
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

          {/* Bullets for Navigation */}
          <div className="flex justify-center mt-4 space-x-2">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full cursor-pointer ${
                  selectedImage === img ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Gallery Section for Desktop */}
          <div className="flex flex-row md:flex-col md:w-1/5 gap-2">
            {galleryImages.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Gallery Image ${index + 1}`}
                height={100}
                width={100}
                className={`h-24 w-24 object-cover rounded-lg shadow-md cursor-pointer transition-transform duration-200 ${
                  selectedImage === img ? "border-2 border-blue-600" : ""
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* Main Image Section */}
          <div className="flex-1">
            {selectedImage ? (
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
              <div className="text-gray-500 text-center">
                Image not available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageGallery;
