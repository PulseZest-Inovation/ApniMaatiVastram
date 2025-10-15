"use client";

import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import React, {forwardRef, useEffect,  useImperativeHandle,  useState,} from "react";

// FilterSection Props
interface FilterSectionProps {
  title: string;
  options?: { label: string; count?: number }[];
  onSelect?: (label: string, checked?: boolean) => void;
}

// Ref exposed to FilterModal
export interface FilterPanelRef {
  getSelectedFilters: () => {
    categories: string[];
    stockStatus: string[];
    priceRange: [number, number][];
  };
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, options, onSelect }) => {
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
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-purple-600"
                onChange={(e) => onSelect?.(opt.label, e.target.checked)}
              />
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

// Main FilterPanel
const FilterPanel = forwardRef<FilterPanelRef>((props, ref) => {
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    stockStatus: [] as string[],
    priceRange: [] as [number, number][],
  });

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllDocsFromCollection<{ name: string; slug: string }>(
          "categories"
        );
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle checkbox selection
  const handleSelect = (type: keyof typeof selectedFilters, label: string, checked: boolean) => {
    const updated = { ...selectedFilters };

    if (type === "priceRange") {
      const ranges: Record<string, [number, number]> = {
        "500 - 1000": [500, 1000],
        "1000 - 1500": [1000, 1500],
        "1500 - 2000": [1500, 2000],
        "2000 - 3000" : [2000,3000],
      };
      if (checked) updated.priceRange.push(ranges[label]);
      else updated.priceRange = updated.priceRange.filter(
        (r) => r[0] !== ranges[label][0] || r[1] !== ranges[label][1]
      );
    } else {
      if (checked) updated[type].push(label);
      else updated[type] = updated[type].filter((v) => v !== label);
    }

    setSelectedFilters(updated);
  };

  useImperativeHandle(ref, () => ({
    getSelectedFilters: () => selectedFilters,
  }));

  return (
    <div className="w-64 border border-gray-200 rounded-md p-4 overflow-y-auto max-h-[500px]">
      <FilterSection title="Availability" options={[{ label: "In Stock" }, { label: "Out of Stock" }]}
        onSelect={(label, checked) => handleSelect("stockStatus", label, checked)}
      />
      <FilterSection title="Price"
        options={[
          { label: "500 - 1000" },
          { label: "1000 - 1500" },
          { label: "1500 - 2000" },
          { label: "2000 - 3000" },
        ]}
        onSelect={(label, checked) => handleSelect("priceRange", label, checked)}
      />

      <FilterSection
        title="Category"
        // options={[
        //   { label: "Earrings", count: 70 },
        //   { label: "Accessories", count: 34 },
        //   { label: "Neckpiece", count: 22 },
        //   { label: "Mask Chain", count: 4 },
        //   { label: "Necklace Set", count: 2 },
        // ]}
        options={
          categories.length > 0
            ? categories.map((cat) => ({ label: cat.name }))
            : [{ label: "All" }]
        }
        onSelect={(label, checked) => handleSelect("categories", label, checked)}
      />
    </div>
  );
});

FilterPanel.displayName = "FilterPanel";

export default FilterPanel;
