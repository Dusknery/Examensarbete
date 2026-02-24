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

  return (
    <div className="home">
      {/* Hero Header */}
      <section className="hero">
        <img
          src="/images/header.png"
          alt="Greyfall Stable"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <h1 className="heroTitle">Greyfall stable</h1>
      </section>

      {/* Intro sektion */}
      <section className="introSection">
        <div className="introBox">
          <div className="introImage">
            <img src="/images/logo.png" alt="Greyfall Stable" />
          </div>
          <div className="introText">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
              velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
              est laborum.
            </p>
          </div>
        </div>
      </section>

      {/* Nyheter */}
      <section className="newsSection">
        <h2 className="newsHeader">NYHETSBLAD</h2>

        {error ? <p className="error-message">{error}</p> : null}

        <div className="newsGrid">
          {news.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.7, gridColumn: "1 / -1" }}>
              Inga nyheter ännu.
            </p>
          ) : null}

          {news.map((n) => (
            <article key={n.id} className="newsCard">
              <div className="newsCardInner">
                <h3 className="newsTitle">{n.title}</h3>

                {n.body ? <p className="newsBody">{n.body}</p> : null}

                {n.imageUrl ? (
                  <img className="newsImage" src={n.imageUrl} alt={n.title} />
                ) : null}

                {n.linkUrl ? (
                  <div className="newsLink">
                    <a href={n.linkUrl} target="_blank" rel="noreferrer">
                      Läs mer →
                    </a>
                  </div>
                ) : null}

                {n.date ? (
                  <div className="newsDate">
                    {new Date(n.date).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}