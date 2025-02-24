import mongoose from "mongoose";

// Database connection function
async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mydatabase");

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process if connection fails
  }
}
