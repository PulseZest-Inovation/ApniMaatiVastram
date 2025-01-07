import { getCurrentQuantity } from "./getCurrentQuantity";
import { updateDocField } from "@/service/Firebase/postFirestore";

export const handleDecrementQuantity = async (productId: string, userId: string): Promise<boolean> => {
  console.log(`Processing Decrement Quantity for: ${productId}`);
  try {
    // Fetch the current quantity from Firestore (assume you have a method to fetch it)
    const currentQuantity = await getCurrentQuantity(userId, productId);
    if (currentQuantity === null) {
      console.error("Product not found in cart");
      return false;
    }

    // Ensure quantity does not go below 1
    const newQuantity = Math.max(currentQuantity - 1, 1);

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
    console.error("Failed to decrement quantity:", error);
    return false;
  }
};
