const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
  
    content: {
      type: String,
      required: [true, "Please provide content of this about us"],
      trim: true,
    }
  },
  { timestamps: true }
);

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

module.exports = AboutUs;
