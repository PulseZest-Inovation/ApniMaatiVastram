"use client";
import { useState, useEffect } from "react";
import { db } from "@/config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header/NormalHeader/page";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import Image from "next/image";
import Link from 'next/link'; // Import Link from next/link
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation


// ✅ Define the Product Type
interface Product {
  id: string;
  productTitle: string;
  slug: string;
  price: number;
  categories: string[];
  salePrice: number;
  regularPrice: string;
  featuredImage: string;
  galleryImage?: string[]; // Optional field for gallery images
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // ✅ Use Product[]
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]); // Reset results when search is cleared
      return;
    }

    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "app_name", ApplicationConfig.secretKey, "products");
        const querySnapshot = await getDocs(productsRef);

        const products: Product[] = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            // Explicitly extract fields from Firestore data
            const product: Product = {
              id: doc.id,
              slug: data.slug,
              productTitle: data.productTitle,
              price: data.price,
              categories: data.categories,
              regularPrice: data.regularPrice,
              salePrice: data.salePrice,
              featuredImage: data.featuredImage,
              galleryImage: data.galleryImage || [], // Default to empty array if no gallery images
            };
            return product;
          })
          .filter((product) =>
            product.productTitle?.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
          );

        setFilteredProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Reset searchQuery on pathname change
  useEffect(() => {
    setSearchQuery(""); // Clear the search query when the pathname changes
  }, [pathname]); // Dependency on pathname

  return (
    <div>
      <Header searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

      {searchQuery === "" ? (
        children
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [hoverImage, setHoverImage] = useState(product.featuredImage); // Default image

  return (
    <Link
      href={`/collection/${product.categories[0]}/product/${product.slug}`} // Link wraps the entire card
      className="border rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 flex flex-col"
    >
      {/* Product Image */}
      <div
        className="w-full h-72 relative"
        onMouseEnter={() => product.galleryImage?.length && setHoverImage(product.galleryImage[0])}
        onMouseLeave={() => setHoverImage(product.featuredImage)}
      >
        <Image
          src={hoverImage}
          alt={product.productTitle}
          layout="fill" // Makes the image fill the container
          objectFit="cover" // Ensures the image covers the area, maintaining aspect ratio
        />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h3 className="font-semibold text-sm mb-2 text-center">{product.productTitle}</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center text-xs sm:text-sm">
          <div className="flex justify-center">
            {product.salePrice ? (
              <div className="flex sm:space-x-2 items-center justify-center">
                <div className="font-bold">₹ {product.salePrice}</div>
                <div className="line-through text-gray-500">₹ {product.regularPrice}</div>
              </div>
            ) : (
              <div className="text-gray-800 font-bold">₹ {product.regularPrice || "N/A"}</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
