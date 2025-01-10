import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Lazy load videos when they come into the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoElement = entry.target as HTMLVideoElement;
            if (!loadedVideos.has(videoElement.src)) {
              setLoadedVideos((prev) => new Set(prev).add(videoElement.src));
            }
          }
        });
      },
      {
        rootMargin: "0px 0px 200px 0px", // Start loading when it's close to the viewport
      }
    );

    const videoElements = galleryRef.current?.querySelectorAll("video");
    videoElements?.forEach((video) => observer.observe(video));

    return () => {
      videoElements?.forEach((video) => observer.unobserve(video));
    };
  }, [loadedVideos]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touchStart = e.touches[0].clientX;
    setStartTouch(touchStart);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startTouch === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const swipeThreshold = 50;

    if (startTouch - touchEnd > swipeThreshold) {
      const currentIndex = galleryImages.indexOf(selectedImage || "");
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex]);
    } else if (touchEnd - startTouch > swipeThreshold) {
      const currentIndex = galleryImages.indexOf(selectedImage || "");
      const prevIndex =
        (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex]);
    }

    setStartTouch(null); // Reset touch position
  };

  const isVideoUrl = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {isMobile ? (
        <div className="relative" ref={galleryRef}>
          {selectedImage ? (
            isVideoUrl(selectedImage) ? (
              <div className="w-full">
                <video
                  className="rounded-lg shadow-lg"
                  controls
                  width="100%"
                  height="auto"
                  src={selectedImage}
                  autoPlay
                  muted
                  preload="none"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
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
            )
          ) : (
            <div className="text-gray-500 text-center">Image not available</div>
          )}

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
          <div className="flex flex-row md:flex-col md:w-1/5 gap-2">
            {galleryImages.map((img, index) => (
              <div key={index}>
                {isVideoUrl(img) ? (
                  <video
                    className={`h-24 w-24 object-cover rounded-lg shadow-md cursor-pointer transition-transform duration-200 ${
                      selectedImage === img ? "border-2 border-blue-600" : ""
                    }`}
                    controls
                    width={100}
                    height={100}
                    onClick={() => setSelectedImage(img)}
                    preload="none"
                    src={loadedVideos.has(img) ? img : ""}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
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
                )}
              </div>
            ))}
          </div>

          <div className="flex-1">
            {selectedImage ? (
              isVideoUrl(selectedImage) ? (
                <video
                  className="rounded-lg shadow-lg"
                  controls
                  width="100%"
                  height="auto"
                  preload="none"
                  src={loadedVideos.has(selectedImage) ? selectedImage : ""}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  className="rounded-lg shadow-lg"
                  src={selectedImage}
                  alt="Selected Product"
                  layout="responsive"
                  width={1000}
                  height={800}
                  objectFit="contain"
                />
              )
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
