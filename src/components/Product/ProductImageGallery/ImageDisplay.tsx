// components/ImageDisplay.tsx
import React from "react";
import Image from "next/image";

interface ImageDisplayProps {
  selectedImage: string | undefined;
  videoUrl?: string;
  videoCoverImage?: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  selectedImage,
  videoUrl,
  videoCoverImage,
}) => {
  if (videoUrl && selectedImage === videoUrl) {
    return (
      <div className="w-full">
        <video
          controls
          autoPlay
          muted
          loop
          className="rounded-lg shadow-lg w-full"
          src={videoUrl}
          poster={videoCoverImage}
        />
      </div>
    );
  }

  if (selectedImage) {
    return (
      <Image
        className="rounded-lg shadow-lg"
        src={selectedImage}
        alt="Selected Product"
        layout="responsive"
        width={1000}
        height={800}
        objectFit="contain"
      />
    );
  }

  return <div className="text-gray-500 text-center">Image not available</div>;
};

export default ImageDisplay;
