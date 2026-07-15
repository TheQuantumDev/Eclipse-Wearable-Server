import mongoose from "mongoose";

let ordersConnection: mongoose.Connection | null = null;

export const connectOrdersDB = async function () {
  try {
    // Only connect if not already connected
    if (!ordersConnection) {
      ordersConnection = mongoose.createConnection(
        process.env.MONGODB_ORDERS_URI!,
      );

      ordersConnection.on("connected", () => {
        console.log("Access to the orders Database Granted");
      });

      ordersConnection.on("error", (err) => {
        console.error("❌ Orders DB connection error:", err);
      });
    }
    return ordersConnection;
  } catch (error) {
    console.error("Failed to connect to the orders Database: ", error);
    throw error;
  }
};

// Helper to get the orders connection
export const getOrdersDB = () => {
  if (!ordersConnection) {
    throw new Error(
      "Orders database not connected. Call connectOrdersDB() first.",
    );
  }
  return ordersConnection;
};
