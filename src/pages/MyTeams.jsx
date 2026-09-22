import { useEffect, useState } from "react";

import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

import { getLeagueTeams } from "../api/sportsApi";
import { normalizeTeam } from "../api/normalizers";

import { useFavouriteTeamsContext } from "../context/FavouriteTeamsContext";

function MyTeams() {
  const { favouriteTeams, toggleFavourite } = useFavouriteTeamsContext();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamsError, setTeamsError] = useState("");

  const loadTeams = () => {
    setLoading(true);
    setTeamsError("");

    getLeagueTeams("English Premier League")
      .then((data) => {
        const apiTeams = (data.teams || []).map(normalizeTeam);

        setTeams(apiTeams);
      })
      .catch((error) => {
        setTeamsError(error.message);
        setTeams([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTeams();
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

      {teamsError && <ErrorMessage message={teamsError} onRetry={loadTeams} />}

      {!loading && !teamsError && myTeams.length === 0 && (
        <section className="my-teams-empty">
          <div className="status-message">
            <div className="empty-state-icon" aria-hidden="true">
              ☆
            </div>

            <h2>No teams yet</h2>

            <p>
              You are not following any teams yet. Find teams you support and
              follow them to see them here.
            </p>

            <a href="/teams" className="empty-state-action">
              Find Teams
            </a>
          </div>
        </section>
      )}

      {!loading && !teamsError && myTeams.length > 0 && (
        <section className="my-teams-list">
          <div className="my-teams-list-header">
            <div>
              <p className="eyebrow">YOUR FAVOURITES</p>

              <h2>Following</h2>

              <p>
                {myTeams.length} {myTeams.length === 1 ? "team" : "teams"}{" "}
                currently in your list
              </p>
            </div>
          </div>

          <div className="teams-grid">
            {myTeams.map((team) => (
              <div className="team-card favourite-team-card" key={team.id}>
                <div className="team-card-top">
                  <div className="team-logo-large">
                    {team.badge ? (
                      <img src={team.badge} alt={`${team.name} badge`} />
                    ) : (
                      team.shortName
                    )}
                  </div>

                  <button
                    type="button"
                    className="favourite-button favourite"
                    onClick={() => toggleFavourite(team.id)}
                    aria-pressed="true"
                    aria-label={`Unfollow ${team.name}`}
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
