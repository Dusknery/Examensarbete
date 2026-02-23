import { Link } from "react-router-dom";
import { horses } from "../data/horses";

export default function HorsesListPage() {
  return (
    <div>
      <h1>Hästarna</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 14,
          marginTop: 16,
        }}
      >
        {horses.map((horse) => (
          <Link
            key={horse.id}
            to={`/hastar/${horse.id}`}
            style={{
              textDecoration: "none",
              color: "black",
              border: "1px solid #ddd",
              borderRadius: 14,
              padding: 16,
              background: "white",
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            <div
              style={{
                height: 120,
                background: "#eee",
                borderRadius: 10,
                marginBottom: 10,
              }}
            />

            {horse.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
