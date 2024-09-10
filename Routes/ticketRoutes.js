const express = require('express')

const authController = require('../Controllers/authController')
const ticketController = require('../Controllers/ticketController')


const router = express.Router()


router.post('/book-ticket',  ticketController.bookTicket)
router.post('/webhook/payment-captured', ticketController.verifyTicketStatus)
router.patch('/verify-ticket-status/:paymentId', ticketController.verifyTicketStatus)
router.get('/get-my-tickets', authController.protect, ticketController.getMyBookedTickets)
router.get('/success')



module.exports = router     