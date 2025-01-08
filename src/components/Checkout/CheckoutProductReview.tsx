import React, { useEffect, useState } from "react";
import { Card } from "@nextui-org/react";
import { getAllDocsFromSubCollection } from "@/service/Firebase/getFirestore";
import { getAuth } from "firebase/auth";
import Image from "next/image";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productTitle: string;
}

export default function CheckoutProductReview() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchCartItems = async () => {
      try {
        const auth = getAuth();
        const docId = auth.currentUser?.uid;

        if (!docId) {
          console.error("User not authenticated");
          return;
        }

        const userDoc = docId.toString();

        const fetchedCartItems = await getAllDocsFromSubCollection<CartItem>(
          "customers",
          userDoc,
          "cart"
        );

        if (isMounted) {
          setCartItems(fetchedCartItems);
        }
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    fetchCartItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="hidden md:block md:w-1/3 p-4 md:sticky top-4">
      <h3 className="text-lg font-bold mb-4">Order Summary</h3>
      <Card className="space-y-4 p-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-2 relative"
          >
            <div className="relative">
              {/* Quantity Badge */}
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                {item.quantity}
              </div>
              {/* Product Image */}
              <Image
                src={item.image}
                alt={item.productTitle}
                height={40}
                width={40}
                className="rounded-md"
              />
            </div>
            <div>
              <p className="font-semibold  ">{item.productTitle}</p>
            </div>
            <p className="font-semibold">₹{item.price}</p>
          </div>
        ))}
        <div className="flex justify-between items-center mt-4">
          <p className="font-semibold">Total</p>
          <p className="font-semibold">₹{calculateTotal()}</p>
        </div>
      </Card>
    </div>
  );
}
