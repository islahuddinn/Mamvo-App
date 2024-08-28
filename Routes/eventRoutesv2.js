const express = require('express')
const authController = require('../Controllers/authController')
const eventController = require('../Controllers/eventControllerv2')


const router = express.Router()



router.get('/', eventController.getAllEvents)
router.get('/get-upcoming-events', eventController.getUpComingEvents)
router.get('/get-one-event/:eventId', eventController.getOneEvent)
router.post('/create-custom-event', authController.protect, eventController.createCustomEvent)
router.delete('/delete-event/:id', authController.protect, eventController.deleteEvent)
router.patch('/update-event/:id', authController.protect, eventController.updateEvent)








module.exports = router