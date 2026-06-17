const ScamReport = require("../models/ScamReport");

// @desc    Submit scam report
// @route   POST /api/scam-report
// @access  Public
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

    // Validation
    if (!reporterEmail || !reporterName || !scamType || !scamDescription) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const report = await ScamReport.create({
      userId: req.user?.id,
      reporterEmail,
      reporterName,
      reporterPhone: reporterPhone || "",
      scamType,
      scamDescription,
      suspectDetails: suspectDetails || "",
      amountLost: amountLost || 0,
    });

    res.status(201).json({
      success: true,
      message: "Scam report submitted successfully",
      caseNumber: report.caseNumber,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error submitting scam report",
    });
  }
};

// @desc    Get all scam reports (Admin only)
// @route   GET /api/scam-report
// @access  Private
exports.getAllScamReports = async (req, res) => {
  try {
    const reports = await ScamReport.find().sort({ reportedAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching scam reports",
    });
  }
};

// @desc    Get scam report by case number
// @route   GET /api/scam-report/:caseNumber
// @access  Public
exports.getScamReportByCaseNumber = async (req, res) => {
  try {
    const report = await ScamReport.findOne({
      caseNumber: req.params.caseNumber,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Scam report not found",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching scam report",
    });
  }
};

// @desc    Get scam reports by user
// @route   GET /api/scam-report/user/:userId
// @access  Private
exports.getUserScamReports = async (req, res) => {
  try {
    const reports = await ScamReport.find({
      userId: req.params.userId,
    }).sort({ reportedAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching scam reports",
    });
  }
};

// @desc    Update scam report status (Admin only)
// @route   PATCH /api/scam-report/:id
// @access  Private
exports.updateScamReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const report = await ScamReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Scam report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Scam report status updated",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating scam report",
    });
  }
};

// @desc    Get scam statistics (Admin only)
// @route   GET /api/scam-report/stats/overview
// @access  Private
exports.getScamStatistics = async (req, res) => {
  try {
    const totalReports = await ScamReport.countDocuments();
    const reportsByType = await ScamReport.aggregate([
      {
        $group: {
          _id: "$scamType",
          count: { $sum: 1 },
          totalAmountLost: { $sum: "$amountLost" },
        },
      },
    ]);

    const reportsByStatus = await ScamReport.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalReports,
        reportsByType,
        reportsByStatus,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching statistics",
    });
  }
};
