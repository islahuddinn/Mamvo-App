const express = require("express");
const userControler = require("../Controllers/userController");
const affiliateControler = require("../Controllers/affiliateController");
const prController = require('../Controllers/prController')
const authController = require("../Controllers/authController");
// const apiController = require("../Controllers/apiController");
// const pushNotificationController = require("../controllers/push-notificationController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/socialLogin", authController.socialLogin);
router.post("/guestLogin", authController.signup);
// router.post("/PRUser", affiliateControler.PRUser);
router.post("/verify", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/sendOTP", authController.sendOTP);
router.post("/verifyOTP", authController.verifyOtp);
router.post("/refresh/:token", authController.refresh);
router.post("/forgetPassword", authController.forgotPassword);
router.patch("/resetPassword", authController.resetPassword);
router.post(
  "/verifyOTPResetPassword",
  authController.verifyOtpForResetPassword
);

router.post(
  "/request-affiliate-approval",
  affiliateControler.requestAffiliateApproval
);

router.patch('/change-affiliate-status/:affiliateRequestId', affiliateControler.changeRequestStatus)
router.get('/get-all-affiliate-requests', affiliateControler.getAllAffiliateRequests)

// protecting all routes ussing protect midleware
router.use(authController.protect);
router.post(
  "/request-affiliate-approval",
  affiliateControler.requestAffiliateApproval
);

router.patch('/change-affiliate-status/:affiliateRequestId', affiliateControler.changeRequestStatus)
router.get('/get-all-affiliate-requests', affiliateControler.getAllAffiliateRequests)



router.post(
  "/request-pr-approval",
  prController.requestPRApproval
);

router.patch('/change-pr-status/:prRequestId', prController.changeRequestStatus)
router.get('/get-all-pr-requests', prController.getAllPRRequests)



router.get("/mynotifications", userControler.mynotifications);

//router.post("/requestAprroved", affiliateControler.requestApproved);
// router.post("/handleEventCommission", affiliateControler.calculateCashback);
router.patch("/updateMyPassword", authController.updatePassword);
router.post("/logout", authController.logout);
// router.post(
//   "/send-notification",
//   pushNotificationController.sendPushNotification
// );

router.get("/me", userControler.getMe, userControler.getUser);
router.patch("/updateProfile", userControler.updateMe);
// router.patch("/updateMe", userControler.updateMe);
// router.patch("/updateProfile", userControler.updateUserProfile);
router.route("/getAllUsers").get(userControler.getAllUsers);
router.get("/getwallet", userControler.getWalletBalance);

// router.use(authController.restrictTo("admin"));
// router.route("/").post(userControler.createUser);

router
  .route("/:id")
  .get(userControler.getUser)
  .patch(userControler.updateUser)
  .delete(userControler.deleteUser)
  .post(userControler.deleteUser);

module.exports = router;
