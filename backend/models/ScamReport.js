const crypto = require("crypto");
const mongoose = require("mongoose");

const scamReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    reporterEmail: {
      type: String,
      required: [true, "Please provide reporter email"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    reporterName: {
      type: String,
      required: [true, "Please provide reporter name"],
      trim: true,
      maxlength: 120,
    },
    reporterPhone: {
      type: String,
      required: false,
      trim: true,
      maxlength: 40,
    },
    scamType: {
      type: String,
      enum: [
        "phishing",
        "fake-job",
        "romance-scam",
        "investment-fraud",
        "upi-fraud",
        "sms-scam",
        "call-fraud",
        "other",
      ],
      required: [true, "Please select a scam type"],
    },
    scamDescription: {
      type: String,
      required: [true, "Please provide scam description"],
      minlength: 20,
      maxlength: 2000,
      trim: true,
    },
    suspectDetails: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    amountLost: {
      type: Number,
      default: 0,
      min: 0,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["new", "investigating", "resolved", "closed"],
      default: "new",
    },
    caseNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

scamReportSchema.pre("save", function generateCaseNumber(next) {
  if (!this.caseNumber) {
    const suffix = crypto.randomBytes(4).toString("hex").toUpperCase();
    this.caseNumber = `CASE-${Date.now()}-${suffix}`;
  }
  next();
});

const ScamReport = mongoose.model("ScamReport", scamReportSchema);

module.exports = ScamReport;
