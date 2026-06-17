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
    },
    reporterName: {
      type: String,
      required: [true, "Please provide reporter name"],
      trim: true,
    },
    reporterPhone: {
      type: String,
      required: false,
      trim: true,
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
    },
    suspectDetails: {
      type: String,
      trim: true,
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
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Generate case number before saving
scamReportSchema.pre("save", async function (next) {
  if (!this.caseNumber) {
    const count = await mongoose.model("ScamReport").countDocuments();
    this.caseNumber = `CASE-${Date.now()}-${count + 1}`;
  }
  next();
});

const ScamReport = mongoose.model("ScamReport", scamReportSchema);

module.exports = ScamReport;
