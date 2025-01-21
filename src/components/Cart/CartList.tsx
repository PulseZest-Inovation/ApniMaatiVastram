import { IndianRupee } from "lucide-react";
import Image from "next/image";
import React from "react";
import { handleIncrementQuantity } from "@/utils/handleIncrementQuantity";
import { handleDecrementQuantity } from "@/utils/handleDecrementQuantity";
import SparklesText from "../ui/sparkles-text";

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

interface CartListProps {
  cartItems: CartItem[];
  userId: string;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartList: React.FC<CartListProps> = ({
  cartItems,
  userId,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const handleIncrement = async (id: string, currentQuantity: number) => {
    const success = await handleIncrementQuantity(id, userId);
    if (success) {
      onUpdateQuantity(id, currentQuantity + 1);
    }
  };

  const handleDecrement = async (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      const success = await handleDecrementQuantity(id, userId);
      if (success) {
        onUpdateQuantity(id, currentQuantity - 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      {cartItems.length === 0 ? (
        <p className="text-xl font-semibold text-center text-gray-600">
          No items in the cart.
        </p>
      ) : (
        cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-lg p-6 mb-4 flex items-center space-x-4"
          >
            {/* Product Image */}
            <Image
              height={100}
              width={100}
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              {/* Product Name */}
              <p className="text-xl font-semibold text-gray-800">{item.name}</p>
              {/* Price */}
              <p className="text-sm text-gray-600 flex items-center">
                <IndianRupee size={20} /> {item.price}
              </p>
              <div className="flex items-center mt-2">
                {/* Quantity Controls */}
                <button
                  onClick={() => handleDecrement(item.id, item.quantity)}
                  className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition duration-200"
                >
                  -
                </button>
                <p className="mx-2 text-lg">{item.quantity}</p>
                <button
                  onClick={() => handleIncrement(item.id, item.quantity)}
                  className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition duration-200"
                >
                  +
                </button>
              </div>
              {/* Ready-to-Wear Charges */}
              {item.isReadyToWear && (
                <div className="flex">
               <SparklesText text="Ready to Wear " sparklesCount={3} className="text-sm font-light text-orange-400 fill-content4-foreground"></SparklesText> <span className=" pl-2 text-sm"> ₹{item.readyToWearCharges}</span>
                </div>
              )}
                 {item.isPrePlated && (
                <div className="flex">
               <SparklesText text="Pre-Plated " sparklesCount={3} className="text-sm font-light text-orange-400 fill-content4-foreground"></SparklesText> <span className=" pl-2 text-sm"> ₹{item.prePlatedCharges}</span>
                </div>
              )}
            </div>
            <div>
              {/* Remove Button */}
              <button
                onClick={() => onRemoveItem(item.id)}
                className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CartList;
