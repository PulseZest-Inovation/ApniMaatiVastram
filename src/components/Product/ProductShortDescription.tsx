import React from 'react';

interface ProductShortDescriptionProps {
  description: string;
}

export default function ProductShortDescription({ description }: ProductShortDescriptionProps) {
  return (
    <div>
     
      {/* Render the description as HTML */}
      <div
        className="prose max-w-none "
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
