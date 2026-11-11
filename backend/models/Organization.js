const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  slug: { type: String, required: true, trim: true, lowercase: true, match: /^[a-z0-9-]{3,80}$/ },
  officialDomains: [{ type: String, trim: true, lowercase: true, maxlength: 253 }],
  verificationStatus: { type: String, enum: ["pending", "verified", "suspended"], default: "pending", index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  verifiedAt: { type: Date, default: null },
}, { timestamps: true });

organizationSchema.index({ slug: 1 }, { unique: true });
organizationSchema.index({ name: 1 });

module.exports = mongoose.model("Organization", organizationSchema);
