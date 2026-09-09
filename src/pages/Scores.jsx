import { useState } from "react";
import GameCard from "../components/GameCard";
import { games } from "../data/mockData";

function Scores() {
  const [filter, setFilter] = useState("ALL");

  const filteredGames =
    filter === "ALL" ? games : games.filter((game) => game.status === filter);

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
          <h2>
            {filter === "ALL"
              ? "All Games"
              : filter === "LIVE"
                ? "Live Games"
                : filter === "UPCOMING"
                  ? "Upcoming Games"
                  : "Finished Games"}
          </h2>

          <span>{filteredGames.length} games</span>
        </div>

        <div className="games-grid">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Scores;
