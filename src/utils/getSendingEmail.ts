import { getDataByDocName } from "@/service/Firebase/getFirestore";

// Define the expected structure of the Firestore document
interface EmailSettings {
  emailType: "custom" | "google";
  smtpServer?: string;
  port?: string;
  customEmail?: string;
  password?: string;
  googleEmail?: string;
  appPassword?: string;
  isEnabled?: boolean;
  emailList?: string[];
}

export const fetchEmailDetails = async (): Promise<EmailSettings | null> => {
  try {
    // Fetch the document data
    const data = await getDataByDocName<EmailSettings>("settings", "email-setting");

    if (!data) {
      console.warn("No data found for email settings.");
      return null; // Return `null` if no data is found
    }

    console.log(data);
    return data; // Return the entire object as is
  } catch (error) {
    console.error("Error fetching email settings:", error);
    return null; // Return `null` in case of an error
  }
};
