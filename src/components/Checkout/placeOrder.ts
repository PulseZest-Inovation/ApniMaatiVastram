import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import { createDataWithCustomId, placeOrderFiresotre } from "@/service/Firebase/postFirestore";
import { Timestamp } from "firebase/firestore";
import { deleteDocFromSubCollection } from "@/service/Firebase/deleteDocFromSubCollection";
import { fetchEmailDetails } from "@/utils/getSendingEmail";

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

export const placeOrder = async (orderData: any) => {
  try {
    // Get the current user's UID from Firebase Auth
    const currentUserUid = getAuth().currentUser?.uid;

    if (!currentUserUid) {
      throw new Error("User is not authenticated");
    }

    // Fetch all the cart items from the 'cart' collection of the current user
    const cartItems = await getAllDocsFromCollection<CartItem>(`customers/${currentUserUid}/cart`);
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty. Cannot place an order.");
    }

    console.log(cartItems);

    // Prepare the order data to be set in the 'orders' collection of the current user
    const orderDataWithCartItems = {
      ...orderData,
      orderDetails: cartItems, // Add the cart items to the order details
      createdAt: Timestamp.fromDate(new Date()), // Add a creation timestamp
    };

    // Use the custom function to create a new order in the 'orders' collection of the current user
    const success = await createDataWithCustomId(
      "customers", // Collection name
      currentUserUid, // Use current user's UID for the document
      "orders", // Subcollection name
      orderData.orderId, // Custom document ID (orderId)
      orderDataWithCartItems // Data to save
    );

    // Save data to the global 'orders' collection
    await placeOrderFiresotre("orders", orderData.orderId, orderDataWithCartItems);

    // Fetch email configuration details
    const emailDetails = await fetchEmailDetails();
    if (!emailDetails) {
      throw new Error("Failed to fetch email configuration details.");
    }

    if (success) {
      console.log("Order placed successfully with ID:", orderData.orderId);

      // Delete all documents in the 'cart' subcollection after order placement
      for (const item of cartItems) {
        await deleteDocFromSubCollection(
          "customers", // Main collection
          currentUserUid, // Document ID (current user's UID)
          "cart", // Subcollection name
          item.id // Subdocument ID (cart item ID)
        );
      }
      console.log("Cart items deleted successfully after placing the order.");

      // After clearing the cart, send data to the API
      const apiResponse = await fetch("/api/order/recive-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems, // Send cart items
          emailDetails, // Send email configuration details
          orderId: orderData.orderId, // Include the order ID for reference
          customerEmail: orderData.email, // Include customer email
          totalAmount: orderData.totalAmount
        }),
      });

      if (!apiResponse.ok) {
        const errorDetails = await apiResponse.json();
        throw new Error(
          `Failed to call the API. Status: ${apiResponse.status}, Message: ${errorDetails.message}`
        );
      }

      const apiResult = await apiResponse.json();
      console.log("API Response:", apiResult);
    } else {
      console.error("Failed to create order.");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    throw new Error("Could not place order. Please try again later.");
  }
};
