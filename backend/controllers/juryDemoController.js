const { analyzeMessage } = require("../services/analysis/cyberAnalysisService");
const { analyzeUrl } = require("../services/analysis/urlAnalysisService");
const chatController = require("./chatController");
const noticeService = require("../services/trust/noticeService");

exports.analyze = (req, res, next) => {
  try {
    const type = req.body?.type;
    const input = String(req.body?.input || "").trim();
    if (!input) return res.status(400).json({ success: false, message: "Input is required" });
    const result = type === "url" ? analyzeUrl(input) : type === "message" ? analyzeMessage(input) : null;
    if (!result) return res.status(400).json({ success: false, message: "Type must be message or url" });
    return res.json({
      success: true,
      riskLevel: result.riskLevel,
      indicators: result.indicators || [],
      explanation: result.explanation || "",
      recommendedActions: result.recommendedActions || [],
      evidenceStatus: result.evidenceStatus || "HEURISTIC_ONLY",
      analysisMethod: result.analysisMethod || "CyberRakshak analysis service",
      data: result,
    });
  } catch (error) { return next(error); }
};

// Reuse the existing chat controller, including cyber relevance gating,
// sensitive-input suppression, grounding and structured output validation.
exports.aiAssist = (req, res, next) => {
  const message = typeof req.body?.message === "string" ? req.body.message : "";
  if (!message.trim()) return res.status(400).json({ success: false, message: "Message is required" });
  req.body.messages = Array.isArray(req.body.messages) && req.body.messages.length
    ? req.body.messages
    : [{ role: "user", content: message.slice(0, 2000) }];
  return chatController.chat(req, res, next);
};

exports.verifyNotice = async (req, res, next) => {
  try {
    const result = await noticeService.verifyPublicNotice(req.params.id);
    return res.json({
      success: true,
      found: true,
      valid: result.signatureValid,
      current: result.current,
      notice: {
        id: result.notice.noticeId,
        noticeId: result.notice.noticeId,
        version: result.notice.version,
        category: result.notice.category,
        title: result.notice.title,
        body: result.notice.body,
        content: result.notice.body,
        issuer: "Verified campus issuer",
        status: result.notice.status,
        signatureValid: result.signatureValid,
        current: result.current,
        warning: result.warning,
      },
    });
  } catch (error) {
    if (error.status === 404) return res.status(404).json({ success: true, found: false, valid: false, notice: null });
    return next(error);
  }
};

exports.listMedia = async (req, res) => {
  // Empty is an honest live catalogue until a publisher/admin media workflow exists.
  return res.json({ success: true, items: [], mode: "live", message: "No media has been published yet." });
};

exports.listResources = async (req, res) => {
  return res.json({ success: true, items: [], mode: "live", message: "No resources have been published yet." });
};

exports.incidentIntake = async (req, res) => {
  // Deliberately do not store case narrative or evidence without an approved
  // retention, access and deletion policy. Return a transient assistance reference.
  const crypto = require("node:crypto");
  const description = typeof req.body?.description === "string" ? req.body.description.trim() : "";
  if (description.length < 10 || description.length > 3000) {
    return res.status(400).json({ success: false, message: "Provide a description between 10 and 3000 characters" });
  }
  if (req.body?.consent !== true) return res.status(400).json({ success: false, message: "Explicit consent is required" });
  const forbidden = /\b(?:otp|one[- ]time password|upi\s*pin|cvv|cvc|password|recovery code)\b\s*[:=-]?\s*\S+/i;
  if (forbidden.test(description)) return res.status(400).json({ success: false, message: "Remove credentials or secrets before submitting" });
  const referenceId = `CRK-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
  return res.status(202).json({
    success: true,
    referenceId,
    status: "RECEIVED_TRANSIENT",
    persisted: false,
    message: "A transient assistance reference was created. This is not an official police complaint and the narrative was not stored.",
  });
};

exports.comparePaymentInstruction = async (req, res) => {
  // No actual payment execution. This demo adapter only compares a fictional record.
  const { referenceId, beneficiary, amount } = req.body || {};
  if ([referenceId, beneficiary, amount].some((v) => typeof v !== "string" || !v.trim())) {
    return res.status(400).json({ success: false, message: "Reference, beneficiary and amount are required" });
  }
  const expected = { referenceId: "CRK-PAY-DEMO-01", beneficiary: "DEMO CAMPUS OFFICE", amount: "1000" };
  const matched = referenceId.trim() === expected.referenceId &&
    beneficiary.trim().toUpperCase() === expected.beneficiary &&
    amount.trim() === expected.amount;
  return res.json({
    success: true,
    matched,
    source: "SERVER_SIDE_SYNTHETIC_DEMO_RECORD",
    message: matched
      ? "Matches the fictional server-side demonstration record. This is not a bank or UPI approval."
      : "Details do not match the fictional record. Verify independently before taking action.",
  });
};
