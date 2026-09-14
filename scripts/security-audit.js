const fs = require("node:fs");
const path = require("node:path");
const { scanTextForSecrets } = require("../services/security/securityAudit");

const ROOT = path.resolve(__dirname, "..");
const SKIP = new Set([".git", "node_modules", "dist", "build", "coverage", ".gradle"]);
const TEXT_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".json", ".md", ".yml", ".yaml", ".env", ".properties", ".kt", ".kts"]);
const MAX_FILE_BYTES = 1024 * 1024;

const walk = (directory) => {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...walk(fullPath));
    else if (TEXT_EXTENSIONS.has(path.extname(entry.name)) || entry.name.startsWith(".env")) results.push(fullPath);
  }
  return results;
};

const files = walk(ROOT);
const findings = [];
for (const file of files) {
  const stat = fs.statSync(file);
  if (stat.size > MAX_FILE_BYTES) continue;
  const content = fs.readFileSync(file, "utf8");
  findings.push(...scanTextForSecrets(content, path.relative(ROOT, file)));
}

if (findings.length) {
  console.error("Security audit failed: possible secrets were detected.");
  for (const finding of findings) console.error(`- ${finding.file}: ${finding.type} (${finding.count})`);
  process.exit(1);
}

console.log(`Security audit passed: scanned ${files.length} text files.`);
