'use client';
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getAllDocsFromSubCollection } from "@/service/Firebase/getFirestore";

export default function GetCartItemAndShow() {
  const [cartItems, setCartItems] = useState<any[]>([]); // Using 'any' for now
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        // Get the current user's UID
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          throw new Error("No user is currently logged in.");
        }

        const userId = currentUser.uid;
        console.log("Current user ID:", userId);

        // Fetch cart items for the current user
        const cartDetails = await getAllDocsFromSubCollection("customers", userId, "cart");
        console.log(cartDetails);
        setCartItems(cartDetails);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  if (loading) {
    return <div>Loading cart items...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Cart Items</h1>
      {cartItems.length > 0 ? (
        <ul className="space-y-4">
          {cartItems.map((item: any) => (
            <li key={item.id} className="p-4 border rounded-md shadow-sm">
              <h2 className="text-lg font-medium">{item.name}</h2>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
}
