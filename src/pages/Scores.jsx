import { useEffect, useState } from "react";

import GameCard from "../components/GameCard";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

import { getEventsByDay } from "../api/sportsApi";

import { leagueIds } from "../api/leagueIds";
import { normalizeGame } from "../api/normalizers";
import { useFavouriteTeamsContext } from "../context/FavouriteTeamsContext";

function Scores() {
  const { favouriteTeams } = useFavouriteTeamsContext();

  const [filter, setFilter] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDateForApi = (date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDateLabel = (date) => {
    const today = new Date();

    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const yesterdayStart = new Date(todayStart);

    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const tomorrowStart = new Date(todayStart);

    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const selectedStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    if (selectedStart.getTime() === todayStart.getTime()) {
      return "Today";
    }

    if (selectedStart.getTime() === yesterdayStart.getTime()) {
      return "Yesterday";
    }

    if (selectedStart.getTime() === tomorrowStart.getTime()) {
      return "Tomorrow";
    }

    return selectedStart.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const loadGames = () => {
    setLoading(true);
    setError("");

    const date = formatDateForApi(selectedDate);

    getEventsByDay(date, leagueIds.premierLeague)
      .then((data) => {
        const apiGames = (data.events || []).map(normalizeGame);

        setGames(apiGames);
      })
      .catch((error) => {
        setError(error.message);
        setGames([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadGames();
  }, [selectedDate]);

  const goToPreviousDay = () => {
    setSelectedDate((currentDate) => {
      const previousDate = new Date(currentDate);

      previousDate.setDate(previousDate.getDate() - 1);

      return previousDate;
    });
  };

  const goToNextDay = () => {
    setSelectedDate((currentDate) => {
      const nextDate = new Date(currentDate);

      nextDate.setDate(nextDate.getDate() + 1);

      return nextDate;
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const filteredGames = games.filter((game) => {
    if (filter === "ALL") {
      return true;
    }

    if (filter === "MY_TEAMS") {
      return favouriteTeams.some(
        (teamId) => teamId === game.homeTeamId || teamId === game.awayTeamId,
      );
    }

    return game.status === filter;
  });

  const getTitle = () => {
    if (filter === "LIVE") {
      return "Live Games";
    }

    if (filter === "UPCOMING") {
      return "Upcoming Games";
    }

    if (filter === "FINISHED") {
      return "Finished Games";
    }

    if (filter === "MY_TEAMS") {
      return "My Team Games";
    }

    return "All Games";
  };

  return (
    <main className="scores-page">
      <section className="scores-header">
        <div>
          <p className="eyebrow">SCORES</p>

          <h1>Games</h1>

          <p>Follow live action, upcoming fixtures and completed games.</p>
        </div>
      </section>

      {/* Date Navigation */}

      <div className="score-date-navigation">
        <button
          type="button"
          className="date-navigation-button"
          onClick={goToPreviousDay}
          aria-label="Previous day"
        >
          ← Previous
        </button>

        <div className="selected-date">
          <span>{formatDateLabel(selectedDate)}</span>

          <strong>
            {selectedDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </strong>
        </div>

        <button
          type="button"
          className="date-navigation-button"
          onClick={goToNextDay}
          aria-label="Next day"
        >
          Next →
        </button>
      </div>

      <div className="today-button-wrapper">
        <button type="button" className="today-button" onClick={goToToday}>
          Today
        </button>
      </div>

      {/* Filters */}

      <div className="score-filters">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>

        <button
          className={filter === "MY_TEAMS" ? "active" : ""}
          onClick={() => setFilter("MY_TEAMS")}
        >
          My Teams
        </button>

        <button
          className={filter === "LIVE" ? "active" : ""}
          onClick={() => setFilter("LIVE")}
        >
          Live
        </button>

        <button
          className={filter === "UPCOMING" ? "active" : ""}
          onClick={() => setFilter("UPCOMING")}
        >
          Upcoming
        </button>

        <button
          className={filter === "FINISHED" ? "active" : ""}
          onClick={() => setFilter("FINISHED")}
        >
          Finished
        </button>
      </div>

      <section className="scores-list">
        <div className="scores-list-header">
          <div>
            <h2>{getTitle()}</h2>

            <p className="scores-selected-date">
              {formatDateLabel(selectedDate)}
            </p>
          </div>

          {!loading && !error && (
            <span>
              {filteredGames.length}{" "}
              {filteredGames.length === 1 ? "game" : "games"}
            </span>
          )}
        </div>

        {loading && <LoadingMessage message="Loading games..." />}

        {error && <ErrorMessage message={error} onRetry={loadGames} />}

        {!loading && !error && filteredGames.length === 0 && (
          <div className="status-message">
            {filter === "MY_TEAMS" && favouriteTeams.length === 0 ? (
              <>
                <h3>No teams followed yet</h3>

                <p>
                  Follow a team from the Teams page to see their games here.
                </p>
              </>
            ) : (
              <>
                <h3>No games found</h3>

                <p>
                  There are no games matching this filter on{" "}
                  {formatDateLabel(selectedDate).toLowerCase()}.
                </p>
              </>
            )}
          </div>
        )}

        {!loading && !error && filteredGames.length > 0 && (
          <div className="scores-groups">
            <section className="score-date-group">
              <div className="score-date-header">
                <h3>{formatDateLabel(selectedDate)}</h3>

                <span>
                  {filteredGames.length}{" "}
                  {filteredGames.length === 1 ? "game" : "games"}
                </span>
              </div>

              <div className="games-grid">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    favouriteTeamIds={favouriteTeams}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

export default Scores;
