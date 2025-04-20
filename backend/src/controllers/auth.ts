import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/utility-class";
import { TryCatch } from "../middlewares/error";
import { sendToken } from "../utils/auth";
import { prisma } from "../lib/prisma";

export const registerUser = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { username } });

  if (existing) return next(new ErrorHandler("Username already exists", 409));

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  sendToken({ userId: user.id, res, message: "Registration successful", statusCode: 201 });
});

export const login = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) return next(new ErrorHandler("Invalid credentials", 401));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials", 401));

  sendToken({ userId: user.id, res, message: "Login successful" });
});
