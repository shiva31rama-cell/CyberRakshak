const test = require("node:test");
const assert = require("node:assert/strict");
const ScamReport = require("../models/ScamReport");
const { createCaseNumber } = require("../services/caseNumberService");
const { getScamReportByCaseNumber } = require("../controllers/scamReportController");

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
