import { getAuth } from "firebase/auth";
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

export const placeOrder = async (orderData: any): Promise<boolean> => {
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

    // Create order in Firestore and place it globally
    const [success, globalOrderResponse] = await Promise.all([
      createDataWithCustomId(
        "customers", // Collection name
        currentUserUid, // Use current user's UID for the document
        "orders", // Subcollection name
        orderData.orderId, // Custom document ID (orderId)
        orderDataWithCartItems // Data to save
      ),
      placeOrderFiresotre("orders", orderData.orderId, orderDataWithCartItems) // Save data globally
    ]);

    if (!success) {
      throw new Error("Failed to create order in the database.");
    }

    console.log("Order placed globally:", globalOrderResponse);

    // Fetch email configuration details
    const emailDetails = await fetchEmailDetails();
    if (!emailDetails) {
      throw new Error("Failed to fetch email configuration details.");
    }

    // Prepare for cart deletion and email sending concurrently
    const deleteCartItemsPromise = Promise.all(
      cartItems.map((item) =>
        deleteDocFromSubCollection(
          "customers", // Main collection
          currentUserUid, // Document ID (current user's UID)
          "cart", // Subcollection name
          item.id // Subdocument ID (cart item ID)
        )
      )
    );

    // Wait for cart items deletion and email sending
    await Promise.all([deleteCartItemsPromise]);

    console.log("Cart items deleted and email sent successfully.");

    // Return true indicating success
    return true;

  } catch (error) {
    console.error("Error placing order:", error);
    // Return false indicating failure
    return false;
  }
};
