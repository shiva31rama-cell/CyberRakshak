import "./LegalPage.css";

function TermsOfService() {
  return (
    <main className="legal-page">
      <span className="legal-kicker">CYBERRAKSHAK</span>
      <h1>Terms of Service</h1>
      <p className="legal-lead">CyberRakshak is an educational and defensive cyber-safety assistant. It does not replace emergency services, banks, law-enforcement agencies or professional legal advice.</p>
      <section><h2>Use responsibly</h2><p>Use CyberRakshak to understand suspicious situations, learn safer digital habits and prepare information for an appropriate report. Do not use it to attempt unauthorized access, credential theft, malware deployment or other harmful activity.</p></section>
      <section><h2>No guarantee</h2><p>Safety checks are risk assessments and can be incomplete or wrong. Always independently verify high-stakes claims before paying money, changing account settings or sharing sensitive information.</p></section>
      <section><h2>Official response</h2><p>Use the official Government of India channels linked in the product for complaints and emergencies. CyberRakshak cannot freeze funds, investigate crimes or guarantee an outcome.</p></section>
      <section><h2>Changes</h2><p>Product features and supported providers may change as the system evolves. Production deployments should publish their own current version of these terms.</p></section>
    </main>
  );
}

export default TermsOfService;
