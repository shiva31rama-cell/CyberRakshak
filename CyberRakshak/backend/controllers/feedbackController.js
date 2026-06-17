const Feedback = require("../models/Feedback");

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, category, comments, userName, userEmail } = req.body;

    // Validation
    if (!rating || !comments) {
      return res.status(400).json({
        success: false,
        message: "Please provide rating and comments",
      });
    }

    const feedback = await Feedback.create({
      userId: req.user?.id,
      userEmail: userEmail || req.user?.email,
      userName: userName || req.user?.name,
      rating,
      category: category || "app",
      comments,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error submitting feedback",
    });
  }
};

// @desc    Get all feedback (Admin only)
// @route   GET /api/feedback
// @access  Private
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching feedback",
    });
  }
};

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
// @access  Private
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching feedback",
    });
  }
};

// @desc    Update feedback status (Admin only)
// @route   PATCH /api/feedback/:id
// @access  Private
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback status updated",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error updating feedback",
    });
  }
};

// @desc    Delete feedback (Admin only)
// @route   DELETE /api/feedback/:id
// @access  Private
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting feedback",
    });
  }
};
