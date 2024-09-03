const express = require("express");
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");
const PrivacyController = require("../Controllers/privacy-policyController");
const router = express.Router();

router.post('/create-policy', authController.protect,PrivacyController.createPrivacyPolicy)
router.patch('/update-policy/:id', authController.protect, PrivacyController.updatePrivacyPolicy)
router.delete('/delete-policy/:id', authController.protect,PrivacyController.deletePrivacyPolicy )
router.get('/', PrivacyController.getAllPrivacyPolicy)
router.get('/get-one-policy/:id',  PrivacyController.getOnePrivacyPolicy)

module.exports = router;
