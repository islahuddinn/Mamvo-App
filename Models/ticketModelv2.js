const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  ticketRateId: { type: String, required: true },
  ticketId:{type: String, required: true},
  qrCode: { type: String, required: true },
  status: { type: String, required: true },
  price: {
    priceId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    // validUntil: { type: Date, required: true },
    // quantity: { type: Number, required: true },
    feeType: { type: String, required: true },
    feeQuantity: { type: Number, required: true },
    includes: { type: String, required: true },
    additionalInfo: { type: String }
  },
  channelId: { type: String, required: true },
  fees: {
    organization: { type: Number, required: true },
    //discocil: { type: Number, required: true }
  },
  fullName: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  gender: { type: Number,  },
  birthday: { type: Date,  },
  address: { type: String,  },
  postalCode: { type: String,  },
  countryCode: { type: String,  },
  // personalDocumentType: { type: String, required: true },
  // personalDocumentNumber: { type: String, required: true },
  answers: [
    {
      questionId: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ],
  supplements: [
    {
      supplementId: { type: String, required: true },
      label: {type: String, required: true},
      price: { type: Number, required: true }
    }
  ],
  refunded: { type: Number, required: true },
  refundedAt: { type: Date },
  refunds: [
    {
      channelId: { type: String },
      amount: { type: Number },
      at: { type: Date }
    }
  ],
  for: { type: Number, required: true },
  enter: { type: Number, required: true },
  //entryTime: { type: Date, required: true },
  totalSupplements: { type: Number, required: true },
  totalFees: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  // warranty: {
  //   total: { type: Number, required: true },
  //   hours: { type: Number, required: true }
  // },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  userType:{
    type: String,
    enum:{
      values: ['registered-user', 'guest-user'],
      message: "Please select a valid user Type",
      
    },

    required: [true,"Please specify the user type"]
  },

  paymentId:{type: String, required: true}
}, {timestamps:true});


ticketSchema.pre([/^find/, 'save'], function(next){
  this.populate({
    path: 'userId',
    select: 'isNotifications'
  })

  next()
})

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
