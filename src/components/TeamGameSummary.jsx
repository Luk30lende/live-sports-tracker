import { Link } from "react-router-dom";

function TeamGameSummary({ team, upcomingGame, recentGame }) {
  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

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
          <span className="team-game-summary-label">NEXT GAME</span>

          {upcomingGame ? (
            <div>
              <strong>{upcomingGame.homeTeam}</strong>

              <span className="team-game-summary-vs">
                {formatDate(upcomingGame.date)}
                {" • "}
                {upcomingGame.time || "TBA"}
              </span>

              <strong>{upcomingGame.awayTeam}</strong>
            </div>
          ) : (
            <p>No upcoming game available.</p>
          )}
        </div>

        <div className="team-game-summary-item">
          <span className="team-game-summary-label">LAST RESULT</span>

          {recentGame ? (
            <div>
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
            </div>
          ) : (
            <p>No recent result available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamGameSummary;
