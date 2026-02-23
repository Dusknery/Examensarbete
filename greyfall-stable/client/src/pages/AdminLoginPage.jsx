import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/api";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      await adminLogin(username, password);
      nav("/admin");
    } catch {
      setMsg("Fel användarnamn eller lösenord.");
    }
  }

  return (
    <div style={{ maxWidth: 520, display: "grid", gap: 12 }}>
      <h1>Admin</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Användarnamn"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lösenord"
          type="password"
        />
        <button type="submit">Logga in</button>
      </form>

      {msg && <p>{msg}</p>}
    </div>
  );
}
