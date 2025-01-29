import React from "react";
import Image from "next/image";
import { FiPlay } from "react-icons/fi";

interface GalleryThumbnailsProps {
  galleryItems: string[];
  selectedImage: string | undefined;
  onImageSelect: (image: string) => void;
  videoUrl?: string;
  videoCoverImage?: string;
}

const GalleryThumbnails: React.FC<GalleryThumbnailsProps> = ({
  galleryItems,
  selectedImage,
  onImageSelect,
  videoUrl,
  videoCoverImage,
}) => {
  const videoIndex = 1; 
  const combinedGallery = videoUrl
    ? [galleryItems[videoIndex], ...galleryItems.slice(0, videoIndex), ...galleryItems.slice(videoIndex + 1)]
    : galleryItems;

  return (
    <div className="relative mt-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-start space-x-2 lg:space-y-2 overflow-x-auto md:space-x-0 md:flex-col scrollbar-hide">
          {combinedGallery.map((item, index) => (
            <div key={index} className="relative flex-shrink-0">
              {item === videoUrl ? (
                <div
                  onClick={() => onImageSelect(videoUrl || "")}
                  className={`h-30 w-30 rounded-lg shadow-md transition-transform duration-200 ${
                    selectedImage === videoUrl ? "border-2 border-blue-600" : ""
                  }`}
                >
                  <div className="relative w-[100px] h-[100px]">
                    <Image
                      src={videoCoverImage || "/placeholder.png"}
                      alt="Video Thumbnail"
                      fill // Automatically adjusts width & height
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        className="p-2 bg-black bg-opacity-50 rounded-full"
                        onClick={() => onImageSelect(videoUrl || "")}
                      >
                        <FiPlay className="text-white text-2xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-[100px] h-[100px] flex justify-center items-center">
                  <Image
                    src={item}
                    alt={`Gallery Image ${index}`}
                    fill
                    className={`object-cover rounded-lg shadow-md transition-transform duration-200 ${
                      selectedImage === item ? "border-2 border-blue-600" : ""
                    }`}
                    onClick={() => onImageSelect(item)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryThumbnails;
