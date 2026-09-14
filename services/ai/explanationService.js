const { buildSafetyPrompt } = require("./safetyPrompt");

const parseModelJson = (value) => {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const fallbackExplanation = (assessment) => {
  const level = assessment?.riskLevel || "info";
  const summary = level === "critical" || level === "high"
    ? "This content shows strong warning signs. Treat it as unsafe until independently verified."
    : level === "medium"
      ? "This content has some warning signs. Verify it through an official channel before acting."
      : "No strong local warning signal was detected, but automated checks cannot guarantee safety.";

  return {
    summary,
    whyRisky: Array.isArray(assessment?.reasons) ? assessment.reasons.slice(0, 5) : [],
    safeNextSteps: [
      "Do not share OTPs, PINs, passwords, or card security codes.",
      "Do not pay or install an app because of an unexpected message.",
      "Verify important requests using an official website or known contact method.",
    ],
    confidenceNote: "Deterministic local checks were used. AI explanation is currently unavailable.",
    mode: "deterministic-fallback",
  };
};

const extractResponseText = (payload) => {
  if (typeof payload?.output_text === "string") return payload.output_text;
  const parts = [];
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n");
};

const explainAssessment = async ({ text, inputType, assessment }) => {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) {
    return fallbackExplanation(assessment);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL,
        input: buildSafetyPrompt({ text, inputType, assessment }),
        max_output_tokens: 500,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return fallbackExplanation(assessment);
    }

    const payload = await response.json();
    const parsed = parseModelJson(extractResponseText(payload));
    if (!parsed || typeof parsed.summary !== "string") {
      return fallbackExplanation(assessment);
    }

    return {
      summary: parsed.summary.slice(0, 1200),
      whyRisky: Array.isArray(parsed.whyRisky) ? parsed.whyRisky.slice(0, 6) : [],
      safeNextSteps: Array.isArray(parsed.safeNextSteps) ? parsed.safeNextSteps.slice(0, 6) : [],
      confidenceNote: typeof parsed.confidenceNote === "string"
        ? parsed.confidenceNote.slice(0, 500)
        : "AI explanation generated from the deterministic assessment.",
      mode: "ai-assisted",
    };
  } catch {
    return fallbackExplanation(assessment);
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = { explainAssessment, fallbackExplanation };
