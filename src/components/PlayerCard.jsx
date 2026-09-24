import { Link } from "react-router-dom";

function PlayerCard({ player, onSelect }) {
  return (
    <article
      className="player-card"
      role="button"
      tabIndex="0"
      onClick={() => onSelect(player)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(player);
        }
      }}
      aria-label={`View ${player.name} details`}
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
          {player.teamId ? (
            <Link
              to={`/teams/${player.teamId}`}
              className="player-team-link"
              onClick={(event) => event.stopPropagation()}
            >
              {player.team}
            </Link>
          ) : (
            <strong>{player.team}</strong>
          )}

          <span>{player.nationality}</span>
        </div>
      </div>

      <div className="player-card-footer">
        <span>View profile</span>
        <span aria-hidden="true">→</span>
      </div>
    </article>
  );
}

export default PlayerCard;
