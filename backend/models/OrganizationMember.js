const mongoose = require("mongoose");

const organizationMemberSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  role: { type: String, enum: ["organization_admin", "issuer", "approver", "student", "staff"], required: true },
  status: { type: String, enum: ["invited", "active", "suspended"], default: "active", index: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  activatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

organizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("OrganizationMember", organizationMemberSchema);
