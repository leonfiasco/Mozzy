import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import CustomError from "../errors/CustomError";
import { IUser } from "../types";
import { Model } from "mongoose";

const protect =
  (model: Model<IUser>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

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
