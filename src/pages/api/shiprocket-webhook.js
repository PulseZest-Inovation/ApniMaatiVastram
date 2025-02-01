// pages/api/shiprocket-webhook.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      console.log('Received Shiprocket webhook data:', data);

      // Extract relevant data from the webhook payload
      const { order_id, status,  } = data;
// customer_email, customer_name, message
      // Define the email subject and message based on the order status
    //   let emailSubject = `Your Order #${order_id} Status Update`;
    //   let emailMessage = `Hello ${customer_name},\n\n${message}\n\nStatus: ${status}\nOrder ID: ${order_id}`;
    
      // Check status and set custom messages
      switch (status) {
        case 'Pending':
          emailMessage = `Your order #${order_id} is pending. We will notify you once it's processed.`;
          break;
        case 'Shipped':
          emailMessage = `Your order #${order_id} has been shipped. It’s on its way!`;
          break;
        case 'In-Transit':
          emailMessage = `Your order #${order_id} is in transit. We will update you once it's out for delivery.`;
          break;
        case 'Out for Delivery':
          emailMessage = `Your order #${order_id} is out for delivery. It should reach you soon!`;
          break;
        case 'Delivered':
          emailMessage = `Your order #${order_id} has been successfully delivered.`;
          break;
        case 'Failed':
          emailMessage = `There was an issue with the delivery of your order #${order_id}. Please contact support.`;
          break;
        case 'Return Initiated':
          emailMessage = `A return has been initiated for your order #${order_id}. We’ll keep you updated.`;
          break;
        case 'Return Delivered':
          emailMessage = `The return of your order #${order_id} has been successfully delivered back to us.`;
          break;
        case 'Canceled':
          emailMessage = `Your order #${order_id} has been canceled. If this is a mistake, please contact support.`;
          break;
        case 'Exception':
          emailMessage = `There is an issue with your order #${order_id}. Please check with support.`;
          break;
        case 'Pick-up Failed':
          emailMessage = `The pick-up for your order #${order_id} has failed. Please try again later.`;
          break;
        case 'Delivered to Alternate Address':
          emailMessage = `Your order #${order_id} was delivered to an alternate address.`;
          break;
        case 'Delivery Attempted':
          emailMessage = `A delivery attempt was made for your order #${order_id}. Please check your location for more details.`;
          break;
        default:
          emailMessage = `There has been an update on your order #${order_id}. Status: ${status}`;
          break;
      }

      // Send the email to the customer
   

      // Respond with a success status
      res.status(200).json({ message: 'Webhook received and processed successfully'  });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
