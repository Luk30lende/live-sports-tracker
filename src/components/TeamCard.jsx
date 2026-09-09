function TeamCard({ team, isFavourite, onToggleFavourite }) {
  return (
    <div className="team-card">
      <div className="team-card-top">
        <div className="team-logo-large">{team.shortName}</div>

        <button
          className={`favourite-button ${isFavourite ? "favourite" : ""}`}
          onClick={() => onToggleFavourite(team.id)}
        >
          {isFavourite ? "★ Following" : "☆ Follow"}
        </button>
      </div>

      <div className="team-card-info">
        <h3>{team.name}</h3>

        <p>{team.league}</p>

        <span>{team.sport}</span>
      </div>
    </div>
  );
}

export default TeamCard;
