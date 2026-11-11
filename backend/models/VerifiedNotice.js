const mongoose = require("mongoose");

const verifiedNoticeSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  noticeId: { type: String, required: true, unique: true, immutable: true, index: true },
  version: { type: Number, required: true, min: 1 },
  category: { type: String, enum: ["general", "academic", "placement", "event", "fee_payment", "administrative"], required: true },
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 180 },
  body: { type: String, required: true, trim: true, minlength: 5, maxlength: 12000 },
  issuerMemberId: { type: mongoose.Schema.Types.ObjectId, ref: "OrganizationMember", required: true },
  status: { type: String, enum: ["draft", "pending_approval", "published", "superseded", "revoked"], default: "draft", index: true },
  issuedAt: { type: Date, default: null },
  expiresAt: { type: Date, default: null },
  approvedByMemberId: { type: mongoose.Schema.Types.ObjectId, ref: "OrganizationMember", default: null },
  approvedAt: { type: Date, default: null },
  supersededBy: { type: String, default: null },
  contentDigest: { type: String, default: null },
  signature: { type: String, default: null },
  keyId: { type: String, default: null },
  signatureAlgorithm: { type: String, enum: ["Ed25519", null], default: null },
}, { timestamps: true });

verifiedNoticeSchema.index({ organizationId: 1, noticeId: 1 }, { unique: true });
verifiedNoticeSchema.index({ organizationId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("VerifiedNotice", verifiedNoticeSchema);
