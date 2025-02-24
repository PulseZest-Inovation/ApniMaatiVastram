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
  orderType: string;
}

export const generateOrderEmailTemplate = ({
  orderId,
  customerEmail,
  cartItems,
  totalAmount,
  orderType,
}: EmailTemplateProps): string => {
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
          .table-container {
            margin-top: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f8f8f8;
            font-weight: bold;
          }
          .total {
            font-size: 16px;
            font-weight: bold;
            color: #f15b5b;
            margin-top: 10px;
          }
          .status {
            font-size: 14px;
            font-weight: bold;
            color: ${orderType === "COD" ? "#f15b5b" : "#28a745"};
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
          <h1>New Order Received 🎉</h1>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer Email:</strong> ${customerEmail}</p>

          <h2>Order Details:</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${cartItems
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.productTitle}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price}</td>
                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <p class="total">Total: ₹${totalAmount.toFixed(2)}</p>
          <p><strong>Payment Status:</strong> <span class="status">${orderType === "COD" ? "Not Paid" : "Paid"}</span></p>
          <p><strong>Status:</strong> Pending</p>
          <p><strong>Created At:</strong> ${new Date().toLocaleString()}</p>
          
          <a href="https://ecommerce-with-pulsezest.vercel.app/dashboard/orders/view-all-orders" class="button">
            View Order Details
          </a>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${ApplicationConfig.applicationName}. All rights reserved.</p>
        </div>

        <div class="credit">
          <p>PulseZest 🚀 Notification System</p>
          <p>support@pulsezest.com</p>
        </div>
      </body>
    </html>
  `;
};
