// src/components/HorseEditModal.jsx
import { useEffect } from "react";

export default function HorseEditModal({
  open,
  title = "Redigera",
  onClose,
  children,
  busy = false,
}) {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e) {
      if (e.key === "Escape") {
        if (!busy) onClose?.();
      }
    }

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, busy]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => {
        if (!busy) onClose?.();
      }}
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
          maxHeight: "calc(100vh - 32px)",
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "auto 1fr",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            padding: 16,
            borderBottom: "1px solid #eee",
            background: "white",
          }}
        >
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button type="button" onClick={() => (!busy ? onClose?.() : null)}>
            Stäng
          </button>
        </div>

        <div
          style={{
            padding: 16,
            overflowY: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}