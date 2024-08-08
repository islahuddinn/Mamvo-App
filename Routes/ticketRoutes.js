const express = require('express')

const authController = require('../Controllers/authController')
const ticketController = require('../Controllers/ticketController')


const router = express.Router()


router.post('/book-ticket',  ticketController.bookTicket)
router.get('/success')



module.exports = router     