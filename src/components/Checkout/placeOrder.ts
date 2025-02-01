import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import { createDataWithCustomId, placeOrderFiresotre } from "@/service/Firebase/postFirestore";
import { Timestamp } from "firebase/firestore";
import { deleteDocFromSubCollection } from "@/service/Firebase/deleteDocFromSubCollection";
import { fetchEmailDetails } from "@/utils/getSendingEmail";
import { decreaseStockValue } from "@/utils/decressaseTheStock";

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

export const placeOrder = async (orderData: any): Promise<boolean> => {
  try {
    if (!orderData.customerId) {
      throw new Error("No customer Id Found");
    }

    // Fetch cart items in parallel with email details
    const [cartItems, emailDetails] = await Promise.all([
      getAllDocsFromCollection<CartItem>(`customers/${orderData.customerId}/cart`),
      fetchEmailDetails(),
    ]);

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty. Cannot place an order.");
    }

    if (!emailDetails) {
      throw new Error("Failed to fetch email configuration details.");
    }

    console.log(cartItems);

    // Prepare order data
    const orderDataWithCartItems = {
      ...orderData,
      orderDetails: cartItems,
      createdAt: Timestamp.fromDate(new Date()),
    };

    // Create the order in parallel in both collections
    await Promise.all([
      createDataWithCustomId("customers", orderData.customerId, "orders", orderData.orderId, orderDataWithCartItems),
      placeOrderFiresotre("orders", orderData.orderId, orderDataWithCartItems),
    ]);

    console.log("Order placed successfully with ID:", orderData.orderId);

    // Decrease stock for each product in parallel
    const stockUpdates = cartItems.map((item) => decreaseStockValue(item.id, item.quantity));
    
    // Delete all cart items in parallel
    const cartDeletions = cartItems.map((item) =>
      deleteDocFromSubCollection("customers", orderData.customerId, "cart", item.id)
    );

    // Execute stock updates and cart deletions concurrently
    await Promise.all([...stockUpdates, ...cartDeletions]);

    console.log("Stock updated and cart items deleted successfully.");

    // Send order confirmation API request
    const apiResponse = await fetch("/api/order/recive-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems,
        emailDetails,
        orderId: orderData.orderId,
        customerEmail: orderData.email,
        totalAmount: orderData.totalAmount,
      }),
    });

    if (!apiResponse.ok) {
      const errorDetails = await apiResponse.json();
      throw new Error(`Failed to call the API. Status: ${apiResponse.status}, Message: ${errorDetails.message}`);
    }

    console.log("Order confirmation email sent successfully.");

    return true;
  } catch (error) {
    console.error("Error placing order:", error);
    return false;
  }
};
