import LoadingMessage from "./LoadingMessage";
import ErrorMessage from "./ErrorMessage";

function PlayerDetails({ player, stats, loading, error, onClose, onRetry }) {
  return (
    <section className="player-details">
      <div className="player-details-header">
        <button type="button" className="back-button" onClick={onClose}>
          ← Back to Players
        </button>
      </div>

      <section className="player-profile">
        <div className="player-profile-image">
          {player.image ? (
            <img src={player.image} alt={player.name} />
          ) : (
            player.shortName
          )}
        </div>

        <div className="player-profile-info">
          <p className="eyebrow">PLAYER PROFILE</p>

          <h1>{player.name}</h1>

          <p className="player-position">{player.position}</p>

          <div className="player-profile-meta">
            <span>{player.team}</span>
            <span>{player.nationality}</span>

            {player.number !== "-" && <span>#{player.number}</span>}
          </div>
        </div>
      </section>

      <section className="player-stats-section">
        <div className="players-list-header">
          <div>
            <p className="eyebrow">PERFORMANCE</p>

            <h2>Statistics</h2>

            <p>Available statistics for this player.</p>
          </div>

          {!loading && !error && stats.length > 0 && (
            <span>
              {stats.length} {stats.length === 1 ? "statistic" : "statistics"}
            </span>
          )}
        </div>

        {loading && <LoadingMessage message="Loading statistics..." />}

        {error && <ErrorMessage message={error} onRetry={onRetry} />}

        {!loading && !error && stats.length === 0 && (
          <div className="status-message">
            <h3>No statistics available</h3>

            <p>There are currently no statistics available for this player.</p>
          </div>
        )}

        {!loading && !error && stats.length > 0 && (
          <div className="player-stats-grid">
            {stats.map((stat) => (
              <div className="player-stat-card" key={stat.id}>
                <span>{stat.statistic}</span>

                <strong>{stat.value}</strong>

                <small>
                  {stat.league} • {stat.season}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default PlayerDetails;
