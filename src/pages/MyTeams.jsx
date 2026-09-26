import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

import {
  getLeagueTeams,
  getTeamNextEvents,
  getTeamPreviousEvents,
} from "../api/sportsApi";

import { normalizeTeam, normalizeGame } from "../api/normalizers";

import { useFavouriteTeamsContext } from "../context/FavouriteTeamsContext";

import TeamGameSummary from "../components/TeamGameSummary";

function MyTeams() {
  const { favouriteTeams, toggleFavourite } = useFavouriteTeamsContext();

  const [teams, setTeams] = useState([]);
  const [teamGames, setTeamGames] = useState({});
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState("");
  const [loading, setLoading] = useState(true);
  const [teamsError, setTeamsError] = useState("");

  const loadTeams = () => {
    setLoading(true);
    setTeamsError("");

    getLeagueTeams("English Premier League")
      .then((data) => {
        const apiTeams = (data.teams || []).map(normalizeTeam);

        setTeams(apiTeams);

        const followedTeams = apiTeams.filter((team) =>
          favouriteTeams.includes(team.id),
        );

        loadTeamGames(followedTeams);
      })
      .catch((error) => {
        setTeamsError(error.message);
        setTeams([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadTeamGames = (teamList, showLoading = true) => {
    if (teamList.length === 0) {
      setTeamGames({});
      return;
    }

    if (showLoading) {
      setGamesLoading(true);
    }
    setGamesError("");

    const requests = teamList.map((team) =>
      Promise.all([
        getTeamNextEvents(team.id),
        getTeamPreviousEvents(team.id),
      ]).then(([nextData, previousData]) => {
        const upcomingGames = (nextData.events || []).map(normalizeGame);

        const recentGames = (previousData.results || []).map(normalizeGame);

        return {
          teamId: team.id,
          upcomingGame: upcomingGames[0] || null,
          recentGame: recentGames[0] || null,
        };
      }),
    );

    Promise.all(requests)
      .then((results) => {
        const gamesByTeam = {};

        results.forEach((result) => {
          gamesByTeam[result.teamId] = {
            upcomingGame: result.upcomingGame,
            recentGame: result.recentGame,
          };
        });

        setTeamGames(gamesByTeam);
      })
      .catch((error) => {
        setGamesError(error.message);
        setTeamGames({});
      })
      .finally(() => {
        if (showLoading) {
          setGamesLoading(false);
        }
      });
  };

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (teams.length === 0) {
      return;
    }

    const followedTeams = teams.filter((team) =>
      favouriteTeams.includes(team.id),
    );

    loadTeamGames(followedTeams);

    const refreshInterval = setInterval(() => {
      const currentFollowedTeams = teams.filter((team) =>
        favouriteTeams.includes(team.id),
      );

      loadTeamGames(currentFollowedTeams, false);
    }, 60000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [favouriteTeams, teams]);

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
                  <Link
                    to={`/teams/${team.id}`}
                    className="team-card-link"
                    aria-label={`View ${team.name} details`}
                  >
                    <div className="team-logo-large">
                      {team.badge ? (
                        <img src={team.badge} alt={`${team.name} badge`} />
                      ) : (
                        team.shortName
                      )}
                    </div>
                  </Link>

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
                  <Link
                    to={`/teams/${team.id}`}
                    className="team-card-name-link"
                  >
                    <h3>{team.name}</h3>
                  </Link>

                  <p>{team.league}</p>

                  <span>{team.sport}</span>
                </div>
              </div>
            ))}
          </div>

          <section className="my-teams-games">
            <div className="my-teams-list-header">
              <div>
                <p className="eyebrow">TEAM ACTIVITY</p>

                <h2>Games</h2>

                <p>
                  Upcoming games and recent results for the teams you follow.
                </p>
              </div>
            </div>

            {gamesLoading && <LoadingMessage message="Loading team games..." />}

            {gamesError && (
              <ErrorMessage
                message={gamesError}
                onRetry={() => {
                  const followedTeams = teams.filter((team) =>
                    favouriteTeams.includes(team.id),
                  );

                  loadTeamGames(followedTeams);
                }}
              />
            )}

            {!gamesLoading && !gamesError && (
              <div className="my-teams-games-list">
                {myTeams.map((team) => (
                  <TeamGameSummary
                    key={team.id}
                    team={team}
                    upcomingGame={teamGames[team.id]?.upcomingGame || null}
                    recentGame={teamGames[team.id]?.recentGame || null}
                  />
                ))}
              </div>
            )}
          </section>
        </section>
      )}
    </main>
  );
}

export default MyTeams;
