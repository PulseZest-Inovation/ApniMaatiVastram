import { getDataByDocName } from "@/service/Firebase/getFirestore";

interface PaymentSetting {
    secretKey: string;
    merchantId: string;
    keyIndex: string;
}

export const fetchPaymentDetails = async (): Promise<PaymentSetting | null> => {
  try {
    // Fetch the document data
    const data = await getDataByDocName<PaymentSetting>("settings", "payment");

    if (!data) {
      console.warn("No data found for Pyament Setting.");
      return null; // Return `null` if no data is found
    }
    return data; // Return the entire object as is
  } catch (error) {
    console.error("Error fetching Payment settings:", error);
    return null; // Return `null` in case of an error
  }
};
