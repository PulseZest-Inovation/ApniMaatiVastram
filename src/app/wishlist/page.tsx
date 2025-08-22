"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAllDocsFromSubCollection } from "@/service/Firebase/getFirestore";
import { auth } from "@/config/FirebaseConfig";
import { Spinner } from "@nextui-org/react";

// Wishlist item structure
interface WishlistItem {
  productTitle: string;
  regularPrice: number;
  salePrice: number;
  id: string;
  image: string;
  productSubtitle: string;
}

const WishlistComponent = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("No user is logged in");
          setLoading(false);
          return;
        }

        const data = await getAllDocsFromSubCollection<WishlistItem>(
          "customers",
          user.uid,
          "wishlist"
        );

        console.log("Fetched Wishlist:", data);
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // ✅ Function to limit subtitle to 30 words
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Wishlist ❤️</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        // 👇 phone par 2, tablet par 3, desktop par 4
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white shadow-md border hover:shadow-lg transition cursor-pointer"
              onClick={() => router.push(`/collection/wishlist/product/${item.id}`)}
            >
              <Image
                src={item.image}
                alt={item.productTitle}
                width={200}
                height={192}
                className="w-50 h-48 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold">{item.productTitle}</h3>
              <p className="text-gray-600 text-sm">
                {truncateText(item.productSubtitle, 4)}
              </p>
              <p className="text-gray-800 font-bold mt-1">
                <span className="line-through text-gray-500 mr-2">₹{item.regularPrice}</span>
                <span className="text-red-600">₹{item.salePrice}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistComponent;
