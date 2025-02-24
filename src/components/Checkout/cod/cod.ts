import { placeOrder } from '../placeOrder';
import { getAllDocsFromSubCollection } from '@/service/Firebase/getFirestore';
import { toast } from 'react-toastify';
import { DeliverDetails } from '@/Types/data/DeliveryDetails';
import { fetchEmailDetails } from '@/utils/getSendingEmail';

export const handleCodOrder = async (
  deliveryDetails: DeliverDetails,
  totalAmount: number,
  orderId: string,
  setLoading: (loading: boolean) => void
): Promise<boolean> => {
  setLoading(true); // Start loading state immediately

  try {
    // Fetch cart details
    const cartDetails = await getAllDocsFromSubCollection('customers', deliveryDetails.customerId ,"cart");

    // Prepare email request data
    const emailDetail = await fetchEmailDetails();
    if (!emailDetail || !emailDetail.isEnabled) {
      toast.error('Email service is disabled or email details are missing.');
      return false; // Exit early if email details are missing
    }

    const emailRequestBody = {
      orderDetails: {
        orderId,
        customerEmail: deliveryDetails.email,
        totalAmount,
        cartItems: cartDetails, // Ensure `cartDetails` is valid
        fullName: deliveryDetails.fullName,
        phoneNumber: deliveryDetails.phoneNumber,
        address: deliveryDetails.address,
        orderType: 'COD'
      },
      emailDetails: emailDetail,
      emailType: 'Pending', // Email type must match the backend handler's logic
    };

    // Send email first
    const emailResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailRequestBody),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.json();
      console.error('Email sending failed:', error);
      toast.error(`Failed to send email: ${error.message}`);
      return false; // Exit early if email sending fails
    }

    // Proceed to place the order
    const newOrderData = {
      ...deliveryDetails,
      status: 'Pending',
      orderId: orderId,
      totalAmount: totalAmount,
      type: 'COD'
    };

    const orderPlacedSuccessfully = await placeOrder(newOrderData);

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
