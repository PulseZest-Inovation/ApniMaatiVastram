import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { ApplicationConfig } from "@/config/ApplicationConfig";

export const getCurrentQuantity = async (userId: string, productId: string): Promise<number | null> => {
  try {
    const docRef = doc(
      db,
      "app_name",
      ApplicationConfig.secretKey,
      "customers",
      userId,
      "cart",
      productId
    );

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.quantity || 0;
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching current quantity:", error);
    return null;
  }
};
