const service = require("../services/trust/noticeService");

exports.createOrganization = async (req, res, next) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const slug = typeof req.body?.slug === "string" ? req.body.slug.trim().toLowerCase() : "";
    if (name.length < 2 || name.length > 120 || !/^[a-z0-9-]{3,80}$/.test(slug)) {
      return res.status(400).json({ success: false, message: "Provide a valid organization name and slug" });
    }
    const organization = await service.createOrganization({ user: req.user, name, slug, officialDomains: [] });
    return res.status(201).json({
      success: true,
      message: "Organization submitted for verification. It cannot publish notices until verified.",
      data: { id: organization._id, name: organization.name, slug: organization.slug, verificationStatus: organization.verificationStatus },
    });
  } catch (error) { return next(error); }
};

exports.addMember = async (req, res, next) => {
  try {
    const targetUserId = String(req.body?.userId || "");
    const role = String(req.body?.role || "");
    if (!/^[a-f\d]{24}$/i.test(targetUserId)) return res.status(400).json({ success: false, message: "Provide a valid user ID" });
    const member = await service.addMember({ actor: req.user, organizationId: req.params.organizationId, targetUserId, role });
    return res.status(201).json({ success: true, data: { id: member._id, organizationId: member.organizationId, userId: member.userId, role: member.role, status: member.status } });
  } catch (error) { return next(error); }
};

exports.createNotice = async (req, res, next) => {
  try {
    const { category, title, body, expiresAt } = req.body || {};
    if (!["general", "academic", "placement", "event", "fee_payment", "administrative"].includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid notice category" });
    }
    if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 180) {
      return res.status(400).json({ success: false, message: "Notice title must contain 3–180 characters" });
    }
    if (typeof body !== "string" || body.trim().length < 5 || body.trim().length > 12000) {
      return res.status(400).json({ success: false, message: "Notice body must contain 5–12,000 characters" });
    }
    const notice = await service.createNotice({
      actor: req.user, organizationId: req.params.organizationId,
      input: { category, title, body, expiresAt },
    });
    return res.status(201).json({ success: true, data: { id: notice._id, noticeId: notice.noticeId, status: notice.status, version: notice.version } });
  } catch (error) { return next(error); }
};

exports.submitNotice = async (req, res, next) => {
  try {
    const notice = await service.submitNotice({ actor: req.user, organizationId: req.params.organizationId, noticeObjectId: req.params.noticeId });
    return res.json({ success: true, data: { id: notice._id, noticeId: notice.noticeId, status: notice.status } });
  } catch (error) { return next(error); }
};

exports.publishNotice = async (req, res, next) => {
  try {
    const notice = await service.publishNotice({ actor: req.user, organizationId: req.params.organizationId, noticeObjectId: req.params.noticeId });
    return res.json({ success: true, message: "Notice published and signed", data: { noticeId: notice.noticeId, version: notice.version, status: notice.status, contentDigest: notice.contentDigest, signature: notice.signature, keyId: notice.keyId, signatureAlgorithm: notice.signatureAlgorithm } });
  } catch (error) { return next(error); }
};

exports.revokeNotice = async (req, res, next) => {
  try {
    const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 240) : "";
    const notice = await service.revokeNotice({ actor: req.user, organizationId: req.params.organizationId, noticeObjectId: req.params.noticeId, reason });
    return res.json({ success: true, data: { noticeId: notice.noticeId, status: notice.status } });
  } catch (error) { return next(error); }
};

exports.verifyNotice = async (req, res, next) => {
  try {
    const data = await service.verifyPublicNotice(req.params.verificationId);
    return res.json({ success: true, data });
  } catch (error) { return next(error); }
};
