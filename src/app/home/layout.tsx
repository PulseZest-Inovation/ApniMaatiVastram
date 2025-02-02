"use client";
import { useState } from "react";
import Header from "@/components/Header/NormalHeader/page";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState(""); // Manage search query state

  return (
    <div>
      <Header 
        searchQuery={searchQuery} 
        onSearchQueryChange={setSearchQuery} 
      />
      
      {/* Hide children if searchQuery has a value */}
      {searchQuery === "" && children}
    </div>
  );
}
