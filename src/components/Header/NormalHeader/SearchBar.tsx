"use client";

import React, { useState } from "react";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  onQueryChange: (query: string) => void; // Callback to return input value
}

const SearchBar: React.FC<SearchBarProps> = ({ onQueryChange }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onQueryChange(value); // Send value back to parent
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
          <SearchIcon size={18} />
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
