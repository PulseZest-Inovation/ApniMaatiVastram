import nodemailer from "nodemailer";
import { getEmailTemplate } from "./getemailtemplate";
import { ApplicationConfig } from "@/config/ApplicationConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { orderDetails, emailDetails, emailType } = req.body;

    // Validate required fields
    if (!orderDetails || !emailDetails || !emailType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { orderId, customerEmail, totalAmount, cartItems } = orderDetails;
    if (!orderId || !customerEmail || !totalAmount || !cartItems) {
      return res.status(400).json({ message: "Order details are incomplete." });
    }

    const {
      smtpServer,
      port,
      customEmail,
      password,
      googleEmail,
      appPassword,
      isEnabled,
    } = emailDetails;

    if (!isEnabled) {
      return res.status(403).json({ message: "Email service is disabled" });
    }

    // Fetch the email template dynamically based on emailType
    const emailTemplate = await getEmailTemplate(emailType);
    if (!emailTemplate) {
      return res.status(404).json({ message: `Email template for type '${emailType}' not found.` });
    }

    // Configure the transporter
    let transporterConfig;
    if (emailDetails.emailType === "google") {
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
    } else if (emailDetails.emailType === "custom") {
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

    // Replace placeholders in the email template
    const emailContent = emailTemplate
      .replace("{{orderId}}", orderId)
      .replace("{{customerName}}", orderDetails.fullName)
      .replace("{{companyEmail}}", ApplicationConfig.email)
      .replace("{{companyNumber}},", ApplicationConfig.phoneNumber)
      .replace("{{customerNumber}}", orderDetails.phoneNumber)
      .replace("{{Customeraddress}}", orderDetails.address)
      .replace("{{customerEmail}}", customerEmail)
      .replace("{{totalAmount}}", totalAmount)
      .replace(
        "{{orderDetails}}",
        cartItems
          .map((item) => `<li>${item.name} (x${item.quantity}) - $${item.price}</li>`)
          .join("")
      );

    const mailOptions = {
      from: emailDetails.emailType === "google" ? googleEmail : customEmail,
      to: customerEmail,
      subject: `${ApplicationConfig.applicationName} ${emailType.replace(/([A-Z])/g, " $1")}`, // Format emailType for subject
      html:  emailContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "Order created successfully and email sent", orderId });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
