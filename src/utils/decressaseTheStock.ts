import { getDataByDocName } from "@/service/Firebase/getFirestore";
import { updateDocWithCustomId } from "@/service/Firebase/updateDocField";
import { ProductType } from "@/Types/data/ProductType";

export const decreaseStockValue = async (productId: string, quantity: number): Promise<boolean> => {
    try {
        // Fetch the current stock from Firestore
        const productData = await getDataByDocName<ProductType>('products', productId);

        if (!productData || productData.stockQuantity === undefined) {
            console.error(`Product ${productId} not found or missing stockQuantity field.`);
            return false;
        }

        const currentStock = productData.stockQuantity;

        if (currentStock <= 0) {
            console.warn(`Stock for product ${productId} is already zero.`);
            return false; // Prevent negative stock values
        }

        const updatedStock = Math.max(0, currentStock - quantity); // Prevent negative stock
        const status = await updateDocWithCustomId('products', productId, { stockQuantity: updatedStock });

        return status;
    } catch (error) {
        console.error(`Error decreasing stock for product ${productId}:`, error);
        return false;
    }
};
