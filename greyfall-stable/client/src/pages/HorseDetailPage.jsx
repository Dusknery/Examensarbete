import { Link, useParams } from "react-router-dom";
import { horses } from "../data/horses";

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        gap: 10,
        padding: "6px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <strong>{label}</strong>
      <span>{value || "-"}</span>
    </div>
  );
}

export default function HorseDetailPage() {
  const { id } = useParams();

  const horse = horses.find((h) => h.id === id);

  if (!horse) {
    return <p>Häst hittades inte</p>;
  }

  // Avkommor: alla hästar där denna häst är far eller mor
  const offspring = horses.filter(
    (h) => h.sireId === horse.id || h.damId === horse.id
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Link to="/hastar" style={{ textDecoration: "none" }}>
        ← Tillbaka till hästar
      </Link>

      <h1 style={{ margin: 0 }}>{horse.name}</h1>
      <div style={{ opacity: 0.8 }}>
        {horse.breed} • {horse.ageText} • {horse.sex}
      </div>

      {/* Bild placeholder */}
      <div
        style={{
          height: 300,
          background: "#eee",
          borderRadius: 16,
        }}
      />

      {/* Fakta */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 14,
          padding: 12,
          background: "white",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Fakta</h2>

        <Row label="Fader (E)" value={horse.pedigree?.e} />
        <Row label="Moder (U)" value={horse.pedigree?.u} />
        <Row label="Morfar (UE)" value={horse.pedigree?.ue} />
        <Row label="Farfar (EE)" value={horse.pedigree?.ee} />

        <Row label="Inriktning" value={(horse.focus || []).join(", ")} />
        <Row label="Dressyr" value={horse.levels?.dressyr} />
        <Row label="Hopp" value={horse.levels?.hopp} />
        <Row label="Terräng" value={horse.levels?.terrang} />

        <Row label="Mkh" value={horse.other?.mkh} />
        <Row label="Land" value={horse.other?.country} />
      </div>

      {/* Genetik */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 14,
          padding: 12,
          background: "white",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Genetik</h2>
        <div>{horse.genetics || "-"}</div>
      </div>

      {/* Beskrivning */}
      {horse.description && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 14,
            padding: 12,
            background: "white",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Beskrivning</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{horse.description}</p>
        </div>
      )}

      {/* Avkommor */}
      {(offspring.length > 0 || horse.extraOffspringNote) && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 14,
            padding: 12,
            background: "white",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Avkommor</h2>

          {offspring.length > 0 ? (
            <div style={{ display: "grid", gap: 8 }}>
              {offspring.map((child) => (
                <div key={child.id}>
                  <strong>{child.name}</strong> – {child.breed}, {child.ageText},{" "}
                  {child.sex}{" "}
                  <Link to={`/hastar/${child.id}`}>Mer info</Link>
                </div>
              ))}
            </div>
          ) : (
            <p>Inga avkommor inlagda.</p>
          )}

          {horse.extraOffspringNote && <p>{horse.extraOffspringNote}</p>}
        </div>
      )}
    </div>
  );
}
