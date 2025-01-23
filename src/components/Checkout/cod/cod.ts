import { placeOrder  } from '../placeOrder';
import { generateOrderId } from '../genrateOrderId';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';


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
export const handleCodOrder = async (deliveryDeatails: DeliverDetails) => {
  const orderId = generateOrderId(); // Generate unique order ID
  const cartDetails = await getAllDocsFromCollection('carts');
  const newOrderData ={
    ...deliveryDeatails,
    ...cartDetails,
    status: 'Pending',
    orderId: orderId,
  };

  console.log(newOrderData);

  // Place the order in Firebase
  placeOrder(newOrderData)
    .then(() => {
      console.log('COD Order placed successfully!');
      // You can show a success message or redirect user
    })
    .catch((error) => {
      console.error('Error placing COD order:', error);
      // Handle error gracefully
    });
};
