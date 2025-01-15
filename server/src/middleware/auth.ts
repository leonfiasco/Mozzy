import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import CustomError from "../errors/CustomError";
import { IUser } from "../types";
import { Model } from "mongoose";
import { AuthenticatedRequest } from "../types";

const protect =
  (model: Model<IUser>) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    // Access 'authorization' header safely
    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    }

    if (!token) {
      return next(new CustomError("Not authorized to access this route", 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return next(
          new CustomError("Token has expired. Please login again", 401)
        );
      }

      const user = await model.findById(decoded.id);

      if (!user) {
        return next(new CustomError("No user found with this ID", 404));
      }

      req.user = user; // Attach the user to the request
      next();
    } catch (error) {
      next(new CustomError("Not authorized to access this route", 401));
    }
  };

export default protect;
