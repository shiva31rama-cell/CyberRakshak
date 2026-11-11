require("dotenv").config({
  path: require("node:path").join(__dirname, "..", ".env"),
});

const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { randomUUID } = require("node:crypto");
const ScamReport = require("../models/ScamReport");

function getDatabaseNames(uri) {
  let parsedUri;
  try {
    parsedUri = new URL(uri);
  } catch {
    throw new Error("MONGODB_TEST_URI is not a valid MongoDB connection URI.");
  }

  if (!["mongodb:", "mongodb+srv:"].includes(parsedUri.protocol)) {
    throw new Error("MONGODB_TEST_URI must use the mongodb or mongodb+srv protocol.");
  }

  const pathDatabaseName = decodeURIComponent(
    parsedUri.pathname.replace(/^\/+/, "").split("/")[0] || ""
  );
  const dbNameOptions = [...parsedUri.searchParams.entries()]
    .filter(([key]) => key.toLowerCase() === "dbname")
    .map(([, value]) => value);

  return [pathDatabaseName, ...dbNameOptions];
}

async function main() {
  const uri = process.env.MONGODB_TEST_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_TEST_URI is missing. Configure a dedicated test database in backend/.env."
    );
  }

  const databaseNames = getDatabaseNames(uri);

  // Check every database name that could be selected from the URI so an
  // override cannot redirect this script to a non-test database.
  if (
    databaseNames.length === 0 ||
    databaseNames.some((name) => !name || !/test/i.test(name))
  ) {
    throw new Error(
      "Safety check failed: every database name in MONGODB_TEST_URI must include 'test'. Use a separate test database."
    );
  }

  const databaseName = databaseNames[0];
  let createdId;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 2,
    });

    const marker = randomUUID();

    // Synthetic values only; no real person's information is used.
    const created = await ScamReport.create({
      reporterEmail: "db-test-" + marker + "@example.com",
      reporterName: "CyberRakshak Database Test",
      scamType: "phishing",
      scamDescription: "Synthetic MongoDB persistence test record: " + marker,
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
      { suspectDetails: marker + "-updated" },
      { new: true, runValidators: true }
    ).lean();

    assert.equal(
      updated?.suspectDetails,
      marker + "-updated",
      "Updated value should be persisted"
    );

    // DELETE: verify only this script's synthetic document is removed.
    await ScamReport.deleteOne({ _id: createdId });
    const deleted = await ScamReport.findById(createdId).lean();
    assert.equal(deleted, null, "Deleted document should no longer exist");

    createdId = null;
    console.log(
      "PASS: MongoDB CRUD (create/read/update/delete) verified on \"" +
        databaseName +
        "\"."
    );
  } finally {
    // Clean up only the document created by this run, including after failure.
    if (createdId && mongoose.connection.readyState === 1) {
      await ScamReport.deleteOne({ _id: createdId });
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

main().catch((error) => {
  // Never print an environment value or an unredacted MongoDB URI.
  const message = String(error?.message || error).replace(
    /mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi,
    "[redacted MongoDB URI]"
  );
  console.error("MongoDB persistence test failed:", message);
  process.exitCode = 1;
});
