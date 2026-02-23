export default function NewsModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(820px, 100%)",
          background: "white",
          borderRadius: 16,
          padding: 16,
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ margin: 0 }}>{item.title}</h2>
          <button onClick={onClose}>Stäng</button>
        </div>

        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: "100%", borderRadius: 12, maxHeight: 420, objectFit: "cover" }}
          />
        ) : null}

        <div style={{ opacity: 0.7, fontSize: 14 }}>
          {new Date(item.date).toLocaleString()}
        </div>

        <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{item.body}</p>

        {item.linkUrl ? (
          <a
            href={item.linkUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: 6,
              textDecoration: "none",
              border: "1px solid #ddd",
              padding: "10px 12px",
              borderRadius: 12,
              width: "fit-content",
              fontWeight: 700,
            }}
          >
            Öppna länk
          </a>
        ) : null}
      </div>
    </div>
  );
}