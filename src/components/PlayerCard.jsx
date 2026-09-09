function PlayerCard({ player }) {
  const isBasketball = player.sport === "Basketball";

  return (
    <div className="player-card">
      <div className="player-card-header">
        <div className="player-avatar">{player.shortName}</div>

        <span className="player-number">#{player.number}</span>
      </div>

      <div className="player-info">
        <h3>{player.name}</h3>

        <p>{player.position}</p>

        <div className="player-team">
          <strong>{player.team}</strong>
          <span>{player.league}</span>
        </div>
      </div>

      <div className="player-stats">
        <div>
          <strong>{player.appearances}</strong>
          <span>Games</span>
        </div>

        <div>
          <strong>{player.goals}</strong>
          <span>{isBasketball ? "PPG" : "Goals"}</span>
        </div>

        <div>
          <strong>{player.assists}</strong>
          <span>Assists</span>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;
