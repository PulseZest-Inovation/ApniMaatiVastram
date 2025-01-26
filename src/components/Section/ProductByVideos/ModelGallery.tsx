import { ProductType } from "@/Types/data/ProductType";
import Image from "next/image";
import React, { useState } from "react";

interface ModelGallery {
  product: ProductType;
}

export default function ModelGallery({ product }: ModelGallery) {
  const [loadedImages, setLoadedImages] = useState<boolean[]>(
    Array(product.galleryImages.length).fill(false)
  );

  const handleImageLoad = (index: number) => {
    const newLoadedImages = [...loadedImages];
    newLoadedImages[index] = true;
    setLoadedImages(newLoadedImages);
  };

  return (
    <div >
      <div className="flex gap-2 mt-2 mb-0 overflow-x-auto scrollbar-hide">
        {product.galleryImages.map((galleryImage, index) => (
          <div
            key={index}
            className="relative flex-shrink-0"
            style={{ width: 150, height: 150 }}
          >
            {!loadedImages[index] && (
              <div className="absolute inset-0 bg-gray-300 animate-pulse rounded" />
            )}
            <Image
              src={galleryImage}
              alt={product.productTitle}
              height={150}
              width={150}
              className={`rounded ${
                loadedImages[index] ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
              onLoadingComplete={() => handleImageLoad(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
