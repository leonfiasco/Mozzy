import { OAuth2Client } from "googleapis-common";
import { google } from "googleapis";

export const generateAuthUrl = (oauth2Client: any) => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"], // Scopes required for Gmail API
    prompt: "consent", // Ensures refresh token is issued
  });
};

export async function getGmailMessages(oauth2Client: OAuth2Client) {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const res = await gmail.users.messages.list({ userId: "me" });
  return res.data.messages;
}

export default getGmailMessages;
