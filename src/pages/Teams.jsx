import { useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import { getLeagueTeams } from "../api/sportsApi";
import { normalizeTeam } from "../api/normalizers";

function Teams() {
  const [sportFilter, setSportFilter] = useState("ALL");
  const [favouriteTeams, setFavouriteTeams] = useState([]);

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getLeagueTeams("English Premier League")
      .then((data) => {
        const apiTeams = (data.teams || []).map(normalizeTeam);

        setTeams(apiTeams);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredTeams =
    sportFilter === "ALL"
      ? teams
      : teams.filter((team) => team.sport === sportFilter);

  const toggleFavourite = (teamId) => {
    setFavouriteTeams((currentFavourites) => {
      if (currentFavourites.includes(teamId)) {
        return currentFavourites.filter((id) => id !== teamId);
      }

      return [...currentFavourites, teamId];
    });
  };

  return (
    <main className="teams-page">
      <section className="teams-header">
        <div>
          <p className="eyebrow">TEAMS</p>

          <h1>Find Your Teams</h1>

          <p>
            Follow your favourite teams and keep up with their latest games.
          </p>
        </div>

        <div className="favourite-count">{favouriteTeams.length} Following</div>
      </section>

      <div className="team-filters">
        <button
          className={sportFilter === "ALL" ? "active" : ""}
          onClick={() => setSportFilter("ALL")}
        >
          All
        </button>

        <button
          className={sportFilter === "Football" ? "active" : ""}
          onClick={() => setSportFilter("Football")}
        >
          Football
        </button>

        <button
          className={sportFilter === "Basketball" ? "active" : ""}
          onClick={() => setSportFilter("Basketball")}
        >
          Basketball
        </button>
      </div>

      {loading && <div className="status-message">Loading teams...</div>}

      {error && <div className="status-message error">{error}</div>}

      <section className="teams-list">
        <div className="teams-list-header">
          <h2>Teams</h2>

          <span>{filteredTeams.length} teams</span>
        </div>

        {!loading && !error && (
          <div className="teams-grid">
            {filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                isFavourite={favouriteTeams.includes(team.id)}
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Teams;
