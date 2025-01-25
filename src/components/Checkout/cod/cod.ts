import { placeOrder } from '../placeOrder';
import { generateOrderId } from '../genrateOrderId';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { toast } from 'react-toastify';
import { DeliverDetails } from '@/Types/data/DeliveryDetails';
import { fetchEmailDetails } from '@/utils/getSendingEmail';

// Handle the COD Order
export const handleCodOrder = async (
  deliveryDetails: DeliverDetails,
  totalAmount: number,
  orderId: string,
  setLoading: (loading: boolean) => void
): Promise<boolean> => {
  setLoading(true); // Start loading state immediately

  try {
    // Generate order ID and fetch cart details concurrently
    const [cartDetails] = await Promise.all([
      getAllDocsFromCollection('carts'), // Fetch all cart details
    ]);

    // Create the new order data object
    const newOrderData = {
      ...deliveryDetails,
      ...cartDetails,
      status: 'Pending',
      orderId: orderId,
      totalAmount: totalAmount,
    };

    
    // Place the order in Firebase
    const orderPlacedSuccessfully = await placeOrder(newOrderData);
    const emailDetail = await fetchEmailDetails();

    if(orderPlacedSuccessfully){
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the request content type as JSON
        },
        body: JSON.stringify({
          orderDetails: newOrderData, // Include order data as the body of the request
          emailDetails: emailDetail, // Include email configuration details
          emailType: "Pending", // The type of email (e.g., 'order-received', 'order-shipped', etc.)
        }),
      });
    }

    if (!orderPlacedSuccessfully) {
      throw new Error('Failed to place the order.');
    }

    // Show success message
    toast.success('COD Order placed successfully!');
    return true; // Indicate success
  } catch (error) {
    console.error('Error placing COD order:', error);
    
    // Show error message
    toast.error('Failed to place COD order. Please try again.');
    
    return false; // Indicate failure
  } finally {
    setLoading(false); // Set loading to false once all operations are complete or fail
  }
};
