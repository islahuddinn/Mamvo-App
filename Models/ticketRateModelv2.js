const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceSchema = new Schema({
  priceId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  valid_until: { type: Date },
  fee_type: { type: String },
  fee_quantity: { type: Number },
  includes: { type: String },
  additional_info: { type: String },
  quantity: { type: Number }
});

const supplementSchema = new Schema({
  supplementId: { type: String, required: true },
  label: { type: String, required: true },
  price: { type: Number, required: true }
});

const questionSchema = new Schema({
  questionId: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, required: true },
  items: [String]
});

const ticketRateSchema = new Schema({
  ticketRateId: { type: String, required: true, unique: true },
  organization_id: { type: String, required: true },
  event_id: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String },
  valid_from: { type: Date },
  complete: { type: Boolean },
  type: { type: String },
  show_all_prices: { type: Boolean },
  prices: [priceSchema],
  supplements: [supplementSchema],
  warranty: {
    enabled: { type: Boolean },
    percentage: { type: Number },
    hours: { type: Number }
  },
  available: { type: Boolean },
  current_price: priceSchema,
  availability: {
    sold: { type: Number },
    available: { type: Number }
  },
  min: { type: Number },
  max: { type: Number },
  fields: [{
    type: { type: String, required: true },
    required: { type: Boolean, required: true },
    label: { type: String, required: true },
    slug: { type: String, required: true }
  }],
  questions: [questionSchema]
});

module.exports = mongoose.model('TicketRate', ticketRateSchema);
