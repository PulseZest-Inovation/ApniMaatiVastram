import { useRouter } from 'next/router';
import { placeOrder,  } from '../placeOrder';
import { generateOrderId } from '../genrateOrderId';

// Handle redirection to the payment page
export const handleOnlineOrder = (orderData: any) => {
  const orderId = generateOrderId();
  const newOrderData = {
    ...orderData,
    orderId,
    paymentMethod: 'online',
    createdAt: new Date(),
  };

  // Redirect to the payment page (you can pass order details along)
  const router = useRouter();
  router.push({
    pathname: '/paymentPage',
    query: {
      orderId: orderId,
      amount: calculateAmount(orderData),  // Add your calculation logic here
      // other relevant data for payment gateway
    },
  });

  // After successful payment, call placeOrder function with transaction ID
  // Assume that you will get the transaction ID from the payment success callback
  const handlePaymentSuccess = (transactionId: string) => {
    const finalOrderData = {
      ...newOrderData,
      transactionId,
    };

    placeOrder(finalOrderData)
      .then(() => {
        console.log('Online Order placed successfully!');
        // You can show a success message or redirect the user
      })
      .catch((error) => {
        console.error('Error placing online order:', error);
        // Handle error gracefully
      });
  };
};

// Example of calculating the amount (you should add your calculation logic)
const calculateAmount = (orderData: any) => {
  return orderData.orderDetails.reduce((total: number, item: any) => total + item.price * item.quantity, 0);
};
