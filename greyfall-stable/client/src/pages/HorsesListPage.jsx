import { Link } from "react-router-dom";
import { horses } from "../data/horses";
import "../styles/HorsesList.css";

export default function HorsesListPage() {
  return (
    <div className="horsesListPage">
      <div className="horsesHeader">
        <div className="horsesLogo">
          <img src="/images/logo.png" alt="Greyfall Stable" />
        </div>
        <h1 className="horsesTitle">Hästarna</h1>
      </div>

      <div className="horsesGrid">
        {horses.map((horse) => (
          <Link
            key={horse.id}
            to={`/hastar/${horse.id}`}
            className="horseCard"
          >
            {horse.imageUrl ? (
              <>
                <img
                  src={horse.imageUrl}
                  alt={horse.name}
                />
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

      <div className="horsesFooterImage">
        <img src="/images/avelshastar.png" alt="Horses" />
      </div>
    </div>
  );
}
