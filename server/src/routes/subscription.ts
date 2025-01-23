// src/routes/subscription.ts
import express from "express";
import * as subscriptionController from "../controllers/subscription";
import protect from "../middleware/auth";
import User from "../models/user";

const router = express.Router();

router.post("/add", subscriptionController.addSubscription);
router.put("/edit/:id", subscriptionController.editSubscription);
router.delete("/delete/:id", subscriptionController.deleteSubscription);
router.get("/view/:id", subscriptionController.getUserSubscriptions);

export default router;
