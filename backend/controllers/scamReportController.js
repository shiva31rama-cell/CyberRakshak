const ScamReport = require("../models/ScamReport");

exports.submitScamReport = async (req, res) => {
  try {
    const { reporterEmail, reporterName, reporterPhone, scamType, scamDescription, suspectDetails, amountLost } = req.body;
    if (!reporterEmail || !reporterName || !scamType || !scamDescription) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const numericAmount = amountLost === undefined || amountLost === "" ? 0 : Number(amountLost);
    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      return res.status(400).json({ success: false, message: "Amount lost must be a valid non-negative number" });
    }

    const report = await ScamReport.create({
      userId: req.user?.id,
      reporterEmail: String(reporterEmail).trim().toLowerCase(),
      reporterName: String(reporterName).trim(),
      reporterPhone: String(reporterPhone || "").trim(),
      scamType: String(scamType).trim(),
      scamDescription: String(scamDescription).trim(),
      suspectDetails: String(suspectDetails || "").trim(),
      amountLost: numericAmount,
    });

    // Do not expose the complete report (including contact/suspect details) in a public response.
    res.status(201).json({
      success: true,
      message: "Scam report submitted successfully",
      caseNumber: report.caseNumber,
      status: report.status,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Error submitting scam report" });
  }
};

exports.getAllScamReports = async (req, res) => {
  try {
    const reports = await ScamReport.find().sort({ reportedAt: -1 }).lean();
    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching scam reports" });
  }
};

exports.getScamReportByCaseNumber = async (req, res) => {
  try {
    const report = await ScamReport.findOne({ caseNumber: req.params.caseNumber })
      .select("caseNumber status scamType reportedAt updatedAt")
      .lean();
    if (!report) return res.status(404).json({ success: false, message: "Scam report not found" });

    // Case tracking is intentionally limited to non-sensitive status information.
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching scam report" });
  }
};

exports.getUserScamReports = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.userId) {
      return res.status(403).json({ success: false, message: "You can only view your own scam reports" });
    }
    const reports = await ScamReport.find({ userId: req.params.userId }).sort({ reportedAt: -1 }).lean();
    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching scam reports" });
  }
};

exports.updateScamReportStatus = async (req, res) => {
  try {
    const allowed = ["new", "under-investigation", "resolved"];
    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: "Invalid report status" });
    }

    const report = await ScamReport.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!report) return res.status(404).json({ success: false, message: "Scam report not found" });
    res.json({ success: true, message: "Scam report status updated", report });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid scam report ID or status" });
  }
};

exports.getScamStatistics = async (req, res) => {
  try {
    const [totalReports, reportsByType, reportsByStatus] = await Promise.all([
      ScamReport.countDocuments(),
      ScamReport.aggregate([
        { $group: { _id: "$scamType", count: { $sum: 1 }, totalAmountLost: { $sum: "$amountLost" } } },
      ]),
      ScamReport.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);
    res.json({ success: true, statistics: { totalReports, reportsByType, reportsByStatus } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching statistics" });
  }
};
