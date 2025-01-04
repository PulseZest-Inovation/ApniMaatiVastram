import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig'; // Assuming 'db' is your Firestore instance
import { getAuth } from 'firebase/auth';
import { ApplicationConfig } from '@/config/ApplicationConfig';

// Function to create the user in Firestore
export const createAccount = async () => {
  try {
        const auth = getAuth();
        const currentUser = auth.currentUser

    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    // Check if the user document already exists in the 'customer' collection
    const userDocRef = doc(db, 'app_name', ApplicationConfig.secretKey, 'customer', currentUser.uid); // Use `uid` as the doc ID for the user
    const userDocSnapshot = await getDoc(userDocRef);

    // If the document doesn't exist, create it and set the phone number
    if (!userDocSnapshot.exists()) {
      await setDoc(userDocRef, {
        phoneNumber: currentUser.phoneNumber, // Set the phone number as part of the user's document
      });

      console.log('User account created successfully.');
    } else {
      console.log('User document already exists. No changes made.');
    }
  } catch (error) {
    console.error('Error creating user account: ', error);
  }
};
