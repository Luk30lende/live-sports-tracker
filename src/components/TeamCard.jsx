function TeamCard({ team, isFavourite, onToggleFavourite }) {
  return (
    <article
      className={`team-card ${isFavourite ? "favourite-team-card" : ""}`}
    >
      <div className="team-card-top">
        <div className="team-logo-large">
          {team.badge ? (
            <img src={team.badge} alt={`${team.name} badge`} />
          ) : (
            team.shortName
          )}
        </div>

        <button
          type="button"
          className={`favourite-button ${isFavourite ? "favourite" : ""}`}
          onClick={() => onToggleFavourite(team.id)}
          aria-pressed={isFavourite}
          aria-label={
            isFavourite ? `Unfollow ${team.name}` : `Follow ${team.name}`
          }
        >
          {isFavourite ? "★ Following" : "☆ Follow"}
        </button>
      </div>

      <div className="team-card-info">
        <h3>{team.name}</h3>

        <p>{team.league}</p>

        <span>{team.sport}</span>
      </div>
    </article>
  );
}

export default TeamCard;
