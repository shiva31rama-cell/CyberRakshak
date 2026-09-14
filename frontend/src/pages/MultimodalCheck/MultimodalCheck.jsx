import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./MultimodalCheck.css";

const MAX_BYTES = 2 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

const MultimodalCheck = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [allowCloudAnalysis, setAllowCloudAnalysis] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const selectFile = (event) => {
    const next = event.target.files?.[0];
    setError("");
    setResult(null);
    if (!next) return;
    if (!TYPES.includes(next.type)) return setError("Use a JPEG, PNG or WebP image.");
    if (next.size > MAX_BYTES) return setError("Keep the image under 2 MB.");
    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(URL.createObjectURL(next));
  };

  const analyze = async (event) => {
    event.preventDefault();
    if (!file) return setError("Choose an image or screenshot first.");
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const data = await apiRequest("/multimodal/image", {
        method: "POST",
        body: JSON.stringify({
          imageBase64,
          mimeType: file.type,
          extractedText: text,
          allowCloudAnalysis,
        }),
        timeoutMs: 20000,
      });
      setResult(data);
    } catch (err) {
      setError(err.message || "Image analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="multi-page">
      <header className="multi-hero">
        <span>CYBERRAKSHAK 2.0 · MULTIMODAL CHECK</span>
        <h1>Don't just check the words. Check the <em>screen.</em></h1>
        <p>Upload a suspicious screenshot, payment image or message image. Local checks remain available without cloud AI. Cloud visual review is optional and requires your explicit consent.</p>
      </header>
      <main className="multi-layout">
        <form className="multi-workspace" onSubmit={analyze}>
          <label className="dropzone">
            {preview ? <img src={preview} alt="Selected screenshot preview" /> : <><strong>＋ Add screenshot or image</strong><span>JPEG, PNG or WebP · max 2 MB</span></>}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFile} />
          </label>
          <label className="text-field">Optional visible text / OCR result<textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={12000} placeholder="Paste only non-sensitive text…" /></label>
          <label className="cloud-consent">
            <input type="checkbox" checked={allowCloudAnalysis} onChange={(event) => setAllowCloudAnalysis(event.target.checked)} />
            <span><strong>Allow optional cloud visual analysis</strong><small>The selected image may be sent to the configured vision AI provider for this request. Leave unchecked to keep processing local/deterministic.</small></span>
          </label>
          <button className="multi-submit" disabled={loading} type="submit">{loading ? "Analyzing image…" : "Run multimodal safety check →"}</button>
          <p className="multi-privacy">🔒 Never upload passwords, OTPs, PINs, CVVs, private keys or other secrets. Cloud analysis is off by default. The server does not intentionally store the submitted image.</p>
          {error && <div className="multi-error" role="alert">⚠️ {error}</div>}
        </form>
        <aside className="multi-result" aria-live="polite">
          {!result ? <><span>READY</span><h2>Your visual safety assessment appears here.</h2><p>Local/deterministic checking is the default. Cloud AI is only used when you explicitly enable it.</p></> : <>
            <span>RESULT</span>
            <div className={`multi-risk risk-${result.assessment?.riskLevel || "info"}`}>{(result.assessment?.riskLevel || "info").toUpperCase()} · {result.assessment?.score || 0}/100</div>
            <h2>{result.visualAnalysis?.message}</h2>
            {result.visualAnalysis?.warningSigns?.length > 0 && <><h3>Visible warning signs</h3><ul>{result.visualAnalysis.warningSigns.map((item) => <li key={item}>{item}</li>)}</ul></>}
            {result.visualAnalysis?.safeNextSteps?.length > 0 && <><h3>Safer next steps</h3><ul>{result.visualAnalysis.safeNextSteps.map((item) => <li key={item}>{item}</li>)}</ul></>}
            <p className="confidence">{result.visualAnalysis?.confidenceNote}</p>
            <p className="confidence">Cloud analysis: {result.privacy?.cloudAnalysis ? "enabled for this request" : "not used"} · Server storage: {result.privacy?.serverStored ? "reported" : "not used"}</p>
            <Link to="/incidents">Something already happened? Open Incident Mode →</Link>
          </>}
        </aside>
      </main>
    </section>
  );
};

export default MultimodalCheck;
