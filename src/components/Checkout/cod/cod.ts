import { placeOrder  } from '../placeOrder';
import { generateOrderId } from '../genrateOrderId';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { toast } from 'react-toastify';


interface DeliverDetails{
    fullName: string;
    country: string;
    state: string;
    address: string;
    apartment: string;
    houseNumber: string;
    city: string;
    pinCode: string;
    phoneNumber: string;
}

// Handle the COD Order
export const handleCodOrder = async (deliveryDeatails: DeliverDetails, setLoading: (loading: boolean) => void) => {
  try {
    const orderId = generateOrderId(); // Generate unique order ID
    const cartDetails = await getAllDocsFromCollection('carts');
    const newOrderData = {
      ...deliveryDeatails,
      ...cartDetails,
      status: 'Pending',
      orderId: orderId,
    };

    console.log(newOrderData);

    setLoading(true); // Set loading to true while placing the order
    await placeOrder(newOrderData); // Place the order in Firebase
    setLoading(false); // Set loading to false once done

    toast.success('COD Order placed successfully!'); // Success message
  } catch (error) {
    setLoading(false); // Set loading to false if there's an error
    toast.error('Error placing COD order. Please try again later.'); // Error message
    console.error('Error placing COD order:', error);
  }
};
