const mongoose = require('mongoose')



const notificationSchema = new mongoose.Schema({
    notificationType:{
        type: String,
        required:[true, "Please define your notification type."],
        enum:{
            values: ['message', 'password-reset', 'pr-request', 'affiliate-request', 'free-attendance-request'],
            message:"Please select a valid notification type."
        }
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title:{
        type: String,
        trim: true
    },
    body:{
        type: String,
        trim: true
    },
    data:{
        type: Object
    }
},{timestamps: true})


const Notification = mongoose.model('Notification', notificationSchema)


module.exports = Notification