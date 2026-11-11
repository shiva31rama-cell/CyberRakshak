const { randomBytes } = require("node:crypto");
const Organization = require("../../models/Organization");
const OrganizationMember = require("../../models/OrganizationMember");
const VerifiedNotice = require("../../models/VerifiedNotice");
const AuditEvent = require("../../models/AuditEvent");
const { signNotice, verifyNotice } = require("./noticeCryptoService");

const sensitiveCategories = new Set(["placement", "fee_payment", "administrative"]);
const publicFields = "noticeId version category title body issuedAt expiresAt status contentDigest signature keyId signatureAlgorithm organizationId issuerMemberId";

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function getActiveMembership(userId, organizationId) {
  const organization = await Organization.findOne({ _id: organizationId, verificationStatus: "verified" });
  if (!organization) throw createHttpError(404, "Verified organization not found");
  const member = await OrganizationMember.findOne({ organizationId, userId, status: "active" });
  if (!member) throw createHttpError(403, "Active organization membership required");
  return { organization, member };
}

async function writeAudit({ organizationId, userId, memberId, action, targetType, targetId, metadata = {} }) {
  await AuditEvent.create({ organizationId, actorUserId: userId, actorMemberId: memberId, action, targetType, targetId, metadata });
}

async function createOrganization({ user, name, slug, officialDomains = [] }) {
  const existing = await Organization.findOne({ $or: [{ slug }, { name }] });
  if (existing) throw createHttpError(409, "An organization with this name or slug already exists");
  const organization = await Organization.create({
    name, slug, officialDomains, verificationStatus: "pending", createdBy: user.id,
  });
  await writeAudit({
    organizationId: organization._id, userId: user.id, action: "organization.created",
    targetType: "Organization", targetId: organization._id,
  });
  // A self-created organization is never considered verified automatically.
  return organization;
}

async function addMember({ actor, organizationId, targetUserId, role }) {
  const { member: actorMember } = await getActiveMembership(actor.id, organizationId);
  if (actorMember.role !== "organization_admin") throw createHttpError(403, "Organization administrator role required");
  if (!["issuer", "approver", "student", "staff"].includes(role)) throw createHttpError(400, "Unsupported organization role");
  const member = await OrganizationMember.create({
    organizationId, userId: targetUserId, role, status: "active", invitedBy: actor.id,
  });
  await writeAudit({
    organizationId, userId: actor.id, memberId: actorMember._id,
    action: "member.added", targetType: "OrganizationMember", targetId: member._id, metadata: { role },
  });
  return member;
}

async function createNotice({ actor, organizationId, input }) {
  const { member } = await getActiveMembership(actor.id, organizationId);
  if (!["organization_admin", "issuer"].includes(member.role)) throw createHttpError(403, "Notice issuer role required");
  const noticeId = randomBytes(18).toString("base64url");
  const expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
  if (expiresAt && (!Number.isFinite(expiresAt.getTime()) || expiresAt <= new Date())) {
    throw createHttpError(400, "Expiry must be a valid future date");
  }
  const notice = await VerifiedNotice.create({
    organizationId, noticeId, version: 1, category: input.category, title: input.title.trim(),
    body: input.body.trim(), issuerMemberId: member._id, expiresAt, status: "draft",
  });
  await writeAudit({
    organizationId, userId: actor.id, memberId: member._id,
    action: "notice.created", targetType: "VerifiedNotice", targetId: notice._id,
  });
  return notice;
}

async function submitNotice({ actor, organizationId, noticeObjectId }) {
  const { member } = await getActiveMembership(actor.id, organizationId);
  const notice = await VerifiedNotice.findOne({ _id: noticeObjectId, organizationId, status: "draft" });
  if (!notice) throw createHttpError(404, "Draft notice not found");
  if (String(notice.issuerMemberId) !== String(member._id) && member.role !== "organization_admin") {
    throw createHttpError(403, "Only the issuer or organization administrator may submit this notice");
  }
  notice.status = "pending_approval";
  await notice.save();
  await writeAudit({
    organizationId, userId: actor.id, memberId: member._id,
    action: "notice.submitted", targetType: "VerifiedNotice", targetId: notice._id,
  });
  return notice;
}

async function publishNotice({ actor, organizationId, noticeObjectId }) {
  const { member } = await getActiveMembership(actor.id, organizationId);
  if (!["approver", "organization_admin"].includes(member.role)) throw createHttpError(403, "Approver role required");
  const notice = await VerifiedNotice.findOne({ _id: noticeObjectId, organizationId, status: "pending_approval" });
  if (!notice) throw createHttpError(404, "Pending notice not found");
  if (String(notice.issuerMemberId) === String(member._id)) throw createHttpError(403, "The issuer cannot approve their own notice");
  if (sensitiveCategories.has(notice.category) && member.role !== "approver" && member.role !== "organization_admin") {
    throw createHttpError(403, "Independent approver required");
  }
  const organization = await Organization.findOne({ _id: organizationId, verificationStatus: "verified" });
  if (!organization) throw createHttpError(409, "Organization is not verified");
  notice.issuedAt = new Date();
  const signature = signNotice(notice);
  notice.contentDigest = signature.contentDigest;
  notice.signature = signature.signature;
  notice.keyId = signature.keyId;
  notice.signatureAlgorithm = signature.signatureAlgorithm;
  notice.approvedByMemberId = member._id;
  notice.approvedAt = new Date();
  notice.status = "published";
  await notice.save();
  await writeAudit({
    organizationId, userId: actor.id, memberId: member._id,
    action: "notice.published", targetType: "VerifiedNotice", targetId: notice._id,
    metadata: { version: notice.version, keyId: notice.keyId },
  });
  return notice;
}

async function revokeNotice({ actor, organizationId, noticeObjectId, reason }) {
  const { member } = await getActiveMembership(actor.id, organizationId);
  if (!["organization_admin", "approver"].includes(member.role)) throw createHttpError(403, "Approver role required");
  const notice = await VerifiedNotice.findOne({ _id: noticeObjectId, organizationId, status: "published" });
  if (!notice) throw createHttpError(404, "Published notice not found");
  notice.status = "revoked";
  await notice.save();
  await writeAudit({
    organizationId, userId: actor.id, memberId: member._id,
    action: "notice.revoked", targetType: "VerifiedNotice", targetId: notice._id,
    metadata: { reason: String(reason || "Revoked by an authorised approver").slice(0, 240) },
  });
  return notice;
}

async function verifyPublicNotice(noticeId) {
  const notice = await VerifiedNotice.findOne({ noticeId }).select(publicFields).lean();
  if (!notice || notice.status === "draft" || notice.status === "pending_approval") {
    throw createHttpError(404, "Published notice not found");
  }
  const signatureValid = verifyNotice(notice);
  let currentStatus = notice.status;
  if (currentStatus === "published" && notice.expiresAt && new Date(notice.expiresAt) <= new Date()) currentStatus = "expired";
  return {
    notice: {
      noticeId: notice.noticeId, version: notice.version, category: notice.category,
      title: notice.title, body: notice.body, issuedAt: notice.issuedAt, expiresAt: notice.expiresAt,
      status: currentStatus, contentDigest: notice.contentDigest, keyId: notice.keyId,
      signatureAlgorithm: notice.signatureAlgorithm,
    },
    signatureValid,
    current: currentStatus === "published" && signatureValid,
    warning: "This confirms the registered notice record and its integrity. It does not prove who sent you a forwarded message or that the surrounding chat is genuine.",
  };
}

module.exports = { createOrganization, addMember, createNotice, submitNotice, publishNotice, revokeNotice, verifyPublicNotice, getActiveMembership };
