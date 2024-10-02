import cors from "cors";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import authRouter from "./router/router.js";
import "ejs";
import taskRouter from "./router/taskRouter.js";

export const appConfig = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(helmet());
  app.set("view engine", "ejs");
  
  app.use("/api", authRouter);
  app.use("/api/task",taskRouter);



  app.get("/", (req, res) => {
    try {
      return res.status(200).json({
        message: "Welcome to Taskme: A Task Application API",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  });
};
