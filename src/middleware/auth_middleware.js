//step for authorization
//check: if header include authorization
//check if authentication value has bearer or not
//authorization [1] is not empty : token
//verify token is valid or not using jwt : decoded data
//check expriesIn date actually expired or not

import { success } from "zod";
import jwt from "jsonwebtoken";
export let authMiddleware = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  //check if authorization header is available or not
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header is required",
    });
  }
  //check if authHeader starts with bearer
  if (!authHeader.startsWith("Bearer ")) {
    //space after Bearer
    return res.status(401).json({
      success: false,
      message: "authorization header is not valid",
    });
  } //check if token is empty or not
  let token = authHeader.split(" ")[1];
  if (token == "") {
    return res.status(401).json({
      success: false,
      message: "token is not valid",
    });
  }
  try {
    //verify the token or validate the token
    let decodedDataFromToken = await jwt.verify(token, process.env.SECRET_KEY);
    req.payload = decodedDataFromToken.payload;
    //attach user data or payload to req for further use
    next();
  } catch (e) {
    console.log("error:", e.name);
    if (e.name === "TokenExpiredError"){
      res.status(401).json({
        success: false,
        message: `token expired at: ${expiredAt}`,
      });
  }
  res.status(401).json({
    success: false,
    message: "token invalid",
    stack: e,
  });
}
};
