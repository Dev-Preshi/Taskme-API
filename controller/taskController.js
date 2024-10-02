import mongoose from "mongoose";
import authModel from "../model/authModel.js";
import taskModel from "../model/taskModel.js";

// Create Task Controller
export const createTaskController = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const { id } = req.params;
    const auth = await authModel.findById(id);

    if (auth) {
      const task = await taskModel.create({
        title,
        description,
        priority,
        userId: auth._id,
        auth,
      });

      auth.taskHistory.push(new mongoose.Types.ObjectId(task._id));
      auth.save();

      return res.status(200).json({
        message: "Task created",
        data: task,
      });
    } else {
      return res.status(404).json({
        message: "Oh Sorry, This account is not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// View All Tasks Created by one user
export const populateTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const auth = await authModel.findById(id).populate({
      path: "taskHistory",
      options: {
        sort: { createdAt: -1 },
      },
    });

    if (auth) {
      return res.status(200).json({
        message: `${auth.username}'s Tasks Record`,
        data: auth.taskHistory,
      });
    } else {
      return res.status(404).json({
        message: "Task Record NOT Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// View All PENDING Task Created by one user
export const populatePendingTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const auth = await authModel.findById(id).populate({
      path: "pendingHistory",
      options: {
        sort: { createdAt: -1 },
      },
    });

    if (auth) {
      return res.status(200).json({
        message: `${auth.username}'s PENDING Tasks Record`,
        data: auth.pendingHistory,
      });
    } else {
      return res.status(404).json({
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// View All DONE Task Created by one user
export const populateDoneTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const auth = await authModel.findById(id).populate({
      path: "doneHistory",
      options: {
        sort: { createdAt: -1 },
      },
    });

    if (auth) {
      return res.status(200).json({
        message: `${auth.username}'s DONE Tasks Record`,
        data: auth.doneHistory,
      });
    } else {
      return res.status(404).json({
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

// View All Tasks created by Users
export const viewAllTaskController = async (req, res) => {
  try {
    const task = await taskModel.find();

    return res.status(200).json({
      message: "All Tasks",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// View One User's Task
export const viewOneTaskController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await taskModel.findById(taskId);

    if (task) {
      return res.status(200).json({
        message: "View One Task",
        data: task,
      });
    } else {
      return res.status(404).json({
        message: "Task requested is NOT found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete User's Task
export const deleteUserTaskController = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const auth = await authModel.findById(id);
    const task = await taskModel.findById(taskId);

    if (auth && task) {
      if (task.userId === id) {
        auth.taskHistory.pull(new mongoose.Types.ObjectId(task._id));
        await taskModel.findByIdAndDelete(task._id);
        auth.save();

        return res.status(200).json({
          message: "Task has been deleted",
        });
      } else {
        return res.status(400).json({
          message: `Task does not belong to ${auth.username}`,
        });
      }
    } else {
      return res.status(404).json({
        message: "Credentials NOT Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update Task Status: PENDING
export const updateTaskToPendingController = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const auth = await authModel.findById(id);
    const task = await taskModel.findById(taskId);

    if (auth && task) {
      if (task.userId === id) {
        const taskStatus = await taskModel.findByIdAndUpdate(
          task._id,
          {
            status: "PENDING",
          },
          { new: true }
        );

        auth.taskHistory.pull(new mongoose.Types.ObjectId(task._id));
        auth.pendingHistory.push(new mongoose.Types.ObjectId(taskStatus._id));
        auth.save();

        return res.status(200).json({
          message: "Task in progress",
          data: taskStatus,
        });
      } else {
        return res.status(400).json({
          message: `Task does not belong to ${auth.username}`,
        });
      }
    } else {
      return res.status(404).json({
        message: "Credentials NOT Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update Task Status: DONE
export const updateTaskToDoneController = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const auth = await authModel.findById(id);
    const task = await taskModel.findById(taskId);

    if (auth && task) {
      if (task.userId === id) {
        const taskUpdate = await taskModel.findByIdAndUpdate(
          task._id,
          {
            status: "FINISHED",
          },
          { new: true }
        );

        auth.pendingHistory.pull(new mongoose.Types.ObjectId(task._id));
        auth.doneHistory.push(new mongoose.Types.ObjectId(taskUpdate._id));
        auth.save();

        return res.status(200).json({
          message: "Task is done",
          data: taskUpdate,
        });
      } else {
        return res.status(400).json({
          message: `Task does not belong to ${auth.username}`,
        });
      }
    } else {
      return res.status(404).json({
        message: "Credentials NOT Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
