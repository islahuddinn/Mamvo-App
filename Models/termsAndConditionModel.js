const mongoose = require("mongoose");

const termsOfServiceSchema = new mongoose.Schema(
  {
    
    content: {
      type: String,
      required: [true, "Please provide content of this term"],
      trim: true,
    }
  },
  { timestamps: true }
);

const TermsOfService = mongoose.model("TermsOfService", termsOfServiceSchema);

module.exports = TermsOfService;
