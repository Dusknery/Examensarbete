import { Link } from "react-router-dom";
import { horses } from "../data/horses";
import "../styles/stallions.css";

export default function StallionsPage() {
  const stallions = horses.filter(h => h.isStud);

  return (
    <div className="stallionsPage">
      {/* Hero Section */}
      <div className="stallionsHero">
        <h1>Avelshingstarna</h1>
      </div>

      {/* Intro Section */}
      <div className="stallionsIntro">
        <img 
          src="/images/logo.png" 
          alt="Greyfall Stable" 
          className="stallionsIntroImage"
        />
        <div className="stallionsIntroText">
          <p>
            Varmt välkommen till vår samling av avelshingstar på Greyfall Stable! Här hittar du information om våra hingstar som är tillgängliga för avel. Varje hingst har sin egen unika historia, meriter och egenskaper som gör dem perfekta för olika typer av avel.
          </p>
          <p>
            Vi är stolta över att kunna erbjuda högkvalitativa hingstar med bevisade meriter inom sina respektive discipliner. Alla våra hingstar är noggrant utvalda för sina goda egenskaper, både mentalt och fysiskt.
          </p>
        </div>
      </div>

      {/* Stallion Cards */}
      {stallions.map(horse => (
        <div key={horse.id} className="stallionCard">
          <div className="stallionMain">
            {/* Left: Image and Pedigree */}
            <div className="stallionLeft">
              {horse.imageUrl ? (
                <img
                  src={horse.imageUrl}
                  alt={horse.name}
                  className="stallionImage"
                />
              ) : (
                <div className="stallionImage" style={{ background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  Ingen bild tillgänglig
                </div>
              )}

              {/* Pedigree Section */}
              <div className="pedigreeSection">
                {horse.images?.pedigree ? (
                  <img 
                    src={horse.images.pedigree} 
                    alt={`Stamtavla för ${horse.name}`}
                    className="pedigreeImage"
                  />
                ) : (
                  <div className="pedigreePlaceholder">
                    Ingen stamtavla finns än
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="stallionInfo">
              <h2 className="stallionName">{horse.name}</h2>
              
              <div className="stallionBasicInfo">
                <div>{horse.breed}</div>
                <div> {horse.year}</div>
                <div>{horse.sex}</div>
              </div>

              <div className="stallionPedigreeInfo">
                {horse.pedigree?.e && <div>E - {horse.pedigree.e}</div>}
                {horse.pedigree?.u && <div>U - {horse.pedigree.u}</div>}
                {horse.pedigree?.ue && <div>UE - {horse.pedigree.ue}</div>}
              </div>

              <div className="stallionDetailsInfo">
                {horse.focus && horse.focus.length > 0 && (
                  <div>Inriktning: {horse.focus.join(", ")}</div>
                )}
                {horse.levels?.dressyr && <div>Dressyrnivå: {horse.levels.dressyr}</div>}
                {horse.levels?.hopp && <div>Hoppnivå: {horse.levels.hopp}</div>}
                {horse.levels?.terrang && <div>Terrängnivå: {horse.levels.terrang}</div>}
                {horse.other?.mkh && <div>Mkh: {horse.other.mkh} cm</div>}
                {horse.other?.country && <div>Ursprungsland: {horse.other.country}</div>}
              </div>

              {horse.genetics && (
                <div className="stallionGenetics">
                  <div>Genetik: {horse.genetics}</div>
                </div>
              )}

              <Link to={`/hastar/${horse.id}`} className="stallionButton">
                Mer Info!
              </Link>

              {/* Offspring Section */}
              {horse.offspring && horse.offspring.length > 0 && (
                <div className="offspringSection">
                  <div className="offspringTitle">Avkommor</div>
                  <div className="offspringImages">
                    {horse.offspring.map((offspring, idx) => (
                      <img
                        key={idx}
                        src={offspring.imageUrl || "/images/placeholder.png"}
                        alt={offspring.name || `Avkomma ${idx + 1}`}
                        className="offspringImage"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
