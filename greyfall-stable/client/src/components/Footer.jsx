export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #ddd", marginTop: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 12 }}>
        <small>© {new Date().getFullYear()} Greyfall Stable</small>
      </div>
    </footer>
  );
}
