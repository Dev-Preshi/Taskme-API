import { createTransport } from "nodemailer";
import { envConfig } from "../config/envConfig.js";
import jwt from 'jsonwebtoken';
import {dirname, join} from "path";
import { fileURLToPath } from "url";
import { renderFile } from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
 export const sendVerificationMail = async (user) => {
    try {
      const transport = createTransport({
        service: "gmail",
        auth: {
            user:'quinash234@gmail.com',
            pass: envConfig.PASS,
        },
      });
      const token = jwt.sign({id: user._id}, envConfig.TOKEN);
      console.log(token);
      const dataForEjs = {
        username : user.username,
        email: user.email,
        url: `http://localhost:1234/api/${token}/verify-user`,
      };
      
      const locateEjsFile =  join(__dirname, "../views/verifyMail.ejs");
      const renderEjsFile = await renderFile(locateEjsFile, dataForEjs);

      const mailer = {
        from: "Taskme Mail <quinash234@gmail.com>",
        to: user.email,
        subject: "Registeration Successfull -- Please verify account",
        html: renderEjsFile,
      };

      transport.sendMail(mailer);
    } catch (error) {
      throw error;  
    }
}


export const resetPasswordMail = async (user, token)=>{
  try {
const transport = createTransport({
  service: "gmail",
  auth:{
    user:"quinash234@gmail.com",
    pass:envConfig.PASS,
  }
});

const passedData = {
  username:user.username,
  email: user.email,
  url: `http://localhost:1234/api/${token}/change-user-password`,
};

const locateEjsFile = join (__dirname, "../views/resetMail.ejs");
const readFile = await renderFile(locateEjsFile,passedData);

const mailer ={ 
  from:"Reset Password <quinash234@gmail.com>",
  to: user.email,
  subject:"Reset Your Password",
  html:readFile,
};
transport.sendMail(mailer);
  } catch (error) {
    throw error;
  }
}