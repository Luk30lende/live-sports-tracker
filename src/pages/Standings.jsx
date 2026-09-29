import { useEffect, useState } from "react";

import StandingsTable from "../components/StandingsTable";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

import { getLeagueStandings } from "../api/sportsApi";
import { leagueIds, leagues } from "../api/leagueIds";
import { normalizeStanding } from "../api/normalizers";

function Standings() {
  const [selectedLeague, setSelectedLeague] = useState(leagueIds.premierLeague);

  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStandings = () => {
    setLoading(true);
    setError("");

    getLeagueStandings(selectedLeague)
      .then((data) => {
        const apiStandings = (data.table || []).map(normalizeStanding);

        setStandings(apiStandings);
      })
      .catch((error) => {
        setError(error.message);
        setStandings([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStandings();
  }, [selectedLeague]);

  const currentLeague = leagues.find((league) => league.id === selectedLeague);

  return (
    <main className="standings-page">
      <section className="standings-header">
        <div>
          <p className="eyebrow">STANDINGS</p>

          <h1>League Tables</h1>

          <p>Track team rankings, results and league positions.</p>
        </div>
      </section>

      <section className="standings-section">
        <div className="standings-section-header">
          <div>
            <h2>{currentLeague?.name || "League Standings"}</h2>
            <p>Current league standings</p>
          </div>

          <label>
            Competition{" "}
            <select
              value={selectedLeague}
              onChange={(event) =>
                setSelectedLeague(Number(event.target.value))
              }
            >
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </label>

          {!loading && !error && (
            <span>
              {standings.length} {standings.length === 1 ? "team" : "teams"}
            </span>
          )}
        </div>

        {loading && <LoadingMessage message="Loading standings..." />}

        {error && <ErrorMessage message={error} onRetry={loadStandings} />}

        {!loading && !error && standings.length > 0 && (
          <StandingsTable teams={standings} />
        )}

        {!loading && !error && standings.length === 0 && (
          <div className="status-message">
            <h3>No standings available</h3>
            <p>
              Standings are currently unavailable for {currentLeague?.name}.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Standings;
