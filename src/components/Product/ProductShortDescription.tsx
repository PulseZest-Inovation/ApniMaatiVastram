import React from 'react';

interface ProductShortDescriptionProps {
  description: string;
}

export default function ProductShortDescription({ description }: ProductShortDescriptionProps) {
  return (
    <div>
      <h4 className="font-bold text-2xl text-center">Product Description</h4>
      {/* Render the description as HTML */}
      <div
        className="prose max-w-none "
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
