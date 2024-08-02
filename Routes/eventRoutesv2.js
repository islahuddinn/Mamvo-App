const express = require('express')
const authController = require('../Controllers/authController')
const eventController = require('../Controllers/eventControllerv2')


const router = express.Router()



router.get('/', eventController.getAllEvents)

router.get('/get-one-event/:eventId', eventController.getOneEvent)









module.exports = router