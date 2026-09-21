import { useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import { getLeagueTeams } from "../api/sportsApi";
import { normalizeTeam } from "../api/normalizers";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import { useFavouriteTeamsContext } from "../context/FavouriteTeamsContext";

function Teams() {
  const [sportFilter, setSportFilter] = useState("ALL");
  const { favouriteTeams, toggleFavourite } = useFavouriteTeamsContext();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeams = () => {
    setLoading(true);
    setError("");

    getLeagueTeams("English Premier League")
      .then((data) => {
        const apiTeams = (data.teams || []).map(normalizeTeam);

        setTeams(apiTeams);
      })
      .catch((error) => {
        setError(error.message);
        setTeams([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const filteredTeams =
    sportFilter === "ALL"
      ? teams
      : teams.filter((team) => team.sport === sportFilter);

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
      </div>

      {loading && <LoadingMessage message="Loading teams..." />}

      {error && <ErrorMessage message={error} onRetry={loadTeams} />}

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
