const mongoose = require('mongoose')
const validator = require('validator')



const requestAdminSchema = new mongoose.Schema({

    requestedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },

    type: {
        type: String,
        enum:{
            values:['affiliate-request', 'pr-request', 'free-attendance-request'],
            message:"Please provide valid type value"
        },
        required:[true,'type is a required field']
    },

    reviewedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    status:{
        type: String,
        enum:{
            values:['pending', 'approved', 'rejected'],
            message:"Please provide valid status value"
        },

        default: 'pending'
    }
    

},{timestamps:true})


requestAdminSchema.pre([/^find/, 'save'], function(next){
    this.populate({
        path: 'requestedBy',
        select: 'name fullName email'
    })

    this.populate({
        path: 'event'
    })

    next()
})





const RequestAdmin = mongoose.model('RequestAdmin', requestAdminSchema)

module.exports = RequestAdmin