import { Link } from "react-router-dom";

function GameCard({ game, favouriteTeamIds = [] }) {
  const isHomeFavourite = favouriteTeamIds.includes(game.homeTeamId);

  const isAwayFavourite = favouriteTeamIds.includes(game.awayTeamId);

  const isFavouriteGame = isHomeFavourite || isAwayFavourite;

  const formatGameDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const getStatusLabel = () => {
    if (game.status === "LIVE") {
      return "LIVE";
    }

    if (game.status === "FINISHED") {
      return "Full Time";
    }

    return "Upcoming";
  };

  const getScoreContent = () => {
    if (game.status === "UPCOMING") {
      return (
        <div className="game-kickoff">
          <strong>{game.time || "TBA"}</strong>
        </div>
      );
    }

    return (
      <div className="game-score">
        <strong>{game.homeScore ?? "-"}</strong>

        <span>-</span>

        <strong>{game.awayScore ?? "-"}</strong>
      </div>
    );
  };

  return (
    <article className={`game-card ${isFavouriteGame ? "favourite-game" : ""}`}>
      <div className="game-card-header">
        <span>{game.league}</span>

        <div className="game-card-header-right">
          {isFavouriteGame && (
            <span
              className="favourite-game-badge"
              aria-label="Favourite team playing"
            >
              ★
            </span>
          )}

          <span
            className={`game-status ${
              game.status === "LIVE"
                ? "live"
                : game.status === "FINISHED"
                  ? "finished"
                  : "upcoming"
            }`}
          >
            {getStatusLabel()}
          </span>
        </div>
      </div>

      <div className="game-card-date">
        <span>{formatGameDate(game.date)}</span>

        {game.status === "UPCOMING" && game.time && <span>{game.time}</span>}
      </div>

      <div className="teams">
        <div className={`team ${isHomeFavourite ? "favourite-team" : ""}`}>
          <div className="team-logo">
            {game.homeTeamBadge ? (
              <img src={game.homeTeamBadge} alt={`${game.homeTeam} badge`} />
            ) : (
              game.homeTeam.charAt(0)
            )}
          </div>

          <Link to={`/teams/${game.homeTeamId}`} className="game-team-link">
            {game.homeTeam}
          </Link>
        </div>

        <div className="score">{getScoreContent()}</div>

        <div className="team">
          <div className={`team ${isAwayFavourite ? "favourite-team" : ""}`}>
            <div className="team-logo">
              {game.awayTeamBadge ? (
                <img src={game.awayTeamBadge} alt={`${game.awayTeam} badge`} />
              ) : (
                game.awayTeam.charAt(0)
              )}
            </div>
          </div>

          <Link to={`/teams/${game.awayTeamId}`} className="game-team-link">
            {game.awayTeam}
          </Link>
        </div>
      </div>

      <div className="game-card-footer">
        <div>
          {game.status === "LIVE" && (
            <span className="game-live-indicator">● Match in progress</span>
          )}

          {game.status === "FINISHED" && <span>Match completed</span>}

          {game.status === "UPCOMING" && <span>Kickoff scheduled</span>}

          {game.venue && <span className="game-venue">{game.venue}</span>}
        </div>

        <Link to={`/games/${game.id}`} className="game-details-link">
          View game →
        </Link>
      </div>
    </article>
  );
}

export default GameCard;
