const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const normalizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  lastLogin: user.lastLogin,
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, password, confirmPassword } = req.body;
    const email = normalizeEmail(req.body.email);
    const cleanName = typeof name === "string" ? name.trim() : "";

    if (!cleanName || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }
    if (cleanName.length > 50) {
      return res.status(400).json({ success: false, message: "Name cannot be more than 50 characters" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email }).select("_id");
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User with this email already exists" });
    }

    const user = await User.create({ name: cleanName, email, password, role: "user" });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: "User with this email already exists" });
    }
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Error logging in user" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("_id name email role lastLogin createdAt updatedAt").lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Current-user error:", error);
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({ success: true, message: "User logged out successfully" });
};
