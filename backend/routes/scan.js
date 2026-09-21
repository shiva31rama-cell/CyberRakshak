const express = require("express");
const { scanMessage } = require("../controllers/scanController");

const router = express.Router();
router.post("/message", scanMessage);

module.exports = router;
