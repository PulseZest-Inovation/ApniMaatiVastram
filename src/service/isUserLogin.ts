// utils/authUtils.ts
import {auth} from '@/config/FirebaseConfig'
import { onAuthStateChanged } from "firebase/auth";

export const isUserLoggedIn = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true); // User is logged in
      } else {
        resolve(false); // User is not logged in
      }
      unsubscribe(); // Unsubscribe after checking
    }, reject);
  });
};
