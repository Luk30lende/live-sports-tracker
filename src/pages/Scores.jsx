import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { getLeagueNextEvents, getLeaguePreviousEvents } from "../api/sportsApi";
import { leagueIds } from "../api/leagueIds";
import { normalizeGame } from "../api/normalizers";

function Scores() {
  const [filter, setFilter] = useState("ALL");

  const [games, setGames] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      getLeagueNextEvents(leagueIds.premierLeague),
      getLeaguePreviousEvents(leagueIds.premierLeague),
    ])
      .then(([nextData, previousData]) => {
        const nextGames = (nextData.events || []).map(normalizeGame);

        const previousGames = (previousData.events || []).map(normalizeGame);

        setGames([...previousGames, ...nextGames]);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredGames =
    filter === "ALL" ? games : games.filter((game) => game.status === filter);

  const getTitle = () => {
    if (filter === "LIVE") {
      return "Live Games";
    }

    if (filter === "UPCOMING") {
      return "Upcoming Games";
    }

    if (filter === "FINISHED") {
      return "Finished Games";
    }

    return "All Games";
  };

  return (
    <main className="scores-page">
      <section className="scores-header">
        <div>
          <p className="eyebrow">SCORES</p>

          <h1>Games</h1>

          <p>Follow live action, upcoming fixtures and completed games.</p>
        </div>
      </section>

      <div className="score-filters">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>

        <button
          className={filter === "LIVE" ? "active" : ""}
          onClick={() => setFilter("LIVE")}
        >
          Live
        </button>

        <button
          className={filter === "UPCOMING" ? "active" : ""}
          onClick={() => setFilter("UPCOMING")}
        >
          Upcoming
        </button>

        <button
          className={filter === "FINISHED" ? "active" : ""}
          onClick={() => setFilter("FINISHED")}
        >
          Finished
        </button>
      </div>

      <section className="scores-list">
        <div className="scores-list-header">
          <h2>{getTitle()}</h2>

          {!loading && !error && <span>{filteredGames.length} games</span>}
        </div>

        {loading && <div className="status-message">Loading games...</div>}

        {error && <div className="status-message error">{error}</div>}

        {!loading && !error && filteredGames.length === 0 && (
          <div className="status-message">No games found.</div>
        )}

        {!loading && !error && filteredGames.length > 0 && (
          <div className="games-grid">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Scores;
