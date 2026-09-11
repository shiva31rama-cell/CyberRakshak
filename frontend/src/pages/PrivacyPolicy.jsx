import "./LegalPage.css";

function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <span className="legal-kicker">CYBERRAKSHAK</span>
      <h1>Privacy Policy</h1>
      <p className="legal-lead">CyberRakshak is designed to provide safety guidance without asking for secrets such as passwords, OTPs, UPI PINs, CVVs or authentication tokens.</p>
      <section><h2>What we collect</h2><p>The product may process information you deliberately submit to a feature, such as a scam report, feedback or account information. Local preferences such as language and self-declared age group are stored in your browser for personalization.</p></section>
      <section><h2>Safety rule</h2><p>Do not paste passwords, one-time passwords, payment PINs, CVVs, recovery codes or access tokens into CyberRakshak.</p></section>
      <section><h2>AI assistance</h2><p>When the AI assistant is enabled, messages may be sent to the configured server-side AI provider to generate a response. Provider configuration and retention depend on the deployment.</p></section>
      <section><h2>Reporting</h2><p>CyberRakshak provides guidance and a reporting workflow. Official complaints and emergency response are handled by the relevant authorities.</p></section>
    </main>
  );
}

export default PrivacyPolicy;
