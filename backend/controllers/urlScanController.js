const { analyzeUrl } = require("../services/analysis/urlAnalysisService");

exports.scanUrl = (req, res, next) => {
  try {
    const data = analyzeUrl(req.body?.url);
    return res.json({ success: true, message: "URL analysis completed", data });
  } catch (error) {
    return next(error);
  }
};
