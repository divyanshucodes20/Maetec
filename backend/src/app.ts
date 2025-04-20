import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/task";
import { errorMiddleware } from "./middlewares/error";
import morgan from "morgan";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
  });

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

//@ts-ignore
app.use(errorMiddleware);

export default app;
