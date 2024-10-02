import { Router } from "express";
import {
    changeUserPassword,
  deleteOneUser,
  loginUser,
  registerAuth,
  resetUserPassword,
  updateUser,
  verifyAuth,
  viewAllUsers,
  viewOneUser,
} from "../controller/authController.js";

const authRouter = Router();

authRouter.route("/register").post(registerAuth);
authRouter.route("/:token/verify-user").get(verifyAuth);
authRouter.route("/all-users").get(viewAllUsers);
authRouter.route("/:authID/one-user").get(viewOneUser);
authRouter.route("/login-user").post(loginUser);
authRouter.route("/:id/delete-user").delete(deleteOneUser);
authRouter.route("/:id/update-user").patch(updateUser);
authRouter.route("/reset-user-password").patch(resetUserPassword);
authRouter.route("/:token/change-user-password").patch(changeUserPassword);
export default authRouter;
