const express = require("express");
const controller = require("../controllers/juryDemoController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/ai/assist", controller.aiAssist);
router.post("/analyze", controller.analyze);
router.get("/public/media", controller.listMedia);
router.get("/public/resources", controller.listResources);
router.get("/public/notices/verify/:id", controller.verifyNotice);
router.post("/incident-intake", protect, controller.incidentIntake);
router.post("/payment-instructions/compare", protect, controller.comparePaymentInstruction);

module.exports = router;
