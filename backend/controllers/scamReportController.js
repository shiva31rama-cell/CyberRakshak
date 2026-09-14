const ScamReport = require("../models/ScamReport");

const cleanText = (value, maxLength) => String(value ?? "").trim().slice(0, maxLength);

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
    } = req.body;

    if (!reporterEmail || !reporterName || !scamType || !scamDescription) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const numericAmount = amountLost === undefined || amountLost === "" ? 0 : Number(amountLost);
    const description = cleanText(scamDescription, 2000);

    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount lost must be a valid non-negative number",
      });
    }

    if (description.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least 20 characters describing what happened",
      });
    }

    const report = await ScamReport.create({
      userId: req.user?.id,
      reporterEmail: cleanText(reporterEmail, 160).toLowerCase(),
      reporterName: cleanText(reporterName, 120),
      reporterPhone: cleanText(reporterPhone, 40),
      scamType: cleanText(scamType, 40),
      scamDescription: description,
      suspectDetails: cleanText(suspectDetails, 2000),
      amountLost: numericAmount,
    });

    return res.status(201).json({
      success: true,
      message: "Scam report submitted successfully",
      caseNumber: report.caseNumber,
      status: report.status,
      reportedAt: report.reportedAt,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error submitting scam report",
    });
  }
};

exports.getAllScamReports = async (req, res) => {
  try {
    const reports = await ScamReport.find()
      .sort({ reportedAt: -1 })
      .lean();

    return res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching scam reports",
    });
  }
};

exports.getScamReportByCaseNumber = async (req, res) => {
  try {
    const caseNumber = cleanText(req.params.caseNumber, 80);
    const report = await ScamReport.findOne({ caseNumber })
      .select("caseNumber status scamType reportedAt updatedAt")
      .lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Scam report not found",
      });
    }

    return res.json({
      success: true,
      report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching scam report",
    });
  }
};

exports.getUserScamReports = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own scam reports",
      });
    }

    const reports = await ScamReport.find({ userId: req.params.userId })
      .sort({ reportedAt: -1 })
      .lean();

    return res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching scam reports",
    });
  }
};

exports.updateScamReportStatus = async (req, res) => {
  try {
    const allowedStatuses = ["new", "investigating", "resolved", "closed"];
    const status = cleanText(req.body?.status, 40);

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status",
      });
    }

    const report = await ScamReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Scam report not found",
      });
    }

    return res.json({
      success: true,
      message: "Scam report status updated",
      report,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid scam report ID or status",
    });
  }
};

exports.getScamStatistics = async (req, res) => {
  try {
    const [totalReports, totalLossResult, reportsByType, reportsByStatus] = await Promise.all([
      ScamReport.countDocuments(),
      ScamReport.aggregate([
        {
          $group: {
            _id: null,
            totalAmountLost: { $sum: "$amountLost" },
          },
        },
      ]),
      ScamReport.aggregate([
        {
          $group: {
            _id: "$scamType",
            count: { $sum: 1 },
            totalAmountLost: { $sum: "$amountLost" },
          },
        },
        { $sort: { count: -1 } },
      ]),
      ScamReport.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    return res.json({
      success: true,
      statistics: {
        totalReports,
        totalAmountLost: totalLossResult[0]?.totalAmountLost || 0,
        reportsByType,
        reportsByStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching statistics",
    });
  }
};
