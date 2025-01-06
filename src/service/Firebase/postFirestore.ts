import { addDoc, collection } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { ApplicationConfig } from "@/config/ApplicationConfig";

export const createDocWithAutoId = async (
  collectionName: string,
  documentId: string,
  subcollectionName: string,
  data: Record<string, any>
): Promise<string | null> => {
  try {
    // Reference to the specified subcollection
    const colRef = collection(db, 'app_name', ApplicationConfig.secretKey, collectionName, documentId, subcollectionName);

    // Add the document with an auto-generated ID
    const docRef = await addDoc(colRef, data);
    console.log(`Document created with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('Error creating document with auto ID:', error);
    return null;
  }
};
