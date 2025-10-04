"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import { ProductType } from "@/Types/data/ProductType";
import { Spinner } from "@nextui-org/react";
import { handleAddToWishlist } from "@/utils/handleAddToWishlist";
import { CategoryType } from "@/Types/data/CategoryType";

export default function CollectionPage() {
  const params = useParams() as Record<string, string>;
  const category = params.cid;
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const Route = useRouter();

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(
          db,
          "app_name",
          ApplicationConfig.secretKey,
          "products"
        );
        const q = query(
          productsRef,
          where("categories", "array-contains", category)
        );
        const querySnapshot = await getDocs(q);
        const fetchedProducts: ProductType[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as ProductType)
        );
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // 🔹 Fetch categories (for subcategories list)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRef = collection(
          db,
          "app_name",
          ApplicationConfig.secretKey,
          "categories"
        );
        const querySnapshot = await getDocs(catRef);
        const fetchedCategories: CategoryType[] = querySnapshot.docs.map(
          (doc) =>
            ({
              cid: doc.id,
              ...doc.data(),
            } as CategoryType)
        );
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // 🔹 Find subcategories of current category
  const subCategories = categories.filter((cat) => cat.parent === category);

  // Group them
  const colourCategories = subCategories.filter((s) =>
    s.name.toLowerCase().includes("colour")
  );
  const fabricCategories = subCategories.filter((s) =>
    s.name.toLowerCase().includes("fabric")
  );
  const otherCategories = subCategories.filter(
    (s) =>
      !s.name.toLowerCase().includes("colour") &&
      !s.name.toLowerCase().includes("fabric")
  );

  const handleLoveClick = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Product ${productId} loved!`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 uppercase text-center">
        {category}
      </h1>

      {/* 🔹 Subcategories Section */}
      {subCategories.length > 0 && (
        <div className="mb-10">
          {/* By Colour */}
          {colourCategories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">By Colour</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
                {colourCategories.map((sub) => (
                  <div
                    key={sub.slug}
                    className="flex flex-col items-center cursor-pointer bg-white shadow-md rounded-lg p-3 hover:shadow-lg transition"
                    onClick={() => Route.push(`/collection/${sub.slug}`)}
                  >
                    <div className="w-20 h-20 aspect-square relative">
                      {sub.image && (
                        <Image
                          src={sub.image}
                          alt={sub.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      )}
                    </div>
                    <p className="text-sm mt-2 text-center">{sub.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* By Fabric */}
          {fabricCategories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">By Fabric</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
                {fabricCategories.map((sub) => (
                  <div
                    key={sub.slug}
                    className="flex flex-col items-center cursor-pointer bg-white shadow-md rounded-lg p-3 hover:shadow-lg transition"
                    onClick={() => Route.push(`/collection/${sub.slug}`)}
                  >
                    <div className="w-20 h-20 aspect-square relative">
                      {sub.image && (
                        <Image
                          src={sub.image}
                          alt={sub.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      )}
                    </div>
                    <p className="text-sm mt-2 text-center">{sub.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other */}
          {otherCategories.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4"></h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
                {otherCategories.map((sub) => (
                  <div
                    key={sub.slug}
                    className="flex flex-col items-center cursor-pointer bg-white shadow-md rounded-lg p-3 hover:shadow-lg transition"
                    onClick={() => Route.push(`/collection/${sub.slug}`)}
                  >
                    <div className="w-28 h-32 aspect-square relative">
                      {sub.image && (
                        <Image
                          src={sub.image}
                          alt={sub.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      )}
                    </div>
                    <p className="text-sm mt-2 text-center">{sub.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🔹 Products Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-2 rounded-lg flex flex-col items-center bg-white shadow hover:shadow-lg transition"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={() =>
              Route.push(`/collection/${category}/product/${product.id}`)
            }
          >
            {/* Square image wrapper */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              {/* 🔹 Diagonal Ribbon Tag */}
              {product.tagForImage && (
                <div className="absolute top-2 left-[-40px] z-10 rotate-[-45deg]">
                  <span className="bg-red-500 text-white text-xs font-semibold px-10 py-1 shadow-md">
                    {product.tagForImage}
                  </span>
                </div>
              )}

              {hoveredProduct === product.id &&
              product.galleryImages &&
              product.galleryImages.length > 0 ? (
                <Image
                  src={product.galleryImages[0]}
                  alt={`${product.productTitle} - gallery`}
                  fill
                  className="object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <Image
                  src={product.featuredImage}
                  alt={product.id}
                  fill
                  className="object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                />
              )}

              {/* Heart Icon */}
              <div
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer"
                onClick={(e) => handleLoveClick(product.id, e)}
              >
                <Image
                  src="/Icons/heart.png"
                  alt="Love Icon"
                  width={24}
                  height={24}
                  onClick={() => {
                    handleAddToWishlist(product);
                  }}
                />
              </div>
            </div>

            <h2 className="font-light mt-3 text-center capitalize line-clamp-1">
              {product.productTitle}
            </h2>
            <div className="text-center mt-2">
              {product.salePrice ? (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm text-gray-500 line-through">
                    ₹{product.regularPrice}
                  </p>

                  <p className="text-sm text-black font-medium">
                    ₹{product.salePrice}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-black font-light">
                  ₹{product.regularPrice}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
