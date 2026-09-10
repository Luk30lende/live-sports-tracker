function PlayerDetails({ player, stats, loading, error, onClose }) {
  return (
    <section className="player-details">
      <div className="player-details-header">
        <button className="back-button" onClick={onClose}>
          ← Back to Players
        </button>
      </div>

      <div className="player-profile">
        <div className="player-profile-image">
          {player.image ? (
            <img src={player.image} alt={player.name} />
          ) : (
            player.shortName
          )}
        </div>

        <div>
          <p className="eyebrow">PLAYER</p>

          <h1>{player.name}</h1>

          <p>{player.position}</p>

          <div className="player-profile-meta">
            <span>{player.team}</span>
            <span>{player.nationality}</span>

            {player.number !== "-" && <span>#{player.number}</span>}
          </div>
        </div>
      </div>

      <section className="player-stats-section">
        <div className="players-list-header">
          <div>
            <h2>Statistics</h2>
            <p>Available player statistics</p>
          </div>
        </div>

        {loading && <div className="status-message">Loading statistics...</div>}

        {error && <div className="status-message error">{error}</div>}

        {!loading && !error && stats.length === 0 && (
          <div className="status-message">
            No statistics available for this player.
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
