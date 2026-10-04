import { useState } from "react";
import { apiRequest } from "../../services/api";
import "./SocialVerification.css";

function SocialVerification() {
  const [claim,setClaim]=useState(""),[result,setResult]=useState(null),[error,setError]=useState(""),[loading,setLoading]=useState(false);
  const submit=async(e)=>{e.preventDefault();setError("");setResult(null);if(!claim.trim())return setError("Enter the claim you want to check.");setLoading(true);try{const r=await apiRequest("/verify/social",{method:"POST",body:JSON.stringify({claim})});setResult(r.data)}catch(err){setError(err.message||"Unable to review this claim.")}finally{setLoading(false)}};
  return <main className="verify-page"><section className="verify-hero"><span>🔎 VERIFY · EVIDENCE FIRST</span><h1>Pause before you share a viral claim.</h1><p>CyberRakshak separates evidence from assumption. In this first verification layer, a claim is never labelled false without supporting evidence.</p></section>
    <form className="verify-form" onSubmit={submit}><label htmlFor="claim">Claim / copied post text</label><textarea id="claim" rows={7} maxLength={3000} value={claim} onChange={e=>setClaim(e.target.value)} placeholder="Paste the claim or a short description of what the post says."/><button disabled={loading}>{loading?"Reviewing…":"Review Claim"}</button>{error&&<p role="alert">{error}</p>}</form>
    {result&&<section className="verify-result" aria-live="polite"><div className="verdict"><span>VERDICT</span><strong>{result.verdict}</strong></div><p>{result.explanation}</p><h3>Recommended verification steps</h3><ol>{result.nextSteps.map(x=><li key={x}>{x}</li>)}</ol><h3>Official-source registry</h3><ul>{result.officialSources.map(x=><li key={x.domain}>{x.name} — {x.domain}</li>)}</ul><p className="limitation"><strong>Current limitation:</strong> {result.limitation}</p></section>}</main>
}
export default SocialVerification;
