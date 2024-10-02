import { Router } from "express";
import {
  createTaskController,
  deleteUserTaskController,
  populateDoneTaskController,
  populatePendingTaskController,
  populateTaskController,
  updateTaskToDoneController,
  updateTaskToPendingController,
  viewAllTaskController,
  viewOneTaskController,
} from "../controller/taskController.js";

const taskRouter = Router();

taskRouter.route("/:id/create-task").post(createTaskController);
taskRouter.route("/all-tasks").get(viewAllTaskController);
taskRouter.route("/:taskId/one-task").get(viewOneTaskController);
taskRouter.route("/:id/one-user-tasks").get(populateTaskController);
taskRouter
  .route("/:id/:taskId/delete-one-task")
  .delete(deleteUserTaskController);
taskRouter
  .route("/:id/:taskId/update-task-status")
  .patch(updateTaskToPendingController);
taskRouter
  .route("/:id/:taskId/update-task-done")
  .patch(updateTaskToDoneController);

taskRouter.route("/:id/one-pending-tasks").get(populatePendingTaskController);
taskRouter.route("/:id/one-done-tasks").get(populateDoneTaskController);

export default taskRouter;
