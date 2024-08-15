const express = require('express')

const sellWithUsController = require('../Controllers/sellWithUsController')

const router = express.Router()



router.get('/', sellWithUsController.getAllSellWithUsRequests)
router.post('/create-sell-with-us-request', sellWithUsController.createSellWithUs)








module.exports = router