const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Sub-schema for price details
const PriceSchema = new Schema({
  _id: String,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  valid_until: { type: Date, required: true },
  quantity: { type: Number, required: true },
  fee_type: { type: String, required: true },
  fee_quantity: { type: Number, required: true },
  includes: { type: String, required: true },
  additional_info: { type: String, required: true },
});

// Sub-schema for fees
const FeesSchema = new Schema({
  organization: { type: Number, required: true },
  discocil: { type: Number, required: true },
});

// Sub-schema for answers
const AnswerSchema = new Schema({
  question_id: { type: String, required: true },
  answer: { type: String, required: true },
});

// Sub-schema for supplements
const SupplementSchema = new Schema({
  supplement_id: { type: String, required: true },
  price: { type: Number, required: true },
});

// Sub-schema for refunds
const RefundSchema = new Schema({
  channel_id: { type: String, required: true },
  amount: { type: Number, required: true },
  at: { type: Date, required: true },
});

// Sub-schema for warranty
const WarrantySchema = new Schema({
  total: { type: Number, required: true },
  hours: { type: Number, required: true },
});

// Main schema for ticket
const TicketSchema = new Schema(
  {
    event_id: { type: String, required: true },
    ticket_rate_id: { type: String, required: true },
    qr_code: { type: String, required: true },
    status: { type: String, required: true },
    price: { type: PriceSchema, required: true },
    channel_id: { type: String, required: true },
    fees: { type: FeesSchema, required: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: Number, required: true },
    birthday: { type: Date, required: true },
    address: { type: String, required: true },
    postal_code: { type: String, required: true },
    country_code: { type: String, required: true },
    personal_document_type: { type: String, required: true },
    personal_document_number: { type: String, required: true },
    answers: { type: [AnswerSchema], default: [] },
    supplements: { type: [SupplementSchema], default: [] },
    refunded: { type: Number, required: true },
    refunded_at: { type: Date },
    refunds: { type: [RefundSchema], default: [] },
    for: { type: Number, required: true },
    enter: { type: Number, required: true },
    entry_time: { type: Date },
    total_supplements: { type: Number, required: true },
    total_fees: { type: Number, required: true },
    total_price: { type: Number, required: true },
    warranty: { type: WarrantySchema, required: true },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;
