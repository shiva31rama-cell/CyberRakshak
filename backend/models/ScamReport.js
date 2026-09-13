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
      maxlength: [100, "Reporter name cannot exceed 100 characters"],
    },
    reporterPhone: {
      type: String,
      required: false,
      trim: true,
      maxlength: [25, "Reporter phone cannot exceed 25 characters"],
    },
    scamType: {
      type: String,
      enum: [
        "UPI Fraud",
        "Fake Call/SMS",
        "Online Shopping Fraud",
        "Job Scam",
        "Dating Scam",
        "Investment Fraud",
        "Phishing",
        "Tech Support Scam",
        "Prize/Lottery Scam",
        "Government Impersonation",
        "Banking Fraud",
        "Insurance Scam",
        "Other",
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
      maxlength: 1000,
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
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

scamReportSchema.pre("save", async function (next) {
  if (!this.caseNumber) {
    const count = await mongoose.model("ScamReport").countDocuments();
    this.caseNumber = `CASE-${Date.now()}-${count + 1}`;
  }
  next();
});

const ScamReport = mongoose.model("ScamReport", scamReportSchema);

module.exports = ScamReport;
