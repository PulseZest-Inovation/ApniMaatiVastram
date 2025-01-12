import React from 'react';

interface ProductShortDescriptionProps {
  description: string;
}

// Function to convert newlines into <br /> tags and bullet points into <ul> and <li> elements
const renderDescription = (text: string) => {
  // Split by newline
  const lines = text.split('\n');
  
  return lines.map((line, index) => {
    // If the line starts with a bullet point
    if (line.startsWith('-') || line.startsWith('*')) {
      return <li key={index}>{line.slice(1).trim()}</li>; // Create list item
    }
    
    // For non-bullet point lines, return as a paragraph
    return (
      <p key={index}>
        {line}
      </p>
    );
  });
};

export default function ProductShortDescription({ description }: ProductShortDescriptionProps) {
  return (
    <div>
       <h4 className='font-bold text-2xl text-center'>Product Description</h4> 
      {/* Render the description with line breaks and bullet points */}
      <ul>
        {renderDescription(description)}
      </ul>
    </div>
  );
}
