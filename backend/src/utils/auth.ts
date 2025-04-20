import jwt from "jsonwebtoken";
import { Response } from "express";

interface Options {
  userId: string;
  res: Response;
  message: string;
  statusCode?: number;
}

export const sendToken = ({ userId, res, message, statusCode = 200 }: Options) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.status(statusCode).json({
    success: true,
    message,
    token,
  });
};
