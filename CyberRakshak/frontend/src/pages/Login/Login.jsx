import "./Login.css";

function Login() {
  return (
    <div className="login-container">

      <div className="login-header">
        <h1>CyberRakshak</h1>
        <p>Login</p>
      </div>

      <div className="login-card">

        <input
          type="email"
          placeholder="Email Address"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button>
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;