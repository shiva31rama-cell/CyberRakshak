import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: "3rem 1rem", textAlign: "center" }}>
      <div>
        <p style={{ fontSize: "4rem", margin: 0 }} aria-hidden="true">🛡️</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist or has moved.</p>
        <Link to="/">Return to CyberRakshak</Link>
      </div>
    </section>
  );
}

export default NotFound;
