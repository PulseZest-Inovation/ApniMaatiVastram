import { getDataByDocName } from "@/service/Firebase/getFirestore";
import { EmailSettings } from "@/Types/data/EmailSettingType";

// Define the expected structure of the Firestore document

export const fetchEmailDetails = async (): Promise<EmailSettings | null> => {
  try {
    // Fetch the document data
    const data = await getDataByDocName<EmailSettings>("settings", "email-setting");

    if (!data) {
      console.warn("No data found for email settings.");
      return null; // Return `null` if no data is found
    }

    return data; // Return the entire object as is
  } catch (error) {
    console.error("Error fetching email settings:", error);
    return null; // Return `null` in case of an error
  }
};
