const mongoose = require('mongoose')



const discountSchema = new mongoose.Schema({
    brandName:{
        type: String,
        trim: true,
        required:[true,'Please provide brand name who is providing the discount']
    },
    brandLogo:{
        type: String,
        trim: true,
        required:[true,'Please provide brand logo who is providing the discount']
    },
    discount:{
        type: String,
        trim: true,
        required:[true,'Please provide discount percentage']
    },
    description:{
        type: String,
        trim: true,
        required:[true,'Please provide description for the discount']
    },

    qrCode:{
        type: String,
        trim: true,
    },
    
    discountUrl:{
        type: String,
        trim: true
    },

    isQr:{
        type: Boolean,
        default: false
    },

    isUrl:{
        type: Boolean,
        default: false
    }

},{timestamps:true})



const Discount = mongoose.model('Discount', discountSchema)



module.exports = Discount