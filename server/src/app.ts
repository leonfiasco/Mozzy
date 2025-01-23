require("dotenv").config({ path: "./config.env" });

import express from "express";
import http from "http";
import morgan from "morgan";
import cors from "cors";

import connectDB from "./config/db";
import CustomError from "./errors/CustomError";
import errorHandler from "./middleware/error";

import subscriptionRoutes from "./routes/subscription";
import userAuthRoutes from "./routes/auth/user";
import gmailRoutes from "./routes/gmail/gmail";

const app = express();

connectDB();

app.use(express.json()); // Use Express' built-in body parser for JSON
app.use(express.urlencoded({ extended: true })); // Use Express' built-in URL-encoded parser
app.use(morgan("dev")); // HTTP request logger
app.use(cors()); // Enable CORS for all routes

// Route Handlers
app.use("/user", userAuthRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/gmail", gmailRoutes);

// Handles all non-existing routes
app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

// Error Handler (Should be last middleware)
app.use(errorHandler);

const server = http.createServer(app);

const port = process.env.PORT || 2402;

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

export default app;
