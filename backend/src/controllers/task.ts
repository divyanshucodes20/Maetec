import { Request, Response } from "express";
import { TryCatch } from "../middlewares/error";
import { prisma } from "../lib/prisma";

export const getTasks = TryCatch(async (req:Request, res:Response) => {
  const tasks = await prisma.task.findMany({ where: { userId: req.user.id } });
  res.status(200).json({ success: true, tasks });
});

export const createTask = TryCatch(async (req, res) => {
  const { title, description, status } = req.body;
  const task = await prisma.task.create({
    data: { title, description, status, userId: req.user.id },
  });
  res.status(201).json({ success: true, task });
});

export const updateTask = TryCatch(async (req:Request, res:Response) => {
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.status(200).json({ success: true, task });
});

export const deleteTask = TryCatch(async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.status(200).json({ success: true, message: "Task deleted" });
});
