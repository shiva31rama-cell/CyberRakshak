const ACTIONS_BY_LEVEL = {
  critical: [
    "Do not open the link, attachment, or app involved in the alert.",
    "Do not send money or share OTPs, PINs, CVVs, passwords, or recovery codes.",
    "Verify the request using an independently sourced official contact channel.",
    "Use the official cybercrime reporting process when fraud or unauthorized activity has occurred.",
  ],
  high: [
    "Pause before responding or paying.",
    "Do not share passwords, OTPs, PINs, CVVs, or recovery codes.",
    "Verify the sender and request independently before taking action.",
  ],
  medium: [
    "Treat the request cautiously and avoid rushed decisions.",
    "Verify important claims through a trusted independent source.",
  ],
  low: [
    "Stay cautious with unfamiliar senders, requests, and links.",
    "Check the destination before opening links or sharing information.",
  ],
  info: [
    "No strong fraud signal was identified by the local rules.",
    "Continue normal digital-safety precautions.",
  ],
  unknown: [
    "There is not enough content for a meaningful risk decision.",
    "Provide the suspicious message, link, identifier, or a clear description of what happened.",
  ],
};

const contextualActions = (assessment) => {
  const actions = [...(ACTIONS_BY_LEVEL[assessment.riskLevel] || ACTIONS_BY_LEVEL.unknown)];
  const categories = new Set(assessment.categories || []);

  if (categories.has("payment_fraud") || categories.has("upi_fraud")) {
    actions.push("For a suspected payment fraud, contact the relevant financial institution immediately through its official channel.");
  }

  if (categories.has("malicious_app") || assessment.inputType === "notification") {
    actions.push("Do not install or grant permissions to an app prompted by an unsolicited message or notification.");
  }

  return [...new Set(actions)];
};

const createActionPlan = (assessment) => ({
  priority: assessment.riskLevel,
  steps: contextualActions(assessment),
  disclaimer: "CyberRakshak provides safety guidance and signals; it does not certify that a sender, person, account, or website is legitimate.",
});

module.exports = { createActionPlan };
