import express from "express";
import * as subscriptionController from "../controllers/subscription";
import protect from "../middleware/auth";
import User from "../models/user";

const router = express.Router();

router.post("/add", protect(User), subscriptionController.addSubscription);

// Other routes
router.put("/edit/:id", protect(User), subscriptionController.editSubscription);
router.delete(
  "/delete/:id",
  protect(User),
  subscriptionController.deleteSubscription
);
router.get("/view/:id", subscriptionController.get_aSubscription);

export default router;
