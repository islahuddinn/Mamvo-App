// const mongoose = require("mongoose");

// const eventSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   location: {
//     type: {
//       type: String,
//       default: "Point",
//     },
//     coordinates: { type: [Number], default: [0, 0] },
//   },
//   image: String,
//   price: {
//     type: Number,
//     default: 0,
//   },
//   eventInfo: {
//     type: String,
//     required: true,
//   },
//   age: {
//     type: String,
//     // required: true,
//   },
//   date: {
//     type: Date,
//     // required: true,
//   },
//   eventType: {
//     type: String,
//     enum: ["Todo", "Electronica", "Commercial", "Regue"],
//     required: true,
//   },
// });

// const Event = mongoose.model("Event", eventSchema);
// module.exports = Event;

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    eventId: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    display_date: {
      type: Date,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    image_url: {
      type: String,
      default: "",
    },
    outfit: {
      type: String,
      default: "casual",
    },
    ambiences: {
      type: [String],
      default: [],
    },
    music_genres: {
      type: [String],
      default: [],
    },
    artists: {
      type: [String],
      default: [],
    },
    organization_id: {
      type: String,
      required: true,
    },
    // location_id: {
    //   type: String,
    //   required: true,
    // },
    location: {
      // _id: {
      //   type: String,
      //   required: true,
      // },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      full_address: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      timezone: {
        type: String,
        required: true,
      },
    },
    // eventType: {
    //   type: String,
    //   enum: ["Todo", "Electronica", "Commercial", "Regue"],
    //   required: true,
    // },
    // createdBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  { timestamps: true }
);
// eventSchema.pre([/^find/, "save"], function (next) {
//   this.populate({
//     path: "createdBy",
//   });
//   next();
// });
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
