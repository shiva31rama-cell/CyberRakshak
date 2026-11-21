const test = require("node:test");
const assert = require("node:assert/strict");
const { analyzeMessage, inspectUrl } = require("../../shared/analyzer/messageAnalyzer.mjs");
const { buildQuiz, QUIZ_BANK } = require("../../shared/content/quiz.mjs");

const run = (text) => analyzeMessage(text);

test("1. normal personal message is likely safe", () => {
  const r = run("Hi Amma, I reached the hostel safely. Will call you after dinner tonight.");
  assert.equal(r.classification, "likely_safe");
  assert.equal(r.level, "low");
});

test("2. genuine-looking bank debit alert with protective advice is not flagged as fraud", () => {
  const r = run("Rs.1,250.00 debited from A/c XX1234 on 20-11-26 to VPA grocer@okaxis. Not you? Call the number on the back of your card. Never share your OTP or PIN with anyone. -Bank");
  assert.ok(["likely_safe", "suspicious"].includes(r.classification), r.classification);
  assert.ok(r.protectiveLanguage);
  assert.ok(!r.indicators.some((i) => i.id === "otp_request"));
});

test("3. fake lottery with bank details request is critical", () => {
  const r = run("Congratulations! You won ₹25,00,000. Click this link immediately and enter your bank details to claim your prize: bit.ly/claim-now");
  assert.equal(r.level, "critical");
  assert.ok(["potential_scam", "high_risk_fraud"].includes(r.classification));
  const ids = r.indicators.map((i) => i.id);
  for (const id of ["lottery_prize", "urgency", "credential_request", "suspicious_url"]) assert.ok(ids.includes(id), id);
});

test("4. fake job offer is a potential scam", () => {
  const r = run("Part time job! Earn Rs 3000 per day by liking YouTube videos. No experience required. Pay Rs 500 registration fee to start.");
  assert.ok(["potential_scam", "high_risk_fraud"].includes(r.classification), r.classification);
  assert.ok(r.indicators.some((i) => i.id === "fake_job"));
});

test("5. OTP request is high risk", () => {
  const r = run("Dear Customer, your account will be blocked today. Share the OTP sent to your mobile with our executive to verify KYC.");
  assert.ok(["high", "critical"].includes(r.level));
  assert.ok(r.indicators.some((i) => i.id === "otp_request"));
});

test("6. suspicious URL inspection", () => {
  assert.equal(inspectUrl("sbi-kyc-update.top/login").risk, "high");
  assert.equal(inspectUrl("http://192.168.10.5/pay").risk, "high");
  assert.equal(inspectUrl("https://www.onlinesbi.sbi").risk, "known");
});

test("7. UPI PIN to receive money is critical", () => {
  const r = run("You have received a cashback of Rs 2,000. Enter your UPI PIN to receive the money now.");
  assert.ok(r.indicators.some((i) => i.id === "upi_pin_request"));
  assert.ok(["high", "critical"].includes(r.level));
});

test("8. urgent payment request is flagged", () => {
  const r = run("URGENT: Your electricity will be disconnected tonight. Pay immediately at elec-bill-pay.xyz to avoid disconnection.");
  assert.notEqual(r.classification, "likely_safe");
});

test("9. normal promotional message is spam at most, never fraud", () => {
  const r = run("Flat 40% off on winter wear this weekend. Shop now at www.myntra.com. T&C apply. To opt out reply STOP.");
  assert.ok(["likely_safe", "potential_spam"].includes(r.classification), r.classification);
  assert.equal(r.level, "low");
});

test("10. ambiguous message with a link is not automatically a scam", () => {
  const r = run("Here are the photos from the trip: https://photos.google.com/share/abc123");
  assert.equal(r.classification, "likely_safe");
});

test("rejects empty and oversized input", () => {
  assert.equal(run("   ").error, "empty");
  assert.equal(run("a".repeat(6000)).error, "too_long");
  assert.equal(analyzeMessage(42).error, "invalid_type");
});

test("quiz has no repeats, four options and a valid answer", () => {
  for (const level of ["beginner", "intermediate", "advanced"]) {
    const quiz = buildQuiz(level, 20);
    assert.equal(quiz.length, 20);
    assert.equal(new Set(quiz.map((q) => q.id)).size, 20);
    for (const q of quiz) {
      assert.equal(q.options.en.length, 4);
      assert.equal(q.options.te.length, 4);
      const original = QUIZ_BANK.find((x) => x.id === q.id);
      assert.equal(q.options.en[q.answer], original.options.en[original.answer]);
      assert.equal(q.options.te[q.answer], original.options.te[original.answer]);
    }
  }
});
