import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("CyberRakshak UI error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main role="alert" style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
        <div>
          <p style={{ fontSize: "3rem", margin: 0 }} aria-hidden="true">⚠️</p>
          <h1>Something went wrong</h1>
          <p>CyberRakshak could not render this page. Please reload and try again.</p>
          <button type="button" onClick={this.handleReload}>Reload page</button>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
