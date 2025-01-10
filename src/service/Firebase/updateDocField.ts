import { doc,  updateDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { ApplicationConfig } from "@/config/ApplicationConfig";

export const updateDocField = async (
    collectionName: string,
    documentId: string,
    subcollectionName: string,
    subCollectionDocId: string,
    field: string,
    value: string | number | boolean | object | null
  ): Promise<boolean> => {
    try {
      // Reference to the document
      const docRef = doc(
        db,
        "app_name",
        ApplicationConfig.secretKey,
        collectionName,
        documentId,
        subcollectionName,
        subCollectionDocId
      );
  
      // Update the specified field with the new value
      await updateDoc(docRef, {
        [field]: value,
      });
  
      console.log(
        `Updated field '${field}' to '${value}' for document ID: ${subCollectionDocId}`
      );
      return true; // Indicate success
    } catch (error) {
      console.error("Error updating document field:", error);
      return false; // Indicate failure
    }
  };