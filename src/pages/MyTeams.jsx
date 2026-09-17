import { useEffect, useState } from "react";
import LoadingMessage from "../components/LoadingMessage";
import { getLeagueTeams } from "../api/sportsApi";
import { normalizeTeam } from "../api/normalizers";
import { useFavouriteTeamsContext } from "../context/FavouriteTeamsContext";

function MyTeams() {
  const { favouriteTeams, toggleFavourite } = useFavouriteTeamsContext();

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

  const myTeams = teams.filter((team) => favouriteTeams.includes(team.id));

  return (
    <main className="my-teams-page">
      <section className="my-teams-header">
        <div>
          <p className="eyebrow">MY TEAMS</p>

          <h1>Your Teams</h1>

          <p>
            Manage the teams you follow and keep them close to your dashboard.
          </p>
        </div>

        <div className="favourite-count">{favouriteTeams.length} Following</div>
      </section>

      {loading && <LoadingMessage message="Loading your teams..." />}

      {error && <div className="status-message error">{error}</div>}

      {!loading && !error && myTeams.length === 0 && (
        <section className="my-teams-empty">
          <div className="status-message">
            <h2>No teams yet</h2>

            <p>
              You are not following any teams. Visit the Teams page to find
              teams you want to follow.
            </p>
          </div>
        </section>
      )}

      {!loading && !error && myTeams.length > 0 && (
        <section className="my-teams-list">
          <div className="my-teams-list-header">
            <div>
              <h2>Following</h2>

              <p>
                {myTeams.length} {myTeams.length === 1 ? "team" : "teams"}
              </p>
            </div>
          </div>

          <div className="teams-grid">
            {myTeams.map((team) => (
              <div className="team-card" key={team.id}>
                <div className="team-card-top">
                  <div className="team-logo-large">
                    {team.badge ? (
                      <img src={team.badge} alt={`${team.name} badge`} />
                    ) : (
                      team.shortName
                    )}
                  </div>

                  <button
                    className="favourite-button favourite"
                    onClick={() => toggleFavourite(team.id)}
                  >
                    ★ Following
                  </button>
                </div>

                <div className="team-card-info">
                  <h3>{team.name}</h3>

                  <p>{team.league}</p>

                  <span>{team.sport}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default MyTeams;
