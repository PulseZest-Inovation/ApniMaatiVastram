import { ProductType } from "@/Types/data/ProductType";
import { createDataWithCustomId } from "@/service/Firebase/postFirestore";
import { getAuth } from "firebase/auth";
import { app } from "@/config/FirebaseConfig";

// Function to handle adding a product to the wishlist
export const handleAddToWishlist = async (product: ProductType): Promise<boolean> => {
  console.log(`Processing Add to Wishlist for: ${product.productTitle}`);

  try {
    const auth = getAuth(app);

    // Ensure the user is authenticated
    if (!auth.currentUser) {
      console.error("User is not authenticated.");
      return false;
    }

    const userId = auth.currentUser?.uid;

    // Wishlist Data
    const wishlistData = {
      productId: product.id,
      productTitle: product.productTitle,
      productSubtitle: product.productSubtitle,
      image: product.featuredImage,
      addedAt: new Date(), // Timestamp of when the product was added to the wishlist
      sku: product.sku ?? "",
      isReadyToWear: product.isReadyToWear ?? null,
      isPrePlated: product.isPrePlated ?? null,
    };

    // Use Firestore to add product to the wishlist subcollection
    const wishlistDocId = await createDataWithCustomId(
      "customers", // Collection name for customers
      userId, // User's UID as the document ID
      "wishlist",
      product.id, // Use product ID as the document ID
      wishlistData // Data to store
    );

    if (wishlistDocId) {
      console.log(`Product added to wishlist with document ID: ${wishlistDocId}`);
      return true; // Indicate success
    } else {
      console.error("Failed to add product to wishlist");
      return false; // Indicate failure
    }
  } catch (error) {
    console.error("Failed to add product to wishlist:", error);
    return false; // Indicate failure
  }
};
