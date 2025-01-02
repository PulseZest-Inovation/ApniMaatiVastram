import React from "react";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@nextui-org/react";
import CartList from "./CartList";

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

    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: "1", name: "Product 1", price: 20, quantity: 2, image: "https://via.placeholder.com/150" },
        { id: "2", name: "Product 2", price: 15, quantity: 1, image: "https://via.placeholder.com/150" },
        { id: "3", name: "Product 3", price: 30, quantity: 3, image: "https://via.placeholder.com/150" },
      ]);

      const handleRemoveItem = (id: string) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
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
              <CartList onUpdateQuantity={()=>{}} cartItems={cartItems} onRemoveItem={handleRemoveItem} />
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
