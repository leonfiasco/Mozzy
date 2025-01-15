import mongoose, { Document } from "mongoose";

import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      headers: {
        authorization?: string;
        [key: string]: string | undefined; // Allow other header keys
      };
    }
  }
}

export interface ISubscription extends Document {
  _id: mongoose.Types.ObjectId; // Unique ID for the subscription
  subscriptionName: string; // Name of the subscription (e.g., Netflix, Spotify)
  price: number; // Monthly or yearly subscription cost
  currency: string; // Currency for the price (e.g., USD, GBP)
  billingFrequency: "monthly" | "yearly"; // How often the subscription is billed
  dateOfExpiry: Date; // When the current subscription period ends
  renewalReminder: boolean; // Whether the user wants a renewal reminder
  reminderDaysBefore: number; // Days before expiry to send a reminder
  category: string; // Category (e.g., entertainment, productivity, fitness)
  notes?: string; // Optional notes about the subscription
  user: mongoose.Types.ObjectId; // Reference to the user who owns this subscription
  createdAt: Date; // Date when the subscription was added to the system
  updatedAt: Date; // Last updated date
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verified: boolean;
  resetToken?: string;
  resetTokenExpiration?: Date | number | null;
}

interface IMongooseValidatorError {
  validator: () => boolean;
  message: string;
  type: string;
  path: string;
  fullPath?: string;
  value: any;
}

interface IMongooseValidationError {
  properties: IMongooseValidatorError;
  kind: string;
  path: string;
  value: any;
  reason?: any;
  "mongoose#validatorError": boolean; // Use a string as a symbol-like identifier
}

export interface IMyValidationError extends Error {
  name: "ValidationError";
  errors: {
    [key: string]: IMongooseValidationError;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
