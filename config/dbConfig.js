import mongoose from "mongoose";
import { envConfig } from "./envConfig.js";

const connectUrl = envConfig.MONGO_CONNECT;

export const dbConfig = () => {
  mongoose.connect(connectUrl).then(() => {
    console.log("Server and Database is live");
  });
};
