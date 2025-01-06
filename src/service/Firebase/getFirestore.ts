import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { ApplicationConfig } from "@/config/ApplicationConfig";

/**
 * Get a specific document from a collection by document name.
 * @param collectionName - Name of the collection.
 * @param docName - Name of the document.
 * @returns A promise resolving to the document data.
 */
export const getDataByDocName = async <T>(
    collectionName: string,
    docName: string
  ): Promise<T | null> => {
    try {
      // Retrieve the appKey from localStorage
      if (!ApplicationConfig.secretKey) {
        throw new Error('No security key found!');
      }
  
      // Reference the document in Firestore
      const docRef = doc(db, 'app_name', ApplicationConfig.secretKey, collectionName, docName);
      const docSnap = await getDoc(docRef);
  
      // Check if the document exists
      if (docSnap.exists()) {
        return docSnap.data() as T;
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document: ', error);
      return null;
    }
  };



/**
 * Get all documents from a collection.
 * @param collectionName - Name of the collection.
 * @returns A promise resolving to an array of documents.
 */
export const getAllDocsFromCollection = async <T>(
    collectionName: string
  ): Promise<Array<T & { id: string }>> => {
    try {
      
      if (!ApplicationConfig.secretKey) {
        throw new Error('No security key found!');
      }
  
      // Build the collection reference path
      const colRef = collection(db, 'app_name', ApplicationConfig.secretKey, collectionName);
  
      // Fetch all documents from the collection
      const querySnapshot = await getDocs(colRef);
  
      // Map through the documents and return them with their IDs
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as T),
      }));
  
      return data;
    } catch (error) {
      console.error('Error getting documents: ', error);
      return [];
    }
  };


  export const getAllDocsFromSubCollection = async <T>(
    collectionName: string,
    userDoc: string,
    subCollectionName: string
  ): Promise<Array<T & { id: string }>> => {
    try {
      
      if (!ApplicationConfig.secretKey) {
        throw new Error('No security key found!');
      }
  
      // Build the collection reference path
      const colRef = collection(db, 'app_name', ApplicationConfig.secretKey, collectionName, userDoc, subCollectionName);
  
      // Fetch all documents from the collection
      const querySnapshot = await getDocs(colRef);
  
      // Map through the documents and return them with their IDs
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as T),
      }));
  
      return data;
    } catch (error) {
      console.error('Error getting documents: ', error);
      return [];
    }
  };
   
   