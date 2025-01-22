import { db } from "@/config/FirebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import { userProfileType } from "@/Types/data/userProfileType";

// Function to fetch user data
export const fetchUserData = async (
  userId: string,
  setUserData: React.Dispatch<React.SetStateAction<userProfileType | null>>,
  setFormData: React.Dispatch<React.SetStateAction<userProfileType>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const userDocRef = doc(db, 'app_name', ApplicationConfig.secretKey, 'customers', userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      setUserData(userDocSnap.data() as userProfileType);
      setFormData(userDocSnap.data() as userProfileType);
    } else {
      setUserData(null);
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        houseNumber: '',
        apartment: '',
        country: 'India',
        address: '',
        city: '',
        pinCode: '',
      });
    }
    setLoading(false);
  } catch (error) {
    console.error("Error fetching user data:", error);
    setLoading(false);
  }
};

// Function to update user profile data
export const updateUserProfile = async (userId: string, field: string, value: string) => {
  try {
    const userDocRef = doc(db, 'app_name', ApplicationConfig.secretKey, 'customers', userId);
    await updateDoc(userDocRef, {
      [field]: value,
    });
    
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};
