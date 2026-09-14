const { analyzeText, analyzeUrl } = require("../services/riskEngine");

exports.analyze = (req, res) => {
  const text = req.body?.text;

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide message text to analyze",
    });
  }

  if (text.length > 10000) {
    return res.status(400).json({
      success: false,
      message: "Message is too long",
    });
  }

  return res.json(analyzeText(text));
};

exports.analyzeUrl = (req, res) => {
  const url = req.body?.url;

  if (typeof url !== "string" || !url.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide a URL to analyze",
    });
  }

  if (url.length > 2000) {
    return res.status(400).json({
      success: false,
      message: "URL is too long",
    });
  }

  const result = analyzeUrl(url);
  if (!result.success) return res.status(400).json(result);
  return res.json(result);
};
