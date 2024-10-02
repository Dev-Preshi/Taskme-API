import express from "express";
import { envConfig } from "./config/envConfig.js";
import { dbConfig } from "./config/dbConfig.js";
import { appConfig } from "./appConfig.js";

const port = parseInt(envConfig.PORT);
const app = express();

appConfig(app)

const server = app.listen(process.env.PORT || port, () => {
  dbConfig();
});

process.on("uncaughtException" , (error) =>{
  console.error("uncaught-exception: ", error.message);
});

process.on("unhandledRejection", (reason) => {
  console.error( "unhandled-rejection",reason.message);
  server. close(()=>{
    process.exit(1);
  });
});
