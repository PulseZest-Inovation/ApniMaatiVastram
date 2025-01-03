import React from 'react';

interface GalleryProps {
  galleryImages: string[];
  selectedImage: string | undefined;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Gallery: React.FC<GalleryProps> = ({ galleryImages, selectedImage, setSelectedImage }) => (
  <div className="md:w-1/5">
    <h2 className="text-xl font-bold mb-4">Gallery</h2>
    <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2">
      {galleryImages.map((img, index) => (
        <img
          key={index}
          className={`h-24 w-24 object-cover rounded-lg shadow-md cursor-pointer transition-transform duration-200 ${
            selectedImage === img ? 'border-2 border-blue-600' : ''
          }`}
          src={img}
          alt={`Gallery Image ${index + 1}`}
          onClick={() => setSelectedImage(img)}
        />
      ))}
    </div>
  </div>
);

export default Gallery;
