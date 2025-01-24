import { generateOrderId } from '../genrateOrderId';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { toast } from 'react-toastify';

interface DeliverDetails {
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
export const handleOnlineOrder = async (
  deliveryDetails: DeliverDetails,
  totalAmount: number,
  setLoading: (loading: boolean) => void
) => {
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

    // Here redirect to the payment page.. after getting the success status.. run the given placeOrder function..

   
    // await placeOrder(newOrderData); // Place the order in Firebase
    setLoading(false); // Set loading to false once done

    toast.success('COD Order placed successfully!'); // Success message
  } catch {
    setLoading(false); // Set loading to false if there's an error
  }
};
