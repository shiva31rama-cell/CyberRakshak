# CyberRakshak AI Safety Copilot

## 1. What we are building

The chatbot is not treated as a decorative chat box. It is a **Safety Copilot** that connects conversation with the rest of CyberRakshak:

`Ask → Understand → Check → Learn → Act → Report`

The interface provides guided tools for checking messages, learning, privacy questions, incident response and quizzes.

## 2. Current AI workflow

```text
React Safety Copilot
        |
        v
/api/chat (Express)
        |
        +--> Gemini Interactions API (primary)
        |
        +--> OpenRouter free-model router (optional fallback)
        |
        +--> deterministic CyberRakshak safety fallback
```

The API key is kept on the backend. The browser never receives provider credentials.

## 3. Stateful conversation

When Gemini is enabled, CyberRakshak stores a provider interaction identifier in the browser and sends it back as `previous_interaction_id` for later turns. This lets the provider manage conversation state instead of resending the full transcript on every turn.

The UI still stores a small local conversation window so the screen can reopen quickly.

## 4. Free-first provider strategy

### Primary: Gemini API

The current configuration uses `gemini-3.1-flash-lite`. Google's current pricing documentation lists a free tier for this model, and the Interactions API is the recommended conversational API for new applications.

### Optional secondary: OpenRouter

`openrouter/free` can route to currently available free models. OpenRouter currently documents a free plan with a request limit, so it is treated as a fallback rather than the sole production dependency.

### Local fallback

When no provider key is configured, or a provider fails, CyberRakshak returns a small deterministic defensive response. The product therefore remains usable during development and provider outages.

## 5. Chatbot product features

- multi-turn conversation
- self-declared language selection
- age-aware response context
- guided safety tools
- message checking path
- learning mode
- privacy mode
- incident-response path
- quiz mode
- copy response
- regenerate response
- new-conversation control
- local conversation persistence
- provider/fallback indicator
- concise safety footer

## 6. Security model

The model is treated as an untrusted component. The application, not the model, controls privileged behavior.

Required controls include:

- input length limits
- message-count limits
- API rate limits
- server-side provider keys
- no secret collection
- clear trust boundaries around user-supplied content
- no arbitrary tools or privileged actions
- safe output framing
- deterministic validation for structured actions

This follows the security principles documented by OWASP for prompt injection, excessive agency, sensitive information disclosure and RAG/data handling.

## 7. Future multimodal workflow

Planned, not production-ready:

```text
Screenshot / Image / Video / Audio
             |
        consent + size/type checks
             |
        safe extraction/analysis
             |
        CyberRakshak risk signals
             |
        explanation + next action
```

The first screenshot release deliberately keeps the image local and asks the user to paste visible text. Future OCR/vision work must pass privacy and security gates first.

## 8. Future agent workflow

A future advanced version can add narrowly scoped tools such as:

- internal knowledge retrieval
- official resource lookup
- learning recommendation
- scam-category classification
- case-navigation assistance

High-impact operations must remain outside the model and require explicit application authorization. The assistant must never independently send payments, change credentials, access private records, or take irreversible actions.

## 9. Paid upgrade path

Do not activate paid providers until the free-first implementation is tested. When usage grows, the same provider abstraction can support a paid Gemini/OpenRouter plan without changing the frontend contract.
