const catchAsyncErrors = require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
var jwt = require('jsonwebtoken');
const User = require("../models/User");
// const JWT_SECRET = "PrathamKhandelwalIsAGoodBoy";
const JWT_EXPIRE = "2d";

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
  
    if (!token) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = await User.findById(decodedData.id);
    // console.log(req.user)
  
    next();
  });

// exports.authorizeRoles = (roles)=>{                  // Here roles array contain "admin"
exports.authorizeRoles = (...roles)=>{                  // Here roles array contain "admin"
    return(req , res , next) => {
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};









// var jwt = require('jsonwebtoken');
// const JWT_SECRET = 'PrathamKhandelwalIsAGoodBoy';

// const fetchuser = (req, res, next) => {
//     // Get the user from the jwt token and add id to req object
//     const token = req.header('auth-token');
//     console.log(token)
//     if (!token) {
//         res.status(401).send({ error: "Please authenticate using a valid token" })
//     }
//     try {
//         const data = jwt.verify(token, JWT_SECRET);
//         req.user = data.user;            // If the authentic token is correct then set the request user to the data user
//         next();
//     } catch (error) {
//         res.status(401).send({ error: "Please authenticate using a valid token" })
//     }

// }


// module.exports = fetchuser;