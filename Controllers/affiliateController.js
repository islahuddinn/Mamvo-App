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

exports.requestAffiliateApproval = catchAsync(async (req, res, next) => {
  const { name, email, phoneNumber, addressInfo, description } = req.body;
  const requestApproval = await RequestAdmin.create({
    requestedBy: {
      name,
      email,
      phoneNumber,
      addressInfo,
      description,
    },

    type: "affiliate-request",
  });

  if (!requestApproval) {
    return next(
      new AppError("Could not create your affiliate request. Try Again!", 400)
    );
  }

  res.status(201).json({
    status: "success",
    statusCode: 200,
    message: "Your request has been submitted. Wait for the Admin Approval.",
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

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Affiliate Requests fetched successfully",
    length: affiliateRequests.length,
    affiliateRequests,
  });
});

exports.changeRequestStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const { affiliateRequestId } = req.params;
  if (!affiliateRequestId) {
    return next(new AppError("Please select the affiliate request", 400));
  }
  if (!status) {
    return next(
      new AppError("Please provide the status for this affiliate request", 400)
    );
  }

  let affiliateRequest = await RequestAdmin.findById(affiliateRequestId);
  if (!affiliateRequest) {
    return next(
      new AppError("Affiliate Request with this ID doesn't exist.", 400)
    );
  }

  const user = await User.findOne({
    email: affiliateRequest.requestedBy.email,
  });

  if (status === "approved") {
    affiliateRequest.status = "approved";
    affiliateRequest.reviewedBy = req.user?._id
  
    let newUser;

    if (!user) {
      const defaultPassword = `mamvo${affiliateRequest.requestedBy.name}`;
      newUser = await User.create({
        email: affiliateRequest.requestedBy.email,
        password: `mamvo${affiliateRequest.requestedBy.name}`,
        active: true,
        isAffiliate: true,
      });

      try {
        await new Email(newUser, defaultPassword).affiliateConfirmation(
          defaultPassword
        );
      } catch (error) {
        console.log(error);
      }

      
      await affiliateRequest.save();

      return res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Affiliation request has been approved.",
        affiliateRequest,
      });
    }

    user.isAffiliate = true;

    await user.save();

    await affiliateRequest.save();

    //------Send Notification Here ------ //

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Affiliation request has been approved.",
      affiliateRequest,
    });
  }else if(status === 'rejected'){
    affiliateRequest.status = 'rejected';
    affiliateRequest.reviewedBy = req.user._id
    if(!user){
      const newUser = {
        email: affiliateRequest.requestedBy.email
      }
      try {
        await new Email(newUser).affiliateRejection()
        
      } catch (error) {
        console.log(error);
      }
    }

    //------Send Notification Here------//

    await affiliateRequest.save()

    res.status(200).json({
      status:"success",
      statusCode:200,
      message:"Affiliate request has been rejected",
      affiliateRequest
    })
  }
});
