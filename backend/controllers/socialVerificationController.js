const { verifySocialClaimWithOfficialEvidence } = require("../services/verification/socialVerificationService");

exports.verifySocialClaim = async (req, res, next) => {
  try {
    const data = await verifySocialClaimWithOfficialEvidence(req.body?.claim);
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};
