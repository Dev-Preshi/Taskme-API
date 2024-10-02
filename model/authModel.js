import { Schema, Types, model } from "mongoose";
import { type } from "os";

const authModel = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    taskHistory: [
      {
        type: Types.ObjectId,
        ref: "todos",
      },
    ],
    pendingHistory: [
      {
        type: Types.ObjectId,
        ref: "todos",
      },
    ],
    doneHistory: [
      {
        type: Types.ObjectId,
        ref: "todos",
      },
    ],
  },
  { timestamps: true }
);

export default model("auths", authModel);
