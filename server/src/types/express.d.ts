import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      accessToken?: string;
      // Add other fields if necessary, e.g., refreshToken, id, etc.
    };
  }
}
