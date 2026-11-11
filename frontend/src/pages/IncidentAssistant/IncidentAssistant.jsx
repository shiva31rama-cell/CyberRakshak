import { useState } from "react";
import { apiRequest } from "../../services/api";
import "./IncidentAssistant.css";

const types = [
  ["general","Something suspicious happened"],["financial_fraud","Money/payment problem"],["phishing","Phishing or suspicious link"],
  ["account_compromise","Account may be compromised"],["device_compromise","Phone/device concern"],["impersonation","Someone is impersonating a person or organisation"],["privacy","Personal-data exposure"],
];

function IncidentAssistant() {
  const [incidentType,setIncidentType]=useState("general"), [description,setDescription]=useState(""), [plan,setPlan]=useState(null), [loading,setLoading]=useState(false), [error,setError]=useState("");
  const submit=async(e)=>{e.preventDefault();setError("");setPlan(null);setLoading(true);try{const r=await apiRequest("/incidents",{method:"POST",body:JSON.stringify({incidentType,description})});setPlan(r.data)}catch(err){setError(err.message||"Unable to create a safe action plan.")}finally{setLoading(false)}};
  return <main className="incident-page"><section className="incident-hero"><span>🆘 RESPOND SAFELY</span><h1>Incident Assistant</h1><p>Choose what happened and get a simple defensive action plan. Never enter passwords, OTPs, PINs, CVVs or recovery codes here.</p></section>
    <form className="incident-form" onSubmit={submit}><label htmlFor="incidentType">What best describes the situation?</label><select id="incidentType" value={incidentType} onChange={e=>setIncidentType(e.target.value)}>{types.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
    <label htmlFor="description">What happened? <small>(optional)</small></label><textarea id="description" maxLength={1000} rows={6} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe the event without including secrets."/><button disabled={loading}>{loading?"Preparing…":"Create Safe Action Plan"}</button>{error&&<p role="alert" className="incident-error">{error}</p>}</form>
    {plan&&<section className="incident-result" aria-live="polite"><h2>{plan.title}</h2><h3>Do this now</h3><ol>{plan.safeActions.map(x=><li key={x}>{x}</li>)}</ol><h3>Keep this evidence</h3><ul>{plan.evidenceToKeep.map(x=><li key={x}>{x}</li>)}</ul><h3>Never share</h3><ul className="never">{plan.neverShare.map(x=><li key={x}>{x}</li>)}</ul><div className="official-help"><strong>Official help in India</strong><p>Cyber-fraud reporting: 1930 or the National Cyber Crime Reporting Portal when appropriate.</p></div></section>}</main>
}
export default IncidentAssistant;
