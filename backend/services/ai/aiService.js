const openaiProvider = require("./providers/openaiProvider");

async function generate(messages) {
  return openaiProvider.generate({
    apiUrl: process.env.AI_API_URL,
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL,
    messages,
  });
}

module.exports = { generate };
