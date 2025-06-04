'use client'

import React from "react";
import NavBar from "./NavBar";

interface HeaderProps {
  onSearchQueryChange: (query: string) => void;
  searchQuery: string;  
}

export default function Header({ onSearchQueryChange,   }: HeaderProps) {

  return (
    <div className="sticky top-0 z-30 bg-white">
      <NavBar
        onSearchQueryChange={(query) => {
          onSearchQueryChange(query);  
        }}
      />
    </div>
  );
}
