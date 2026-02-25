import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHorses } from "../services/api";
import "../styles/HorsesList.css";

export default function HorsesListPage() {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await getHorses();
        if (alive) setHorses(data);
      } catch (e) {
        if (alive) setError(e.message || "Kunde inte hämta hästar");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="horsesListPage">
      <div className="horsesHeader">
        <div className="horsesLogo">
          <img src="/images/logo.png" alt="Greyfall Stable" />
        </div>
        <h1 className="horsesTitle">Hästarna</h1>
      </div>

      {loading ? (
        <div style={{ padding: 20 }}>Laddar...</div>
      ) : error ? (
        <div style={{ padding: 20, color: "crimson" }}>{error}</div>
      ) : (
        <div className="horsesGrid">
          {horses.map((horse) => (
            <Link
              key={horse.id}
              to={`/hastar/${horse.id}`}
              className="horseCard"
            >
              {horse.imageUrl ? (
                <>
                  <img src={horse.imageUrl} alt={horse.name} />
                  <div className="horseName">{horse.name}</div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      height: 350,
                      background: "#333",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                    }}
                  >
                    Ingen bild
                  </div>
                  <div className="horseName">{horse.name}</div>
                </>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="horsesFooterImage">
        <img src="/images/avelshastar.png" alt="Horses" />
      </div>
    </div>
  );
}