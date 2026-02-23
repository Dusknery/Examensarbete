import { useEffect, useState } from "react";
import { getNews } from "../services/api";
import "../styles/home.css";

export default function HomePage() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const items = await getNews();
        if (!alive) return;
        setNews(Array.isArray(items) ? items : []);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError("Kunde inte hämta nyheter.");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Byt dessa senare till dina riktiga bilder (lägg i /public eller /src/assets/images)
  const heroImage = "/hero.jpg"; // lägg en bild i client/public/hero.jpg
  const logoImage = "/logo.png"; // lägg en bild i client/public/logo.png

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <img
          src={heroImage}
          alt="Greyfall Stable"
          onError={(e) => {
            // fallback om du inte lagt bilden än
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="heroTitle">Greyfall stable</div>
      </section>

      {/* Logga + intro */}
      <section className="introRow">
        <div className="logoBox">
          <img
            src={logoImage}
            alt="Greyfall Stable logga"
            onError={(e) => {
              // fallback om du inte lagt logga än
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div>
          <p style={{ margin: 0 }}>
            Greyfall Stable är ett RRP-stall i Star Stable Online med fokus på hästar,
            avel och information. Här hittar du nyheter, hästprofiler och avelshingstar.
          </p>
        </div>
      </section>

      {/* Nyheter */}
      <section className="newsShell">
        <div className="newsHeader">NYHETSBLAD</div>

        {error ? <p>{error}</p> : null}

        <div className="newsScroller">
          {news.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.7 }}>
              Inga nyheter ännu.
            </p>
          ) : null}

          {news.map((n) => (
            <article key={n.id} className="newsCard">
              <div className="newsTitle">{n.title}</div>

              {n.body ? <div className="newsBody">{n.body}</div> : null}

              {n.linkUrl ? (
                <div className="newsLink">
                  <a href={n.linkUrl} target="_blank" rel="noreferrer">
                    Öppna länk
                  </a>
                </div>
              ) : null}

              {n.imageUrl ? (
                <img className="newsImage" src={n.imageUrl} alt={n.title} />
              ) : null}

              {n.date ? (
                <div className="smallMeta">
                  {new Date(n.date).toLocaleString()}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}