import { ProductType } from "@/Types/data/ProductType";
import { createDataWithCustomId } from "@/service/Firebase/postFirestore";
import { getAuth } from "firebase/auth";
import { app } from "@/config/FirebaseConfig";

// Updated Function to handle Add to Cart
export const handleAddToCart = async (
  product: ProductType & { readyToWear?: { wrist: number; length: number; hip: number } }
): Promise<boolean> => {
  console.log(`Processing Add to Cart for: ${product.productTitle}`);
  try {
    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
    const auth = getAuth(app);

    // Ensure the user is authenticated
    if (!auth.currentUser) {
      console.error("User is not authenticated.");
      return false;
    }

    const userId = auth.currentUser?.uid;

    // Ensure product.price is a number (in case it's a string)
    const price = parseFloat(product.price.toString());

    if (isNaN(price)) {
      console.error("Invalid product price");
      return false;
    }

    // Data to store in the cart
    const cartData = {
      productId: product.id,
      quantity: 1, // Default quantity can be 1 or passed from the front-end
      price: price, // Ensure price is a number
      productTitle: product.productTitle,
      productSubtitle: product.productSubtitle,
      totalPrice: price * 1, // Total price calculated for quantity (1 in this case)
      addedAt: new Date(), // Timestamp of when the product was added to the cart
      status: "pending", // Could be "pending", "in-process", "purchased", etc.
      image: product.featuredImage,
      readyToWear: product.readyToWear || null, // Include custom fields if available
      readyToWearCharges: product.readyToWearCharges,
      isReadyToWear: product.isReadyToWear
    };

    // Use the collection name to create a document in the cart subcollection
    const cartDocId = await createDataWithCustomId(
      "customers", // Collection name for the customers
      userId, // User's UID as the document ID for the customer
      "cart",
      product.id,
      cartData // Data to add to the cart document
    );

    if (cartDocId) {
      console.log(`Product added to cart with document ID: ${cartDocId}`);
      return true; // Indicate success
    } else {
      console.error("Failed to add product to cart");
      return false; // Indicate failure
    }
  } catch (error) {
    console.error("Failed to add product to cart:", error);
    return false; // Indicate failure
  }
};
