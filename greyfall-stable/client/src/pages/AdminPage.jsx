import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminLogout,
  createHorse,
  createNews,
  deleteHorse,
  deleteNews,
  generateHorseIds,
  getHorses,
  getNews,
  isAdminLoggedIn,
  updateHorse,
  uploadImage,
} from "../services/api";
import ImageCropModal from "../components/ImageCropModal";
import { IMAGE_PRESETS } from "../config/imagePresets";
import GeneticsPicker, { geneticsToString } from "../components/GeneticsPicker";
import "../styles/admin.css";
import { PLACEHOLDERS } from "../config/placeholders";

// Viktigt: använd som "mall" och klona alltid (ingen delad referens)
const DEFAULT_GENETICS_TEMPLATE = {
  E: ["e", "e"],
  A: ["a", "a"],
  CrPrl: ["cr", "cr"],
  Z: ["z", "z"],
  D: ["d", "d"],
  Ch: ["ch", "ch"],
  G: ["g", "g"],
  Rn: ["rn", "rn"],
  To: ["to", "to"],
  O: ["o", "o"],
  SB1: ["sb1", "sb1"],
  SW1: ["sw1", "sw1"],
  LP: ["lp", "lp"],
};

function cloneGenetics() {
  if (globalThis.structuredClone)
    return globalThis.structuredClone(DEFAULT_GENETICS_TEMPLATE);
  return JSON.parse(JSON.stringify(DEFAULT_GENETICS_TEMPLATE));
}

