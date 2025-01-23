import { ApplicationConfig } from "@/config/ApplicationConfig";

interface CartItem {
  productTitle: string;
  price: number;
  quantity: number;
}

interface EmailTemplateProps {
  orderId: string;
  customerEmail: string;
  cartItems: CartItem[];
  totalAmount: number;
}

export const generateOrderEmailTemplate = ({ orderId, customerEmail, cartItems, totalAmount }: EmailTemplateProps): string => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            font-size: 24px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          h2 {
            color: #555;
            font-size: 20px;
            margin-top: 10px;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          strong {
            font-weight: bold;
          }
          .total {
            font-size: 16px;
            font-weight: bold;
            color: #f15b5b;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #f15b5b;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            text-align: center;
            color: #888;
          }
          .credit {
            margin-top: 20px;
            font-size: 12px;
            text-align: center;
            color: #888;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Recived New Order 🎉</h1>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer Email:</strong> ${customerEmail}</p>
          <h2>Cart Items:</h2>
          <ul>
            ${cartItems
              .map(
                (item) => `
              <li>
                <strong>${item.productTitle}</strong><br>
                <strong>Price:</strong> ₹${item.price} <br>
                <strong>Quantity:</strong> ${item.quantity}<br>
                <strong>Total:</strong> ₹${(item.price * item.quantity).toFixed(2)}<br>
              </li>`
              )
              .join("")}
          </ul>
          <p class="total">Total: ₹${totalAmount}</p>
          <p><strong>Status:</strong> Pending</p>
          <p><strong>Created At:</strong> ${new Date().toLocaleString()}</p>
          
          <a href="https://ecommerce-with-pulsezest.vercel.app/dashboard/orders/view-all-orders" class="button">
            View Order Details
          </a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()}  ${ApplicationConfig.applicationName} . All rights reserved.</p>
        </div>
        <div class="credit">
          <p>PulseZest 🚀 Notification System</p>
          <p>support@pulsezest.com</p>
        </div>
      </body>
    </html>
  `;
};
