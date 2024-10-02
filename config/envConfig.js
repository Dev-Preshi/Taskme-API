import dotenv from "dotenv";
dotenv.config();

export const envConfig = {
    PORT: process.env.PORT,
    MONGO_CONNECT: process.env.MONGO_CONNECT,
    PASS: process.env.PASS,
    TOKEN:process.env.TOKEN,
};
