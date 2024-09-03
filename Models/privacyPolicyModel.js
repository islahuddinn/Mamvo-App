const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema(
  {
    
    content: {
      type: String,
      required: [true, "Please provide content of this policy"],
      trim: true,
    }

  },
  { timestamps: true }
);

const PrivacyPolicy = mongoose.model("PrivacyPolicy", privacyPolicySchema);

module.exports = PrivacyPolicy;
