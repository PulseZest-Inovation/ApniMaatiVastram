import Image from 'next/image';
import React from 'react';

interface MainImageProps {
  selectedImage: string | undefined;
}

const MainImage: React.FC<MainImageProps> = ({ selectedImage }) => (
  <div className="md:w-2/5">
    {selectedImage && (
      <Image
        className="h-auto w-full object-contain rounded-lg shadow-lg"
        src={selectedImage}
        alt='apni maati'
        height={200} width={200}
      />
    )}
  </div>
);

export default MainImage;
