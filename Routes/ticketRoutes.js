const express = require('express')

const authController = require('../Controllers/authController')
const ticketController = require('../Controllers/ticketController')


const router = express.Router()


router.post('/book-ticket', authController.protect, ticketController.bookTicket)





module.exports = router     