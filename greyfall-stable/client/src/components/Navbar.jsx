import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header style={{ borderBottom: "1px solid #ddd" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: 12,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Link
          to="/"
          style={{ textDecoration: "none", color: "black", fontWeight: 800, fontSize: 18 }}
        >
          Greyfall Stable
        </Link>

        <nav style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>Hem</Link>
          <Link to="/hastar" style={{ textDecoration: "none", color: "black" }}>Hästar</Link>
          <Link to="/avel" style={{ textDecoration: "none", color: "black" }}>Avel</Link>
          <Link to="/hingstar" style={{ textDecoration: "none", color: "black" }}>
            Avelshingstar
          </Link>
        </nav>
      </div>
    </header>
  );
}
