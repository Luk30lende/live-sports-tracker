function GameCard({ game }) {
  return (
    <div className="game-card">
      <div className="game-card-header">
        <span>{game.league}</span>

        {game.status === "LIVE" && <span className="live-badge">LIVE</span>}
      </div>

      <div className="teams">
        <div className="team">
          <div className="team-logo">{game.homeTeam.charAt(0)}</div>

          <span>{game.homeTeam}</span>
        </div>

        <div className="score">
          {game.status === "UPCOMING" ? (
            <strong>{game.time}</strong>
          ) : (
            <>
              <strong>{game.homeScore}</strong>
              <span>-</span>
              <strong>{game.awayScore}</strong>
            </>
          )}
        </div>

        <div className="team">
          <div className="team-logo">{game.awayTeam.charAt(0)}</div>

          <span>{game.awayTeam}</span>
        </div>
      </div>

      <div className="game-time">
        {game.status === "LIVE"
          ? `${game.minute}'`
          : game.status === "FINISHED"
            ? "Full Time"
            : "Upcoming"}
      </div>
    </div>
  );
}

export default GameCard;
