// components/ImageGallery.tsx
"use client";
import React, { useState, useEffect,  } from "react";
import { ScrollShadow } from "@nextui-org/react";
import ImageDisplay from "./ImageDisplay";
import GalleryThumbnails from "./GalleryThumbnail";

interface ImageGalleryProps {
  galleryImages: string[];
  initialSelectedImage?: string;
  videoUrl?: string;
  videoCoverImage?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  galleryImages,
  initialSelectedImage,
  videoUrl,
  videoCoverImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    initialSelectedImage || galleryImages[0]
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const combinedGallery = videoUrl ? [videoUrl, ...galleryImages] : galleryImages;

  return (
    <div className="w-full flex flex-col md:flex-row gap-4">
      {isMobile ? (
        <>
          <div className="relative">
            <ImageDisplay
              selectedImage={selectedImage}
              videoUrl={videoUrl}
              videoCoverImage={videoCoverImage}
            />
        
            <GalleryThumbnails
              galleryItems={combinedGallery}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              videoUrl={videoUrl}
              videoCoverImage={videoCoverImage}
            />
          </div>
        </>
      ) : (
        <>
          <ScrollShadow className="max-h-[450px] flex flex-row md:flex-col md:w-1/5 gap-2 overflow-y-auto">
            <GalleryThumbnails
              galleryItems={combinedGallery}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              videoUrl={videoUrl}
              videoCoverImage={videoCoverImage}
            />
          </ScrollShadow>
          <div className="flex-1">
            <ImageDisplay
              selectedImage={selectedImage}
              videoUrl={videoUrl}
              videoCoverImage={videoCoverImage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ImageGallery;
