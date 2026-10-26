const ScamReport = require("../models/ScamReport");

const ALLOWED_SCAM_TYPES = new Set(["phishing", "fake-job", "romance-scam", "investment-fraud", "upi-fraud", "sms-scam", "call-fraud", "other"]);
const ALLOWED_REPORT_STATUSES = new Set(["new", "under-investigation", "resolved", "closed"]);
const CASE_NUMBER_PATTERN = /^CASE-[A-F0-9]{32}$/;

function normalizeCaseNumber(value) {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  return CASE_NUMBER_PATTERN.test(normalized) ? normalized : null;
}

function getPagination(query = {}) {
  const requestedPage = Number.parseInt(query.page, 10);
  const requestedLimit = Number.parseInt(query.limit, 10);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, 1000000)
    : 1;
  const limit = Number.isSafeInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 100)
    : 20;
  return { page, limit, skip: (page - 1) * limit };
}

exports.submitScamReport = async (req, res) => {
  try {
    const {
      reporterEmail,
      reporterName,
      reporterPhone,
      scamType,
      scamDescription,
      suspectDetails,
      amountLost,
    } = req.body || {};
    const cleanEmail = typeof reporterEmail === "string" ? reporterEmail.trim().toLowerCase() : "";
    const cleanName = typeof reporterName === "string" ? reporterName.trim() : "";
    const cleanPhone = typeof reporterPhone === "string" ? reporterPhone.trim().slice(0, 30) : "";
    const cleanType = typeof scamType === "string" ? scamType.trim() : "";
    const cleanDescription = typeof scamDescription === "string" ? scamDescription.trim() : "";
    const cleanSuspectDetails = typeof suspectDetails === "string" ? suspectDetails.trim().slice(0, 2000) : "";

    if (!cleanEmail || !cleanName || !cleanType || !cleanDescription) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(cleanEmail) || cleanEmail.length > 254) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }
    if (cleanName.length > 100) {
      return res.status(400).json({ success: false, message: "Name is too long" });
    }
    if (!ALLOWED_SCAM_TYPES.has(cleanType)) {
      return res.status(400).json({ success: false, message: "Invalid scam type" });
    }
    if (cleanDescription.length < 20 || cleanDescription.length > 2000) {
      return res.status(400).json({ success: false, message: "Scam description must be between 20 and 2000 characters" });
    }

    const numericAmount = amountLost === undefined || amountLost === "" ? 0 : Number(amountLost);
    if (!Number.isFinite(numericAmount) || numericAmount < 0 || numericAmount > 100000000) {
      return res.status(400).json({ success: false, message: "Amount lost must be a valid non-negative number" });
    }

    const report = await ScamReport.create({
      userId: req.user?.id,
      reporterEmail: cleanEmail,
      reporterName: cleanName,
      reporterPhone: cleanPhone,
      scamType: cleanType,
      scamDescription: cleanDescription,
      suspectDetails: cleanSuspectDetails,
      amountLost: numericAmount,
    });
    return res.status(201).json({
      success: true,
      message: "Scam report submitted successfully",
      caseNumber: report.caseNumber,
    });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Please check the report fields and try again" });
    }
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "Could not create a unique report reference. Please try again" });
    }
    return res.status(500).json({ success: false, message: "Error submitting scam report" });
  }
};

exports.getAllScamReports = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const [reports, total] = await Promise.all([
      ScamReport.find().sort({ reportedAt: -1 }).skip(skip).limit(limit).lean(),
      ScamReport.countDocuments(),
    ]);
    return res.json({
      success: true,
      count: reports.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      reports,
    });
  } catch {
    return res.status(500).json({ success: false, message: "Error fetching scam reports" });
  }
};

exports.getScamReportByCaseNumber = async (req, res) => {
  const caseNumber = normalizeCaseNumber(req.params.caseNumber);
  if (!caseNumber) {
    return res.status(400).json({ success: false, message: "Invalid CyberRakshak case number" });
  }

  try {
    const report = await ScamReport.findOne({ caseNumber })
      .select("caseNumber status reportedAt")
      .lean();
    if (!report) {
      return res.status(404).json({ success: false, message: "Scam report not found" });
    }
    return res.json({
      success: true,
      report: {
        caseNumber: report.caseNumber,
        status: report.status,
        reportedAt: report.reportedAt,
      },
    });
  } catch {
    return res.status(500).json({ success: false, message: "Error fetching scam report" });
  }
};

exports.deleteScamReportByCaseNumber = async (req, res) => {
  const caseNumber = normalizeCaseNumber(req.params.caseNumber);
  if (!caseNumber) {
    return res.status(400).json({ success: false, message: "Invalid CyberRakshak case number" });
  }

  try {
    const report = await ScamReport.findOneAndDelete({ caseNumber }).select("_id").lean();
    if (!report) {
      return res.status(404).json({ success: false, message: "Scam report not found" });
    }
    return res.json({
      success: true,
      message: "Report deleted from active CyberRakshak records",
    });
  } catch {
    return res.status(500).json({ success: false, message: "Error deleting scam report" });
  }
};

exports.getUserScamReports = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  if (req.user.role !== "admin" && String(req.user.id) !== String(req.params.userId)) {
    return res.status(403).json({ success: false, message: "You can only view your own scam reports" });
  }

  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { userId: req.params.userId };
    const [reports, total] = await Promise.all([
      ScamReport.find(filter).sort({ reportedAt: -1 }).skip(skip).limit(limit).lean(),
      ScamReport.countDocuments(filter),
    ]);
    return res.json({
      success: true,
      count: reports.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      reports,
    });
  } catch {
    return res.status(500).json({ success: false, message: "Error fetching scam reports" });
  }
};

exports.updateScamReportStatus = async (req, res) => {
  const status = req.body?.status;
  if (!ALLOWED_REPORT_STATUSES.has(status)) {
    return res.status(400).json({ success: false, message: "Invalid report status" });
  }

  try {
    const report = await ScamReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!report) {
      return res.status(404).json({ success: false, message: "Scam report not found" });
    }
    return res.json({ success: true, message: "Scam report status updated", report });
  } catch (error) {
    const isInvalidInput = error?.name === "CastError" || error?.name === "ValidationError";
    return res.status(isInvalidInput ? 400 : 500).json({
      success: false,
      message: isInvalidInput ? "Invalid scam report ID or status" : "Error updating scam report status",
    });
  }
};

exports.getScamStatistics = async (req, res) => {
  try {
    const [totalReports, reportsByType, reportsByStatus] = await Promise.all([
      ScamReport.countDocuments(),
      ScamReport.aggregate([
        { $group: { _id: "$scamType", count: { $sum: 1 }, totalAmountLost: { $sum: "$amountLost" } } },
      ]),
      ScamReport.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);
    return res.json({ success: true, statistics: { totalReports, reportsByType, reportsByStatus } });
  } catch {
    return res.status(500).json({ success: false, message: "Error fetching statistics" });
  }
};
