import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { ApplicationConfig } from "@/config/ApplicationConfig";

export const getProductStock = async (productId: string): Promise<number | null> => {
  try {
    const docRef = doc(
      db,
      "app_name",
      ApplicationConfig.secretKey,
      "products",
      productId
    );

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.stockQuantity ?? 0; // Ensure 0 is returned if stock is undefined
    } else {
      console.error("No such product document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product stock:", error);
    return null;
  }
};
