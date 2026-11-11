const { randomBytes } = require("node:crypto");

function createCaseNumber() {
  return `CASE-${randomBytes(16).toString("hex").toUpperCase()}`;
}

module.exports = { createCaseNumber };
