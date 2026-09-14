const ScamReport = require("../models/ScamReport");

const ALLOWED_SCAM_TYPES = new Set(["phishing", "fake-job", "romance-scam", "investment-fraud", "upi-fraud", "sms-scam", "call-fraud", "other"]);

exports.submitScamReport = async (req, res) => {
  try {
    const { reporterEmail, reporterName, reporterPhone, scamType, scamDescription, suspectDetails, amountLost } = req.body || {};
    const cleanEmail = typeof reporterEmail === "string" ? reporterEmail.trim().toLowerCase() : "";
    const cleanName = typeof reporterName === "string" ? reporterName.trim() : "";
    const cleanPhone = typeof reporterPhone === "string" ? reporterPhone.trim().slice(0, 30) : "";
    const cleanType = typeof scamType === "string" ? scamType.trim() : "";
    const cleanDescription = typeof scamDescription === "string" ? scamDescription.trim() : "";
    const cleanSuspectDetails = typeof suspectDetails === "string" ? suspectDetails.trim().slice(0, 2000) : "";

    if (!cleanEmail || !cleanName || !cleanType || !cleanDescription) return res.status(400).json({ success: false, message: "Please provide all required fields" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    if (cleanName.length > 100) return res.status(400).json({ success: false, message: "Name is too long" });
    if (!ALLOWED_SCAM_TYPES.has(cleanType)) return res.status(400).json({ success: false, message: "Invalid scam type" });
    if (cleanDescription.length < 20 || cleanDescription.length > 2000) return res.status(400).json({ success: false, message: "Scam description must be between 20 and 2000 characters" });

    const numericAmount = amountLost === undefined || amountLost === "" ? 0 : Number(amountLost);
    if (!Number.isFinite(numericAmount) || numericAmount < 0 || numericAmount > 100000000) return res.status(400).json({ success: false, message: "Amount lost must be a valid non-negative number" });

    const report = await ScamReport.create({ userId: req.user?.id, reporterEmail: cleanEmail, reporterName: cleanName, reporterPhone: cleanPhone, scamType: cleanType, scamDescription: cleanDescription, suspectDetails: cleanSuspectDetails, amountLost: numericAmount });
    res.status(201).json({ success: true, message: "Scam report submitted successfully", caseNumber: report.caseNumber, report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Error submitting scam report" });
  }
};

exports.getAllScamReports = async (req, res) => { try { const reports = await ScamReport.find().sort({ reportedAt: -1 }).lean(); res.json({ success: true, count: reports.length, reports }); } catch { res.status(500).json({ success: false, message: "Error fetching scam reports" }); } };
exports.getScamReportByCaseNumber = async (req, res) => { try { const report = await ScamReport.findOne({ caseNumber: req.params.caseNumber }).lean(); if (!report) return res.status(404).json({ success: false, message: "Scam report not found" }); res.json({ success: true, report }); } catch { res.status(500).json({ success: false, message: "Error fetching scam report" }); } };
exports.getUserScamReports = async (req, res) => { try { if (req.user.role !== "admin" && req.user.id !== req.params.userId) return res.status(403).json({ success: false, message: "You can only view your own scam reports" }); const reports = await ScamReport.find({ userId: req.params.userId }).sort({ reportedAt: -1 }).lean(); res.json({ success: true, count: reports.length, reports }); } catch { res.status(500).json({ success: false, message: "Error fetching scam reports" }); } };
exports.updateScamReportStatus = async (req, res) => { try { const allowed = ["new", "under-investigation", "resolved"]; if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid report status" }); const report = await ScamReport.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }); if (!report) return res.status(404).json({ success: false, message: "Scam report not found" }); res.json({ success: true, message: "Scam report status updated", report }); } catch { res.status(400).json({ success: false, message: "Invalid scam report ID or status" }); } };
exports.getScamStatistics = async (req, res) => { try { const [totalReports, reportsByType, reportsByStatus] = await Promise.all([ScamReport.countDocuments(), ScamReport.aggregate([{ $group: { _id: "$scamType", count: { $sum: 1 }, totalAmountLost: { $sum: "$amountLost" } } }]), ScamReport.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])]); res.json({ success: true, statistics: { totalReports, reportsByType, reportsByStatus } }); } catch { res.status(500).json({ success: false, message: "Error fetching statistics" }); } };
