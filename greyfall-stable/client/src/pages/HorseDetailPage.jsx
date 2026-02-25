import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getHorseById, getHorses } from "../services/api";
import "../styles/HorseDetail.css";

export default function HorseDetailPage() {
  const { id } = useParams();

  const [horse, setHorse] = useState(null);
  const [allHorses, setAllHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const h = await getHorseById(id);
        if (!alive) return;
        setHorse(h);

        const list = await getHorses();
        if (!alive) return;
        setAllHorses(list);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Kunde inte hämta hästen");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const offspring = useMemo(() => {
    if (!horse?.id || !allHorses?.length) return [];

    // Stöd för båda varianter:
    // 1) sireId/damId (om du lägger till dem i schema)
    // 2) pedigree.eId/pedigree.uId (rekommenderat)
    return allHorses.filter((h) => {
      const byLegacy = h?.sireId === horse.id || h?.damId === horse.id;
      const byPedigreeIds =
        h?.pedigree?.eId === horse.id || h?.pedigree?.uId === horse.id;
      return byLegacy || byPedigreeIds;
    });
  }, [horse, allHorses]);

  if (loading) return <div style={{ padding: 20 }}>Laddar...</div>;
  if (error)
    return (
      <div style={{ padding: 20, color: "crimson" }}>
        {error}
      </div>
    );

  if (!horse) {
    return <p>Häst hittades inte</p>;
  }

  const mainImageUrl = horse.imageUrl;
  const bodyshotUrl = horse.images?.bodyshot;
  const pedigreeUrl = horse.images?.pedigree;

  return (
    <div className="horseDetailPage">
      <Link to="/hastar" className="backLink">
        ← Tillbaka till hästar
      </Link>

      <div className="horseDetailHeader">
        <div className="horseDetailLogo">
          <img src="/images/logo.png" alt="Greyfall Stable" />
        </div>
        <h1 className="horseDetailTitle">{horse.name}</h1>
      </div>

      <div className="horseMainSection">
        <div className="horseHeadshotWrapper">
          {mainImageUrl ? (
            <img
              src={mainImageUrl}
              alt={horse.name}
              className="horseHeadshot"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 280,
                background: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              Ingen bild
            </div>
          )}
        </div>

        <div className="horseInfo">
          <div className="horseBasicInfo">
            {horse.nickname && <div>{horse.nickname}</div>}
            {horse.breed && <div>{horse.breed}</div>}
            {horse.year && <div>Född {horse.year}</div>}
            {horse.sex && <div>{horse.sex}</div>}
          </div>

          <div className="horsePedigreeInfo">
            {horse.pedigree?.e && <div>E - {horse.pedigree.e}</div>}
            {horse.pedigree?.u && <div>U - {horse.pedigree.u}</div>}
            {horse.pedigree?.ue && <div>UE - {horse.pedigree.ue}</div>}
          </div>

          <div className="horseDetailsInfo">
            {horse.focus && horse.focus.length > 0 && (
              <div>Inriktning: {horse.focus.join(", ")}</div>
            )}
            {horse.levels?.dressyr && (
              <div>Dressyrnivå: {horse.levels.dressyr}</div>
            )}
            {horse.levels?.hopp && <div>Hoppnivå: {horse.levels.hopp}</div>}
            {horse.levels?.terrang && (
              <div>Terrängnivå: {horse.levels.terrang}</div>
            )}
            {horse.other?.mkh && <div>Mkh: {horse.other.mkh} cm</div>}
            {horse.other?.country && (
              <div>Ursprungsland: {horse.other.country}</div>
            )}
          </div>

          {horse.genetics && (
            <div className="horseGeneticsInfo">
              <div>Genetik: {horse.genetics}</div>
            </div>
          )}
        </div>
      </div>

      {horse.description && (
        <div className="horseDescription">
          <p>{horse.description}</p>
        </div>
      )}

      {bodyshotUrl ? (
        <div className="horseBodyshot">
          <img src={bodyshotUrl} alt={`${horse.name} helkropp`} />
        </div>
      ) : (
        <div className="horseBodyshot">
          <div
            style={{
              width: "100%",
              minHeight: 350,
              padding: 40,
              textAlign: "center",
              background: "#eee",
              borderRadius: 12,
              color: "#666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Ingen Helkroppsbild uppladdad
          </div>
        </div>
      )}

      {pedigreeUrl ? (
        <div className="horsePedigreeImage">
          <img src={pedigreeUrl} alt={`${horse.name} stamtavla`} />
        </div>
      ) : (
        <div className="horsePedigreeImage">
          <div
            style={{
              width: "100%",
              minHeight: 350,
              padding: 40,
              textAlign: "center",
              background: "#eee",
              borderRadius: 12,
              color: "#666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Ingen stamtavlebild uppladdad
          </div>
        </div>
      )}

      {(offspring.length > 0 || horse.offspring?.length > 0) && (
        <div className="horseOffspring">
          <h2>Avkommor</h2>

          <div className="offspringGrid">
            {offspring.map((child) => (
              <div key={child.id} className="offspringCard">
                {child.imageUrl ? (
                  <img src={child.imageUrl} alt={child.name} />
                ) : (
                  <div
                    style={{
                      width: 220,
                      height: 220,
                      background: "#eee",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8em",
                      color: "#999",
                    }}
                  >
                    Ingen bild
                  </div>
                )}

                <div className="offspringInfo">
                  <h3>{child.name}</h3>
                  {child.breed && <p>{child.breed}</p>}
                  {child.year && <p>{child.year}</p>}
                  {child.sex && <p>{child.sex}</p>}

                  {child.pedigree?.e && <p>E - {child.pedigree.e}</p>}
                  {child.pedigree?.u && <p>U - {child.pedigree.u}</p>}
                  {child.pedigree?.ue && <p>UE - {child.pedigree.ue}</p>}
                </div>

                <Link to={`/hastar/${child.id}`} className="offspringLink">
                  Mer info
                </Link>
              </div>
            ))}

            {horse.offspring?.map((child, idx) => (
              <div key={idx} className="offspringCard">
                {child.imageUrl ? (
                  <img src={child.imageUrl} alt={child.name || "Avkomma"} />
                ) : (
                  <div
                    style={{
                      width: 220,
                      height: 220,
                      background: "#eee",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8em",
                      color: "#999",
                    }}
                  >
                    Ingen bild
                  </div>
                )}

                <div className="offspringInfo">
                  <h3>{child.name || "Avkomma"}</h3>
                  <p>{child.info || ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}