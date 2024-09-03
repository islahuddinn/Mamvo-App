const express = require("express");
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");
const TermsandConditionController = require("../Controllers/termsAndConditionController");
const router = express.Router();

router.post('/create-terms', authController.protect,TermsandConditionController.createTermsOfService)
router.patch('/update-terms/:id', authController.protect, TermsandConditionController.updateTermsOfService)
router.delete('/delete-terms/:id', authController.protect,TermsandConditionController.deleteTermsOfService )
router.get('/', TermsandConditionController.getAllTermsOfService)
router.get('/get-one-term/:id',  TermsandConditionController.getOneTermsOfService)

module.exports = router;
