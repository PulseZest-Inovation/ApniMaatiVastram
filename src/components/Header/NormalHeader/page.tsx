'use client'

import React, { useState } from "react";
import NavBar from "./NavBar";

// Update the HeaderProps interface to accept both `onSearchQueryChange` and `searchQuery`
interface HeaderProps {
  onSearchQueryChange: (query: string) => void;
  searchQuery: string; // Accept searchQuery as a prop
}

export default function Header({ onSearchQueryChange, searchQuery }: HeaderProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery); // You can either use local state or prop directly

  return (
    <div className="sticky top-0 z-30 bg-white">
      <NavBar
        onSearchQueryChange={(query) => {
          setLocalSearchQuery(query);
          onSearchQueryChange(query); // Pass the query to the parent
        }}
      />
      {/* Display search query in header for example */}
      <div>{localSearchQuery}</div>
    </div>
  );
}
