// import { Request, Response, NextFunction } from "express";
// import { google } from "googleapis";
// import {
//   generateAuthUrl,
//   getGmailMessages as fetchMessages,
// } from "../../services/googleEmailServices";

// // Google OAuth2 setup
// const oauth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );

// // Redirect the user to the Google OAuth consent page
// export const redirect = (_req: Request, res: Response, next: NextFunction) => {
//   try {
//     const authUrl = generateAuthUrl(oauth2Client);
//     console.log("Generated OAuth URL:", authUrl); // Log for testing
//     res.redirect(authUrl); // Redirect the user to the Google OAuth consent page
//   } catch (error) {
//     console.error("Error generating OAuth URL:", error); // Log for debugging
//     res.status(500).json({ message: "Failed to generate OAuth URL", error });
//     next(error);
//   }
// };

// // Handle Google OAuth callback
// export const handleOauth = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { code } = req.query;

//     if (!code) {
//       console.error("No authorization code provided");
//       return res.status(400).json({ message: "Authorization code is missing" });
//     }

//     const { tokens } = await oauth2Client.getToken(code as string);
//     oauth2Client.setCredentials(tokens);

//     // Store the access token in session
//     // req.session.accessToken = tokens.access_token;

//     console.log("🔥", req.session);

//     console.log("OAuth Tokens received:", tokens);
//     res.status(200).json({
//       message: "Authentication successful",
//       tokens,
//     });
//   } catch (error) {
//     console.error("Error handling OAuth callback:", error);
//     res.status(500).json({ message: "Failed to handle OAuth callback", error });
//     next(error);
//   }
// };

// // Fetch Gmail messages
// export const getGmailMessages = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Retrieve the access token from the session
//     const accessToken = req.session.accessToken;

//     if (!accessToken) {
//       return res.status(400).json({ message: "Access token not found" });
//     }

//     oauth2Client.setCredentials({ access_token: accessToken });

//     const gmail = google.gmail({ version: "v1", auth: oauth2Client });
//     const response = await gmail.users.messages.list({ userId: "me" });

//     res.status(200).json({
//       message: "Messages fetched successfully",
//       messages: response.data.messages,
//     });
//   } catch (error) {
//     console.error("Error fetching Gmail messages:", error);
//     res.status(500).json({ message: "Failed to fetch Gmail messages", error });
//     next(error);
//   }
// };
