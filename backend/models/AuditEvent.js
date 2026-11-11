const mongoose = require("mongoose");

const auditEventSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  actorMemberId: { type: mongoose.Schema.Types.ObjectId, ref: "OrganizationMember", default: null },
  action: { type: String, required: true, enum: ["organization.created", "member.added", "notice.created", "notice.submitted", "notice.published", "notice.revoked"] },
  targetType: { type: String, required: true, enum: ["Organization", "OrganizationMember", "VerifiedNotice"] },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true, versionKey: false });

auditEventSchema.index({ organizationId: 1, createdAt: -1 });

module.exports = mongoose.model("AuditEvent", auditEventSchema);
