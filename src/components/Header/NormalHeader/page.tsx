'use client'

import React, { useState } from "react";
import NavBar from "./NavBar";

// Update the HeaderProps interface to accept both `onSearchQueryChange` and `searchQuery`
interface HeaderProps {
  onSearchQueryChange: (query: string) => void;
  searchQuery: string; // Accept searchQuery as a prop
}

export default function Header({ onSearchQueryChange, searchQuery }: HeaderProps) {

  return (
    <div className="sticky top-0 z-30 bg-white">
      <NavBar
        onSearchQueryChange={(query) => {
          onSearchQueryChange(query); // Pass the query to the parent
        }}
      />
    </div>
  );
}
