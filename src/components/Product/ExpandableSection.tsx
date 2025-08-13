'use client';
import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import DOMPurify from 'dompurify';

interface ExpandableSectionProps {
  title: string;
  content: string; // Assumes HTML content as a string
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sanitize the HTML content but allow inline styles
  const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'u', 'span', 'br', 'b', 'i', 'a'], ALLOWED_ATTR: ['style', 'href'] });

  return (
    <div className="mt-4">
      <div
        className="cursor-pointer border-b py-1 flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
       <h1>fhjdfj</h1>
        <h2 className="text-xl font-bold uppercase">{title}</h2>
        {isExpanded ? <FaCaretUp /> : <FaCaretDown />}

      
      </div>
      {isExpanded && (
      <div
      className="p-4 rounded-lg shadow-md prose prose-sm w-full max-w-screen-lg mx-auto" // Ensure the div is fluid and responsive
      style={{ lineHeight: '1.2' }} // Adjust line-height here
      dangerouslySetInnerHTML={{
        __html: sanitizedContent, // Render the sanitized dynamic content
      }}
    />
      )}
    </div>
  );
};

export default ExpandableSection;
