import { getCurrentQuantity } from "./getCurrentQuantity";
import { getProductStock } from "./getProductStock"; // Function to get stock from Firestore
import { updateDocField } from "@/service/Firebase/updateDocField";

export const handleIncrementQuantity = async (productId: string, userId: string): Promise<boolean> => {
  console.log(`Processing Increment Quantity for: ${productId}`);
  try {
    // Fetch the current quantity from Firestore (cart)
    const currentQuantity = await getCurrentQuantity(userId, productId);
    if (currentQuantity === null) {
      console.error("Product not found in cart");
      return false;
    }

    // Fetch available stock for the product
    const availableStock = await getProductStock(productId);
    if (availableStock === null) {
      console.error("Failed to fetch product stock");
      return false;
    }

    // Check if adding more exceeds stock
    if (currentQuantity >= availableStock) {
      console.warn("Cannot add more, stock limit reached");
      return false;
    }

    // Increment the quantity
    const newQuantity = currentQuantity + 1;

    // Update the quantity in Firestore
    const result = await updateDocField(
      "customers",
      userId,
      "cart",
      productId,
      "quantity",
      newQuantity
    );

    return result;
  } catch (error) {
    console.error("Failed to increment quantity:", error);
    return false;
  }
};
