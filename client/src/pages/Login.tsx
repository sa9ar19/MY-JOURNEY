import { useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  async function handleLogin() {
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      navigate("/admin");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 border border-border rounded-lg bg-card space-y-4">
        <h1 className="font-serif text-2xl font-semibold text-foreground">Admin Login</h1>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          className="w-full px-4 py-2 border border-border rounded bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
        >
          Login
        </button>
      </div>
    </div>
  );
}