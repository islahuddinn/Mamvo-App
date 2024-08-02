const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new Schema({
    eventId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String },
    description: { type: String },
    display_date: { type: Date },
    start_date: { type: Date },
    end_date: { type: Date },
    code: { type: String },
    age: { type: Number },
    image_url: { type: String },
    outfit: { type: String },
    ambiences: [String],
    music_genres: [String],
    artists: [{
      name: { type: String },
      image_url: { type: String }
    }],
    organization_id: { type: String },
    location: {
      _id: { type: String },
      address: { type: String },
      city: { type: String },
      country: { type: String },
      full_address: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      timezone: { type: String }
    }
  });
  
  module.exports = mongoose.model('Event', eventSchema);
  