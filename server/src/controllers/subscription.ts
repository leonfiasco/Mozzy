import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/custom";
import Subscription from "../models/subscription";

export const addSubscription = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const subscription = await Subscription.create({
      userId: user._id,
      ...req.body,
    });

    return res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};

export const editSubscription = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: id, userId: user._id },
      req.body,
      { new: true }
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json(updatedSubscription);
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response<any>> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subscription ID" });
    }

    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      data: deletedSubscription,
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    next(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserSubscriptions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response<any>> => {
  try {
    if (!req?.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user?.id;

    const subscriptions = await Subscription.find({ user: userId });

    return res.status(200).json({
      success: true,
      message: "Subscriptions retrieved successfully",
      data: subscriptions,
    });
  } catch (error) {
    console.error("Error retrieving subscriptions:", error);
    next(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
