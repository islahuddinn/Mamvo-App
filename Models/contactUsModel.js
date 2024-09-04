const mongoose = require('mongoose')
const validator = require('validator')

const contactUsSchema = new mongoose.Schema({
    content:{
        type: String,
        required:[true,"Provide content for contact us page."],
        trim: true
    },
    email:{
        type: String,
        required: [true, "Please provide your contact email"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please choose a valid email address"]
    },
    phone:{
        type: String,
        required:[true,"Please provide your contact phone no."],
        unique: true,
        trim: true
    },

    facebook:{
        type: String,
        trim:true
    },
    twitter:{
        type: String,
        trim:true
    },
    linkedin:{
        type: String,
        trim:true
    },
    website:{
        type: String,
        trim:true
    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})


const ContactUs = mongoose.model('ContactUs', contactUsSchema)

module.exports = ContactUs