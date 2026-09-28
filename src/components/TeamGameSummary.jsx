import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TeamGameSummary({ team, liveGame, upcomingGame, recentGame }) {
  const [countdown, setCountdown] = useState(null);

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  useEffect(() => {
    if (!upcomingGame?.date || !upcomingGame?.time) {
      setCountdown(null);
      return;
    }

    const getCountdown = () => {
      const kickoffTime = new Date(`${upcomingGame.date}T${upcomingGame.time}`);

      const difference = kickoffTime.getTime() - Date.now();

      if (Number.isNaN(kickoffTime.getTime())) {
        return null;
      }

      if (difference <= 0) {
        return "Starting now";
      }

      const totalSeconds = Math.floor(difference / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      }

      if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      }

      return `${minutes}m ${seconds}s`;
    };

    setCountdown(getCountdown());

    const countdownInterval = setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [upcomingGame]);

  return (
    <div className="team-game-summary">
      <div className="team-game-summary-header">
        <div>
          <h3>{team.name}</h3>
          <span>{team.league}</span>
        </div>

        <Link to={`/teams/${team.id}`} className="team-game-summary-link">
          Team Details →
        </Link>
      </div>

      <div className="team-game-summary-content">
        <div className="team-game-summary-item">
          <span className="team-game-summary-label">
            {liveGame ? "LIVE GAME" : "NEXT GAME"}
          </span>

          {liveGame ? (
            <Link
              to={`/games/${liveGame.id}?fromTeam=${team.id}`}
              className="team-game-summary-game-link"
            >
              <strong>{liveGame.homeTeam}</strong>

              <span className="team-game-summary-score">
                {liveGame.homeScore ?? "-"}
                {" - "}
                {liveGame.awayScore ?? "-"}
              </span>

              <strong>{liveGame.awayTeam}</strong>

              <span className="team-game-summary-live-status">
                Match in progress · View game →
              </span>
            </Link>
          ) : upcomingGame ? (
            <Link
              to={`/games/${upcomingGame.id}?fromTeam=${team.id}`}
              className="team-game-summary-game-link"
            >
              <strong>{upcomingGame.homeTeam}</strong>

              <span className="team-game-summary-vs">
                {formatDate(upcomingGame.date)}
                {" • "}
                {upcomingGame.time || "TBA"}
              </span>

              {countdown && (
                <span className="team-game-summary-countdown">
                  Starts in {countdown}
                </span>
              )}

              <strong>{upcomingGame.awayTeam}</strong>
            </Link>
          ) : (
            <p>No upcoming game available.</p>
          )}
        </div>

        <div className="team-game-summary-item">
          <span className="team-game-summary-label">LAST RESULT</span>

          {recentGame ? (
            <Link
              to={`/games/${recentGame.id}?fromTeam=${team.id}`}
              className="team-game-summary-game-link"
            >
              <strong>{recentGame.homeTeam}</strong>

              <span className="team-game-summary-score">
                {recentGame.homeScore ?? "-"}
                {" - "}
                {recentGame.awayScore ?? "-"}
              </span>

              <strong>{recentGame.awayTeam}</strong>

              <span className="team-game-summary-date">
                {formatDate(recentGame.date)}
              </span>
            </Link>
          ) : (
            <p>No recent result available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamGameSummary;
