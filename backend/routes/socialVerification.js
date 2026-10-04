const express = require("express");
const { verifySocialClaim } = require("../controllers/socialVerificationController");

const router = express.Router();
router.post("/", verifySocialClaim);

module.exports = router;
