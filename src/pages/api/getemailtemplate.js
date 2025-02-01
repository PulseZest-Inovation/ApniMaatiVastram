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
      case "Cancled":
        return data.OrderCancelled || null;
      case "Confirmed":
        return data.OrderConfirmed || null;
      case "Pending":
        return data.OrderPending || null;
      case "Delivered":
        return data.OrderDelivered || null;
      case "Processing":
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
