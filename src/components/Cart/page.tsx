import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@nextui-org/react";
import { getAllDocsFromSubCollection } from "@/service/Firebase/getFirestore";
import { deleteDocFromSubCollection } from "@/service/Firebase/deleteDocFromSubCollection";
import CartList from "./CartList";
import { getAuth } from "firebase/auth";
import { IndianRupee } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartDrawer({ isOpen, onOpenChange }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const auth = getAuth();
        const docId = auth.currentUser?.uid;

        if (!docId) {
          throw new Error("User not authenticated");
        }

        const userDoc = docId.toString(); // Assign the userDoc value from docId

        // Fetch cart items from the 'cart' sub-collection of the 'customers' collection
        const fetchedCartItems = await getAllDocsFromSubCollection<CartItem>(
          "customers", // The main collection name
          userDoc,     // The document ID for the authenticated user
          "cart"       // The sub-collection name
        );

        // Update the cartItems state with fetched items
        setCartItems(fetchedCartItems);
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    if (isOpen) {
      fetchCartItems(); // Fetch data only when the drawer is open
    }
  }, [isOpen]);

  const handleRemoveItem = async (id: string) => {
    try {
      const auth = getAuth();
      const docId = auth.currentUser?.uid;

      if (!docId) {
        throw new Error("User not authenticated");
      }

      const userDoc = docId.toString();

      // Remove the document from Firestore
      await deleteDocFromSubCollection("customers", userDoc, "cart", id);

      // Remove the item from state
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity > 0) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

   
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Drawer
      isOpen={isOpen}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            x: 0,
          },
          exit: {
            x: 100,
            opacity: 0,
          },
        },
      }}
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1 text-orange-400">
              CART 🛒
            </DrawerHeader>
            <DrawerBody>
              {/* Cart items will be displayed inside CartList */}
              <CartList
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
                userId={getAuth().currentUser?.uid || ""}
              />
            </DrawerBody>
            <DrawerFooter>
              {/* Subtotal text and total */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="flex">
                    <IndianRupee size={15} /> {calculateTotal()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Shipping, taxes, and discount codes calculated at checkout.
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                color="warning" // Orange color
                variant="flat" // White background with border
                onPress={onClose} // Placeholder action on button click
                className="w-full mt-4"
              >
                Place Order
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
