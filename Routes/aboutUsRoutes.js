const express = require('express')
const aboutUsController = require('../Controllers/aboutUsController')
const authController = require('../Controllers/authController')


const router = express.Router()

router.post('/create-about', authController.protect,aboutUsController.createAboutUs)
router.patch('/update-about/:id', authController.protect, aboutUsController.updateAboutUs)
router.delete('/delete-about/:id', authController.protect,aboutUsController.deleteAboutUs )
router.get('/', aboutUsController.getAllAboutUs)
router.get('/get-one-about/:id',  aboutUsController.getAboutUs)




module.exports = router