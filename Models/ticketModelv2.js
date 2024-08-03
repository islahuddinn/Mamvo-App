const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  ticketRateId: { type: String, required: true },
  qrCode: { type: String, required: true },
  status: { type: String, required: true },
  price: {
    priceId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    validUntil: { type: Date, required: true },
    quantity: { type: Number, required: true },
    feeType: { type: String, required: true },
    feeQuantity: { type: Number, required: true },
    includes: { type: String, required: true },
    additionalInfo: { type: String, required: true }
  },
  channelId: { type: String, required: true },
  fees: {
    organization: { type: Number, required: true },
    discocil: { type: Number, required: true }
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: Number, required: true },
  birthday: { type: Date, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  countryCode: { type: String, required: true },
  personalDocumentType: { type: String, required: true },
  personalDocumentNumber: { type: String, required: true },
  answers: [
    {
      questionId: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ],
  supplements: [
    {
      supplementId: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  refunded: { type: Number, required: true },
  refundedAt: { type: Date },
  refunds: [
    {
      channelId: { type: String, required: true },
      amount: { type: Number, required: true },
      at: { type: Date, required: true }
    }
  ],
  for: { type: Number, required: true },
  enter: { type: Number, required: true },
  entryTime: { type: Date, required: true },
  totalSupplements: { type: Number, required: true },
  totalFees: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  warranty: {
    total: { type: Number, required: true },
    hours: { type: Number, required: true }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
