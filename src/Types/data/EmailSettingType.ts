export interface EmailSettings {
  emailType: "custom" | "google";
  smtpServer?: string;
  port?: string;
  customEmail?: string;
  password?: string;
  googleEmail?: string;
  appPassword?: string;
  isEnabled?: boolean;
  emailList?: string[];
  OrderCancelled? : string;
  OrderConfirmed? : string;
  OrderDelivered? : string;
  OrderPlaced? : string;
  OrderProcessing? : string;
}
