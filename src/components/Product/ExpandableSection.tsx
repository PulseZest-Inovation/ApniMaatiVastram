import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

interface ExpandableSectionProps {
  title: string;
  content: string;
}

// Function to convert newlines into <br /> tags and bullet points into <ul> and <li> elements
const renderContent = (text: string) => {
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

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4">
      <div
        className="cursor-pointer border-b py-2 flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold uppercase">{title}</h2>
        {isExpanded ? <FaCaretUp /> : <FaCaretDown />}
      </div>
      {isExpanded && (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
          <ul>{renderContent(content)}</ul>
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
