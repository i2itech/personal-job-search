import mongoose from "mongoose";
import appConfig from "../../app/config";

let isConnected = false;
// Database connection function
async function connectDB() {
  try {
    await mongoose.connect(appConfig().mongodb.url);
    isConnected = true;

    // Handle application shutdown
    process.on("SIGINT", async () => {
      await disconnectDB();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await disconnectDB();
      process.exit(0);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Let the caller handle the error
  }
}

async function disconnectDB() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
  } catch (error) {
    console.error("Error while disconnecting MongoDB:", error);
    throw error;
  }
}

export async function useDB<T>(callback: () => Promise<T>): Promise<T> {
  await connectDB();
  try {
    return await callback();
  } finally {
    await disconnectDB();
  }
}
