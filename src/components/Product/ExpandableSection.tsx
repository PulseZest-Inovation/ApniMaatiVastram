import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

interface ExpandableSectionProps {
  title: string;
  content: string;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4">
      <div
        className="cursor-pointer border-b py-2 flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-bold">{title}</h2>
        {isExpanded ? <FaCaretUp /> : <FaCaretDown />}
      </div>
      {isExpanded && <div className="p-4 bg-gray-100 rounded-lg shadow-md">{content}</div>}
    </div>
  );
};

export default ExpandableSection;
