const express = require('express')

const authController = require('../Controllers/authController')
const freeAttendanceController = require('../Controllers/freeAttendanceController')
const router = express.Router()



router.post('/request-free-attendance/:eventId', authController.protect, freeAttendanceController.requestFreeAttendance)
router.get('/get-all-free-attendance-requests', authController.protect, freeAttendanceController.getAllFreeAttendanceRequests)
router.post('/change-free-attendance-request-status/:freeAttendanceRequestId', authController.protect, freeAttendanceController.changeRequestStatus)









module.exports = router