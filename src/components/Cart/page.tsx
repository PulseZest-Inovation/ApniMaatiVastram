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
import { useRouter } from "next/navigation";

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
  isReadyToWear: boolean;
  readyToWearCharges: number;
  isPrePlated: boolean;
  prePlatedCharges: number; 
}

export default function CartDrawer({ isOpen, onOpenChange }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const Router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const auth = getAuth();
        const docId = auth.currentUser?.uid;

        if (!docId) {
          throw new Error("User not authenticated");
        }

        const userDoc = docId.toString();

        const fetchedCartItems = await getAllDocsFromSubCollection<CartItem>(
          "customers",
          userDoc,
          "cart"
        );

        setCartItems(fetchedCartItems);
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      }
    };

    if (isOpen) {
      fetchCartItems();
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

      await deleteDocFromSubCollection("customers", userDoc, "cart", id);

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
    return cartItems.reduce((total, item) => {
      const price = Number(item.price);
      const readyToWearCharges = item.isReadyToWear ? Number(item.readyToWearCharges) : 0;
      const quantity = Number(item.quantity);
  
      const itemTotal = (price + readyToWearCharges) * quantity;
      console.log(typeof itemTotal, itemTotal); // Debugging the type and value
      return total + itemTotal;
    }, 0);
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
              <CartList
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
                userId={getAuth().currentUser?.uid || ""}
              />
            </DrawerBody>
            <DrawerFooter>
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
              <Button
                
                variant="flat"
                className="w-full mt-4"
                onPress={() => {
                  Router.push("/checkout");
                  onClose();
                }}
                style={{ backgroundColor: 'black',
                  color:'white'
                 }} 
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
