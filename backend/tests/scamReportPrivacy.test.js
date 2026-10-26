const test = require("node:test");
const assert = require("node:assert/strict");
const ScamReport = require("../models/ScamReport");
const { createCaseNumber } = require("../services/caseNumberService");
const {
  getScamReportByCaseNumber,
  deleteScamReportByCaseNumber,
  updateScamReportStatus,
  getAllScamReports,
} = require("../controllers/scamReportController");

test("case references have random, non-sequential tokens", () => {
  const references = Array.from({ length: 128 }, createCaseNumber);
  assert.ok(references.every((value) => /^CASE-[A-F0-9]{32}$/.test(value)));
  assert.equal(new Set(references).size, references.length);
});

test("public case lookup returns status only and never exposes report personal data", async (t) => {
  const originalFindOne = ScamReport.findOne;
  const reportedAt = new Date("2026-01-01T00:00:00.000Z");
  const storedReport = {
    caseNumber: `CASE-${"A".repeat(32)}`,
    status: "new",
    reportedAt,
    reporterEmail: "private@example.test",
    reporterName: "Synthetic Reporter",
    reporterPhone: "0000000000",
    scamDescription: "Synthetic private report details",
    suspectDetails: "Synthetic private suspect details",
    amountLost: 1234,
  };
  let projection = "";

  ScamReport.findOne = (query) => {
    assert.deepEqual(query, { caseNumber: storedReport.caseNumber });
    return {
      select(fields) {
        projection = fields;
        return this;
      },
      async lean() {
        return storedReport;
      },
    };
  };

  t.after(() => {
    ScamReport.findOne = originalFindOne;
  });

  const result = { statusCode: 200, payload: null };
  const res = {
    status(code) {
      result.statusCode = code;
      return this;
    },
    json(payload) {
      result.payload = payload;
      return this;
    },
  };

  await getScamReportByCaseNumber({ params: { caseNumber: storedReport.caseNumber } }, res);

  assert.equal(projection, "caseNumber status reportedAt");
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.payload, {
    success: true,
    report: {
      caseNumber: storedReport.caseNumber,
      status: "new",
      reportedAt,
    },
  });
  assert.doesNotMatch(JSON.stringify(result.payload), /private@example\.test|Synthetic Reporter|private report details/i);
});


test("report model accepts every status exposed by the report API", () => {
  const modelStatuses = ScamReport.schema.path("status").enumValues;
  for (const status of ["new", "under-investigation", "resolved", "closed"]) {
    assert.ok(modelStatuses.includes(status), `The report model must accept the API status: ${status}`);
  }
});

test("report model accepts email domains longer than three characters", () => {
  const report = new ScamReport({
    reporterEmail: "reporter@example.technology",
    reporterName: "Synthetic Reporter",
    scamType: "other",
    scamDescription: "Synthetic report description long enough for validation",
  });
  assert.equal(report.validateSync(), undefined);
});

test("report model status values are all accepted by the status API", async (t) => {
  const originalFindByIdAndUpdate = ScamReport.findByIdAndUpdate;
  const syntheticId = "synthetic-report-id";
  let requestedUpdate = null;
  ScamReport.findByIdAndUpdate = async (id, update) => {
    assert.equal(id, syntheticId);
    requestedUpdate = update;
    return { _id: id, status: update.status };
  };
  t.after(() => {
    ScamReport.findByIdAndUpdate = originalFindByIdAndUpdate;
  });

  const result = createResponse();
  await updateScamReportStatus(
    { params: { id: syntheticId }, body: { status: "closed" } },
    result.response
  );
  assert.equal(result.statusCode, 200);
  assert.deepEqual(requestedUpdate, { status: "closed" });
});

test("case reference authorizes deletion of only its active report", async (t) => {
  const originalFindOneAndDelete = ScamReport.findOneAndDelete;
  const caseNumber = "CASE-" + "C".repeat(32);
  let requestedQuery = null;
  ScamReport.findOneAndDelete = (query) => {
    requestedQuery = query;
    return {
      select(fields) {
        assert.equal(fields, "_id");
        return this;
      },
      async lean() {
        return { _id: "synthetic-report-id" };
      },
    };
  };
  t.after(() => {
    ScamReport.findOneAndDelete = originalFindOneAndDelete;
  });

  const result = createResponse();
  await deleteScamReportByCaseNumber(
    { params: { caseNumber: caseNumber.toLowerCase() } },
    result.response
  );
  assert.deepEqual(requestedQuery, { caseNumber });
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.payload, {
    success: true,
    message: "Report deleted from active CyberRakshak records",
  });
});

test("report deletion rejects malformed case references before querying the database", async (t) => {
  const originalFindOneAndDelete = ScamReport.findOneAndDelete;
  ScamReport.findOneAndDelete = () => {
    throw new Error("Invalid case references must not reach MongoDB");
  };
  t.after(() => {
    ScamReport.findOneAndDelete = originalFindOneAndDelete;
  });

  const result = createResponse();
  await deleteScamReportByCaseNumber({ params: { caseNumber: "CASE-123" } }, result.response);
  assert.equal(result.statusCode, 400);
  assert.deepEqual(result.payload, {
    success: false,
    message: "Invalid CyberRakshak case number",
  });
});


test("administrator report lists enforce bounded pagination", async (t) => {
  const originalFind = ScamReport.find;
  const originalCountDocuments = ScamReport.countDocuments;
  let appliedSkip = null;
  let appliedLimit = null;

  ScamReport.find = () => ({
    sort(sort) {
      assert.deepEqual(sort, { reportedAt: -1 });
      return this;
    },
    skip(value) {
      appliedSkip = value;
      return this;
    },
    limit(value) {
      appliedLimit = value;
      return this;
    },
    async lean() {
      return [];
    },
  });
  ScamReport.countDocuments = async () => 250;
  t.after(() => {
    ScamReport.find = originalFind;
    ScamReport.countDocuments = originalCountDocuments;
  });

  const result = createResponse();
  await getAllScamReports({ query: { page: "2", limit: "500" } }, result.response);
  assert.equal(appliedSkip, 100);
  assert.equal(appliedLimit, 100);
  assert.equal(result.payload.page, 2);
  assert.equal(result.payload.limit, 100);
  assert.equal(result.payload.totalPages, 3);
});

function createResponse() {
  const result = { statusCode: 200, payload: null };
  return {
    ...result,
    get statusCode() { return result.statusCode; },
    get payload() { return result.payload; },
    response: {
      status(code) {
        result.statusCode = code;
        return this;
      },
      json(payload) {
        result.payload = payload;
        return this;
      },
    },
  };
}
