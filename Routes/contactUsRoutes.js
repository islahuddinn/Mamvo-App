const express = require('express')
const contactUsController = require('../Controllers/contactUsController')
const authController = require('../Controllers/authController')


const router = express.Router()

router.post('/create-contact', authController.protect,contactUsController.createContactUs)
router.patch('/update-contact/:id', authController.protect, contactUsController.updateContactUs)
router.delete('/delete-contact/:id', authController.protect,contactUsController.deleteContactUs )
router.get('/', contactUsController.getAllContactUs)
router.get('/get-one-contact/:id',  contactUsController.getContactUs)





module.exports = router