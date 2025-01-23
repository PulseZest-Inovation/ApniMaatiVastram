// Helper to generate a unique order ID (UUID)
export const generateOrderId = (): string => {
    // Generate a unique numeric ID using timestamp and random number
    const timestamp = Date.now();  // Current timestamp in milliseconds
    const randomNum = Math.floor(Math.random() * 1000000000);  // Random number for uniqueness
    
    // Combine the timestamp and random number to create a unique ID
    const orderId = (timestamp + randomNum).toString();
  
    return orderId;
  };