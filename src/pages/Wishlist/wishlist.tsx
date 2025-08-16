import React, { useEffect, useState } from "react";
import { getAllDocsFromSubCollection } from "@/service/Firebase/getFirestore";
import { getAuth } from "firebase/auth";

// Define the type for a wishlist item. Add more fields as needed.
type WishlistItem = {
  id: string;
  productId?: string;
  // Add other fields as per your wishlist document structure
};

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }
        const data = await getAllDocsFromSubCollection<WishlistItem>(
          "customer",
          userId,
          "wishlist"
        );
        setWishlist(data);
      } catch (err) {
        setError("Failed to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) {
    return <div>Loading wishlist...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <ul>
          {wishlist.map((item) => (
            <li key={item.id}>
              Product ID: {item.productId || item.id}
              {/* Render other fields here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
