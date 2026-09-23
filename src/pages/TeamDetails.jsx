import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

import {
  getTeam,
  getTeamNextEvents,
  getTeamPreviousEvents,
  getTeamPlayers,
} from "../api/sportsApi";

import {
  normalizeTeam,
  normalizeGame,
  normalizePlayer,
} from "../api/normalizers";

function TeamDetails() {
  const { teamId } = useParams();

  const [team, setTeam] = useState(null);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [recentGames, setRecentGames] = useState([]);

  const [players, setPlayers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeamDetails = () => {
    setLoading(true);
    setError("");

    Promise.all([
      getTeam(teamId),
      getTeamNextEvents(teamId),
      getTeamPreviousEvents(teamId),
      getTeamPlayers(teamId),
    ])
      .then(([teamData, nextData, previousData, playersData]) => {
        const teamResult = teamData.teams?.[0];

        if (!teamResult) {
          throw new Error("Team not found.");
        }

        setTeam(normalizeTeam(teamResult));

        setUpcomingGames((nextData.events || []).map(normalizeGame));

        setRecentGames((previousData.results || []).map(normalizeGame));

        setPlayers((playersData.player || []).map(normalizePlayer));
      })
      .catch((error) => {
        setError(error.message);
        setTeam(null);
        setUpcomingGames([]);
        setRecentGames([]);
        setPlayers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTeamDetails();
  }, [teamId]);

  if (loading) {
    return (
      <main className="team-details-page">
        <LoadingMessage message="Loading team..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="team-details-page">
        <ErrorMessage message={error} onRetry={loadTeamDetails} />

        <Link to="/teams" className="back-link">
          ← Back to Teams
        </Link>
      </main>
    );
  }

  return (
    <main className="team-details-page">
      <Link to="/teams" className="back-link">
        ← Back to Teams
      </Link>

      <section className="team-details-header">
        <div className="team-details-logo">
          {team.badge ? (
            <img src={team.badge} alt={`${team.name} badge`} />
          ) : (
            team.shortName
          )}
        </div>

        <div className="team-details-info">
          <p className="eyebrow">TEAM</p>

          <h1>{team.name}</h1>

          <p>
            {team.league}
            {team.country ? ` • ${team.country}` : ""}
          </p>
        </div>
      </section>

      <section className="team-details-section">
        <div className="team-details-section-header">
          <div>
            <p className="eyebrow">SCHEDULE</p>

            <h2>Upcoming Games</h2>
          </div>

          <span>
            {upcomingGames.length}{" "}
            {upcomingGames.length === 1 ? "game" : "games"}
          </span>
        </div>

        {upcomingGames.length > 0 ? (
          <div className="games-grid">
            {upcomingGames.map((game) => (
              <div key={game.id}>
                <div className="team-details-game">
                  <strong>{game.homeTeam}</strong>

                  <span>{game.time || "TBA"}</span>

                  <strong>{game.awayTeam}</strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="status-message">
            <h3>No upcoming games</h3>

            <p>
              There are currently no upcoming games available for {team.name}.
            </p>
          </div>
        )}
      </section>

      <section className="team-details-section">
        <div className="team-details-section-header">
          <div>
            <p className="eyebrow">RESULTS</p>

            <h2>Recent Games</h2>
          </div>

          <span>
            {recentGames.length} {recentGames.length === 1 ? "game" : "games"}
          </span>
        </div>

        {recentGames.length > 0 ? (
          <div className="games-grid">
            {recentGames.map((game) => (
              <div className="team-details-game" key={game.id}>
                <strong>{game.homeTeam}</strong>

                <span>
                  {game.homeScore ?? "-"} - {game.awayScore ?? "-"}
                </span>

                <strong>{game.awayTeam}</strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="status-message">
            <h3>No recent games</h3>

            <p>
              There are currently no recent results available for {team.name}.
            </p>
          </div>
        )}
      </section>

      <section className="team-details-section">
        <div className="team-details-section-header">
          <div>
            <p className="eyebrow">SQUAD</p>

            <h2>Players</h2>
          </div>

          <span>
            {players.length} {players.length === 1 ? "player" : "players"}
          </span>
        </div>

        {players.length > 0 ? (
          <div className="team-squad-grid">
            {players.map((player) => (
              <Link
                to={`/players/${player.id}`}
                className="team-squad-card"
                key={player.id}
              >
                <div className="team-squad-avatar">
                  {player.image ? (
                    <img src={player.image} alt={player.name} />
                  ) : (
                    player.shortName
                  )}
                </div>

                <div className="team-squad-info">
                  <h3>{player.name}</h3>

                  <p>{player.position}</p>

                  <span>{player.nationality}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="status-message">
            <h3>No squad information</h3>

            <p>
              There is currently no player information available for {team.name}
              .
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default TeamDetails;
