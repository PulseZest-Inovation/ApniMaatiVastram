import { ApplicationConfig } from "@/config/ApplicationConfig";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

/**
 * Deletes a document from a sub-collection in Firestore.
 *
 * @param {string} mainCollection - The name of the main collection.
 * @param {string} documentId - The ID of the document in the main collection.
 * @param {string} subCollection - The name of the sub-collection.
 * @param {string} subDocId - The ID of the document in the sub-collection to delete.
 * @returns {Promise<void>} - A promise that resolves when the document is deleted.
 */
export async function deleteDocFromSubCollection(
  mainCollection: string,
  documentId: string,
  subCollection: string,
  subDocId: string
): Promise<void> {
  try {
    const db = getFirestore();

    // Reference to the document in the sub-collection
    const docRef = doc(db, 'app_name' , ApplicationConfig.secretKey, mainCollection, documentId, subCollection, subDocId);

    // Delete the document
    await deleteDoc(docRef);

    console.log(`Document with ID ${subDocId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
