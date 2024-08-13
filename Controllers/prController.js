const catchAsync = require("../Utils/catchAsync");
const User = require("../Models/userModel");
const Event = require("../Models/eventModel");
const { SendNotification } = require("../Utils/notification");
const Email = require("../Utils/mailSend");
const generateReferralCode = require("../Utils/referralCodeGenerator");
const RequestAdmin = require("../Models/requestAdminModel");
const AppError = require("../Utils/appError");

// const Event = require("../Models/eventModel");
// const Referral = require("../Models/referralModel");

/// 1. Notify admin for request to join affiliate program

exports.requestPRApproval = catchAsync(async(req,res,next)=>{
  const requestApproval = await RequestAdmin.create({
    requestedBy: req.user._id,
    type: 'pr-request',
  })

  if(!requestApproval){
    return next(new AppError("Error while requesting PR approval. Try Again!",400))
  }

  res.status(201).json({
    status:"success",
    statusCode:200,
    message:"Approval request has been sent to admin",
    requestApproval
  })
})




exports.getAllPRRequests = catchAsync(async (req, res, next) => {
  const prRequests = await RequestAdmin.find({
    type: "pr-request",
    status: "pending",
  });

  if (!prRequests) {
    return next(new AppError("Couldn't fetch any affiliate requests", 400));
  }

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Affiliate Requests fetched successfully",
    length: prRequests.length,
    prRequests,
  });
});



exports.changeRequestStatus = catchAsync(async(req,res,next)=>{
  const {status} = req.body
  const {prRequestId} = req.params
  if(!prRequestId){
    return next(new AppError("Please select the PR request that you wnat to approve or reject.",400))
  }

  if(!status){
    return next(new AppError("Please choose whether you want to approve or reject this request.",400))
  }

  const prRequest = await RequestAdmin.findById(prRequestId)

  if(!prRequest){
    return next(new AppError("Affiliate request with this ID doesn't exist",404))
  }

  prRequest.status = `${status}`

  await prRequest.save()
  let user
  if(status === 'approved'){
     user = await User.findById(prRequest.requestedBy._id)
    if(!user){
      return next(new AppError("User with this ID doesn't exist",404))
    }

    user.isPRUser = true
    await user.save()
  }

  //**SEND NOTIFICAITON HERE**//


  res.status(200).json({
    status:"success",
    statusCode:200,
    message: `PR Request has been ${status}`,
    prRequest
  })


})