import nodemailer from "nodemailer";
import { generateOrderEmailTemplate } from "./gnerateEmailTemplate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { cartItems, emailDetails, orderId, customerEmail } = req.body;

    if (!cartItems || !emailDetails || !orderId || !customerEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const {
      emailType,
      smtpServer,
      port,
      customEmail,
      password,
      googleEmail,
      appPassword,
      emailList,
      isEnabled,
    } = emailDetails;

    if (!isEnabled) {
      return res.status(403).json({ message: "Email service is disabled" });
    }

    let transporterConfig;
    if (emailType === "google") {
      if (!googleEmail || !appPassword) {
        return res.status(500).json({ message: "Google email configuration is missing" });
      }
      transporterConfig = {
        service: "gmail",
        auth: {
          user: googleEmail,
          pass: appPassword,
        },
      };
    } else if (emailType === "custom") {
      if (!smtpServer || !customEmail || !password || !port) {
        return res.status(500).json({ message: "Custom email configuration is missing" });
      }
      transporterConfig = {
        host: smtpServer,
        port: parseInt(port, 10),
        secure: port === "465",
        auth: {
          user: customEmail,
          pass: password,
        },
      };
    } else {
      return res.status(400).json({ message: "Invalid email type" });
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    // Verify transporter
    await transporter.verify();

    const emailContent = generateOrderEmailTemplate({ orderId, customerEmail, cartItems });

    const mailOptions = {
      from: emailType === "google" ? googleEmail : customEmail,
      to: emailList?.join(", ") || customerEmail,
      subject: "New Order Received",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "Order created successfully and email sent", orderId });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
