import mongoose from "mongoose";

export const connectCollectionsDB = async function () {
  try {
    await mongoose.connect(process.env.MONGODB_COLLECTIONS_URI!);
    console.log("Access to the collections Database Granted");
  } catch (error) {
    console.error("Failed to connect to the collections Database: ", error);
  }
};

