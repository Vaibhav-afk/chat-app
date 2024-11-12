import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (userId: String, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //milliseconds
    httpOnly: true, //It will prevent XSS
    sameSite: "strict", //prevent CSRF attacks
    secure: process.env.NODE_ENV !== "development", //It will only be unsecure in development environment(i.e. we can use HTTP otherwise HTTPS only)
  });

  return token;
};

export default generateToken;
