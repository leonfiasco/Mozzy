import mongoose, { Document, Schema } from "mongoose";
import { IUser as IUserType } from "../types"; // Import IUser from the types file for better separation

// Define the User schema
const UserSchema: Schema<IUserType> = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    unique: false,
  },
  lastName: {
    type: String,
    unique: false,
  },
  email: {
    type: String,
    unique: true,
  },
  password: { type: String },
  verified: { type: Boolean, default: false },
  resetToken: { type: String, required: false },
  resetTokenExpiration: { type: Date, required: false },
});

// Create and export the User model
const User = mongoose.model<IUserType>("User", UserSchema);

export default User; // Default export for the model
export { IUserType }; // Named export for the IUser interface
