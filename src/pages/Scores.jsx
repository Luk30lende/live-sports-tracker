import { useEffect, useState } from "react";

import GameCard from "../components/GameCard";
import LoadingMessage from "../components/LoadingMessage";

import { getEventsByDay } from "../api/sportsApi";

import { leagueIds } from "../api/leagueIds";
import { normalizeGame } from "../api/normalizers";

function Scores() {
  const [filter, setFilter] = useState("ALL");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date) => {
      const year = date.getFullYear();

      const month = String(date.getMonth() + 1).padStart(2, "0");

      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const dates = [
      formatDate(yesterday),
      formatDate(today),
      formatDate(tomorrow),
    ];

    Promise.all(
      dates.map((date) => getEventsByDay(date, leagueIds.premierLeague)),
    )
      .then((responses) => {
        const allGames = responses.flatMap((data) =>
          (data.events || []).map(normalizeGame),
        );

        setGames(allGames);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredGames =
    filter === "ALL" ? games : games.filter((game) => game.status === filter);

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

    return "All Games";
  };

  const formatDateLabel = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const gameDate = new Date(`${date}T00:00:00`);
    const today = new Date();

    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const gameDateStart = new Date(
      gameDate.getFullYear(),
      gameDate.getMonth(),
      gameDate.getDate(),
    );

    if (gameDateStart.getTime() === todayStart.getTime()) {
      return "Today";
    }

    if (gameDateStart.getTime() === tomorrowStart.getTime()) {
      return "Tomorrow";
    }

    return gameDate.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const groupedGames = filteredGames.reduce((groups, game) => {
    const date = game.date || "unknown";

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(game);

    return groups;
  }, {});

  const sortedGroups = Object.entries(groupedGames).sort(([dateA], [dateB]) => {
    if (dateA === "unknown") {
      return 1;
    }

    if (dateB === "unknown") {
      return -1;
    }

    return new Date(dateA) - new Date(dateB);
  });

  return (
    <main className="scores-page">
      <section className="scores-header">
        <div>
          <p className="eyebrow">SCORES</p>

          <h1>Games</h1>

          <p>Follow live action, upcoming fixtures and completed games.</p>
        </div>
      </section>

      <div className="score-filters">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All
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
          <h2>{getTitle()}</h2>

          {!loading && !error && <span>{filteredGames.length} games</span>}
        </div>

        {loading && <LoadingMessage message="Loading games..." />}

        {error && <div className="status-message error">{error}</div>}

        {!loading && !error && filteredGames.length === 0 && (
          <div className="status-message">No games found.</div>
        )}

        {!loading && !error && filteredGames.length > 0 && (
          <div className="scores-groups">
            {sortedGroups.map(([date, dateGames]) => (
              <section className="score-date-group" key={date}>
                <div className="score-date-header">
                  <h3>{formatDateLabel(date)}</h3>

                  <span>
                    {dateGames.length}{" "}
                    {dateGames.length === 1 ? "game" : "games"}
                  </span>
                </div>

                <div className="games-grid">
                  {dateGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Scores;
