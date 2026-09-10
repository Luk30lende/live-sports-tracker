import { useEffect, useState } from "react";
import StandingsTable from "../components/StandingsTable";
import { getLeagueStandings } from "../api/sportsApi";
import { leagueIds } from "../api/leagueIds";
import { normalizeStanding } from "../api/normalizers";

function Standings() {
  const [selectedLeague, setSelectedLeague] = useState("Premier League");

  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getLeagueStandings(leagueIds.premierLeague)
      .then((data) => {
        const apiStandings = (data.table || []).map(normalizeStanding);

        setStandings(apiStandings);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="standings-page">
      <section className="standings-header">
        <div>
          <p className="eyebrow">STANDINGS</p>

          <h1>League Tables</h1>

          <p>Track team rankings, results and league positions.</p>
        </div>
      </section>

      {loading && <div className="status-message">Loading standings...</div>}

      {error && <div className="status-message error">{error}</div>}

      {!loading && !error && (
        <section className="standings-section">
          <div className="standings-section-header">
            <div>
              <h2>Premier League</h2>
              <p>Current league standings</p>
            </div>

            <span>{standings.length} teams</span>
          </div>

          <StandingsTable teams={standings} />
        </section>
      )}
    </main>
  );
}

export default Standings;
