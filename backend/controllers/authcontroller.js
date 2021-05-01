const User = require(`../models/user`)

const catchAsyncError = require (`../middlewares/catchAsyncError`)
const ErrorHandler = require(`../utils/errorHandler`)
const sendToken = require(`../utils/jwtToken`)
const sendEmail = require(`../utils/sendEmail`)
const crypto = require(`crypto`)
const cloudinary = require(`cloudinary`)


exports.registerUser = catchAsyncError(async (req,res,next) => {
   
    const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder : 'Avatars',
        width : 150,
        crop : "scale"
    })

    const {name, email, password} = req.body
    
    const user = await User.create({
       name,
       email,
       password,
       avatar:{
           public_id:result.public_id,
           url: result.secure_url
       }
   })

   sendToken(user,200,res)
})


exports.loginUser = catchAsyncError(async (req,res,next) => {
    const {email,password} = req.body

    if(!email||!password){
        return next(new ErrorHandler(`Please enter email and password`,400))
    }

    const user = await User.findOne({email}).select(`+password`) 
    if(!user){
        return next(new ErrorHandler(`Invalid email or password`,401))
    }

    const isPasswordMatched = user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler(`Invalid email or password`,401))
    }
   
    sendToken(user,200,res)
})



exports.forgotPassword = catchAsyncError( async (req,res,next) => {
    const user = await User.findOne({email : req.body.email})

    if(!user){
        return next(new ErrorHandler(`User not found with this email`,404))
    }
    const resetToken = user.getResetPasswordToken()

    await user.save({validateBeforeUse : false})
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\n If you have not requested this eamil, than ignore it`

    try{
       sendEmail({
           email : user.email,
           subject : `ShoptIt password recovery`,
            message 
       })

       res.status(200).json({
           success : true,
           message : `email sent to ${user.email}`
       })

    }catch(error){
       user.resetPasswordToken = undefined,
       user.resetPasswordexpire = undefined

       await user.save({validateBeforeSave :  false})

       return next(new ErrorHandler(error.message,500))
    }
})



exports.resetPassword = catchAsyncError(async (req,res,next) => {

    const resetPasswordToken = crypto.createHash(`sha256`).update(req.params.token).digest(`hex`)

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    })

    if(!user){
        return next(new ErrorHandler(`Password reset token is invalid or has been expired`,400))
    }
    
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler(`Password does not match`,400))
    }
    user.password = req.body.password

    user.resetPasswordToken = undefined
    user.resetPasswordexpire = undefined

    await user.save()

    sendToken(user,200,res)
})


exports.getUserProfile = catchAsyncError(async (req,res,next) => {

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success : true,
        user
    })
})


exports.updatePassword = catchAsyncError(async (req,res,next) => {
    
    const user = await  User.findById(req.user.id).select(`+password`)

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatched){
        return next(new ErrorHandler(`Old password is incorrect`,400))
    }
    user.password = req.body.password
    await user.save()
    sendToken(user,200,res)
})

exports.updateProfile =  catchAsyncError(async (req,res,next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email
    }
    
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidator: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success : true
    })

})


exports.logoutUser = catchAsyncError(async (req,res,next) => {
    res.cookie(`token`,null,{
        expires : new Date(Date.now()),
        httponly :true,
    })

    res.status(200).json({
        succees : true,
        message : `Loged Out`
    })
})

exports.allUsers = catchAsyncError(async (req,res,next) => {
    const users = await User.find()

    res.status(200).json({
        success : true,
        users
    })
})

exports.getUserDetails = catchAsyncError(async (req,res,next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User has not been found wiht id: ${req.params.id}`,400))
    }
     res.status(200).json({
        success : true,
        user 
     })
})

exports.updateUser =  catchAsyncError(async (req,res,next) => {
    const newUserdata = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserdata,{
        new: true,
        runValidator: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success : true
    })

})

exports.deleteUser = catchAsyncError(async (req,res,next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User has not been found wiht id: ${req.params.id}`,400))
    }

    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);

    await user.remove() 
    res.status(200).json({
        success : true
     })
})