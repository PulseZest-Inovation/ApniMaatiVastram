import Image from "next/image";
import React from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string; // Add image URL to CartItem
}

interface CartListProps {
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void; // Function to remove an item from the cart
  onUpdateQuantity: (id: string, quantity: number) => void; // Function to update quantity
}

const CartList: React.FC<CartListProps> = ({ cartItems, onRemoveItem, onUpdateQuantity }) => {
  const handleIncrement = (id: string, currentQuantity: number) => {
    onUpdateQuantity(id, currentQuantity + 1);
  };

  const handleDecrement = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      onUpdateQuantity(id, currentQuantity - 1);
    }
  };

  return (
    <div className="space-y-6">
      {cartItems.length === 0 ? (
        <p className="text-xl font-semibold text-center text-gray-600">No items in the cart.</p>
      ) : (
        cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-lg p-6 mb-4 flex items-center space-x-4"
          >
            {/* Product Image */}
            <Image
                height={100} width={100}
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              {/* Product Name */}
              <p className="text-xl font-semibold text-gray-800">{item.name}</p>
              {/* Price */}
              <p className="text-sm text-gray-600">Price: ${item.price}</p>
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
