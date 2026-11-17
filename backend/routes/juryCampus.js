const express = require("express");
const { randomBytes } = require("node:crypto");
const { protect } = require("../middleware/auth");
const Organization = require("../models/Organization");
const OrganizationMember = require("../models/OrganizationMember");
const VerifiedNotice = require("../models/VerifiedNotice");
const AuditEvent = require("../models/AuditEvent");
const { signNotice } = require("../services/trust/noticeCryptoService");

const router = express.Router();

async function getMember(req, organizationId) {
  const organization = await Organization.findOne({ _id: organizationId, verificationStatus: "verified" });
  if (!organization) return { error: [404, "Verified organization not found"] };
  const member = await OrganizationMember.findOne({ organizationId, userId: req.user.id, status: "active" });
  if (!member) return { error: [403, "Active organization membership required"] };
  return { organization, member };
}

async function audit(organizationId, req, member, action, targetId, metadata = {}) {
  await AuditEvent.create({
    organizationId,
    actorUserId: req.user.id,
    actorMemberId: member?._id || null,
    action,
    targetType: "VerifiedNotice",
    targetId,
    metadata,
  });
}

// Trusted campus membership and notice operations.
// Platform-wide User.role=admin is deliberately not silently mapped to campus trust roles.
router.get("/organizations/:organizationId/notices", protect, async (req, res, next) => {
  try {
    const ctx = await getMember(req, req.params.organizationId);
    if (ctx.error) return res.status(ctx.error[0]).json({ success: false, message: ctx.error[1] });
    const notices = await VerifiedNotice.find({ organizationId: req.params.organizationId })
      .sort({ createdAt: -1 }).limit(50)
      .select("noticeId version category title body status issuedAt expiresAt createdAt approvedAt contentDigest keyId");
    return res.json({ success: true, items: notices });
  } catch (error) { return next(error); }
});

router.post("/organizations/:organizationId/notices/:id/review", protect, async (req, res, next) => {
  try {
    const ctx = await getMember(req, req.params.organizationId);
    if (ctx.error) return res.status(ctx.error[0]).json({ success: false, message: ctx.error[1] });
    const { member } = ctx;
    if (!["approver", "organization_admin"].includes(member.role)) return res.status(403).json({ success: false, message: "Approver role required" });
    const notice = await VerifiedNotice.findOne({
      organizationId: req.params.organizationId,
      _id: req.params.id,
      status: "pending_approval",
    });
    if (!notice) return res.status(404).json({ success: false, message: "Pending notice not found" });
    if (String(notice.issuerMemberId) === String(member._id)) return res.status(403).json({ success: false, message: "Issuer cannot approve own notice" });
    if (["placement", "fee_payment", "administrative"].includes(notice.category) && !["approver", "organization_admin"].includes(member.role)) {
      return res.status(403).json({ success: false, message: "Independent approver required" });
    }
    const issuedAt = new Date();
    const signature = signNotice({ ...notice.toObject(), issuedAt });
    const approved = await VerifiedNotice.findOneAndUpdate(
      { _id: notice._id, organizationId: req.params.organizationId, status: "pending_approval", issuerMemberId: { $ne: member._id } },
      { $set: {
        issuedAt,
        approvedByMemberId: member._id,
        approvedAt: issuedAt,
        contentDigest: signature.contentDigest,
        signature: signature.signature,
        keyId: signature.keyId,
        signatureAlgorithm: signature.signatureAlgorithm,
        status: "published",
      }},
      { new: true, runValidators: true }
    );
    if (!approved) return res.status(409).json({ success: false, message: "Notice state changed; reload and review again" });
    await audit(req.params.organizationId, req, member, "notice.published", approved._id, { version: approved.version, keyId: approved.keyId });
    return res.json({ success: true, data: { noticeId: approved.noticeId, version: approved.version, status: approved.status, contentDigest: approved.contentDigest, signature: approved.signature, keyId: approved.keyId } });
  } catch (error) { return next(error); }
});

module.exports = router;
