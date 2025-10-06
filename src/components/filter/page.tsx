"use client";

import React, { useState } from "react";

interface FilterSectionProps {
  title: string;
  options?: { label: string; count?: number }[];
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="border-b border-gray-200 py-2">
      <button
        className="w-full flex justify-between items-center text-left font-medium text-gray-700"
        onClick={toggleOpen}
      >
        {title}
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && options && (
        <div className="mt-2 pl-4 space-y-2">
          {options.map((opt, idx) => (
            <label key={idx} className="flex items-center space-x-2 text-gray-600 text-sm">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-purple-600" />
              <span>
                {opt.label} {opt.count !== undefined && `(${opt.count})`}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterPanel = () => {
  return (
    <div className="w-64 border border-gray-200 rounded-md p-4 overflow-y-auto max-h-[500px]">
      <FilterSection title="Availability" options={[{ label: "In Stock" }, { label: "Out of Stock" }]} />
      <FilterSection title="Price" options={[{ label: "0 - 500" }, { label: "500 - 1000" },{ label: "1000 - 1500" },{ label: "1500 - 2000" },]} />
      <FilterSection title="Discount" options={[{ label: "10%+" }, { label: "20%+" }, { label: "50%+" }]} />
      <FilterSection
        title="Category"
        options={[
          { label: "Earrings", count: 70 },
          { label: "Accessories", count: 34 },
          { label: "Neckpiece", count: 22 },
          { label: "Mask Chain", count: 4 },
          { label: "Necklace Set", count: 2 },
        ]}
      />
    </div>
  );
};

export default FilterPanel;
