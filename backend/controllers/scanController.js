const { analyzeMessage } = require("../services/analysis/cyberAnalysisService");

exports.scanMessage = async (req, res, next) => {
  try {
    const result = analyzeMessage(req.body?.message);
    return res.json({ success: true, message: "Message analysis completed", data: result });
  } catch (error) {
    return next(error);
  }
};
