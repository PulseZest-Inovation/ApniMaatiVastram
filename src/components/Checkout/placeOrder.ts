import { getAuth } from "firebase/auth";  // Import Firebase Authentication
import { getAllDocsFromCollection } from "@/service/Firebase/getFirestore";
import { createDataWithCustomId } from "@/service/Firebase/postFirestore";
import { Timestamp } from "firebase/firestore";
import { deleteDocFromSubCollection } from "@/service/Firebase/deleteDocFromSubCollection";

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
      throw new Error('User is not authenticated');
    }

    // Fetch all the cart items from the 'cart' collection of the current user
    const cartItems = await getAllDocsFromCollection<CartItem>(`customers/${currentUserUid}/cart`);

    // Prepare the order data to be set in the 'orders' collection of the current user
    const orderDataWithCartItems = {
      ...orderData,
      orderDetails: cartItems,  // Add the cart items to the order details
      createdAt: Timestamp.fromDate(new Date()),  // Add a creation timestamp
    };

    // Use the custom function to create a new order in the 'orders' collection of the current user
    const success = await createDataWithCustomId(
      'customers',  // Collection name
      currentUserUid,  // Use current user's UID for the document
      'orders',  // Subcollection name
      orderData.orderId,  // Custom document ID (orderId)
      orderDataWithCartItems  // Data to save
    );

    if (success) {
      console.log('Order placed successfully with ID:', orderData.orderId);
      
      // Delete all documents in the 'cart' subcollection after order placement
      for (const item of cartItems) {
        await deleteDocFromSubCollection(
          'customers',  // Main collection
          currentUserUid,  // Document ID (current user's UID)
          'cart',  // Subcollection name
          item.id  // Subdocument ID (cart item ID)
        );
      }
      console.log('Cart items deleted successfully after placing the order.');
    } else {
      console.error('Failed to create order.');
    }
  } catch (error) {
    console.error('Error placing order:', error);
    throw new Error('Could not place order');
  }
};



  
