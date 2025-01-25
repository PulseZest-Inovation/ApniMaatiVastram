import { placeOrder } from '../placeOrder';
import { generateOrderId } from '../genrateOrderId';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { toast } from 'react-toastify';
import { DeliverDetails } from '@/Types/data/DeliveryDetails';

// Handle the COD Order
export const handleCodOrder = async (
  deliveryDetails: DeliverDetails,
  totalAmount: number,
  setLoading: (loading: boolean) => void
): Promise<boolean> => {
  try {
    const orderId = generateOrderId(); // Generate unique order ID
    const cartDetails = await getAllDocsFromCollection('carts');
    const newOrderData = {
      ...deliveryDetails,
      ...cartDetails,
      status: 'Pending',
      orderId: orderId,
      totalAmount: totalAmount,
    };

    console.log(newOrderData);

    setLoading(true); // Set loading to true while placing the order
    await placeOrder(newOrderData); // Place the order in Firebase
    setLoading(false); // Set loading to false once done

    toast.success('COD Order placed successfully!'); // Success message
    return true; // Indicate success
  } catch (error) {
    console.error('Error placing COD order:', error);
    setLoading(false); // Set loading to false if there's an error
    toast.error('Failed to place COD order. Please try again.'); // Error message
    return false; // Indicate failure
  }
};
