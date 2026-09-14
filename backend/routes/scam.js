const express = require("express");
const { analyze, analyzeUrl } = require("../controllers/scamController");

const router = express.Router();

router.post("/analyze", analyze);
router.post("/analyze-url", analyzeUrl);

module.exports = router;
