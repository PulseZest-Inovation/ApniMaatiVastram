import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { ApplicationConfig } from "@/config/ApplicationConfig";

// Define a generic type for the data
export const createDocWithAutoId = async <T extends Record<string, unknown>>(
  collectionName: string,
  documentId: string,
  subcollectionName: string,
  data: T
): Promise<string | null> => {
  try {
    // Reference to the specified subcollection
    const colRef = collection(
      db,
      "app_name",
      ApplicationConfig.secretKey,
      collectionName,
      documentId,
      subcollectionName
    );

    // Add the document with an auto-generated ID
    const docRef = await addDoc(colRef, data);
    console.log(`Document created with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error creating document with auto ID:", error);
    return null;
  }
};

export const createDataWithCustomId = async <T extends Record<string, unknown>>(
  collectionName: string, // Collection name (e.g., 'customers')
  documentId: string, // Document ID (e.g., user ID)
  subcollectionName: string, // Subcollection name (e.g., 'cart')
  subCollectionDocId: string, // Custom ID for the document in the subcollection
  data: T // Data to save in the document
): Promise<boolean> => {
  try {
    // Reference to the specified subcollection with custom document ID
    const colRef = collection(
      db,
      "app_name",
      ApplicationConfig.secretKey,
      collectionName,
      documentId,
      subcollectionName
    );

    // Reference to the document with the provided custom subcollection document ID
    const docRef = doc(colRef, subCollectionDocId); // Use the custom subcollection document ID

    // Set the document data with the provided ID
    await setDoc(docRef, data);
    console.log(`Document created with custom subcollection ID: ${subCollectionDocId}`);
    return true; // Indicate success
  } catch (error) {
    console.error("Error creating document with custom ID:", error);
    return false; // Indicate failure
  }
};



/**
 * Sets data to a document with a custom ID in the specified collection.
 * @param collectionName - The name of the Firestore collection.
 * @param docName - The custom document ID.
 * @param data - The data to be stored in the document.
 * @returns A boolean indicating success or failure.
 */
export const setDocWithCustomId = async <T>(
  collectionName: string,
  docName: string,
  data: Record<string, any>
): Promise<boolean> => {
  try {
   

    // Reference to the document
    const docRef = doc(db, 'app_name', ApplicationConfig.secretKey, collectionName, docName);

    // Set the data to the document with merge option
    await setDoc(docRef, data, { merge: true }); // Use merge: true to avoid overwriting the document
    console.log(`Document with ID '${docName}' successfully written in '${collectionName}'.`);
    return true;
  } catch (error) {
    console.error('Error setting document with custom ID:', error);
    return false;
  }
};


 
export const placeOrderFiresotre = async <T extends Record<string, unknown>>(
  collectionName: string, // Collection name (e.g., 'customers')
  documentId: string, // Document ID (e.g., user ID)
  data: T // Data to save in the document
): Promise<boolean> => {
  try {
    // Reference to the specified document with custom document ID
    const docRef = doc(
      db,
      "app_name",
      ApplicationConfig.secretKey,
      collectionName,
      documentId
    );

    // Set the document data with the provided ID
    await setDoc(docRef, data);
    return true; // Indicate success
  } catch (error) {
    console.error("Error creating document with custom ID:", error);
    return false; // Indicate failure
  }
};




