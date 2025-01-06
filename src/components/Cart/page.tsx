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
import CartList from "./CartList";
import { getAuth } from "firebase/auth";


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

export default function CartDrawer({
  isOpen,
  onOpenChange,
}: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching

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
      } finally {
        setLoading(false); // Stop loading after the fetch operation
      }
    };

    if (isOpen) {
      fetchCartItems(); // Fetch data only when the drawer is open
    }
  }, [isOpen]);

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
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
            <DrawerHeader className="flex flex-col gap-1"> 🛒</DrawerHeader>
            <DrawerBody>
              {/* Cart items will be displayed inside CartList */}
              <CartList
                onUpdateQuantity={() => {}}
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
              />
            </DrawerBody>
            <DrawerFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" variant="flat" onPress={onClose}>
                Action
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
