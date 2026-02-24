import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header style={{ 
      background: "#CC9F57",
      padding: "12px 0"
    }}>
      <nav
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Link 
          to="/" 
          style={{ 
            textDecoration: "none", 
            color: "white",
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: "0.5px"
          }}
        >
          Hem
        </Link>

        <Link 
          to="/hastar" 
          style={{ 
            textDecoration: "none", 
            color: "white",
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: "0.5px"
          }}
        >
          Hästarna
        </Link>

        <Link 
          to="/avel" 
          style={{ 
            textDecoration: "none", 
            color: "white",
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: "0.5px"
          }}
        >
          Avel
        </Link>

        <Link 
          to="/hingstar" 
          style={{ 
            textDecoration: "none", 
            color: "white",
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: "0.5px"
          }}
        >
          Avelshingstarna
        </Link>
      </nav>
    </header>
  );
}
