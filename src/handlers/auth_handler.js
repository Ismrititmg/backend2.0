import {
  loginUserValidationSchema,
  registerUserValidationSchema,
} from "../validators/auth_validator.js";
import bcrypt from "bcrypt";
import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUserHandler = async (req, res) => {
  let result = registerUserValidationSchema.safeParse(req.body);
  if (!result.success) {
    let errors = result.error.issues.map((ele) => {
      return {
        field: ele.path[0],
        message: ele.message,
      };
    });
    return res.status(400).json({
      success: false,
      message: "validation error",
      errors: errors,
    });
  }
  let { email, password, username } = result.data;
  try {
    //step2: hashed the incomming password using bcrypt.hash (data, salt/round)
    let hashedPassword = await bcrypt.hash(password, 10);
    //step3: store the user data
    let user = await prisma.user.create({
      //.user option comes after generate
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        CreatedAt: true,
        UpdatedAt: true,
        role: true,
      },
    });
    //todo exclude or remove password from user
    res.status(201).json({
      success: true,
      message: "User register successfully",
      data: user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on creating user",
      stack: e,
    });
  }
};

//login step
//validate the incomming data ot request data
//find the user with email
//compare the request password and the matched user hashed password using bycrypt
//generate token with user data payload and expiry date
//send the token to the client as response

export let login = async (req, res) => {
  try {
    //validating incomming request data
    let vResult = loginUserValidationSchema.safeParse(req.body);
    if (!vResult.success) {
      let errors = vResult.error.issues.map((ele) => {
        return {
          field: ele.path[0],
          message: ele.message,
        };
      });
      return res.status(400).json({
        success: false,
        message: "Validation Error",
      });
    }
    let { email, password } = vResult.data;
    
    //check the user with email
    let foundUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "user email or password invalid",
      });
    }
    //compare the password using bcrypt
    let isMatched = await bcrypt.compare(password, foundUser.password);
    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "user email or password invalid",
      });
    }
    //generating token using jwt
    const token = await jwt.sign(
      {
        id: foundUser.id,
        email: foundUser.email,
      },
      //including secret from dotenv
      process.env.SECRET_KEY,
       "", //user data: payload
       "MyEkdamaiSecretKey", //singing secret key

      {
        expiresIn: "2d",
      }, //config
    );
    //response
    res.status(200).json({
      success: true,
      message: "user logged in successfully",
      token: token,
    });
  } catch (e) {
    res.status(500).json({
      error: "cannot update student",
      stack: e?.message,
    });
  }
};
