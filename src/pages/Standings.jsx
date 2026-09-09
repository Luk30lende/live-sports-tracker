import { useState } from "react";
import StandingsTable from "../components/StandingsTable";
import { standings } from "../data/mockData";

function Standings() {
  const [selectedLeague, setSelectedLeague] = useState("Premier League");

  const currentStandings = standings[selectedLeague];

  return (
    <main className="standings-page">
      <section className="standings-header">
        <div>
          <p className="eyebrow">STANDINGS</p>

          <h1>League Tables</h1>

          <p>Track team rankings, results and league positions.</p>
        </div>
      </section>

      <div className="league-selector">
        {Object.keys(standings).map((league) => (
          <button
            key={league}
            className={selectedLeague === league ? "active" : ""}
            onClick={() => setSelectedLeague(league)}
          >
            {league}
          </button>
        ))}
      </div>

      <section className="standings-section">
        <div className="standings-section-header">
          <div>
            <h2>{selectedLeague}</h2>

            <p>Current league standings</p>
          </div>

          <span>{currentStandings.length} teams</span>
        </div>

        <StandingsTable teams={currentStandings} />
      </section>
    </main>
  );
}

export default Standings;
