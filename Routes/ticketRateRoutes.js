const express = require('express')
const authController = require('../Controllers/authController')
const ticketRateController = require('../Controllers/ticketRateController')



const router = express.Router()


router.get('/:eventId', ticketRateController.getAllTicketRatesOfEvent)
router.get('/get-one-ticket-rate/:ticketRateId', ticketRateController.getOneTicketRate)




module.exports = router