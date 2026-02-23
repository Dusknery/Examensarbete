import { Link } from "react-router-dom";
import { horses } from "../data/horses";

export default function StallionsPage() {
const stallions = horses.filter(h => h.isStud);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <h1>Avelshingstarna</h1>

      {stallions.map(horse => (
        <div
          key={horse.id}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            border: "1px solid #ddd",
            borderRadius: 16,
            padding: 16,
            background: "white",
          }}
        >
          <div style={{ background: "#eee", borderRadius: 12, minHeight: 240 }} />

          <div style={{ display: "grid", gap: 10 }}>
            <h2>{horse.name}</h2>
            <div>{horse.breed}</div>
            <div>{horse.ageText}</div>

            <Link to={`/hastar/${horse.id}`}>Mer info</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
