const express = require("express");
const { scanUrl } = require("../controllers/urlScanController");

const router = express.Router();
router.post("/", scanUrl);

module.exports = router;
