"use client";

import React, { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  productTitle: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); // for keyboard navigation
  const router = useRouter();

  // 🔹 Fetch products from Firestore once
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllDocsFromCollection<Product>("products");
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // 🔹 Handle input change & filter products
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
      setSelectedIndex(-1);
    } else {
      const results = products.filter((p) =>
        p.productTitle.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(results);
      setSelectedIndex(-1);
    }
  };

  // 🔹 Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < filteredProducts.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredProducts[selectedIndex]) {
        openProduct(filteredProducts[selectedIndex]);
      }
    }
  };

  // 🔹 Open product details page
const openProduct = (product: Product) => {
  router.push(`/collection/category/product/${product.id}`);
};


  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
          <SearchIcon size={18} />
        </span>
      </div>

      {/* 🔹 Suggestions Dropdown */}
      {filteredProducts.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow-md max-h-60 overflow-y-auto z-10">
          {filteredProducts.map((product, index) => (
            <li
              key={product.id}
              className={`px-4 py-2 text-sm cursor-pointer ${
                index === selectedIndex ? "bg-purple-100" : "hover:bg-gray-100"
              }`}
              onClick={() => openProduct(product)}
            >
              {product.productTitle}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
