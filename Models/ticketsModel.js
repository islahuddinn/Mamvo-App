const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Sub-schema for prices
const PriceSchema = new Schema({
  _id: String,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  valid_until: { type: Date, required: true },
  quantity: { type: Number, required: true },
  fee_type: { type: String, required: true },
  fee_quantity: { type: Number, required: true },
  includes: { type: String, default: "" },
  additional_info: { type: String, default: "" },
});

// Sub-schema for supplements
const SupplementSchema = new Schema({
  _id: String,
  label: { type: String, required: true },
  price: { type: Number, required: true },
});

// Sub-schema for warranty
const WarrantySchema = new Schema({
  enabled: { type: Boolean, required: true },
  percentage: { type: Number, required: true },
  hours: { type: Number, required: true },
});

// Sub-schema for availability
const AvailabilitySchema = new Schema({
  sold: { type: Number, required: true },
  available: { type: Number, required: true },
});

// Sub-schema for questions
const QuestionSchema = new Schema({
  _id: String,
  label: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, required: true },
  items: { type: [String], default: [] },
});

// Main schema for event ticket prices
const EventTicketPriceSchema = new Schema(
  {
    event_id: { type: String, required: true },
    organization_id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    valid_from: { type: Date, required: true },
    complete: { type: Boolean, required: true },
    type: { type: String, required: true },
    show_all_prices: { type: Boolean, required: true },
    prices: [PriceSchema],
    supplements: [SupplementSchema],
    available: { type: Boolean, required: true },
    current_price: PriceSchema,
    warranty: WarrantySchema,
    availability: AvailabilitySchema,
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

const EventTicketPrice = mongoose.model(
  "EventTicketPrice",
  EventTicketPriceSchema
);
module.exports = EventTicketPrice;
