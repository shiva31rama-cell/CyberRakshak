import { useState } from "react";
import { apiRequest } from "../../services/api";
import "./SocialVerification.css";

const evidenceStatusCopy = {
  candidate_matches: "Possible official-source matches were found. Review the linked material and compare the exact details yourself.",
  no_matches: "No matching PIB press releases were found. This does not mean the claim is false.",
  unavailable: "The PIB lookup is temporarily unavailable. The local claim review is still shown below.",
  disabled: "Official-source lookup is disabled. The local claim review is still shown below.",
  insufficient_terms: "There are not enough distinctive words for a useful source lookup. Try a longer, specific description.",
  not_searched: "No official-source lookup was performed for this claim.",
};

function getSafeEvidenceUrl(value) {
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      ["pib.gov.in", "www.pib.gov.in"].includes(url.hostname.toLowerCase())
    ) {
      return url.href;
    }
  } catch {
    // Do not render invalid feed values as links.
  }
  return null;
}

function formatPublishedAt(value) {
  if (!value) return "Publication date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Publication date unavailable";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

function SocialVerification() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    const normalizedClaim = claim.trim();
    if (!normalizedClaim) {
      setError("Enter the claim you want to check.");
      return;
    }
    if (normalizedClaim.length > 3000) {
      setError("Keep the claim under 3,000 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/verify/social", {
        method: "POST",
        body: JSON.stringify({ claim: normalizedClaim }),
      });
      if (!response?.data) {
        throw new Error("The verification service returned an unexpected response.");
      }
      setResult(response.data);
    } catch (requestError) {
      setError(requestError.message || "Unable to review this claim.");
    } finally {
      setLoading(false);
    }
  };

  const evidenceItems = Array.isArray(result?.evidence) ? result.evidence : [];
  const statusMessage = evidenceStatusCopy[result?.evidenceStatus] ||
    "The official-source lookup status is unavailable.";

  return (
    <main className="verify-page">
      <section className="verify-hero">
        <span>🔎 VERIFY · EVIDENCE FIRST</span>
        <h1>Pause before you share a viral claim.</h1>
        <p>
          CyberRakshak offers a cautious first review. A keyword match is only a lead to
          inspect; it never proves whether a claim is true or false.
        </p>
      </section>

      <form className="verify-form" onSubmit={submit} aria-busy={loading}>
        <label htmlFor="claim">Claim or copied post text</label>
        <textarea
          id="claim"
          rows={7}
          maxLength={3000}
          value={claim}
          onChange={(event) => setClaim(event.target.value)}
          placeholder="Paste the claim or a short description of what the post says."
          aria-describedby="claim-privacy claim-length"
        />
        <div className="verify-form-footer">
          <span id="claim-length">{claim.length}/3000 characters</span>
          <button type="submit" disabled={loading}>
            {loading ? "Reviewing…" : "Review claim"}
          </button>
        </div>
        <p id="claim-privacy" className="verify-privacy">
          The claim is sent to CyberRakshak for local triage. When enabled, the backend compares
          its keywords with the public PIB press-release feed; it does not send your claim to PIB
          or search social platforms.
        </p>
        {error && <p role="alert">{error}</p>}
      </form>

      {result && (
        <section className="verify-result" aria-live="polite">
          <div className="verdict">
            <span>CLAIM TRIAGE</span>
            <strong>{result.verdict}</strong>
          </div>
          <p className="verification-mode" role="status">{statusMessage}</p>
          <p>{result.explanation}</p>

          <section className="evidence-section" aria-labelledby="evidence-heading">
            <h2 id="evidence-heading">Possible official-source matches</h2>
            {evidenceItems.length > 0 ? (
              <ul className="evidence-list">
                {evidenceItems.map((item, index) => {
                  const safeUrl = getSafeEvidenceUrl(item.url);
                  return (
                    <li key={safeUrl || item.title || index} className="evidence-card">
                      <h3>
                        {safeUrl ? (
                          <a href={safeUrl} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                        ) : item.title}
                      </h3>
                      <p>{item.summary || "No summary is available."}</p>
                      <p className="evidence-meta">
                        {item.source || "Official source"} · {formatPublishedAt(item.publishedAt)}
                      </p>
                      {Array.isArray(item.matchingTerms) && item.matchingTerms.length > 0 && (
                        <p className="evidence-meta">
                          Shared keywords: {item.matchingTerms.join(", ")}
                        </p>
                      )}
                      {!safeUrl && <p role="note">This item did not include a safe official link.</p>}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No candidate items are available. Continue with the independent checks below.</p>
            )}
            <p className="evidence-disclaimer">
              These results are candidate leads from PIB press releases, not a fact-check verdict.
              Open the source and verify the date, wording and context independently.
            </p>
          </section>

          <h2>Recommended verification steps</h2>
          <ol>{(result.nextSteps || []).map((step) => <li key={step}>{step}</li>)}</ol>

          <h2>Official-source registry</h2>
          <ul>
            {(result.officialSources || []).map((source) => (
              <li key={source.domain}>{source.name} — {source.domain}</li>
            ))}
          </ul>

          <p className="limitation">
            <strong>Current limitation:</strong> {result.limitation}
          </p>
        </section>
      )}
    </main>
  );
}

export default SocialVerification;
