require("dotenv").config();

const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { randomUUID } = require("node:crypto");
const ScamReport = require("../models/ScamReport");

async function main() {
  const uri = process.env.MONGODB_TEST_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_TEST_URI is missing. Configure a dedicated test database in backend/.env."
    );
  }

  let databaseName;
  try {
    databaseName = decodeURIComponent(
      new URL(uri).pathname.replace(/^\/+/, "").split("/")[0] || ""
    );
  } catch {
    throw new Error("MONGODB_TEST_URI is not a valid connection URI.");
  }

  // Refuse to run against the main application database by accident.
  if (!databaseName || !/test/i.test(databaseName)) {
    throw new Error(
      "Safety check failed: the database name must contain 'test'. Use a separate test database."
    );
  }

  let createdId;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 2,
    });

    const marker = randomUUID();

    // CREATE: use synthetic data only; no real person's information.
    const created = await ScamReport.create({
      reporterEmail: `db-test-${marker}@example.com`,
      reporterName: "CyberRakshak Database Test",
      scamType: "phishing",
      scamDescription: `Synthetic MongoDB persistence test record: ${marker}`,
      suspectDetails: marker,
      amountLost: 0,
    });

    createdId = created._id;

    // READ: query MongoDB independently of the create response.
    const saved = await ScamReport.findById(createdId).lean();
    assert.ok(saved, "Created document should be readable from MongoDB");
    assert.equal(saved.suspectDetails, marker);
    assert.equal(saved.reporterName, "CyberRakshak Database Test");

    // UPDATE: prove writes can modify an existing document.
    const updated = await ScamReport.findByIdAndUpdate(
      createdId,
      { suspectDetails: `${marker}-updated` },
      { new: true, runValidators: true }
    ).lean();

    assert.equal(
      updated?.suspectDetails,
      `${marker}-updated`,
      "Updated value should be persisted"
    );

    // DELETE: verify the document is no longer present.
    await ScamReport.deleteOne({ _id: createdId });
    const deleted = await ScamReport.findById(createdId).lean();
    assert.equal(deleted, null, "Deleted document should no longer exist");

    createdId = null;
    console.log(
      `PASS: MongoDB CRUD (create/read/update/delete) verified on "${databaseName}".`
    );
  } finally {
    // Clean up any remaining test document, including after an assertion fails.
    if (createdId && mongoose.connection.readyState === 1) {
      await ScamReport.deleteOne({ _id: createdId });
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

main().catch((error) => {
  // Do not print connection strings or other environment values.
  console.error("MongoDB persistence test failed:", error.message);
  process.exitCode = 1;
});
