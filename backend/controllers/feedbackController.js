const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, category, comments, userName, userEmail } = req.body;
    const numericRating = Number(rating);
    const cleanComments = typeof comments === "string" ? comments.trim() : "";

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be an integer from 1 to 5" });
    }

    if (cleanComments.length < 10 || cleanComments.length > 1000) {
      return res.status(400).json({ success: false, message: "Comments must be between 10 and 1000 characters" });
    }

    const feedback = await Feedback.create({
      userId: req.user?.id,
      userEmail: typeof userEmail === "string" ? userEmail.trim().slice(0, 254) : undefined,
      userName: typeof userName === "string" ? userName.trim().slice(0, 100) : undefined,
      rating: numericRating,
      category: category || "app",
      comments: cleanComments,
    });

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error submitting feedback" });
  }
};

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback?page=1&limit=20
// @access  Private
exports.getAllFeedback = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [feedback, total] = await Promise.all([
      Feedback.find().sort({ submittedAt: -1 }).skip(skip).limit(limit).lean(),
      Feedback.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: feedback.length,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      feedback,
    });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching feedback" });
  }
};

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
// @access  Private
exports.getFeedbackById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid feedback ID" });

    const feedback = await Feedback.findById(req.params.id).lean();
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });

    res.status(200).json({ success: true, feedback });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching feedback" });
  }
};

// @desc    Update feedback status (Admin only)
// @route   PATCH /api/feedback/:id
// @access  Private
exports.updateFeedbackStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid feedback ID" });

    const allowedStatuses = new Set(["new", "reviewed", "resolved"]);
    const { status } = req.body;
    if (!allowedStatuses.has(status)) return res.status(400).json({ success: false, message: "Invalid feedback status" });

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });
    res.status(200).json({ success: true, message: "Feedback status updated", feedback });
  } catch {
    res.status(500).json({ success: false, message: "Error updating feedback" });
  }
};

// @desc    Delete feedback (Admin only)
// @route   DELETE /api/feedback/:id
// @access  Private
exports.deleteFeedback = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid feedback ID" });

    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: "Feedback not found" });

    res.status(200).json({ success: true, message: "Feedback deleted successfully" });
  } catch {
    res.status(500).json({ success: false, message: "Error deleting feedback" });
  }
};
