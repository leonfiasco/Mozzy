import mongoose, { Document } from "mongoose";
import { ISubscription } from "../types";

const SubscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    subscriptionName: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    billingFrequency: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    dateOfExpiry: { type: Date, required: true },
    renewalReminder: { type: Boolean, default: true },
    reminderDaysBefore: { type: Number, default: 7 },
    category: { type: String, default: "general" },
    notes: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);
