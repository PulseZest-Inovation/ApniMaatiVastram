"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import debounce from "lodash.debounce";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const fetchResults = async () => {
      
      };    
      

    const debouncedSearch = debounce(fetchResults, 300);
    debouncedSearch();

    return () => debouncedSearch.cancel();
  }, [query]);

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" onClick={handleSearch}>
          <SearchIcon size={18} />
        </span>
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
          {results.map((item, index) => (
            <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer">
              <Link href={`/product/${item.slug}`} onClick={() => setShowDropdown(false)}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
