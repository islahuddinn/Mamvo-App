const catchAsync = require("../Utils/catchAsync");
const User = require("../Models/userModel");
const Event = require("../Models/eventModelv2");
const RequestAdmin = require("../Models/requestAdminModel");
const AppError = require("../Utils/appError");
const RefreshToken = require('../Models/refreshTokenModel')
const Notification = require("../Models/notificationModel");
const {
  sendNotification,
  sendMulticastNotification,
} = require("../Utils/Notifications");

exports.requestFreeAttendance = catchAsync(async (req, res, next) => {
  if (!req.user.isPRUser) {
    return next(
      new AppError("Only a PR user can request free attendance at clubs.!", 400)
    );
  }
  const { eventId } = req.params;
  if (!eventId) {
    return next(
      new AppError(
        "Please select the event for which you want to request free attendance",
        400
      )
    );
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return next(
      new AppError("Event with this ID doesn't exist.Try Again!", 404)
    );
  }

  const existingRequest = await RequestAdmin.findOne({
    requestedBy: req.user._id,
    type: "free-attendance-request",
    event: event._id,
  });

  if (existingRequest && existingRequest.status === "pending") {
    return res.status(200).json({
      status: 200,
      message:
        "You already have a pending free attendance request for this event. Please wait for admin approval.",
      requestStatus: "pending",
      existingRequest,
    });
  } else if (existingRequest && existingRequest.status === "rejected") {
    await RequestAdmin.findByIdAndDelete(existingRequest._id);
  }

  const requestApproval = await RequestAdmin.create({
    requestedBy: req.user._id,
    type: "free-attendance-request",
    event: event._id,
  });

  if (!requestApproval) {
    return next(
      new AppError("Error while requesting free attendance. Try Again!", 400)
    );
  }

  res.status(201).json({
    status: 201,
    message: "Approval request has been sent to admin",
    requestApproval,
  });
});

exports.getAllFreeAttendanceRequests = catchAsync(async (req, res, next) => {
  const freeAttendanceRequests = await RequestAdmin.find({
    type: "free-attendance-request",
    status: "pending",
  });

  if (!freeAttendanceRequests) {
    return next(
      new AppError("Couldn't fetch any free attendance requests", 400)
    );
  }

  res.status(200).json({
    status: 200,
    message: "free attendance Requests fetched successfully",
    length: freeAttendanceRequests.length,
    freeAttendanceRequests,
  });
});

exports.changeRequestStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const { freeAttendanceRequestId } = req.params;
  if (!freeAttendanceRequestId) {
    return next(
      new AppError(
        "Please select the free attendance request that you want to approve or reject.",
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

  const freeAttendanceRequest = await RequestAdmin.findById(
    freeAttendanceRequestId
  );

  if (!freeAttendanceRequest) {
    return next(
      new AppError("Free attendance request with this ID doesn't exist", 404)
    );
  }

  freeAttendanceRequest.status = `${status}`;

  await freeAttendanceRequest.save();

  const user = await User.findById(freeAttendanceRequest.requestedBy._id);
  if (!user) {
    return next(new AppError("User with this ID doesn't exist", 404));
  }

  //**SEND NOTIFICAITON HERE**//
  await Notification.create({
    notificationType: "free-attendance-request",
    receiver: user._id,
    title: "Free attendance request status",
    body: `Your Free Attendnace request at ${freeAttendanceRequest.event.name} has been ${status} .`,
    data: freeAttendanceRequest,
  });
  const fcmTokens = await RefreshToken.find({ user: user._id }).then((tokens) =>
    tokens.map(({ deviceToken }) => deviceToken)
  );

  
  console.log("FCM TOKENS ARE:", fcmTokens)

  if (user.isNotifications && fcmTokens.length > 1) {
    await sendMulticastNotification({
      fcmTokens,
      title: "Free attendance request status",
      body: `Your Free Attendnace request at ${freeAttendanceRequest.event.name} has been ${status} .`,
      notificationData: JSON.stringify(user),
    });
  } else if (user.isNotifications && fcmTokens.length === 1) {
    await sendNotification({
      fcmToken: fcmTokens[0],
      title: "Free attendance request status",
      body: `Your Free Attendnace request at ${freeAttendanceRequest.event.name} has been ${status} .`,
      notificationData: JSON.stringify(user),
    });
  }

  res.status(200).json({
    status: 200,
    message: `Free Attendance Request at ${freeAttendanceRequest.event.name} has been ${status}`,
    freeAttendanceRequest,
  });
});
