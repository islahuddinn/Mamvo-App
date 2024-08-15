const mongoose = require('mongoose')
const validator = require('validator')


const sellWithUsSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please provide your name']
    },

    email: {
        type: String,
        required: [true, "Email is a required Field"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please choose a valid Email address"],
      },
      
    phoneNumber:{
        type: String,
        required:[true,'Please provide your phone number']
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
        required:[true,'Please provide the description.']
      }

}, {timestamps:true})


const SellWithUs = mongoose.model('SellWithUs', sellWithUsSchema)


module.exports = SellWithUs
