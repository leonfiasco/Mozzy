import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import path from "path";
import Joi from "joi";

import User from "../../models/user";
import Token from "../../models/token";

import { sendEmail } from "../../utils/sendEmail";
import CustomError from "../../errors/CustomError";
import asyncErrorHandler from "../../utils/AsyncErrorHandler";

// setting servery url for production
const development = "http://localhost:2402";
const production = "http://tba/port";
const currentUrl = process.env.NODE_ENV ? production : development;

exports.user_register = asyncErrorHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const registerSchema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30).required(),
    });

    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw error;
    }

    const { firstName, lastName, email, password } = value;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      throw new CustomError("User with this email already exists.", 403);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: passwordHash,
    });

    const user = await newUser.save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${currentUrl}/user/${user._id}/verify/${token.token}`;

    const html = `<p>Verify your email address to complete the signup and login into your account.</p>
						<p>This link<b> expires in 1 hour</b>.</p><p>Press <a href=${url}>here</a> to proceed.</p>
						<p>${url}</p>
						`;

    await sendEmail(user, "Verify Email", html);

    res.status(201).json({
      success: true,
      user: newUser,
    });
  }
);

exports.user_verfiy = asyncErrorHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw new CustomError("Invalid User Link.", 498);

    const token = await Token.findOne({
      userId: req.params.id,
      token: req.params.token,
    });

    if (!token) throw new CustomError("Invalid token Link.", 498);

    const currentTime = Date.now();
    const tokenExpirationTime = token.createdAt.getTime() + 3600 * 1000; // 1 hour in milliseconds

    if (currentTime > tokenExpirationTime) {
      await token.deleteOne();
      throw new CustomError("Token has expired.", 498);
    }

    await User.updateOne({ _id: user._id, verified: true });

    await token.deleteOne();

    res.sendFile(path.join(__dirname, "../../views/verified.html"));
  }
);

exports.user_resendVerification = asyncErrorHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { userId, email } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) throw new CustomError("Invalid user Link.", 498);

    const existingToken = await Token.findOne({
      userId: userId,
    });

    if (!existingToken) throw new CustomError("Invalid token Link.", 498);

    if (!email || !userId) {
      throw new CustomError("Empty user details are not allowed.", 403);
    } else {
      const newTokenValue = crypto.randomBytes(32).toString("hex");

      await existingToken.updateOne({ token: newTokenValue });

      const url = `${currentUrl}/user/${userId}/verify/${newTokenValue}`;

      const html = `<p>Verify your email address to complete the signup and login into your account.</p>
                        <p>This link<b> expires in 1 hour</b>.</p><p>Press <a href=${url}>here</a> to proceed.</p>
                        <p>${url}</p>
                        `;

      await sendEmail(user, "Verify Email", html);
      res.status(200).json({
        message: "Verification email has been resent",
      });
    }
  }
);

exports.user_login = asyncErrorHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30).required(),
    });

    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw error;
    }

    const { email, password } = value;

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!existingUser) {
      throw new CustomError(
        "No account with this username or password has been registered.",
        403
      );
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      throw new CustomError("Invalid credentials.", 401);
    }

    if (!existingUser.verified) {
      let token = await Token.findOne({ userId: existingUser._id });

      if (!token) {
        token = await new Token({
          userId: existingUser._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${currentUrl}/user/${existingUser._id}/verify/${token.token}`;

        const html = `<p>Verify your email address to complete the signup and login into your account.</p>
                        <p>This link<b> expires in 1 hour</b>.</p><p>Press <a href=${url}>here</a> to proceed.</p>
                        <p>${url}</p>
                        `;

        await sendEmail(existingUser, "Verify Email", html);
      }

      return res.status(204).send({
        msg: "A Verifcation email has been sent to your account please verify",
      });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({
      success: true,
      token,
    });
  }
);

exports.user_resetPassword = asyncErrorHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const emailSchema = Joi.object({
      email: Joi.string().email().required(),
    });

    const { error, value } = emailSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw error;
    }

    const { email } = value;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new CustomError("User with the given email not found", 404);
    }

    const input = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "15m",
    });

    const token = crypto.createHash("sha256").update(input).digest("hex");

    const splitToken = token.substring(2, 8);
    user.resetToken = splitToken;
    user.resetTokenExpiration = Date.now() + 900000;

    await user.save();

    const html = `<p>Reset password to your account.</p>
                        <p>This Reset Token<b> expires in 15mins</b>.</p>
                        <p>${splitToken}</p>
                        `;

    await sendEmail(user, "Reset your password", html);

    res.status(200).json({
      message: "reset email has been sent!",
    });
  }
);

exports.user_resetPasswordConfirmation = asyncErrorHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const resetPasswordConfirmationSchema = Joi.object({
      email: Joi.string().email().required(),
      verificationCode: Joi.string().required(),
      password: Joi.string().min(6).max(30).required(),
    });

    const { error, value } = resetPasswordConfirmationSchema.validate(
      req.body,
      {
        abortEarly: false,
      }
    );

    if (error) {
      throw error;
    }

    const { email, verificationCode, password } = value;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.resetToken !== verificationCode) {
      throw new CustomError("Verification code is not a match", 404);
    }

    // Ensure resetTokenExpiration is defined before comparing
    if (!user.resetTokenExpiration || user.resetTokenExpiration < new Date()) {
      throw new CustomError("Token has expired", 403);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
    user.resetToken = "";
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).json({
      message: "Password change has been successful",
    });
  }
);
