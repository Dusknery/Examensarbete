import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedBlob } from "../utils/cropImage";

export default function ImageCropModal({
  file,
  preset,
  onCancel,
  onConfirmBlob,
  busy,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);
  const [ready, setReady] = useState(false);

  const imageUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  // Viktigt: städa objectURL
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  // Reset när ny fil/preset öppnas
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropPixels(null);
    setReady(false);
  }, [file, preset]);

  const onCropComplete = useCallback((_area, areaPixels) => {
    setCropPixels(areaPixels);
  }, []);

  const onMediaLoaded = useCallback((mediaSize) => {
    // mediaSize: { width, height, naturalWidth, naturalHeight }
    // Sätt ett default cropområde = hela bilden, så Save funkar direkt
    const w = mediaSize?.naturalWidth || mediaSize?.width || 0;
    const h = mediaSize?.naturalHeight || mediaSize?.height || 0;

    if (w > 0 && h > 0) {
      setCropPixels({ x: 0, y: 0, width: w, height: h });
      setReady(true);
    } else {
      setReady(true);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!imageUrl || !cropPixels || !preset) {
      console.warn("Kan inte spara: saknar imageUrl, cropPixels eller preset", { imageUrl, cropPixels, preset });
      return;
    }

    try {
      const output = preset.output || { width: 1200, height: 1200, quality: 0.92 };
      console.log("Startar beskärning", { imageUrl, cropPixels, output });
      const blob = await getCroppedBlob(imageUrl, cropPixels, output);
      console.log("Beskärning klar, skickar blob vidare", blob);
      onConfirmBlob(blob);
    } catch (e) {
      console.error("Crop failed:", e);
      // Om du vill: visa ett meddelande i UI här
      // t.ex. setLocalError("Kunde inte beskära bilden.")
    }
  }, [imageUrl, cropPixels, preset, onConfirmBlob]);

  if (!file || !preset) return null;

  const canSave = !busy && ready && !!cropPixels;

  return (
    <div style={styles.backdrop} role="dialog" aria-modal="true">
      <div style={styles.modal}>
        <div style={styles.header}>
          <strong>{preset.label}</strong>
          <button type="button" onClick={onCancel} disabled={busy} style={styles.closeBtn}>
            Stäng
          </button>
        </div>

        <div style={styles.body}>
          <div style={{ ...styles.cropWrap, width: "100%", height: 520 }}>
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={preset.aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              onMediaLoaded={onMediaLoaded}
              restrictPosition
            />
          </div>

          <div style={styles.controls}>
            <label style={{ display: "grid", gap: 6 }}>
              Zoom
              <input
                type="range"
                min={1}
                max={4}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                disabled={busy}
              />
            </label>

            <div style={styles.previewRow}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
                  Preview (som på sidan)
                </div>
                <div
                  style={{
                    width: preset.preview.width,
                    height: preset.preview.height,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#eee",
                    border: "1px solid #ddd",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    color: "#666",
                  }}
                >
                  Croppad fil blir exakt detta format
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flex: 1 }}>
                <button type="button" onClick={onCancel} disabled={busy}>
                  Avbryt
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  style={styles.saveBtn}
                  title={!ready ? "Laddar bild..." : !cropPixels ? "Ingen crop-data ännu" : ""}
                >
                  {busy ? "Sparar..." : "Spara beskärning"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Tips: dra bilden för att flytta beskärningen. Använd zoom-reglaget för att passa in.
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "grid",
    placeItems: "center",
    zIndex: 9999,
    padding: 16,
  },
  modal: {
    width: "min(980px, 100%)",
    background: "white",
    borderRadius: 16,
    padding: 16,
    display: "grid",
    gap: 12,
    fontFamily: "Georgia, serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  closeBtn: {
    border: "1px solid #ddd",
    background: "white",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
  },
  body: {
    display: "grid",
    gap: 12,
  },
  cropWrap: {
    position: "relative",
    background: "#111",
    borderRadius: 12,
    overflow: "hidden",
  },
  controls: {
    display: "grid",
    gap: 10,
  },
  previewRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  saveBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#c69c5d",
    cursor: "pointer",
    fontWeight: 600,
  },
};