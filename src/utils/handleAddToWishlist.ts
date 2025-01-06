import { ProductType } from "@/Types/data/ProductType";
// Function to handle Add to Wishlist
export const handleAddToWishlist = async (product: ProductType): Promise<boolean> => {
    console.log(`Processing Add to Wishlist for: ${product.productTitle}`);
    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      console.log(`Product added to wishlist: ${product.productTitle}`);
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to add product to wishlist:", error);
      return false; // Indicate failure
    }
  };