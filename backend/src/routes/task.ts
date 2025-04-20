import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/task";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.use(isAuthenticated);

router.get("/",getTasks);

router.post("/",createTask);

router.put("/:id",updateTask);

router.delete("/:id", deleteTask);

export default router;
