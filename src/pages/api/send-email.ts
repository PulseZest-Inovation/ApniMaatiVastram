import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { getEmailTemplate } from "./getemailtemplate";
import { ApplicationConfig } from "@/config/ApplicationConfig";
import Cors from "cors";

// Initialize CORS middleware

const allowedOrigins = [
  "http://localhost:3000",
  "https://apnimaativastram.com",
  "https://ecommerce-with-pulsezest.vercel.app",
  "https://ecommerce.pulsezest.com",
];

const cors = Cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST"],
  allowedHeaders: ["Content-Type"],
});

// Middleware to run CORS before request handling
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors); // Enable CORS

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { orderDetails, emailDetails, emailType } = req.body;

    if (!orderDetails || !emailDetails || !emailType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { orderId, customerEmail, totalAmount, cartItems, fullName, phoneNumber, address } =
      orderDetails;

    if (!orderId || !customerEmail || !totalAmount || !cartItems || !fullName || !phoneNumber) {
      return res.status(400).json({ message: "Order details are incomplete." });
    }

    const { smtpServer, port, customEmail, password, googleEmail, appPassword, isEnabled, emailType: emailProvider } = emailDetails;

    if (!isEnabled) {
      return res.status(403).json({ message: "Email service is disabled" });
    }

    // Fetch the email template dynamically based on emailType
    const emailTemplate = await getEmailTemplate(emailType);
    if (!emailTemplate) {
      return res.status(404).json({ message: `Email template for type '${emailType}' not found.` });
    }

    // Configure transporter
    let transporterConfig;
    if (emailProvider === "google") {
      if (!googleEmail || !appPassword) {
        return res.status(500).json({ message: "Google email configuration is missing" });
      }
      transporterConfig = {
        service: "gmail",
        auth: { user: googleEmail, pass: appPassword },
      };
    } else if (emailProvider === "custom") {
      if (!smtpServer || !customEmail || !password || !port) {
        return res.status(500).json({ message: "Custom email configuration is missing" });
      }
      transporterConfig = {
        host: smtpServer,
        port: parseInt(port, 10),
        secure: port === "465",
        auth: { user: customEmail, pass: password },
      };
    } else {
      return res.status(400).json({ message: "Invalid email provider type" });
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    // Verify transporter connection
    try {
      await transporter.verify();
    } catch (err: any) {
      console.error("Error verifying transporter:", err);
      return res.status(500).json({ message: "Email server configuration error", error: err.message });
    }

    // Replace placeholders in the email template
    const emailContent = emailTemplate
      .replace("{{orderId}}", orderId)
      .replace("{{customerName}}", fullName)
      .replace("{{companyEmail}}", ApplicationConfig.email)
      .replace("{{companyNumber}}", ApplicationConfig.phoneNumber)
      .replace("{{customerNumber}}", phoneNumber)
      .replace("{{Customeraddress}}", address)
      .replace("{{customerEmail}}", customerEmail)
      .replace("{{totalAmount}}", totalAmount.toString())
      .replace(
        "{{orderDetails}}",
        cartItems
          .map((item: any) => `<li>${item.productTitle} (x${item.quantity}) - $${item.price}</li>`)
          .join("")
      );

    const mailOptions = {
      from: emailProvider === "google" ? googleEmail : customEmail,
      to: customerEmail,
      subject: `${ApplicationConfig.applicationName} ${emailType.replace(/([A-Z])/g, " $1")}`, // Format emailType for subject
      html: emailContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "Email sent successfully", orderId });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
