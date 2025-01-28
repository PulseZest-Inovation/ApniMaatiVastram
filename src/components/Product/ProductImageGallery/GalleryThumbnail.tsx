import React from "react";
import Image from "next/image";
import { FiPlay } from "react-icons/fi"; // You can use any play icon library you prefer

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
  // Ensure the video is in the correct index (second item if counting from 0)
  const videoIndex = 1; // If counting from 0, video should be at index 1 (2nd position)
  const combinedGallery = videoUrl
    ? [galleryItems[videoIndex], ...galleryItems.slice(0, videoIndex), ...galleryItems.slice(videoIndex + 1)]
    : galleryItems;

  return (
    <div className="relative mt-4">
      <div className="flex justify-between items-center">
        {/* Gallery Thumbnails */}
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
                  <div className="relative">
                    <Image
                      src={videoCoverImage || "/placeholder.png"}
                      alt="Video Thumbnail"
                      height={100}
                      width={100}
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
                <div className="relative w-auto flex justify-center items-center"> {/* Flex Centering */}
                  <Image
                    src={item}
                    alt={`Gallery Image ${index}`}
                    height={100}
                    width={100}
                    className={`h-24 w-30 object-cover rounded-lg shadow-md transition-transform duration-200 ${
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
