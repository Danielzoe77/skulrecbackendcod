
// const asyncHandler = require("express-async-handler");
// const User = require('../model/userModel');
// const jwt = require('jsonwebtoken');

// const protect = asyncHandler (async ( req, res,)=>{
//     try{
        
//         const token = req.cookies.token
//         console.log("Token:", token);
//         if(!token){
//             res.status(401)
//             throw new Error ("Not Authorized user, please Log in")
//         } 
//         // verify token
//         console.log("Verifying token...");
//         const verified = jwt.verify(token, process.env.JWT_SECRET)

//         // Get User id from token
//         const user = await User.findById(verified.id).select("-password")

//     //validate the user in the databaase
//     if(!user){
//         res.status(401)
//         throw new Error ("user not found  Please Login")
//     }
//     req.user = user ;
//     next ();
//     }catch(error){
//         res.status(401)
//         throw new Error ("Not an Authorised user, Please Logg in")
//     }

// })

// module.exports = protect

// const asyncHandler = require("express-async-handler");
// const User = require('../model/userModel');
// const jwt = require('jsonwebtoken');

// const verifyToken = asyncHandler(async (token) => {
//   try {
//     // const token = req.headers.authorization.replace("Bearer ", "");
//     // console.log("Token:", token);
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Verified token:",);
//     // return User.findById((verified)).select("-password");
//     const user = await User.findById((verified)).select("-password");
//     console.log("User found:", user);
//     return user;
   
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     throw new Error("Invalid token");
//   }
  
// }
// );
// console.log(verifyToken)

// const protect = asyncHandler(async (req, res) => {
//   const token = req.cookies.token;
//   console.log("Token:", token)
//   if (!token) {
//     res.status(401);
//     throw new Error("Not Authorized user, please Log in");
//   }

//   const user = await verifyToken(token);
//   console.log("User:", user);
//   if (!user) {
//     res.status(401);
//     throw new Error("User not found. Please login");
//   }

//   req.user = user;
//   next();
// });
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");


const protect =  asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = decoded;
      console.log("Token verified")
      // console.log(req.userData)
      // req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
})
module.exports = protect;