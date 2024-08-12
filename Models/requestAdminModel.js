const mongoose = require('mongoose')
const validator = require('validator')



const requestAdminSchema = new mongoose.Schema({

    requestedBy:{
        name:{
            type: String,
            required:[true,'Please provide your name']
        },

        email: {
            type: String,
            required: [true, "Please provide your email"],
            trim: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please choose a valid Email address"],
          },
          
        phoneNumber:{
            type: String,
            required:[true,'phoneNumber is a required field']
        },
        
        addressInfo:{
            location: {
              type: {
                  type: String,
                  default: "Point"
              },
              coordinates: {
                  type: [Number],
                  default: [0.0,0.0]
              },
              address: {
                  type: String     
              }
            },
      
        },

        description:{
            type: String,
            required:[true,'Provide description for your request']
        }
    },

    type: {
        type: String,
        enum:{
            values:['affiliate-request', 'pr-request'],
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



const RequestAdmin = mongoose.model('RequestAdmin', requestAdminSchema)

module.exports = RequestAdmin