// src/components/EditHorsePopup.jsx
import { useState } from "react";
import GeneticsPicker, { geneticsToString } from "./GeneticsPicker";
import HorseEditModal from "./HorseEditModal";
import { uploadImage } from "../services/api";
import FileUploadButton from "./FileUploadButton";

export default function EditHorsePopup({
  open,
  draft,
  setDraft,
  onClose,
  onSave,
  sexOptions,
  availableDisciplines,
  openCrop,
  IMAGE_PRESETS,
  busy = false,
}) {
  if (!open || !draft) return null;

  const [uploading, setUploading] = useState({});

  async function uploadDirect(file, key) {
    if (!file) return;

    try {
      setUploading((p) => ({ ...p, [key]: true }));

      const { imageUrl } = await uploadImage(file);
      if (!imageUrl) throw new Error("Ingen imageUrl returnerades från upload");

      setDraft((p) => ({
        ...p,
        images: {
          ...(p.images || {}),
          [key]: imageUrl,
        },
      }));
    } catch (err) {
      console.error(err);
      alert("Kunde inte ladda upp bilden.");
    } finally {
      setUploading((p) => ({ ...p, [key]: false }));
    }
  }

  const disciplineMap = {
    Dressyr: "dressyr",
    Hopp: "hopp",
    "Fälttävlan/Terräng": "terrang",
    Körning: "korning",
    Avel: "avel",
    Distansritt: "distansritt",
    "Working Equitation": "we",
    Westernridning: "western",
    "Mounted Games": "mountedgames",
    Voltige: "voltige",
  };

  const selectedNames = new Set((draft.disciplines || []).map((d) => d.name));
  const remaining = availableDisciplines.filter((d) => !selectedNames.has(d));
  const selectedDiscipline = draft._selectedDiscipline || "";

  function addDiscipline(name) {
    if (!name) return;
    setDraft((p) => {
      const list = p.disciplines || [];
      if (list.some((x) => x.name === name)) return p;
      return { ...p, disciplines: [...list, { name, merits: "" }] };
    });
  }

  function removeDiscipline(name) {
    setDraft((p) => ({
      ...p,
      disciplines: (p.disciplines || []).filter((x) => x.name !== name),
    }));
  }

  function updateMerits(name, merits) {
    setDraft((p) => ({
      ...p,
      disciplines: (p.disciplines || []).map((x) =>
        x.name === name ? { ...x, merits } : x
      ),
    }));
  }

  function previewFor(key) {
    return (
      draft.images?.[key] ||
      draft.images?.bodyshot ||
      draft.images?.headshot ||
      ""
    );
  }

  return (
    <HorseEditModal open={open} title="Redigera häst" onClose={onClose} busy={busy}>
      <form
        className="adminForm"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!draft.name?.trim()) return;

          const levels = {};
          for (const d of draft.disciplines || []) {
            const key =
              disciplineMap[d.name] || d.name.toLowerCase().replace(/\W+/g, "");
            levels[key] = (d.merits || "").trim();
          }

          const horseData = {
            name: draft.name.trim(),
            nickname: draft.nickname?.trim() || "",
            breed: draft.breed?.trim() || "",
            year: draft.year || "",
            sex: draft.sex || "",
            isStud: draft.sex === "Hingst" ? !!draft.isStud : false,
            pedigree: {
              e: draft.pedigreeE || "",
              eId: draft.pedigreeEId || "",
              u: draft.pedigreeU || "",
              uId: draft.pedigreeUId || "",
              ue: draft.pedigreeUE || "",
            },
            levels,
            other: {
              mkh: draft.mkh || "",
              country: draft.country || "",
            },
            genetics: geneticsToString(draft.genetics),
            description: draft.description || "",
            imageUrl: draft.images?.headshot || "",
            images: {
              headshot: draft.images?.headshot || "",
              card: draft.images?.card || "",
              stallion: draft.images?.stallion || "",
              bodyshot: draft.images?.bodyshot || "",
              pedigree: draft.images?.pedigree || "",
            },
          };

          await onSave(horseData);
        }}
      >
        <h3 style={{ margin: "0 0 8px 0", fontSize: 18 }}>Grundinfo</h3>

        <input
          value={draft.name}
          onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
          placeholder="Hästens namn *"
          required
        />

        <input
          value={draft.nickname}
          onChange={(e) => setDraft((p) => ({ ...p, nickname: e.target.value }))}
          placeholder="Smeknamn"
        />

        <input
          value={draft.breed}
          onChange={(e) => setDraft((p) => ({ ...p, breed: e.target.value }))}
          placeholder="Ras"
        />

        <input
          type="number"
          value={draft.year}
          onChange={(e) =>
            setDraft((p) => ({
              ...p,
              year: (e.target.value || "").replace(/\D/g, ""),
            }))
          }
          placeholder="Födelseår"
        />

        <label style={{ display: "grid", gap: 6 }}>
          <strong>Kön</strong>
          <select
            value={draft.sex}
            onChange={(e) => {
              const v = e.target.value;
              setDraft((p) => ({
                ...p,
                sex: v,
                isStud: v !== "Hingst" ? false : p.isStud,
              }));
            }}
          >
            <option value="">-- Välj --</option>
            {sexOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        {draft.sex === "Hingst" ? (
          <label className="adminCheckbox">
            <input
              type="checkbox"
              checked={!!draft.isStud}
              onChange={(e) =>
                setDraft((p) => ({ ...p, isStud: e.target.checked }))
              }
            />
            <span>Avelshingst</span>
          </label>
        ) : null}

        <h3 style={{ margin: "20px 0 10px 0", fontSize: 18 }}>Stamtavla</h3>

        <input
          value={draft.pedigreeE}
          onChange={(e) => setDraft((p) => ({ ...p, pedigreeE: e.target.value }))}
          placeholder="E (Far) – namn"
        />
        <input
          value={draft.pedigreeEId}
          onChange={(e) => setDraft((p) => ({ ...p, pedigreeEId: e.target.value }))}
          placeholder="EId (Far) – id"
        />

        <input
          value={draft.pedigreeU}
          onChange={(e) => setDraft((p) => ({ ...p, pedigreeU: e.target.value }))}
          placeholder="U (Mor) – namn"
        />
        <input
          value={draft.pedigreeUId}
          onChange={(e) => setDraft((p) => ({ ...p, pedigreeUId: e.target.value }))}
          placeholder="UId (Mor) – id"
        />
        <input
          value={draft.pedigreeUE}
          onChange={(e) => setDraft((p) => ({ ...p, pedigreeUE: e.target.value }))}
          placeholder="UE (Morfar)"
        />

        <h3 style={{ margin: "20px 0 10px 0", fontSize: 18 }}>Inriktning</h3>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select
              value={selectedDiscipline}
              onChange={(e) =>
                setDraft((p) => ({ ...p, _selectedDiscipline: e.target.value }))
              }
            >
              <option value="">-- Välj --</option>
              {remaining.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                addDiscipline(selectedDiscipline);
                setDraft((p) => ({ ...p, _selectedDiscipline: "" }));
              }}
              disabled={!selectedDiscipline}
            >
              Lägg till
            </button>
          </div>

          {(draft.disciplines || []).length > 0 && (
            <div style={{ display: "grid", gap: 10 }}>
              {(draft.disciplines || []).map((d) => (
                <div
                  key={d.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr 40px",
                    gap: 10,
                    alignItems: "center",
                    padding: 10,
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    background: "white",
                  }}
                >
                  <strong>{d.name}</strong>

                  <input
                    value={d.merits}
                    onChange={(e) => updateMerits(d.name, e.target.value)}
                    placeholder={`${d.name} - meriter`}
                  />

                  <button
                    type="button"
                    onClick={() => removeDiscipline(d.name)}
                    aria-label={`Ta bort ${d.name}`}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: 18,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <h3 style={{ margin: "20px 0 10px 0", fontSize: 18 }}>Övrigt</h3>

        <input
          value={draft.mkh}
          onChange={(e) =>
            setDraft((p) => ({ ...p, mkh: e.target.value.replace(/\D/g, "") }))
          }
          placeholder="Mankhöjd (cm)"
        />
        <input
          value={draft.country}
          onChange={(e) => setDraft((p) => ({ ...p, country: e.target.value }))}
          placeholder="Ursprungsland"
        />

        <GeneticsPicker
          value={draft.genetics}
          onChange={(g) => setDraft((p) => ({ ...p, genetics: g }))}
        />

        <textarea
          value={draft.description}
          onChange={(e) =>
            setDraft((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Beskrivning"
          rows={4}
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />

        <h3 style={{ margin: "20px 0 10px 0", fontSize: 18 }}>Bilder</h3>

        <div className="adminImageUpload">
          <strong>Headshot (1:1)</strong>
          <FileUploadButton
            label="Välj bild"
            disabled={busy}
            onSelect={(file) => openCrop(file, IMAGE_PRESETS.headshot, { target: "edit" })}
          />
          {draft.images?.headshot ? <small>Vald</small> : <small>Ingen vald</small>}
          {previewFor("headshot") ? (
            <img src={previewFor("headshot")} alt="headshot" className="adminImagePreview" />
          ) : null}
        </div>

        <div className="adminImageUpload">
          <strong>Kortbild (3:4)</strong>
          <FileUploadButton
            label="Välj bild"
            disabled={busy}
            onSelect={(file) => openCrop(file, IMAGE_PRESETS.card, { target: "edit" })}
          />
          {draft.images?.card ? <small>Vald</small> : <small>Ingen vald (fallback visas)</small>}
          {previewFor("card") ? (
            <img src={previewFor("card")} alt="card" className="adminImagePreview" />
          ) : null}
        </div>

        {draft.isStud && (
          <div className="adminImageUpload">
            <strong>Hingstbild (5:3)</strong>
            <FileUploadButton
              label="Välj bild"
              disabled={busy}
              onSelect={(file) => openCrop(file, IMAGE_PRESETS.stallion, { target: "edit" })}
            />
            {draft.images?.stallion ? <small>Vald</small> : <small>Ingen vald (fallback visas)</small>}
            {previewFor("stallion") ? (
              <img src={previewFor("stallion")} alt="stallion" className="adminImagePreview" />
            ) : null}
          </div>
        )}

        <div className="adminImageUpload">
          <strong>Bodyshot (4:5)</strong>
          <FileUploadButton
            label="Välj bild"
            disabled={busy}
            onSelect={(file) => openCrop(file, IMAGE_PRESETS.bodyshot, { target: "edit" })}
          />
          {draft.images?.bodyshot ? <small>Vald</small> : <small>Ingen vald</small>}
          {previewFor("bodyshot") ? (
            <img src={previewFor("bodyshot")} alt="bodyshot" className="adminImagePreview" />
          ) : null}
        </div>

        <div className="adminImageUpload">
          <strong>Pedigree (3:2)</strong>
          <FileUploadButton
            label={uploading.pedigree ? "Laddar upp..." : "Välj bild"}
            disabled={busy || uploading.pedigree}
            onSelect={(file) => uploadDirect(file, "pedigree")}
          />

          {draft.images?.pedigree ? <small>Vald</small> : <small>Ingen vald</small>}

          {draft.images?.pedigree ? (
            <img
              src={draft.images.pedigree}
              alt="pedigree"
              className="adminImagePreview contain"
            />
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button type="submit" disabled={busy}>
            Spara ändringar
          </button>
          <button type="button" onClick={onClose} disabled={busy}>
            Avbryt
          </button>
        </div>
      </form>
    </HorseEditModal>
  );
}