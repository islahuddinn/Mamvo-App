const catchAsync = require("../Utils/catchAsync");
const User = require("../Models/userModel");
const Event = require("../Models/eventModel");
const Email = require("../Utils/mailSend");
const generateReferralCode = require("../Utils/referralCodeGenerator");
const RequestAdmin = require("../Models/requestAdminModel");
const AppError = require("../Utils/appError");
const RefreshToken = require('../Models/refreshTokenModel')
const Notification = require("../Models/notificationModel");
const {
  sendNotification,
  sendMulticastNotification,
} = require("../Utils/Notifications");
const preFilteredDataPagination = require("../Utils/preFilteredDataPagination");


exports.requestPRApproval = catchAsync(async (req, res, next) => {

  if(req.user.isPRUser){
    return next(new AppError("You're already a PR user. You cannot request again!",400))
  }

  const existingRequest = await RequestAdmin.findOne({
    requestedBy: req.user._id,
    type: 'pr-request'
  })

  if(existingRequest && existingRequest.status === 'pending'){
    return res.status(200).json({
      status:200,
      message:'You already have a pending pr request. Please wait for admin approval.',
      requestStatus:'pending',
      existingRequest
    })
  }else if(existingRequest && existingRequest.status === 'rejected'){
    await RequestAdmin.findByIdAndDelete(existingRequest._id)
  }




  const requestApproval = await RequestAdmin.create({
    requestedBy: req.user._id,
    type: "pr-request",
  });

  if (!requestApproval) {
    return next(
      new AppError("Error while requesting PR approval. Try Again!", 400)
    );
  }

  res.status(201).json({
    status: 200,
    message: "Approval request has been sent to admin",
    requestApproval,
  });
});

exports.getAllPRRequests = catchAsync(async (req, res, next) => {
  const prRequests = await RequestAdmin.find({
    type: "pr-request",
    status: "pending",
  });

  if (!prRequests) {
    return next(new AppError("Couldn't fetch any affiliate requests", 400));
  }

  const paginatedRequests = preFilteredDataPagination(req, affiliateRequests);


  res.status(200).json({
    status: 200,
    message: "PR Requests fetched successfully",
    length: prRequests.length,
    length: paginatedRequests.data.length,
    totalPages: paginatedRequests.totalPages,
    hasPrevPage: paginatedRequests.hasPrevPage,
    hasNextPage: paginatedRequests.hasNextPage,
    //totalResults: paginatedRequests.totalavailables,
    prRequests:paginatedRequests.data,
  });
});

exports.changeRequestStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const { prRequestId } = req.params;
  if (!prRequestId) {
    return next(
      new AppError(
        "Please select the PR request that you wnat to approve or reject.",
        400
      )
    );
  }

  if (!status) {
    return next(
      new AppError(
        "Please choose whether you want to approve or reject this request.",
        400
      )
    );
  }

  const prRequest = await RequestAdmin.findById(prRequestId);

  if (!prRequest) {
    return next(
      new AppError("Affiliate request with this ID doesn't exist", 404)
    );
  }

  prRequest.status = `${status}`;

  await prRequest.save();
  let user;
  if (status === "approved") {
    user = await User.findById(prRequest.requestedBy._id);
    if (!user) {
      return next(new AppError("User with this ID doesn't exist", 404));
    }

    user.isPRUser = true;
    await user.save();
  }else if(status === 'rejected'){
    user = await User.findById(prRequest.requestedBy._id);
    if (!user) {
      return next(new AppError("User with this ID doesn't exist", 404));
    }
  }

  //**SEND NOTIFICAITON HERE**//
  await Notification.create({
    notificationType: "pr-request",
    receiver: user._id,
    title: "PR request status",
    body: `Your PR request has been ${status} .`,
    data: user,
  });
  const fcmTokens = await RefreshToken.find({ user: user._id }).then((tokens) =>
    tokens.map(({ deviceToken }) => deviceToken)
  );

  console.log("FCM TOKENS ARE:", fcmTokens)


  if (user.isNotifications && fcmTokens.length > 1) {
    await sendMulticastNotification({
      fcmTokens,
      title: "PR request status",
      body: `Your PR request has been ${status} .`,
      notificationData: JSON.stringify(user),
    });
  } else if (user.isNotifications && fcmTokens.length === 1) {
    await sendNotification({
      fcmToken: fcmTokens[0],
      title: "PR request status",
      body: `Your PR request has been ${status} .`,
      notificationData: JSON.stringify(user),
    });
  }

  res.status(200).json({
    status: 200,
    message: `PR Request has been ${status}`,
    prRequest,
  });
});
