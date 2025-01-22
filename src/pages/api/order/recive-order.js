// pages/api/createOrder.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Ensure the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Destructure order details from the request body
    const {
      orderID,
      customerName,
      customerEmail,
      customerPhoneNumber,
      orderType,
      transactionId,
      orderDetails,
    } = req.body;

    // Validate the presence of required fields
    if (!orderID || !customerName || !customerEmail || !customerPhoneNumber || !orderType || !orderDetails) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate orderDetails which should be an array of CartItem objects
    if (!Array.isArray(orderDetails)) {
      return res.status(400).json({ message: 'Order details must be an array' });
    }

    for (const item of orderDetails) {
      // Destructure cart item properties from the orderDetails
      const {
        id,
        productTitle,
        productSubtitle,
        slug,
        price,
        quantity,
        image,
      } = item;

      // Validate CartItem structure
      if (!id || !productTitle || !price || !quantity || !image) {
        return res.status(400).json({ message: 'Missing required cart item fields' });
      }
    }

    // Here, you would typically insert the order into a database or perform business logic
    // Simulating an order insertion
    const newOrder = {
      orderID,
      customerName,
      customerEmail,
      customerPhoneNumber,
      orderType,
      transactionId,
      orderDetails,
      status: 'Order Created',
      createdAt: new Date(),
    };

    // Set up nodemailer to send email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail as the email service provider
      auth: {
        user: 'techchauhan235@gmail.com', // Replace with your email
        pass: 'pobu gwor pasg hgfq', // Use your email password or application-specific password
      },
    });

    // Compose the email message
    const mailOptions = {
      from: 'techchauhan235@gmail.com', // Sender's email
      to: 'rishabkumarchauhan@gmail.com', // Recipient's email
      subject: 'Received New Order', // Email subject
      html: `
        <h1>Order Details</h1>
        <p><strong>Order ID:</strong> ${orderID}</p>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Customer Email:</strong> ${customerEmail}</p>
        <p><strong>Customer Phone:</strong> ${customerPhoneNumber}</p>
        <p><strong>Order Type:</strong> ${orderType}</p>
        ${transactionId ? `<p><strong>Transaction ID:</strong> ${transactionId}</p>` : ''}
        <h2>Order Items:</h2>
        <ul>
          ${orderDetails
            .map(
              (item) => `
                <li>
                  <strong>${item.productTitle}</strong><br>
                  ${item.productSubtitle}<br>
                  <strong>Price:</strong> $${item.price} <br>
                  <strong>Quantity:</strong> ${item.quantity}<br>
                  <strong>Total:</strong> $${(item.price * item.quantity).toFixed(2)}<br>
                </li>`
            )
            .join('')}
        </ul>
        <p><strong>Status:</strong> ${newOrder.status}</p>
        <p><strong>Created At:</strong> ${newOrder.createdAt}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Respond with the created order data
    return res.status(201).json({ message: 'Order created successfully and email sent', order: newOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
