const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

test("content quality gate passes for repository data", () => {
  const result = spawnSync(process.execPath, [path.join(__dirname, "../../scripts/validate-content.js")], {
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Content validation passed/);
});
