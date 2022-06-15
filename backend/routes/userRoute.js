const express = require('express');
const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorhandler');
const catchSyncErrors = require('../utils/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');
const router = express.Router();
const User = require('../models/User');
const sendToken = require('../utils/jwtToken');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { isAuthenticatedUser , authorizeRoles } = require('../middleware/isAuthenticatedUser');
const cloudinary = require("cloudinary");
const FRONTEND_URL = "http://localhost:3000";

//Register a user
router.post('/register' , catchSyncErrors(async( req , res , next )=>{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar , {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const {name , email , password , role} = req.body;
    const user = await User.create({
        name , email , password , role ,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    sendToken(user , 200 , res);
})
)

//Login User
router.post('/login' , catchSyncErrors(async( req , res , next )=>{

    const {email , password} = req.body;
    
    // Checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please enter Email and Password" , 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password" , 401));
    }
    
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password" , 401))
    }

    sendToken(user , 201 , res);
    // const token = user.getJWTToken();

    // res.status(201).json({
    //     success: true,
    //     token,
    // })
})
)


// Logout User
router.get('/logout' , catchSyncErrors(async( req , res , next )=>{

    res.cookie("token" , null , {
        expires: new Date(Date.now()),
        httpOnly: true,
    }); 

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})
)


// Forgot Password
router.post('/forgotpassword' , catchAsyncErrors(async( req, res , next) => {

    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler("User Not Found!" , 404));
    }

    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken();
    console.log(resetToken)

    await user.save({validateBeforeSave: false});
    
    const resetPasswordurl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    // const resetPasswordurl = `${FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your Password reset token isx :- \n\n ${resetPasswordurl} \n\n If you have not requested this email then Please ignore it.`;

    try{
        await sendEmail({
            email: user.email,
            subject:`Ecommerce Password recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })
    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false});

        return next(new ErrorHandler(error.message , 500))
    }
}))


// Reset Password
router.put('/password/reset/:token' , catchAsyncErrors( async(req, res , next)=> {
    
    // Create Token Hash
    console.log(req.params.token)

    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now() },
    })
    console.log(user)
    if(!user){
        return next( new ErrorHandler("Reset Password token is invalid or has been expired" , 400));
    }
    
    if(req.body.password !== req.body.confirmPassword){
        return next( new ErrorHandler("Password must be same" , 400));
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // For login
    sendToken( user , 200 , res);
}));


// Get User Details
router.get('/me' , isAuthenticatedUser, catchSyncErrors( async( req , res , next )=>{
    // const user = await User.findById(req.user.id);      // findById returns a promise

    // // If user exists
    // res.status(200).json({
    //   success: true,
    //   user
    // });
    const user = await User.findById(req.user.id);

     res.status(200).json({
    success: true,
    user,
  });
})
)


// Update User Password
router.put('/password/update' , isAuthenticatedUser , catchSyncErrors( async( req , res , next )=>{
    const user = await User.findById(req.user.id).select("+password");      // findById returns a promise

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect " , 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next( new ErrorHandler("Password must be same" , 400));
    }

    user.password = req.body.confirmPassword;

    await user.save();
    
    sendToken(user , 200 , res)
})
)

module.exports = router



// Update User Name
router.put('/update/name' , isAuthenticatedUser , catchSyncErrors( async( req , res , next )=>{
    const user = await User.findById(req.user.id);      // findById returns a promise
    // const user = await User.findOne(req.body);      
    console.log(user)
    user.name = req.body.name;

    await user.save();
    
    sendToken(user , 200 , res)
})
)


// Update User Profile
router.put('/update/profile' , isAuthenticatedUser , catchSyncErrors( async( req , res , next )=>{
    
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    // Cloudinary
    if(req.body.avatar !== "")
    {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar , {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate( req.user.id , newUserData , {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    
    res.status(200).json({
        success: true,
        user
    })
})
)


// Get All Users                        --> Admin
router.get('/admin/get/users',isAuthenticatedUser , authorizeRoles("admin"), catchSyncErrors( async (req , res) => {

    const userCount = await User.countDocuments();
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
      userCount
    });
})
)


// Get Single User                      --> Admin
router.get('/admin/get/user/:id',isAuthenticatedUser , authorizeRoles("admin"), catchSyncErrors( async (req , res , next) => {

    const user = await User.findById(req.params.id);
    console.log(user)

    if(!user){
        return next(
            new ErrorHandler(`User does not exixts with id ${req.params.id}` , 404)
        )
    }

    res.status(200).json({
      success: true,
      user
    });
})
)


// Update Role of the user --> Admin
router.put('/admin/update/:id' , isAuthenticatedUser , authorizeRoles("admin") , catchSyncErrors( async( req , res , next )=>{
    
    let user = await User.findById(req.params.id);

    if(!user){
        return next(
            new ErrorHandler("User does not exits" , 404)
        )
    }
    
    const newRole = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    user = await User.findByIdAndUpdate(req.params.id , newRole ,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    
    res.status(200).json({
        success: true,
        user
    })
})
)


// Delete User
router.delete('/admin/delete/:id' , isAuthenticatedUser , authorizeRoles("admin") , catchSyncErrors( async( req , res , next )=>{
    
    const user = await User.findOne({_id:req.params.id});

    if(!user){
        return next(
            new ErrorHandler("User does not exits" , 404)
        )
    }
    
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();
    
    res.status(200).json({
        success: true,
        message: "User Successfully Deleted"
    })
})
)

module.exports = router




// Tips:

// params property is an object containing properties mapped to the named route “parameters”. For example, if you have the route /student/:id, then the “id” property is available as req.params.id.

// In reset password--- we use token hash as in the database the token is stored in the hash form