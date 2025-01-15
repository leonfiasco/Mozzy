import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import Subscription from "../models/subscription";

// Add a new subscription
export const addSubscription = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req?.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;

    const {
      subscriptionName,
      price,
      currency,
      billingFrequency,
      dateOfExpiry,
      renewalReminder,
      reminderDaysBefore,
      category,
      notes,
    } = req.body;

    if (
      !subscriptionName ||
      !price ||
      !currency ||
      !billingFrequency ||
      !dateOfExpiry
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    console.log("🔥🇬🇭", userId);

    const newSubscription = new Subscription({
      subscriptionName,
      price,
      currency,
      billingFrequency,
      dateOfExpiry,
      renewalReminder: renewalReminder ?? true,
      reminderDaysBefore: reminderDaysBefore ?? 7,
      category: category || "general",
      notes,
      user: userId,
    });

    const savedSubscription = await newSubscription.save();

    res.status(201).json({
      message: "Subscription created successfully",
      data: savedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

// Edit an existing subscription
export const editSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({
      message: "Subscription updated successfully",
      data: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a subscription
export const deleteSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({
      message: "Subscription deleted successfully",
      data: deletedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

// Get all subscriptions
export const get_aSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const subscriptions = await Subscription.find(); // Fetch all subscriptions
    res.status(200).json({
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const get_userSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const userId = req.user.id; // Extract user ID from the authenticated request

    // const subscriptions = await Subscription.find({ user: userId });

    res.status(200).json({
      message: "Subscriptions retrieved successfully",
      // data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};
