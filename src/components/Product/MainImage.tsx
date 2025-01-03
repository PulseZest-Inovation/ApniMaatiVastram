import React from 'react';

interface MainImageProps {
  selectedImage: string | undefined;
}

const MainImage: React.FC<MainImageProps> = ({ selectedImage }) => (
  <div className="md:w-2/5">
    {selectedImage && (
      <img
        className="h-auto w-full object-contain rounded-lg shadow-lg"
        src={selectedImage}
        alt="Selected Product"
      />
    )}
  </div>
);

export default MainImage;
