import { IUserType } from "../models/user"; // Correct named import for the IUser interface

export interface AuthenticatedRequest extends Request {
  params: { id: any };
  user?: IUserType; // Adjust the type of user based on your middleware implementation
}
