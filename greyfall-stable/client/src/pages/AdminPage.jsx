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

export default function AdminPage() {
  const nav = useNavigate();

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

  function logout() {
    adminLogout();
    nav("/");
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Admin</h1>
        <button onClick={logout}>Logga ut</button>
      </div>

      {msg && <p>{msg}</p>}

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
        <h2>Nyheter</h2>

        <form onSubmit={addNews} style={{ display: "grid", gap: 8, maxWidth: 680 }}>
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

          {/* Extern länk */}
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Extern länk (valfritt) – https://..."
          />

          {/* Bild uppladdning */}
          <div style={{ display: "grid", gap: 6 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !imageFile}
              >
                {uploading ? "Laddar upp..." : "Ladda upp bild"}
              </button>

              {uploadedImageUrl ? (
                <small>✅ Bild uppladdad</small>
              ) : (
                <small>Ingen bild uppladdad</small>
              )}
            </div>

            {uploadedImageUrl ? (
              <img
                src={uploadedImageUrl}
                alt="preview"
                style={{
                  width: "100%",
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid #eee",
                }}
              />
            ) : null}
          </div>

          <button type="submit">Lägg till nyhet</button>
        </form>

        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {news.map((n) => (
            <div key={n.id} style={{ borderTop: "1px solid #eee", paddingTop: 10 }}>
              <strong>{n.title}</strong>

              {n.imageUrl ? (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={n.imageUrl}
                    alt={n.title}
                    style={{
                      width: "100%",
                      maxHeight: 220,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid #eee",
                    }}
                  />
                </div>
              ) : null}

              <div style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{n.body}</div>

              {n.linkUrl ? (
                <div style={{ marginTop: 8 }}>
                  <a href={n.linkUrl} target="_blank" rel="noreferrer">
                    Öppna extern länk
                  </a>
                </div>
              ) : null}

              <small style={{ display: "block", marginTop: 8 }}>
                {new Date(n.date).toLocaleString()}
              </small>

              <div style={{ marginTop: 8 }}>
                <button onClick={() => removeNews(n.id)}>Ta bort</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
        <h2>Hästar</h2>
        <p>Nu: toggle isStud. Sen lägger vi till skapa/ta bort/edit.</p>

        <div style={{ display: "grid", gap: 8 }}>
          {horses.map((h) => (
            <div key={h.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <strong style={{ minWidth: 260 }}>{h.name}</strong>
              <span>{h.isStud ? "Stud: JA" : "Stud: NEJ"}</span>
              <button onClick={() => toggleStud(h)}>Toggle stud</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}