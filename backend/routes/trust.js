const express = require("express");
const { protect } = require("../middleware/auth");
const controller = require("../controllers/trustController");

const router = express.Router();

router.get("/public/notices/verify/:verificationId", controller.verifyNotice);
router.post("/organizations", protect, controller.createOrganization);
router.post("/organizations/:organizationId/members", protect, controller.addMember);
router.post("/organizations/:organizationId/notices", protect, controller.createNotice);
router.post("/organizations/:organizationId/notices/:noticeId/submit", protect, controller.submitNotice);
router.post("/organizations/:organizationId/notices/:noticeId/publish", protect, controller.publishNotice);
router.post("/organizations/:organizationId/notices/:noticeId/revoke", protect, controller.revokeNotice);

module.exports = router;
