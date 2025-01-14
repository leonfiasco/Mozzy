import express from "express";
const router = express.Router();

const subscriptionController = require("../controllers/subscription");

router.post("/subscription/add", subscriptionController.add_new_subscription);
