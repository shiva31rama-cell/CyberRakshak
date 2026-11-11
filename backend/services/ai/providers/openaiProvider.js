async function generate({ apiUrl, apiKey, model, messages, timeoutMs = 20000 }) {
  if (!apiUrl || !apiKey || !model) throw new Error("AI provider configuration is incomplete");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, temperature: 0.1, max_tokens: 650, messages }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply || reply.length > 8000) throw new Error("AI provider returned an invalid response");
    return reply;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { generate };
