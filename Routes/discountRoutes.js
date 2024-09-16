const express = require('express')
const authController = require('../Controllers/authController')
const discountController = require('../Controllers/discountController')


const router = express.Router()



router.get('/', discountController.getAllDiscounts)

router.get('/get-one-discount/:id', discountController.getOneDiscount)
router.post('/create-discount', authController.protect, discountController.createDiscount)
router.delete('/delete-discount/:id', authController.protect, discountController.deleteDiscount)
router.patch('/update-discount/:id', authController.protect, discountController.updateDiscount)








module.exports = router