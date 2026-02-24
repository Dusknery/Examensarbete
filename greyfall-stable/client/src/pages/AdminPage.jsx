import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminLogout,
  createNews,
  deleteNews,
  getHorses,
  getNews,
  isAdminLoggedIn,
  updateHorse,
  uploadImage,
} from "../services/api";
import "../styles/admin.css";

export default function AdminPage() {
  const nav = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("news");

  const [news, setNews] = useState([]);
  const [horses, setHorses] = useState([]);

  // news form
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // upload state
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // horse form state
  const [horseName, setHorseName] = useState("");
  const [horseNickname, setHorseNickname] = useState("");
  const [horseBreed, setHorseBreed] = useState("");
  const [horseYear, setHorseYear] = useState("");
  const [horseAge, setHorseAge] = useState("");
  const [horseSex, setHorseSex] = useState("");
  const [horseColor, setHorseColor] = useState("");
  const [isStud, setIsStud] = useState(false);
  
  // Pedigree
  const [pedigreeE, setPedigreeE] = useState("");
  const [pedigreeU, setPedigreeU] = useState("");
  const [pedigreeUE, setPedigreeUE] = useState("");
  
  // Disciplines and levels
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [disciplineLevel, setDisciplineLevel] = useState("");
  
  const availableDisciplines = [
    "Dressyr",
    "Hopp",
    "Fälttävlan/Terräng",
    "Körning",
    "Avel",
    "Distansritt",
    "Working Equitation",
    "Westernridning",
    "Mounted Games",
    "Voltige"
  ];
  
  // Legacy fields for compatibility
  const [horseFocus, setHorseFocus] = useState("");
  const [levelDressyr, setLevelDressyr] = useState("");
  const [levelHopp, setLevelHopp] = useState("");
  const [levelTerrang, setLevelTerrang] = useState("");
  
  // Other info
  const [horseMkh, setHorseMkh] = useState("");
  const [horseCountry, setHorseCountry] = useState("");
  const [horseGenetics, setHorseGenetics] = useState("");
  const [horseDescription, setHorseDescription] = useState("");
  
  // Horse image uploads - tre bilder
  const [headshotFile, setHeadshotFile] = useState(null);
  const [headshotUrl, setHeadshotUrl] = useState("");
  const [uploadingHeadshot, setUploadingHeadshot] = useState(false);
  
  const [bodyshotFile, setBodyshotFile] = useState(null);
  const [bodyshotUrl, setBodyshotUrl] = useState("");
  const [uploadingBodyshot, setUploadingBodyshot] = useState(false);
  
  const [pedigreeFile, setPedigreeFile] = useState(null);
  const [pedigreeUrl, setPedigreeUrl] = useState("");
  const [uploadingPedigree, setUploadingPedigree] = useState(false);

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

  async function handleUpload() {
    setMsg("");
    if (!imageFile) {
      setMsg("Välj en bildfil först.");
      return;
    }

    try {
      setUploading(true);
      const data = await uploadImage(imageFile); // { imageUrl }
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

    // enkel url-check för link (valfritt men skönt)
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
        imageUrl: uploadedImageUrl, // från upload
        linkUrl: linkUrl.trim(), // extern länk
      });

      setTitle("");
      setBody("");
      setLinkUrl("");
      setImageFile(null);
      setUploadedImageUrl("");

      await load();
      setMsg("Nyhet skapad.");
    } catch (e) {
      console.error(e);
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

  async function handleHeadshotUpload() {
    setMsg("");
    if (!headshotFile) {
      setMsg("Välj en bildfil först.");
      return;
    }
    try {
      setUploadingHeadshot(true);
      const data = await uploadImage(headshotFile);
      setHeadshotUrl(data.imageUrl || "");
      setMsg("Huvudbild uppladdad.");
    } catch (e) {
      console.error(e);
      setMsg("Kunde inte ladda upp huvudbild.");
    } finally {
      setUploadingHeadshot(false);
    }
  }

  async function handleBodyshotUpload() {
    setMsg("");
    if (!bodyshotFile) {
      setMsg("Välj en bildfil först.");
      return;
    }
    try {
      setUploadingBodyshot(true);
      const data = await uploadImage(bodyshotFile);
      setBodyshotUrl(data.imageUrl || "");
      setMsg("Helkroppsbild uppladdad.");
    } catch (e) {
      console.error(e);
      setMsg("Kunde inte ladda upp helkroppsbild.");
    } finally {
      setUploadingBodyshot(false);
    }
  }

  async function handlePedigreeUpload() {
    setMsg("");
    if (!pedigreeFile) {
      setMsg("Välj en bildfil först.");
      return;
    }
    try {
      setUploadingPedigree(true);
      const data = await uploadImage(pedigreeFile);
      setPedigreeUrl(data.imageUrl || "");
      setMsg("Stamtavlebild uppladdad.");
    } catch (e) {
      console.error(e);
      setMsg("Kunde inte ladda upp stamtavlebild.");
    } finally {
      setUploadingPedigree(false);
    }
  }

  async function addHorse(e) {
    e.preventDefault();
    setMsg("");

    if (!horseName.trim()) {
      setMsg("Hästnamn måste fyllas i.");
      return;
    }

    try {
      const newHorse = {
        id: crypto.randomUUID(),
        name: horseName.trim(),
        nickname: horseNickname.trim() || undefined,
        breed: horseBreed.trim() || "Okänd ras",
        year: horseYear.trim() || undefined,
        ageText: horseAge.trim() || "Okänd ålder",
        sex: horseSex.trim() || "Okänd",
        color: horseColor.trim() || "Okänd färg",
        isStud: isStud,
        pedigree: {
          e: pedigreeE.trim() || undefined,
          u: pedigreeU.trim() || undefined,
          ue: pedigreeUE.trim() || undefined,
        },
        focus: horseFocus.trim() ? horseFocus.split(",").map(f => f.trim()).filter(Boolean) : undefined,
        levels: {
          dressyr: levelDressyr.trim() || undefined,
          hopp: levelHopp.trim() || undefined,
          terrang: levelTerrang.trim() || undefined,
        },
        other: {
          mkh: horseMkh.trim() || undefined,
          country: horseCountry.trim() || undefined,
        },
        genetics: horseGenetics.trim() || undefined,
        description: horseDescription.trim() || undefined,
        imageUrl: headshotUrl || "",
        images: {
          headshot: headshotUrl || "",
          bodyshot: bodyshotUrl || "",
          pedigree: pedigreeUrl || "",
        },
      };

      await fetch("http://localhost:4000/api/horses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(newHorse),
      });

      // Reset form
      setHorseName("");
      setHorseNickname("");
      setHorseBreed("");
      setHorseYear("");
      setHorseAge("");
      setHorseSex("");
      setHorseColor("");
      setIsStud(false);
      setPedigreeE("");
      setPedigreeU("");
      setPedigreeUE("");
      setHorseFocus("");
      setLevelDressyr("");
      setLevelHopp("");
      setLevelTerrang("");
      setHorseMkh("");
      setHorseCountry("");
      setHorseGenetics("");
      setHorseDescription("");
      setHeadshotFile(null);
      setHeadshotUrl("");
      setBodyshotFile(null);
      setBodyshotUrl("");
      setPedigreeFile(null);
      setPedigreeUrl("");

      await load();
      setMsg("Häst skapad.");
    } catch (e) {
      console.error(e);
      setMsg("Kunde inte skapa häst.");
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
                  <small>✅ Bild uppladdad</small>
                ) : (
                  <small>Ingen bild uppladdad</small>
                )}
              </div>

              {uploadedImageUrl && (
                <img
                  src={uploadedImageUrl}
                  alt="preview"
                  className="adminImagePreview"
                />
              )}
            </div>

            <button type="submit">Lägg till nyhet</button>
          </form>

          <div>
            <h3 style={{ marginBottom: "16px" }}>Befintliga nyheter</h3>
            <div className="adminList">
              {news.map((n) => (
                <div key={n.id} className="adminListItem">
                  <strong>{n.title}</strong>

                  {n.imageUrl && (
                    <img src={n.imageUrl} alt={n.title} />
                  )}

                  <div className="content">{n.body}</div>

                  {n.linkUrl && (
                    <div>
                      <a href={n.linkUrl} target="_blank" rel="noreferrer">
                        Öppna extern länk
                      </a>
                    </div>
                  )}

                  <small>{new Date(n.date).toLocaleString()}</small>

                  <button onClick={() => removeNews(n.id)} className="adminDeleteBtn">
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
          <form onSubmit={addHorse} className="adminForm">
            <h2 style={{ margin: 0, fontSize: "24px" }}>Lägg till häst</h2>
            
            <input
              value={horseName}
              onChange={(e) => setHorseName(e.target.value)}
              placeholder="Hästens namn *"
              required
            />

            <input
              value={horseBreed}
              onChange={(e) => setHorseBreed(e.target.value)}
              placeholder="Ras (t.ex. Andalusier)"
            />

            <input
              value={horseAge}
              onChange={(e) => setHorseAge(e.target.value)}
              placeholder="Ålder (t.ex. 5 år)"
            />

            <input
              value={horseSex}
              onChange={(e) => setHorseSex(e.target.value)}
              placeholder="Kön (Hingst/Sto/Valack)"
            />

            <input
              value={horseColor}
              onChange={(e) => setHorseColor(e.target.value)}
              placeholder="Färg"
            />

            <label className="adminCheckbox">
              <input
                type="checkbox"
                checked={isStud}
                onChange={(e) => setIsStud(e.target.checked)}
              />
              <span>Avelshingst</span>
            </label>

            <input
              value={horseNickname}
              onChange={(e) => setHorseNickname(e.target.value)}
              placeholder="Smeknamn (valfritt)"
            />

            <input
              value={horseYear}
              onChange={(e) => setHorseYear(e.target.value)}
              placeholder="Födelseår (t.ex. 2019)"
            />

            <h3 style={{ margin: "20px 0 10px 0", fontSize: "18px" }}>Stamtavla</h3>
            
            <input
              value={pedigreeE}
              onChange={(e) => setPedigreeE(e.target.value)}
              placeholder="E (Far)"
            />

            <input
              value={pedigreeU}
              onChange={(e) => setPedigreeU(e.target.value)}
              placeholder="U (Mor)"
            />

            <input
              value={pedigreeUE}
              onChange={(e) => setPedigreeUE(e.target.value)}
              placeholder="UE (Morfar)"
            />

            <h3 style={{ margin: "20px 0 10px 0", fontSize: "18px" }}>Inriktning och nivåer</h3>

            <input
              value={horseFocus}
              onChange={(e) => setHorseFocus(e.target.value)}
              placeholder="Inriktning (kommaseparerat, t.ex. Dressyr, Avel)"
            />

            <input
              value={levelDressyr}
              onChange={(e) => setLevelDressyr(e.target.value)}
              placeholder="Dressyrnivå"
            />

            <input
              value={levelHopp}
              onChange={(e) => setLevelHopp(e.target.value)}
              placeholder="Hoppnivå"
            />

            <input
              value={levelTerrang}
              onChange={(e) => setLevelTerrang(e.target.value)}
              placeholder="Terrängnivå"
            />

            <h3 style={{ margin: "20px 0 10px 0", fontSize: "18px" }}>Övrig information</h3>

            <input
              value={horseMkh}
              onChange={(e) => setHorseMkh(e.target.value)}
              placeholder="Mankhöjd (cm)"
            />

            <input
              value={horseCountry}
              onChange={(e) => setHorseCountry(e.target.value)}
              placeholder="Ursprungsland"
            />

            <input
              value={horseGenetics}
              onChange={(e) => setHorseGenetics(e.target.value)}
              placeholder="Genetik"
            />

            <textarea
              value={horseDescription}
              onChange={(e) => setHorseDescription(e.target.value)}
              placeholder="Beskrivning av hästen"
              rows={4}
              style={{ fontFamily: "inherit", fontSize: "inherit", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
            />

            <div className="adminImageUpload">
              <strong>Huvudbild (headshot)</strong>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setHeadshotFile(e.target.files?.[0] || null)}
              />
              <div className="adminUploadStatus">
                <button
                  type="button"
                  onClick={handleHeadshotUpload}
                  disabled={uploadingHeadshot || !headshotFile}
                  className="adminUploadBtn"
                >
                  {uploadingHeadshot ? "Laddar upp..." : "Ladda upp huvudbild"}
                </button>
                {headshotUrl ? (
                  <small>✅ Huvudbild uppladdad</small>
                ) : (
                  <small>Ingen huvudbild</small>
                )}
              </div>
              {headshotUrl && (
                <img
                  src={headshotUrl}
                  alt="preview"
                  className="adminImagePreview"
                />
              )}
            </div>

            <div className="adminImageUpload">
              <strong>Helkroppsbild (bodyshot)</strong>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBodyshotFile(e.target.files?.[0] || null)}
              />
              <div className="adminUploadStatus">
                <button
                  type="button"
                  onClick={handleBodyshotUpload}
                  disabled={uploadingBodyshot || !bodyshotFile}
                  className="adminUploadBtn"
                >
                  {uploadingBodyshot ? "Laddar upp..." : "Ladda upp helkroppsbild"}
                </button>
                {bodyshotUrl ? (
                  <small>✅ Helkroppsbild uppladdad</small>
                ) : (
                  <small>Ingen helkroppsbild</small>
                )}
              </div>
              {bodyshotUrl && (
                <img
                  src={bodyshotUrl}
                  alt="preview"
                  className="adminImagePreview"
                />
              )}
            </div>

            <div className="adminImageUpload">
              <strong>Stamtavla (pedigree)</strong>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPedigreeFile(e.target.files?.[0] || null)}
              />
              <div className="adminUploadStatus">
                <button
                  type="button"
                  onClick={handlePedigreeUpload}
                  disabled={uploadingPedigree || !pedigreeFile}
                  className="adminUploadBtn"
                >
                  {uploadingPedigree ? "Laddar upp..." : "Ladda upp stamtavla"}
                </button>
                {pedigreeUrl ? (
                  <small>✅ Stamtavla uppladdad</small>
                ) : (
                  <small>Ingen stamtavla</small>
                )}
              </div>
              {pedigreeUrl && (
                <img
                  src={pedigreeUrl}
                  alt="preview"
                  className="adminImagePreview contain"
                />
              )}
            </div>

            <button type="submit">Lägg till häst</button>
          </form>

          <div>
            <h3 style={{ marginBottom: "16px" }}>Befintliga hästar</h3>
            <div className="adminHorseList">
              {horses.map((h) => (
                <div key={h.id} className="adminHorseItem">
                  {h.imageUrl && (
                    <img src={h.imageUrl} alt={h.name} />
                  )}
                  <div className="adminHorseInfo">
                    <strong>{h.name}</strong>
                    <div>
                      {h.breed} • {h.ageText} • {h.sex}
                    </div>
                  </div>
                  <span>{h.isStud ? "Stud: JA" : "Stud: NEJ"}</span>
                  <button onClick={() => toggleStud(h)} className="adminToggleBtn">
                    Toggle stud
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}