export default function AdminPage() {
  const nav = useNavigate();

  // Tabs
  const [activeTab, setActiveTab] = useState("news");

  const [news, setNews] = useState([]);
  const [horses, setHorses] = useState([]);

  // News form
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // News image upload
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Horse form & edit mode
  const [horseName, setHorseName] = useState("");
  const [horseNickname, setHorseNickname] = useState("");
  const [horseBreed, setHorseBreed] = useState("");
  const [horseYear, setHorseYear] = useState("");
  const [horseSex, setHorseSex] = useState("");
  const [isStud, setIsStud] = useState(false);
  const [pedigreeE, setPedigreeE] = useState("");
  const [pedigreeU, setPedigreeU] = useState("");
  const [pedigreeUE, setPedigreeUE] = useState("");
  const [pedigreeEId, setPedigreeEId] = useState("");
  const [pedigreeUId, setPedigreeUId] = useState("");
  const [editHorseId, setEditHorseId] = useState(null);

  // Disciplines
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [disciplines, setDisciplines] = useState([]); // [{ name, merits }]

  const availableDisciplines = useMemo(
    () => [
      "Dressyr",
      "Hopp",
      "Fälttävlan/Terräng",
      "Körning",
      "Avel",
      "Distansritt",
      "Working Equitation",
      "Westernridning",
      "Mounted Games",
      "Voltige",
    ],
    []
  );

  const sexOptions = useMemo(() => ["Hingst", "Sto", "Valack"], []);

  function addDiscipline() {
    if (!selectedDiscipline) return;

    setDisciplines((prev) => {
      if (prev.some((x) => x.name === selectedDiscipline)) return prev;
      return [...prev, { name: selectedDiscipline, merits: "" }];
    });

    setSelectedDiscipline("");
  }

  function removeDiscipline(name) {
    setDisciplines((prev) => prev.filter((x) => x.name !== name));
  }

  function updateMerits(name, value) {
    setDisciplines((prev) =>
      prev.map((x) => (x.name === name ? { ...x, merits: value } : x))
    );
  }

  // Other
  const [horseMkh, setHorseMkh] = useState("");
  const [horseCountry, setHorseCountry] = useState("");
  const [horseGenetics, setHorseGenetics] = useState(() => cloneGenetics());
  const [horseDescription, setHorseDescription] = useState("");

  // Horse image URLs (after crop + upload)
  const [headshotUrl, setHeadshotUrl] = useState("");
  const [cardUrl, setCardUrl] = useState("");
  const [stallionUrl, setStallionUrl] = useState("");
  const [bodyshotUrl, setBodyshotUrl] = useState("");
  const [pedigreeUrl, setPedigreeUrl] = useState("");

  // Crop modal state
  const [cropping, setCropping] = useState(false);
  const [cropFile, setCropFile] = useState(null);
  const [cropPreset, setCropPreset] = useState(null);
  const [cropUploading, setCropUploading] = useState(false);

  const [msg, setMsg] = useState("");

  async function load() {
    const [n, h] = await Promise.all([getNews(), getHorses()]);
    setNews(Array.isArray(n) ? n : []);
    setHorses(Array.isArray(h) ? h : []);
  }




  useEffect(() => {
    if (!isAdminLoggedIn()) {
      nav("/admin-login");
      return;
    }
    load();
  }, [nav]);

  // Upload news image
  async function handleUpload() {
    setMsg("");

    if (!imageFile) {
      setMsg("Välj en bildfil först.");
      return;
    }

    try {
      setUploading(true);
      const data = await uploadImage(imageFile);
      setUploadedImageUrl(data.imageUrl || "");
      setMsg("Bild uppladdad.");
    } catch (e) {
      console.error(e);
      setMsg("Kunde inte ladda upp bild.");
    } finally {
      setUploading(false);
    }
  }

  async function addNews(e) {
    e.preventDefault();
    setMsg("");

    if (!title.trim() || !body.trim()) {
      setMsg("Titel och text måste fyllas i.");
      return;
    }

    if (imageFile && !uploadedImageUrl) {
      setMsg("Ladda upp bilden först.");
      return;
    }

    const validUrl = (s) => {
      if (!s) return true;
      try {
        new URL(s);
        return true;
      } catch {
        return false;
      }
    };

    if (!validUrl(linkUrl.trim())) {
      setMsg("Länken verkar inte vara en giltig URL (måste börja med https://).");
      return;
    }

    try {
      await createNews({
        title: title.trim(),
        body: body.trim(),
        imageUrl: uploadedImageUrl,
        linkUrl: linkUrl.trim(),
      });

      setTitle("");
      setBody("");
      setLinkUrl("");
      setImageFile(null);
      setUploadedImageUrl("");

      await load();
      setMsg("Nyhet skapad.");
    } catch (e2) {
      console.error(e2);
      setMsg("Kunde inte skapa nyhet.");
    }
  }

  async function removeNews(id) {
    setMsg("");
    try {
      await deleteNews(id);
      await load();
      setMsg("Nyhet borttagen.");
    } catch (e) {
      console.error(e);
      setMsg("Kunde inte ta bort nyhet.");
    }
  }

  async function toggleStud(horse) {
    setMsg("");
    try {
      await updateHorse(horse.id, { isStud: !horse.isStud });
      await load();
      setMsg("Häst uppdaterad.");
    } catch (e) {
      console.error(e);
      setMsg("Kunde inte uppdatera häst.");
    }
  }

  async function removeHorse(id) {
    setMsg("");
    const ok = window.confirm("Vill du ta bort hästen? Detta går inte att ångra.");
    if (!ok) return;

    try {
      await deleteHorse(id);
      await load();
      setMsg("Häst borttagen.");
    } catch (e) {
      console.error(e);
      setMsg("Kunde inte ta bort häst.");
    }
  }

  async function onGenerateIds() {
    setMsg("");
    try {
      const r = await generateHorseIds();
      await load();
      setMsg(`Klart. Uppdaterade ${r?.updatedCount ?? 0} hästar.`);
    } catch (e) {
      console.error(e);
      setMsg("Kunde inte generera id:n.");
    }
  }

  function openCrop(file, preset) {
    if (!file || !preset) return;
    setCropFile(file);
    setCropPreset(preset);
    setCropping(true);
  }

  async function uploadCroppedBlob(blob, filename) {
    const f = new File([blob], filename || "cropped.jpg", { type: "image/jpeg" });
    const data = await uploadImage(f);
    return data.imageUrl || "";
  }

  async function handleHorseSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!horseName.trim()) {
      setMsg("Hästnamn måste fyllas i.");
      return;
    }

    try {
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

      const levels = {};
      for (const d of disciplines) {
        const key =
          disciplineMap[d.name] || d.name.toLowerCase().replace(/\W+/g, "");
        levels[key] = (d.merits || "").trim();
      }

      const yearNum = horseYear ? Number(horseYear) : undefined;
      const mkhNum = horseMkh ? Number(horseMkh) : undefined;

      const finalHeadshot = headshotUrl || PLACEHOLDERS.headshot;
      const finalBodyshot = bodyshotUrl || PLACEHOLDERS.bodyshot;
      const finalCard = cardUrl || PLACEHOLDERS.card || finalBodyshot;
      const finalStallion = stallionUrl || PLACEHOLDERS.stallion || finalBodyshot;
      const finalPedigree = pedigreeUrl || PLACEHOLDERS.pedigree || "";

      const horseData = {
        name: horseName.trim(),
        nickname: horseNickname.trim() || undefined,
        breed: horseBreed.trim() || "Okänd ras",
        year: Number.isFinite(yearNum) ? String(yearNum) : undefined,
        sex: horseSex || "Okänd",
        isStud: horseSex === "Hingst" ? isStud : false,
        pedigree: {
          e: pedigreeE.trim() || undefined,
          eId: pedigreeEId.trim() || undefined,
          u: pedigreeU.trim() || undefined,
          uId: pedigreeUId.trim() || undefined,
          ue: pedigreeUE.trim() || undefined,
        },
        levels,
        other: {
          mkh: Number.isFinite(mkhNum) ? String(mkhNum) : undefined,
          country: horseCountry.trim() || undefined,
        },
        genetics: geneticsToString(horseGenetics),
        description: horseDescription.trim() || undefined,
        imageUrl: finalHeadshot,
        images: {
          headshot: finalHeadshot,
          card: finalCard,
          stallion: finalStallion,
          bodyshot: finalBodyshot,
          pedigree: finalPedigree,
        },
      };

      if (editHorseId) {
        await updateHorse(editHorseId, horseData);
        setMsg("Häst uppdaterad.");
      } else {
        await createHorse(horseData);
        setMsg("Häst skapad.");
      }

      // Reset form
      setHorseName("");
      setHorseNickname("");
      setHorseBreed("");
      setHorseYear("");
      setHorseSex("");
      setIsStud(false);
      setPedigreeE("");
      setPedigreeU("");
      setPedigreeUE("");
      setPedigreeEId("");
      setPedigreeUId("");
      setHorseMkh("");
      setHorseCountry("");
      setHorseGenetics(cloneGenetics());
      setHorseDescription("");
      setHeadshotUrl("");
      setCardUrl("");
      setStallionUrl("");
      setBodyshotUrl("");
      setPedigreeUrl("");
      setSelectedDiscipline("");
      setDisciplines([]);
      setEditHorseId(null);

      await load();
    } catch (e2) {
      console.error(e2);
      setMsg(editHorseId ? "Kunde inte uppdatera häst." : "Kunde inte skapa häst.");
    }
  }

  function logout() {
    adminLogout();
    nav("/");
  }

  return (
    <div className="adminPage">
      <div className="adminHeader">
        <h1>Admin</h1>
        <button onClick={logout} className="adminLogoutBtn">
          Logga ut
        </button>
      </div>

      {msg && <div className="adminMessage">{msg}</div>}

      <div className="adminTabs">
        <button
          className={`adminTab ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          Nyheter
        </button>
        <button
          className={`adminTab ${activeTab === "allhorses" ? "active" : ""}`}
          onClick={() => setActiveTab("allhorses")}
        >
          Alla hästar
        </button>
        <button
          className={`adminTab ${activeTab === "horses" ? "active" : ""}`}
          onClick={() => setActiveTab("horses")}
        >
          Hästar
        </button>
      </div>

      {activeTab === "news" && (
        <div className="adminSection">
          <form onSubmit={addNews} className="adminForm">
            <h2 style={{ margin: 0, fontSize: "24px" }}>Skapa nyhet</h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel"
            />

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Text"
              rows={5}
            />

            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Extern länk (valfritt) – https://..."
            />

            <div className="adminImageUpload">
              <strong>Bild</strong>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />

              <div className="adminUploadStatus">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading || !imageFile}
                  className="adminUploadBtn"
                >
                  {uploading ? "Laddar upp..." : "Ladda upp bild"}
                </button>

                {uploadedImageUrl ? (
                  <small>Bild uppladdad</small>
                ) : (
                  <small>Ingen bild uppladdad</small>
                )}
              </div>

              {(uploadedImageUrl || imageFile) && (
                <img
                  src={uploadedImageUrl || PLACEHOLDERS.card || PLACEHOLDERS.bodyshot}
                  alt="news preview"
                  className="adminImagePreview"
                />
              )}
            </div>

            <button type="submit" disabled={uploading}>
              Lägg till nyhet
            </button>
          </form>

          <div>
            <h3 style={{ marginBottom: "16px" }}>Befintliga nyheter</h3>
            <div className="adminList">
              {news.map((n) => (
                <div key={n.id} className="adminListItem">
                  <strong>{n.title}</strong>

                  {n.imageUrl ? <img src={n.imageUrl} alt={n.title} /> : null}

                  <div className="content">{n.body}</div>

                  {n.linkUrl ? (
                    <div>
                      <a href={n.linkUrl} target="_blank" rel="noreferrer">
                        Öppna extern länk
                      </a>
                    </div>
                  ) : null}

                  <small>
                    {n.date ? new Date(n.date).toLocaleString() : ""}
                  </small>

                  <button
                    onClick={() => removeNews(n.id)}
                    className="adminDeleteBtn"
                  >
                    Ta bort
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "horses" && (
        <div className="adminSection">
          <form onSubmit={handleHorseSubmit} className="adminForm">
            <h2 style={{ margin: 0, fontSize: "24px" }}>{editHorseId ? "Redigera häst" : "Lägg till häst"}</h2>
            {editHorseId && (
              <button
                type="button"
                onClick={() => {
                  setEditHorseId(null);
                  setHorseName("");
                  setHorseNickname("");
                  setHorseBreed("");
                  setHorseYear("");
                  setHorseSex("");
                  setIsStud(false);
                  setPedigreeE("");
                  setPedigreeU("");
                  setPedigreeUE("");
                  setPedigreeEId("");
                  setPedigreeUId("");
                  setHorseMkh("");
                  setHorseCountry("");
                  setHorseGenetics(cloneGenetics());
                  setHorseDescription("");
                  setHeadshotUrl("");
                  setCardUrl("");
                  setStallionUrl("");
                  setBodyshotUrl("");
                  setPedigreeUrl("");
                  setSelectedDiscipline("");
                  setDisciplines([]);
                }}
                style={{ marginBottom: 12 }}
              >
                Avbryt redigering
              </button>
            )}

            <input
              value={horseName}
              onChange={(e) => setHorseName(e.target.value)}
              placeholder="Hästens namn *"
              required
            />

            <input
              value={horseNickname}
              onChange={(e) => setHorseNickname(e.target.value)}
              placeholder="Hästens smeknamn *"
              required
            />

            <input
              value={horseBreed}
              onChange={(e) => setHorseBreed(e.target.value)}
              placeholder="Ras (t.ex. Andalusier)"
            />

            <input
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={horseYear}
              onChange={(e) =>
                setHorseYear((e.target.value || "").replace(/\D/g, ""))
              }
              placeholder="Födelseår (t.ex. 2019)"
            />

            <label style={{ display: "grid", gap: 6 }}>
              <strong>Kön</strong>
              <select
                value={horseSex}
                onChange={(e) => {
                  const v = e.target.value;
                  setHorseSex(v);
                  if (v !== "Hingst") setIsStud(false);
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

            {horseSex === "Hingst" ? (
              <label className="adminCheckbox">
                <input
                  type="checkbox"
                  checked={isStud}
                  onChange={(e) => setIsStud(e.target.checked)}
                />
                <span>Avelshingst</span>
              </label>
            ) : null}

            <h3 style={{ margin: "20px 0 10px 0", fontSize: "18px" }}>
              Stamtavla
            </h3>

            <input
              value={pedigreeE}
              onChange={(e) => setPedigreeE(e.target.value)}
              placeholder="E (Far) – namn"
            />
            <input
              value={pedigreeEId}
              onChange={(e) => setPedigreeEId(e.target.value)}
              placeholder="EId (Far) – id (valfritt)"
            />

            <input
              value={pedigreeU}
              onChange={(e) => setPedigreeU(e.target.value)}
              placeholder="U (Mor) – namn"
            />
            <input
              value={pedigreeUId}
              onChange={(e) => setPedigreeUId(e.target.value)}
              placeholder="UId (Mor) – id (valfritt)"
            />

            <input
              value={pedigreeUE}
              onChange={(e) => setPedigreeUE(e.target.value)}
              placeholder="UE (Morfar)"
            />

            <h3 style={{ margin: "20px 0 10px 0", fontSize: "18px" }}>
              Inriktning
            </h3>

            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <select
                  value={selectedDiscipline}
                  onChange={(e) => setSelectedDiscipline(e.target.value)}
                >
                  <option value="">-- Välj --</option>
                  {availableDisciplines
                    .filter((d) => !disciplines.some((x) => x.name === d))
                    .map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  onClick={addDiscipline}
                  disabled={!selectedDiscipline}
                >
                  Lägg till
                </button>
              </div>

              {disciplines.length > 0 && (
                <div style={{ display: "grid", gap: 10 }}>
                  {disciplines.map((d) => (
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

            <h3 style={{ margin: "20px 0 10px 0", fontSize: "18px" }}>
              Övrig information
            </h3>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={horseMkh}
              onChange={(e) => setHorseMkh(e.target.value.replace(/\D/g, ""))}
              placeholder="Mankhöjd (cm)"
            />

            <input
              value={horseCountry}
              onChange={(e) => setHorseCountry(e.target.value)}
              placeholder="Ursprungsland"
            />

            <GeneticsPicker value={horseGenetics} onChange={setHorseGenetics} />

            <textarea
              value={horseDescription}
              onChange={(e) => setHorseDescription(e.target.value)}
              placeholder="Beskrivning av hästen"
              rows={4}
              style={{
                fontFamily: "inherit",
                fontSize: "inherit",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />

            <h3 style={{ margin: "20px 0 10px 0", fontSize: "18px" }}>
              Bilder (välj fil, beskär, zooma, spara)
            </h3>

            <div className="adminImageUpload">
              <strong>Headshot (1:1)</strong>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) openCrop(file, IMAGE_PRESETS.headshot);
                  e.target.value = "";
                }}
              />
              {cropFile && cropPreset?.key === "headshot" ? (
                <small>{cropFile.name}</small>
              ) : headshotUrl ? <small>Vald</small> : <small>Ingen</small>}
              {headshotUrl && (
                <img
                  src={headshotUrl}
                  alt="headshot preview"
                  className="adminImagePreview"
                />
              )}
            </div>

            <div className="adminImageUpload">
              <strong>Kortbild (horses list) (3:4)</strong>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) openCrop(file, IMAGE_PRESETS.card);
                  e.target.value = "";
                }}
              />
              {cropFile && cropPreset?.key === "card" ? (
                <small>{cropFile.name}</small>
              ) : cardUrl ? <small>Vald</small> : <small>Ingen</small>}
              {cardUrl && (
                <img
                  src={cardUrl}
                  alt="card preview"
                  className="adminImagePreview"
                />
              )}
            </div>

            {isStud && (
              <div className="adminImageUpload">
                <strong>Hingstbild (stallions page) (5:3)</strong>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) openCrop(file, IMAGE_PRESETS.stallion);
                    e.target.value = "";
                  }}
                />
                {cropFile && cropPreset?.key === "stallion" ? (
                  <small>{cropFile.name}</small>
                ) : stallionUrl ? <small>Vald</small> : <small>Ingen</small>}
                {stallionUrl && (
                  <img
                    src={stallionUrl}
                    alt="stallion preview"
                    className="adminImagePreview"
                  />
                )}
              </div>
            )}

            <div className="adminImageUpload">
              <strong>Bodyshot (4:5)</strong>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) openCrop(file, IMAGE_PRESETS.bodyshot);
                  e.target.value = "";
                }}
              />
              {cropFile && cropPreset?.key === "bodyshot" ? (
                <small>{cropFile.name}</small>
              ) : bodyshotUrl ? <small>Vald</small> : <small>Ingen</small>}
              {bodyshotUrl && (
                <img
                  src={bodyshotUrl}
                  alt="bodyshot preview"
                  className="adminImagePreview"
                />
              )}
            </div>

            <div className="adminImageUpload">
              <strong>Pedigree (3:2)</strong>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) openCrop(file, IMAGE_PRESETS.pedigree);
                  e.target.value = "";
                }}
              />
              {cropFile && cropPreset?.key === "pedigree" ? (
                <small>{cropFile.name}</small>
              ) : pedigreeUrl ? <small>Vald</small> : <small>Ingen</small>}
              {pedigreeUrl && (
                <img
                  src={pedigreeUrl}
                  alt="pedigree preview"
                  className="adminImagePreview contain"
                />
              )}
            </div>

            <button type="submit">Lägg till häst</button>
          </form>
        </div>
      )}

      {activeTab === "allhorses" && (
        <div className="adminSection">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Befintliga hästar</h3>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={onGenerateIds}>
                Generera id för saknade
              </button>
            </div>
          </div>

          <div className="adminHorseList">
            {horses.map((h) => {
              const img =
                h?.images?.card ||
                h?.images?.headshot ||
                h?.imageUrl ||
                PLACEHOLDERS.card ||
                PLACEHOLDERS.bodyshot ||
                "";

              return (
                <div key={h.id} className="adminHorseItem">
                  {img && <img src={img} alt={h.name} />}

                  <div className="adminHorseInfo">
                    <strong>{h.name}</strong>

                    <div style={{ opacity: 0.8 }}>
                      {h.breed} • {h.year ? h.year : "-"} • {h.sex}
                    </div>

                    <div style={{ opacity: 0.75, fontSize: 12 }}>
                      ID: <code>{h.id}</code>{" "}
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(h.id)}
                        style={{ marginLeft: 8 }}
                      >
                        Kopiera
                      </button>
                    </div>
                  </div>

                  <span>{h.isStud ? "Stud: JA" : "Stud: NEJ"}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => {
                        setEditHorseId(h.id);
                        setHorseName(h.name || "");
                        setHorseNickname(h.nickname || "");
                        setHorseBreed(h.breed || "");
                        setHorseYear(h.year || "");
                        setHorseSex(h.sex || "");
                        setIsStud(h.isStud || false);
                        setPedigreeE(h.pedigree?.e || "");
                        setPedigreeU(h.pedigree?.u || "");
                        setPedigreeUE(h.pedigree?.ue || "");
                        setPedigreeEId(h.pedigree?.eId || "");
                        setPedigreeUId(h.pedigree?.uId || "");
                        setHorseMkh(h.other?.mkh || "");
                        setHorseCountry(h.other?.country || "");
                        setHorseGenetics(h.genetics ? h.genetics.split("/") : cloneGenetics());
                        setHorseDescription(h.description || "");
                        setHeadshotUrl(h.images?.headshot || "");
                        setCardUrl(h.images?.card || "");
                        setStallionUrl(h.images?.stallion || "");
                        setBodyshotUrl(h.images?.bodyshot || "");
                        setPedigreeUrl(h.images?.pedigree || "");
                        setDisciplines(
                          h.levels
                            ? Object.entries(h.levels).map(([name, merits]) => ({
                                name,
                                merits,
                              }))
                            : []
                        );
                        setSelectedDiscipline("");
                      }}
                      className="adminEditBtn"
                      type="button"
                    >
                      Redigera
                    </button>
                    <button
                      onClick={() => toggleStud(h)}
                      className="adminToggleBtn"
                      type="button"
                    >
                      Toggle stud
                    </button>
                    <button
                      onClick={() => removeHorse(h.id)}
                      className="adminDeleteBtn"
                      type="button"
                      style={{ marginLeft: "auto" }}
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {cropping && (
        <ImageCropModal
          file={cropFile}
          preset={cropPreset}
          busy={cropUploading}
          onCancel={() => {
            if (cropUploading) return;
            setCropping(false);
            setCropFile(null);
            setCropPreset(null);
          }}
          onConfirmBlob={async (blob) => {
            try {
              setCropUploading(true);
              setMsg("");
              console.log("Tar emot beskuren blob i AdminPage", blob);

              const url = await uploadCroppedBlob(
                blob,
                `${cropPreset?.key || "cropped"}.jpg`
              );
              console.log("Uppladdad bild-URL:", url);

              if (cropPreset?.key === "headshot") {
                console.log("Sätter headshotUrl", url);
                setHeadshotUrl(url);
              }
              if (cropPreset?.key === "card") {
                console.log("Sätter cardUrl", url);
                setCardUrl(url);
              }
              if (cropPreset?.key === "stallion") {
                console.log("Sätter stallionUrl", url);
                setStallionUrl(url);
              }
              if (cropPreset?.key === "bodyshot") {
                console.log("Sätter bodyshotUrl", url);
                setBodyshotUrl(url);
              }
              if (cropPreset?.key === "pedigree") {
                console.log("Sätter pedigreeUrl", url);
                setPedigreeUrl(url);
              }

              setMsg("Bild sparad.");

              setCropping(false);
              setCropFile(null);
              setCropPreset(null);
            } catch (e) {
              console.error("Fel vid uppladdning av beskuren bild:", e);
              setMsg("Kunde inte spara beskuren bild.");
            } finally {
              setCropUploading(false);
            }
          }}
        />
      )}
    </div>
  );
}