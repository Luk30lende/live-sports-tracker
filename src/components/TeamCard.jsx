import { Link } from "react-router-dom";

function TeamCard({ team, isFavourite, onToggleFavourite }) {
  return (
    <article
      className={`team-card ${isFavourite ? "favourite-team-card" : ""}`}
    >
      <div className="team-card-top">
        <Link
          to={`/teams/${team.id}`}
          className="team-card-link"
          aria-label={`View ${team.name} details`}
        >
          <div className="team-logo-large">
            {team.badge ? (
              <img src={team.badge} alt={`${team.name} badge`} />
            ) : (
              team.shortName
            )}
          </div>
        </Link>

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
        <Link to={`/teams/${team.id}`} className="team-card-name-link">
          <h3>{team.name}</h3>
        </Link>

        <p>{team.league}</p>

        <span>{team.sport}</span>
      </div>
    </article>
  );
}

export default TeamCard;
