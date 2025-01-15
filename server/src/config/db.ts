import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.2vecp.mongodb.net/`
    );
    console.log("MongoDB connection successful");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
