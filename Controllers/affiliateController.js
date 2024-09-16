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




exports.requestAffiliateApproval = catchAsync(async (req, res, next) => {
  console.log("LOGGED IN USER IS:::", req.user)
  console.log("LGGED IN USER ID IS::", req.user._id)

  if(req.user.isAffiliate){
    return next(new AppError("You're already an affiliate user. You cannot request again!",400))
  }

  const existingRequest = await RequestAdmin.findOne({
    requestedBy: req.user._id,
    type: 'affiliate-request'
  })

  if(existingRequest && existingRequest.status === 'pending'){
    return res.status(200).json({
      status:200,
      message:'You already have a pending affiliate request. Please wait for admin approval.',
      requestStatus:'pending',
      existingRequest
    })
  }else if(existingRequest && existingRequest.status === 'rejected'){
    await RequestAdmin.findByIdAndDelete(existingRequest._id)
  }

  const requestApproval = await RequestAdmin.create({
    requestedBy: req.user._id,
    type: "affiliate-request",
  });

  if (!requestApproval) {
    return next(
      new AppError("Error while requesting affiliate approval. Try Again!", 400)
    );
  }

  res.status(201).json({
    status: 200,
    message: "Approval request has been sent to admin",
    requestApproval,
  });
});

exports.getAllAffiliateRequests = catchAsync(async (req, res, next) => {
  const affiliateRequests = await RequestAdmin.find({
    type: "affiliate-request",
    status: "pending",
  });

  if (!affiliateRequests) {
    return next(new AppError("Couldn't fetch any affiliate requests", 400));
  }
  const paginatedRequests = preFilteredDataPagination(req, affiliateRequests);

  res.status(200).json({
   status: 200,
    message: "Affiliate Requests fetched successfully",
    length: paginatedRequests.data.length,
    totalPages: paginatedRequests.totalPages,
    hasPrevPage: paginatedRequests.hasPrevPage,
    hasNextPage: paginatedRequests.hasNextPage,
    //totalResults: paginatedRequests.totalavailables,
    affiliateRequests: paginatedRequests.data,
    
  });
});

exports.changeRequestStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const { affiliateRequestId } = req.params;
  if (!affiliateRequestId) {
    return next(
      new AppError(
        "Please select the affiliate request that you wnat to approve or reject.",
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

  const affiliateRequest = await RequestAdmin.findById(affiliateRequestId);

  if (!affiliateRequest) {
    return next(
      new AppError("Affiliate request with this ID doesn't exist", 404)
    );
  }

  affiliateRequest.status = `${status}`;

  await affiliateRequest.save();
  let user;
  if (status === "approved") {
    user = await User.findById(affiliateRequest.requestedBy._id);
    if (!user) {
      return next(new AppError("User with this ID doesn't exist", 404));
    }

    user.isAffiliate = true;
    await user.save();
  }else if(status === 'rejected'){
    user = await User.findById(affiliateRequest.requestedBy._id);
    if (!user) {
      return next(new AppError("User with this ID doesn't exist", 404));
    }
  }

  //**SEND NOTIFICAITON HERE**//

  console.log("USER IN ACCEPting aff is:", user)
  await Notification.create({
    notificationType: "affiliate-request",
    receiver: user._id,
    title: "Affiliate request status",
    body: `Your Affiliate request has been ${status} .`,
    data: user,
  });
  const fcmTokens = await RefreshToken.find({ user: user._id }).then((tokens) =>
    tokens.map(({ deviceToken }) => deviceToken)
  );
  
  console.log("FCM TOKENS ARE:", fcmTokens)

  if (user.isNotifications && fcmTokens.length > 1) {
    await sendMulticastNotification({
      fcmTokens,
      title: "Affiliate request status",
      body: `Your Affiliate request has been ${status} .`,
      notificationData: JSON.stringify(user),
    });
  } else if (user.isNotifications && fcmTokens.length === 1) {
    await sendNotification({
      fcmToken: fcmTokens[0],
      title: "Affiliate request status",
      body: `Your Affiliate request has been ${status} .`,
      notificationData: JSON.stringify(user),
    });
  }


  res.status(200).json({
    status:200,
    message: `Affiliate Request has been ${status}`,
    affiliateRequest,
  });
});

