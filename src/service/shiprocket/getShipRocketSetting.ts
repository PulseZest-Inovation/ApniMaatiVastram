import { getDataByDocName } from "../Firebase/getFirestore";
import { ShipRocketLoginType } from "@/Types/data/ShipRocketLoginType";

export const getShiprocketSetting = async (): Promise<ShipRocketLoginType | null> => {
    try {
        const data = await getDataByDocName<ShipRocketLoginType>("settings", "shipping");

        if (!data) {
            console.log("No data found for Shiprocket Setting");
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error getting Shipping Details:", error); // ✅ Log the error
        return null;
    }
};