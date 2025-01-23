import express from "express";
import * as gmailController from "../../controllers/gmail/gmail";

const router = express.Router();

router.get("/auth/google", gmailController.redirect);

router.get("/oauth2callback", gmailController.handleOauth);

router.get("/messages", gmailController.getGmailMessages);

export default router;
