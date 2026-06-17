const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logout);

module.exports = router;
