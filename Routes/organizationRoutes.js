const express = require('express')
const authController = require('../Controllers/authController')
const organizationController = require('../Controllers/organizationController')



const router = express.Router()

router.get('/', organizationController.getAllOrganizations)







module.exports = router