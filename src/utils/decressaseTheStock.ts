import { updateDocWithCustomId } from "@/service/Firebase/updateDocField";

export const decreaseStockValue = async (productId: string, currentStock: number): Promise<boolean> => {
    try {
        if (currentStock <= 0) {
            console.warn(`Stock for product ${productId} is already zero.`);
            return false; // Prevent negative stock values
        }

        const updatedValue = currentStock - 1;
        const status = await updateDocWithCustomId('products', productId, { stockQuantity: updatedValue });

        return status;
    } catch (error) {
        console.error(`Error decreasing stock for product ${productId}:`, error);
        return false;
    }
};
