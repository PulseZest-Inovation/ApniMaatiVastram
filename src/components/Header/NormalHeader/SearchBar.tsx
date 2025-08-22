"use client";

import React, { useState } from "react";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  onQueryChange: (query: string) => void; // Callback to return input value
  suggestions?: string[]; // Add suggestions prop
}

const SearchBar: React.FC<SearchBarProps> = ({ onQueryChange, suggestions = [] }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onQueryChange(value); // Send value back to parent
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onQueryChange(suggestion);
    setShowSuggestions(false);
  };

  const filteredSuggestions = suggestions.filter(
    (s) => s.toLowerCase().includes(query.toLowerCase()) && s !== query
  );

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
          onFocus={() => setShowSuggestions(query.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
          <SearchIcon size={18} />
        </span>
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="px-3 py-2 cursor-pointer hover:bg-purple-100 text-sm"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
