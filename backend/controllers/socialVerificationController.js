const { verifySocialClaim } = require("../services/verification/socialVerificationService");

exports.verifySocialClaim = (req, res, next) => {
  try {
    const data = verifySocialClaim(req.body?.claim);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
