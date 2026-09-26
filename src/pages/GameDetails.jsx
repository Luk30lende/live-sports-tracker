import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

import { getEvent, getTeam, getEventTimeline } from "../api/sportsApi";

import {
  normalizeGame,
  normalizeTeam,
  normalizeTimelineEvent,
} from "../api/normalizers";

import GameTimeline from "../components/GameTimeline";

import { useFavouriteTeamsContext } from "../context/FavouriteTeamsContext";

function GameDetails() {
  const { gameId } = useParams();

  const [searchParams] = useSearchParams();
  const fromTeam = searchParams.get("fromTeam");
  const { favouriteTeams } = useFavouriteTeamsContext();

  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  const [game, setGame] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isHomeFavourite =
    game && favouriteTeams.some((id) => String(id) === String(game.homeTeamId));
  const isAwayFavourite =
    game && favouriteTeams.some((id) => String(id) === String(game.awayTeamId));

  const formatGameDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const loadGame = (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    setError("");

    getEvent(gameId)
      .then((data) => {
        const eventResult = data.events?.[0];

        if (!eventResult) {
          throw new Error("Game not found.");
        }

        const normalizedGame = normalizeGame(eventResult);

        setGame(normalizedGame);

        return Promise.all([
          getTeam(normalizedGame.homeTeamId),
          getTeam(normalizedGame.awayTeamId),
          getEventTimeline(gameId),
        ]);
      })
      .then(([homeTeamData, awayTeamData, timelineData]) => {
        const homeTeamResult = homeTeamData.teams?.[0];

        const awayTeamResult = awayTeamData.teams?.[0];

        setHomeTeam(homeTeamResult ? normalizeTeam(homeTeamResult) : null);

        setAwayTeam(awayTeamResult ? normalizeTeam(awayTeamResult) : null);

        setTimeline((timelineData.timeline || []).map(normalizeTimelineEvent));
      })
      .catch((error) => {
        setError(error.message);

        if (showLoading) {
          setGame(null);
          setHomeTeam(null);
          setAwayTeam(null);
          setTimeline([]);
        }
      })
      .finally(() => {
        if (showLoading) {
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    loadGame();
  }, [gameId]);

  useEffect(() => {
    if (!game || game.status !== "LIVE") {
      return;
    }

    const refreshInterval = setInterval(() => {
      loadGame(false);
    }, 60000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [game?.status, gameId]);

  if (loading) {
    return (
      <main className="game-details-page">
        <LoadingMessage message="Loading game..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="game-details-page">
        <ErrorMessage message={error} onRetry={loadGame} />

        <Link to="/scores" className="back-link">
          ← Back to Scores
        </Link>
      </main>
    );
  }

  return (
    <main className="game-details-page">
      <Link
        to={fromTeam ? `/scores?team=${fromTeam}` : "/scores"}
        className="back-link"
      >
        ← Back to Scores
      </Link>

      <section className="game-details-card">
        <div className="game-details-header">
          <div>
            <p className="eyebrow">MATCH</p>

            <h1>{game.league}</h1>
          </div>

          <span
            className={`game-status ${
              game.status === "LIVE"
                ? "live"
                : game.status === "FINISHED"
                  ? "finished"
                  : "upcoming"
            }`}
          >
            {game.status === "LIVE"
              ? "LIVE"
              : game.status === "FINISHED"
                ? "Full Time"
                : "Upcoming"}
          </span>
        </div>

        <div className="game-details-date">
          <span>{formatGameDate(game.date)}</span>

          <span>{game.time || "TBA"}</span>
        </div>

        <div className="game-details-teams">
          <Link to={`/teams/${game.homeTeamId}`} className="game-details-team">
            <div className="game-details-logo">
              {homeTeam?.badge ? (
                <img src={homeTeam.badge} alt={`${game.homeTeam} badge`} />
              ) : (
                game.homeTeam.charAt(0)
              )}
            </div>

            <strong>{game.homeTeam}</strong>

            {isHomeFavourite && (
              <span className="game-details-favourite">★ Following</span>
            )}
          </Link>

          <div className="game-details-score">
            {game.status === "UPCOMING" ? (
              <span>VS</span>
            ) : (
              <>
                <strong>{game.homeScore ?? "-"}</strong>

                <span>-</span>

                <strong>{game.awayScore ?? "-"}</strong>
              </>
            )}
          </div>

          <Link to={`/teams/${game.awayTeamId}`} className="game-details-team">
            <div className="game-details-logo">
              {awayTeam?.badge ? (
                <img src={awayTeam.badge} alt={`${game.awayTeam} badge`} />
              ) : (
                game.awayTeam.charAt(0)
              )}
            </div>

            <strong>{game.awayTeam}</strong>

            {isAwayFavourite && (
              <span className="game-details-favourite">★ Following</span>
            )}
          </Link>
        </div>

        {game.venue && (
          <div className="game-details-venue">
            <span>VENUE</span>
            <strong>{game.venue}</strong>
          </div>
        )}

        <section className="game-details-timeline-section">
          <div className="game-details-section-header">
            <div>
              <p className="eyebrow">MATCH EVENTS</p>

              <h2>Timeline</h2>
            </div>
          </div>

          <GameTimeline events={timeline} />
        </section>
      </section>
    </main>
  );
}

export default GameDetails;
