import { useMemo, useState } from "react";
import { horses } from "../data/horses";

function Field({ label, children }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <strong>{label}</strong>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      style={{
        padding: 10,
        borderRadius: 10,
        border: "1px solid #ccc",
        outline: "none",
      }}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      style={{
        padding: 10,
        borderRadius: 10,
        border: "1px solid #ccc",
        outline: "none",
        resize: "vertical",
      }}
    />
  );
}

export default function BreedingPage() {
  const studs = useMemo(() => horses.filter((h) => h.isStud), []);
  const [mode, setMode] = useState("semen"); // "semen" | "backbreeding"

  const [form, setForm] = useState({
    // Ägare
    ssoName: "",
    discord: "",
    studId: studs[0]?.id || "",

    // Sto
    mareRegisteredName: "",
    mareBreed: "",
    mareBirthYear: "",
    mareColor: "",
    mareSire: "",
    mareDam: "",
    mareDamsire: "",
    mareOwner: "",

    // Semin (enligt bilden)
    backbreedingOffspring: "",

    // Backbreeding (fölinfo enligt bilden)
    foalRegisteredName: "",
    foalBreed: "",
    foalBirthYear: "",
    foalColor: "",
    foalSex: "", // Sto / Hingst / Valack (om du vill ha)

    // Övrigt
    notes: "",
  });

  const [upload, setUpload] = useState(null); // File
  const [status, setStatus] = useState({ type: "idle", text: "" });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!form.ssoName.trim()) return "Fyll i SSO-namn.";
    if (!form.discord.trim()) return "Fyll i Discord.";
    if (!form.studId) return "Välj hingst.";
    if (!form.mareRegisteredName.trim()) return "Fyll i stoets registrerade namn.";
    if (!form.mareBreed.trim()) return "Fyll i stoets ras.";
    if (!form.mareBirthYear.trim()) return "Fyll i stoets födelseår.";
    if (!form.mareColor.trim()) return "Fyll i stoets färg.";

    if (mode === "semen") {
      // om du vill kräva denna:
      // if (!form.backbreedingOffspring.trim()) return "Välj backbreedingavkomma.";
    }

    if (mode === "backbreeding") {
      if (!form.foalRegisteredName.trim()) return "Fyll i fölets registrerade namn.";
      if (!form.foalBreed.trim()) return "Fyll i fölets ras.";
      if (!form.foalBirthYear.trim()) return "Fyll i fölets födelseår.";
      if (!form.foalColor.trim()) return "Fyll i fölets färg.";
      if (!form.foalSex.trim()) return "Välj fölets kön.";
    }

    return null;
  }

  function onSubmit(e) {
    e.preventDefault();
    const error = validate();
    if (error) {
      setStatus({ type: "error", text: error });
      return;
    }

    const payload = {
      mode,
      ...form,
      upload: upload ? { name: upload.name, type: upload.type, size: upload.size } : null,
    };

    console.log("BREEDING REQUEST:", payload);

    setStatus({ type: "success", text: "Skickat! Förfrågan är inskickad." });
  }

  const stud = studs.find((s) => s.id === form.studId);

  return (
    <div style={{ maxWidth: 760, display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0 }}>Avel</h1>

      <form
        onSubmit={onSubmit}
        style={{
          display: "grid",
          gap: 14,
          padding: 14,
          border: "1px solid #ddd",
          borderRadius: 14,
          background: "white",
        }}
      >
        {/* 1) SSO / Discord */}
        <Field label="SSO Name">
          <TextInput
            value={form.ssoName}
            onChange={(e) => update("ssoName", e.target.value)}
            placeholder="Ditt SSO-namn"
          />
        </Field>

        <Field label="Discord">
          <TextInput
            value={form.discord}
            onChange={(e) => update("discord", e.target.value)}
            placeholder="Namntag#0000"
          />
        </Field>

    <Field label="Välj hingst">
  <select
    value={form.studId}
    onChange={(e) => update("studId", e.target.value)}
    style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
  >
    {studs.map((h) => (
      <option key={h.id} value={h.id}>
        {h.name}
      </option>
    ))}
  </select>
</Field>

{/* ✅ Mode-knappar DIREKT under hingst-rutan */}
<div style={{ display: "flex", gap: 10, marginTop: 6 }}>
  <button
    type="button"
    onClick={() => setMode("semen")}
    style={{
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid #ccc",
      background: mode === "semen" ? "#CC9F57" : "white",
      cursor: "pointer",
      fontWeight: 700,
    }}
  >
    Semin
  </button>

  <button
    type="button"
    onClick={() => setMode("backbreeding")}
    style={{
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid #ccc",
      background: mode === "backbreeding" ? "#CC9F57" : "white",
      cursor: "pointer",
      fontWeight: 700,
    }}
  >
    Backbreeding
  </button>
</div>

{stud && (
  <div style={{ opacity: 0.85 }}>
    Vald hingst: <strong>{stud.name}</strong>
  </div>
)}
        {/* 4) Sto (i samma ordning som bilden) */}
        <Field label="Stoets registrerade namn">
          <TextInput
            value={form.mareRegisteredName}
            onChange={(e) => update("mareRegisteredName", e.target.value)}
            placeholder="Registrerat namn"
          />
        </Field>

        <Field label="Stoets ras">
          <TextInput
            value={form.mareBreed}
            onChange={(e) => update("mareBreed", e.target.value)}
            placeholder="t.ex. SWB, PRE..."
          />
        </Field>

        <Field label="Stoets födelseår">
          <TextInput
            value={form.mareBirthYear}
            onChange={(e) => update("mareBirthYear", e.target.value)}
            placeholder="t.ex. 2018"
          />
        </Field>

        <Field label="Stoets färg">
          <TextInput
            value={form.mareColor}
            onChange={(e) => update("mareColor", e.target.value)}
            placeholder="t.ex. skimmel"
          />
        </Field>

        <Field label="Stoets pappa">
          <TextInput
            value={form.mareSire}
            onChange={(e) => update("mareSire", e.target.value)}
            placeholder="Hingstens namn"
          />
        </Field>

        <Field label="Stoets mamma">
          <TextInput
            value={form.mareDam}
            onChange={(e) => update("mareDam", e.target.value)}
            placeholder="Stoets namn"
          />
        </Field>

        <Field label="Stoets morfar">
          <TextInput
            value={form.mareDamsire}
            onChange={(e) => update("mareDamsire", e.target.value)}
            placeholder="Hingstens namn"
          />
        </Field>

        <Field label="Stoets ägare">
          <TextInput
            value={form.mareOwner}
            onChange={(e) => update("mareOwner", e.target.value)}
            placeholder="Ägare (SSO/RRP)"
          />
        </Field>

        {/* 5) Dynamiska fält efter stoet */}
        {mode === "semen" && (
          <Field label="Betäckningsmetod">
            <select
              value={form.breedingMethod}
              onChange={(e) => update("breedingMethod", e.target.value)}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            >
              <option value="">Välj (valfritt)</option>
              <option value="TAI">TAI</option>
              <option value="AI">AI</option>
              <option value="FAI">FAI</option>
              <option value="annat">annat</option>
            </select>
          </Field>
        )}

        {mode === "backbreeding" && (
          <>
            <Field label="Fölens registrerade namn">
              <TextInput
                value={form.foalRegisteredName}
                onChange={(e) => update("foalRegisteredName", e.target.value)}
                placeholder="Registrerat namn"
              />
            </Field>

            <Field label="Fölens ras">
              <TextInput
                value={form.foalBreed}
                onChange={(e) => update("foalBreed", e.target.value)}
                placeholder="t.ex. SWB, PRE..."
              />
            </Field>

            <Field label="Fölens födelseår">
              <TextInput
                value={form.foalBirthYear}
                onChange={(e) => update("foalBirthYear", e.target.value)}
                placeholder="t.ex. 2024"
              />
            </Field>

            <Field label="Fölens färg">
              <TextInput
                value={form.foalColor}
                onChange={(e) => update("foalColor", e.target.value)}
                placeholder="t.ex. brun"
              />
            </Field>

            <Field label="Fölets kön">
              <select
                value={form.foalSex}
                onChange={(e) => update("foalSex", e.target.value)}
                style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
              >
                <option value="">Välj</option>
                <option value="Sto">Sto</option>
                <option value="Hingst">Hingst</option>
                <option value="Valack">Valack</option>
              </select>
            </Field>
          </>
        )}

        <Field label="Lägg till ev. bild (valfritt)">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setUpload(e.target.files?.[0] || null)}
          />
          {upload && (
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Vald fil: <strong>{upload.name}</strong>
            </div>
          )}
        </Field>

        <Field label="Övrigt (valfritt)">
          <TextArea
            rows={3}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Allt extra du vill säga"
          />
        </Field>

        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 12,
            border: "none",
            background: "#c69c5d",
            color: "white",
            fontWeight: 800,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          Skicka
        </button>

        {status.type !== "idle" && (
          <div
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
              background: status.type === "success" ? "CC9F57" : "#ffffff",
            }}
          >
            {status.text}
          </div>
        )}
      </form>
    </div>
  );
}