function PlayerCard({ player, onSelect }) {
  return (
    <div
      className="player-card"
      role="button"
      tabIndex="0"
      onClick={() => onSelect(player)}
    >
      <div className="player-card-header">
        <div className="player-avatar">
          {player.image ? (
            <img src={player.image} alt={player.name} />
          ) : (
            player.shortName
          )}
        </div>

        <span className="player-number">#{player.number}</span>
      </div>

      <div className="player-info">
        <h3>{player.name}</h3>

        <p>{player.position}</p>

        <div className="player-team">
          <strong>{player.team}</strong>
          <span>{player.nationality}</span>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;
