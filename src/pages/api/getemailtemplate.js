import { fetchEmailDetails } from "@/utils/getSendingEmail";

export const getEmailTemplate = async (emailType) => {
  try {
    // Fetch email details from Firestore
    const data = await fetchEmailDetails();

    // Return null if no data is found
    if (!data) {
      console.warn("No email settings found.");
      return null;
    }

    // Map emailType to the corresponding template
    switch (emailType) {
      case "OrderCancelled":
        return data.OrderCancelled || null;
      case "OrderConfirmed":
        return data.OrderConfirmed || null;
      case "OrderPending":
        return data.OrderPending || null;
      case "OrderPlaced":
        return data.OrderPlaced || null;
      case "OrderProcessing":
        return data.OrderProcessing || null;
      default:
        console.warn("Invalid email type provided.");
        return null;
    }
  } catch (error) {
    console.error("Error getting email template:", error);
    return null;
  }
};
