import { generateOrderId } from '../genrateOrderId';
import { getAllDocsFromCollection } from '@/service/Firebase/getFirestore';
import { toast } from 'react-toastify';
import { DeliverDetails } from '@/Types/data/DeliveryDetails';

// Handle the Online Order
export const handleOnlineOrder = async (
  deliveryDetails: DeliverDetails,
  totalAmount: number
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

    // Payment data to send to the API
    const paymentData = {
      user_id: deliveryDetails.customerId, // Use the generated order ID as user_id for this case
      price: totalAmount,
      phone: deliveryDetails.phoneNumber,
      name: deliveryDetails.fullName,
    };

    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (response.ok) {
      const responseData = await response.json();

      if (responseData.success && responseData.paymentUrl) {
        // Return the payment URL for redirection
        window.location.href = responseData.paymentUrl;
        return true;
      } else {
        toast.error('Failed to get payment URL');
        return false;
      }
    } else {
      toast.error('Payment initiation failed');
      return false;
    }
  } catch (error) {
    console.error('Error handling online order:', error);
    toast.error('An error occurred while processing the order');
    return false;
  }
}
