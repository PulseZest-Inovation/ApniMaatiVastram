import { getShiprocketSetting } from "./getShipRocketSetting";
import { ShipRocketLoginType } from "@/Types/data/ShipRocketLoginType";
import { OrderType } from "@/Types/data/OrderType";

import { message } from "antd";

interface ShipData {
  token: string;
  shipRocketPickup: string | null;
  channelId: string;
}

// Function to get the Shiprocket token and pickup location
const getShipData = async (): Promise<ShipData> => {
  try {
    const shipdata: ShipRocketLoginType | null = await getShiprocketSetting();

    if (!shipdata?.email || !shipdata?.password || !shipdata.channelId) {
      throw new Error("Missing Shiprocket credentials");
    }
    const channelId = shipdata.channelId;

    // Generate Shiprocket token
    const tokenResponse = await fetch("https://ecommerce-with-pulsezest.vercel.app/api/shiprocket/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: shipdata.email, password: shipdata.password }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.token) {
      throw new Error("Failed to retrieve Shiprocket token");
    }

    const token = tokenData.token;

    // Fetch pickup location
    const pickupResponse = await fetch("https://ecommerce-with-pulsezest.vercel.app/api/shiprocket/get-shiprocket-pickup", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const pickupData = await pickupResponse.json();
    if (!pickupResponse.ok || !pickupData.pickupData?.data?.shipping_address?.length) {
      throw new Error("Failed to fetch Shiprocket pickup details");
    }

    const shipRocketPickup = pickupData.pickupData.data.shipping_address[0].pickup_location;

    if (!shipRocketPickup) {
      throw new Error("Pickup location is empty.");
    }

    return { token, shipRocketPickup, channelId };
  } catch (error) {
    console.error("Error getting Shiprocket data:", error);
    message.error("An error occurred while retrieving Shiprocket data.");
    throw error;
  }
};

// Function to handle confirmed order status and send order to Shiprocket
const handleConfirmedStatusUpdate = async (order: OrderType): Promise<boolean> => {
  try {
    const { token, shipRocketPickup, channelId } = await getShipData();

    if (!shipRocketPickup) {
      throw new Error("Pickup location not found.");
    }

    let totalVolume = 0;
    let totalWeight = 0;

    order.orderDetails.forEach(item => {
      const itemLength = item.length || 1;
      const itemBreadth = item.breadth || 1;
      const itemHeight = item.height || 1;
      const itemWeight = item.weight || 0.5;
      const quantity = item.quantity || 1;

      totalVolume += itemLength * itemBreadth * itemHeight * quantity;
      totalWeight += itemWeight * quantity;
    });

    // Calculate approximate box dimensions
    const cubicRoot = Math.cbrt(totalVolume);
    const finalLength = Math.ceil(cubicRoot);
    const finalBreadth = Math.ceil(cubicRoot);
    const finalHeight = Math.ceil(cubicRoot);

    // Shiprocket order payload
    const orderDetails = {
      channel_id: channelId,
      order_id: order.orderId,
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: shipRocketPickup,
      billing_customer_name: order.fullName,
      billing_last_name: "",
      billing_address: order.address,
      billing_city: order.city,
      billing_pincode: order.pinCode,
      billing_state: order.state,
      billing_country: order.country,
      billing_email: order.email,
      billing_phone: order.phoneNumber,
      shipping_is_billing: true,
      order_items: order.orderDetails.map(item => ({
        name: item.productTitle,
        sku: item.sku || "TSHIRT123",
        units: item.quantity || 1,
        selling_price: item.price || 0,
        discount: item.discount || 0,
        tax: item.tax || "18",
        hsn: item.hsn || "6109",
      })),
      payment_method: order.type,
      sub_total: order.totalAmount,
      length: finalLength.toString(),
      breadth: finalBreadth.toString(),
      height: finalHeight.toString(),
      weight: totalWeight.toFixed(2),
    };

    console.log("Final Order Payload:", orderDetails);

    // Send order to Shiprocket API
    const response = await fetch("https://ecommerce-with-pulsezest.vercel.app/api/shiprocket/create-shiprocket-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderDetails),
    });

    const data = await response.json();
    console.log("Order Response:", data);

    if (!response.ok || !data) {
      throw new Error("Failed to create Shiprocket order");
    }

    console.log("Order created successfully:", data);
    return true;
  } catch (error) {
    console.error("Error:", error);
    message.error("Failed to create Shiprocket order.");
    return true;
  }
};

export { handleConfirmedStatusUpdate };
