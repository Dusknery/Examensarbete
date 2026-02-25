import { useEffect, useMemo, useState } from "react";
import { getStudHorses } from "../services/api";
import "../styles/breeding.css";

function Field({ label, children }) {
  return (
    <label className="breedingField">
      <strong>{label}</strong>
      {children}
    </label>
  );
}

function TextInput(props) {
  return <input {...props} className="breedingInput" />;
}

function TextArea(props) {
  return <textarea {...props} className="breedingTextarea" />;
}

export default function BreedingPage() {
  const [studs, setStuds] = useState([]);
  const [studsLoading, setStudsLoading] = useState(true);
  const [studsError, setStudsError] = useState("");

  const [mode, setMode] = useState("semen"); // "semen" | "backbreeding"

  const [form, setForm] = useState({
    // Ägare
    ssoName: "",
    discord: "",
    studId: "",

    // Sto
    mareRegisteredName: "",
    mareBreed: "",
    mareBirthYear: "",
    mareColor: "",
    mareSire: "",
    mareDam: "",
    mareDamsire: "",
    mareOwner: "",

    // Semin
    breedingMethod: "",

    // Backbreeding (fölinfo)
    foalRegisteredName: "",
    foalBreed: "",
    foalBirthYear: "",
    foalColor: "",
    foalSex: "",

    // Övrigt
    notes: "",
  });

  const [upload, setUpload] = useState(null); // File
  const [status, setStatus] = useState({ type: "idle", text: "" });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setStudsLoading(true);
        setStudsError("");

        const data = await getStudHorses();
        if (!alive) return;

        const list = Array.isArray(data) ? data : [];
        setStuds(list);

        // sätt default studId när listan kommer in
        setForm((prev) => ({
          ...prev,
          studId: prev.studId || list[0]?.id || "",
        }));
      } catch (e) {
        if (!alive) return;
        setStudsError(e.message || "Kunde inte hämta hingstar");
      } finally {
        if (!alive) return;
        setStudsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!form.ssoName.trim()) return "Fyll i SSO-namn.";
    if (!form.discord.trim()) return "Fyll i Discord.";
    if (!form.studId) return "Välj hingst.";
    if (!form.mareRegisteredName.trim())
      return "Fyll i stoets registrerade namn.";
    if (!form.mareBreed.trim()) return "Fyll i stoets ras.";
    if (!form.mareBirthYear.trim()) return "Fyll i stoets födelseår.";
    if (!form.mareColor.trim()) return "Fyll i stoets färg.";

    if (mode === "backbreeding") {
      if (!form.foalRegisteredName.trim())
        return "Fyll i fölets registrerade namn.";
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
      upload: upload
        ? { name: upload.name, type: upload.type, size: upload.size }
        : null,
    };

    console.log("BREEDING REQUEST:", payload);

    setStatus({ type: "success", text: "Skickat! Förfrågan är inskickad." });
  }

  const stud = useMemo(
    () => studs.find((s) => s.id === form.studId),
    [studs, form.studId]
  );

  return (
    <div className="breedingPage">
      <div className="breedingHeader">
        <div className="horsesLogo">
          <img src="/images/logo.png" alt="Greyfall Stable" />
        </div>
        <h1 className="horsesTitle">Avel</h1>
      </div>

      <div>
        <h2>
          Beställa semin eller <br />
          backbreeding?
        </h2>

        <p>
          Genom att skicka in betäckningsformuläret godkänner du följande:
          Greyfall Stable erbjuder betäckning via semin och fribetäckning, samt
          möjlighet till backbreeding.
        </p>

        <ul>
          <li>
            Backbreeding innebär att avkomman skapas som redan född, vilket gör
            att du får en ridbar häst direkt istället för att vänta på föl.
            Backbreeding erbjuds från och med att hingsten haft sin första
            fölkull.
          </li>
          <li>
            I formuläret ska hästens registrerade namn anges. För tydlighet
            rekommenderas att smeknamn, tillägg och alternativa stavningar inte
            används.
          </li>
          <li>
            Ägare till avkommor efter Greyfall Stables hingstar förväntas vid
            förfrågan kunna lämna uppdateringar om avkomman, exempelvis kring
            utveckling, meriter eller vidare avel.
          </li>
          <li>
            Om villkoren inte följs förbehåller sig Greyfall Stable rätten att
            neka framtida tjänster.
          </li>
        </ul>

        <p>
          Vid mer info om semin, backbreeding etc rekomederas det att läsa på på{" "}
          <a
            href="https://blippblopp.weebly.com/avel.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://blippblopp.weebly.com/avel.html
          </a>
        </p>
      </div>

      <form onSubmit={onSubmit} className="breedingForm">
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
          {studsLoading ? (
            <div style={{ opacity: 0.7 }}>Laddar hingstar...</div>
          ) : studsError ? (
            <div style={{ color: "crimson" }}>{studsError}</div>
          ) : (
            <select
              value={form.studId}
              onChange={(e) => update("studId", e.target.value)}
              className="breedingSelect"
              disabled={studs.length === 0}
            >
              {studs.length === 0 ? (
                <option value="">Inga hingstar hittades</option>
              ) : (
                studs.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))
              )}
            </select>
          )}
        </Field>

        {/* Mode-knappar direkt under hingst */}
        <div className="breedingModeButtons">
          <button
            type="button"
            onClick={() => setMode("semen")}
            className={`breedingModeButton ${mode === "semen" ? "active" : ""}`}
          >
            Semin
          </button>

          <button
            type="button"
            onClick={() => setMode("backbreeding")}
            className={`breedingModeButton ${
              mode === "backbreeding" ? "active" : ""
            }`}
          >
            Backbreeding
          </button>
        </div>

        {stud && (
          <div className="selectedStud">
            Vald hingst: <strong>{stud.name}</strong>
          </div>
        )}

        {/* Sto */}
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

        {/* Dynamiska fält */}
        {mode === "semen" && (
          <Field label="Betäckningsmetod">
            <select
              value={form.breedingMethod}
              onChange={(e) => update("breedingMethod", e.target.value)}
              className="breedingSelect"
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
                className="breedingSelect"
              >
                <option value="">Välj</option>
                <option value="Sto">Sto</option>
                <option value="Hingst">Hingst</option>
                <option value="Valack">Valack</option>
              </select>
            </Field>
          </>
        )}

        <Field label="">
          <label className="breedingFileButton">
            Infoga bild
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUpload(e.target.files?.[0] || null)}
              style={{ display: "none" }}
            />
          </label>

          {upload && (
            <div className="fileInfo">
              Vald fil: <strong>{upload.name}</strong>
            </div>
          )}
        </Field>

        <button type="submit" className="breedingSubmitButton">
          Skicka
        </button>

        {status.type !== "idle" && (
          <div className={`breedingStatus ${status.type}`}>{status.text}</div>
        )}
      </form>
    </div>
  );
}