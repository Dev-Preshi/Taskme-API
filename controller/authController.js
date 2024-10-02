import authModel from "../model/authModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { resetPasswordMail, sendVerificationMail } from "../email/emailConfig.js";
import { envConfig } from "../config/envConfig.js";
export const registerAuth = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);
    const token = crypto.randomBytes(16).toString("hex");
    // const checkEmail = await authModel.findOne({email});

    // if(checkEmail === email){
    //   return res.status(400).json({
    //     message:"This Email already exists",
    //   });
    // }
    const auth = await authModel.create({
      username,
      email,
      password: hash,
      token,
    });

    sendVerificationMail(auth).then(() => {
      console.log(`Mail is sent to ${auth.username}`);
    });

    return res.status(201).json({
      message: "You have just registered on Taskme",
      data: auth,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyAuth = async (req, res) => {
  try {
    const { token } = req.params;

    const getID = jwt.verify(token, envConfig.TOKEN, (err, payload) => {
      if (err) throw new Error();
      else {
        console.log(payload);
        return payload.id;
      }
    });

    const auth = await authModel.findByIdAndUpdate(
      getID,
      {
        token: "",
        verified: true,
      },
      { new: true }
    );
    return res.status(200).json({
      message: `${auth.username} account has been verified`,
      data: auth,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewAllUsers = async (req, res) => {
  try {
    const auth = await authModel.find();

    return res.status(200).json({
      message: "All Users on Taskme Application",
      data: auth,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const viewOneUser = async (req, res) => {
  try {
    const { authID } = req.params;
    const auth = await authModel.findById(authID);

    return res.status(200).json({
      message: `${auth.username} record`,
      data: auth,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = await authModel.findOne({ email });
    if (auth) {
      const checkPassword = await bcryptjs.compare(password, auth.password);
      if (checkPassword) {
        const token = jwt.sign({ id: auth._id }, envConfig.TOKEN);
        if (auth.token === "" && auth.verified) {
          return res.status(200).json({
            message: `Welcom back  ${auth.username}`,
          });
        } else {
          return res.status(400).json({
            message: `${auth.username}, You are not verified.`,
          });
        }
      } else {
        return res.status(400).json({
          message: `${auth.username},Your password is incorrect`,
        });
      }
    } else {
      return res.status(404).json({
        message: `Sorry, Your Email: ${email} is not found. Register!`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const auth = await authModel.findById(id);
    if (auth) {
      await authModel.findByIdAndDelete(auth._id);
      return res.status(200).json({
        message: "Your account has been deleted",
      });
    } 
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const auth = await authModel.findById(id);
    if (auth) {
      const changeUsername = await authModel.findByIdAndUpdate(
        auth.id,
        { username },
        { new: true }
      );
      return res.status(200).json({
        message: "Your name has been updated",
        data: changeUsername
      });
    } else {
      return res.status(404).json({
        message: "Your name cannot be updated",
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};


export const resetUserPassword = async (req, res) =>{
  try {
    const {email} = req.body;
    const auth = await authModel.findOne({email});
    if (auth) {
      const token = jwt.sign({id: auth._id},
      envConfig.TOKEN);
      if (auth.verified && auth.token === "") {
          const resetPasswordGrant = await authModel.findByIdAndUpdate(
            auth._id,
            {token},
            {new:true})

            resetPasswordMail(auth, token).then(() =>{
              console.log("Reset Password Mail Sent....");
            });
            return res.status(200).json({
              message:"Reset Password is granted",
              data:resetPasswordGrant,
            })
     }else{
        returnres.status(404).json({
          message:"You are n verified",
        })
      }
    }else{
      return res.status(404).json({
        message: "Your account does not exist",
      })
    }
  } catch (error) {
    return res.status(500).json({
      mesage:error.message
    });
  }
}



export const changeUserPassword = async (req, res) =>{
  try {
    const {token} = req.params;
    const {password}=req.body;

    const getID = jwt.verify(token, envConfig.TOKEN, (err,payload) => {
    if (err)throw new Error() 
      
  else {
      return payload.id
    }
  }

  );

  const salted = await bcryptjs.genSalt(10);
  const hashed = await bcryptjs.hash(password,salted);
  const changePassword = await authModel.findByIdAndUpdate(
    getID,
    {
      password:hashed,
      token:""
    },
    {new:true}
  );

  return res.status(200).json({
    message:"Your passwod has been changed",
  })
  } catch (error) {
    return res.status(500).json({
      mesage:error.message
    });
  }
}
