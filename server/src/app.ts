require("dotenv").config({ path: "./config.env" });

import express from "express";
import http from "http";
import morgan from "morgan";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";

import connectDB from "./config/db";
import CustomError from "./errors/CustomError";
import errorHandler from "./middleware/error";

import subscriptionRoutes from "./routes/subscription";
import userAuthRoutes from "./routes/auth/user";

const app = express();

connectDB();

app.use(compression());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/user", userAuthRoutes);
app.use("/subscription", subscriptionRoutes);

// handles all non existing routes
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
