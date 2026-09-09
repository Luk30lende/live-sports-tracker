import { useState } from "react";
import PlayerCard from "../components/PlayerCard";
import { players } from "../data/mockData";

function Players() {
  const [sportFilter, setSportFilter] = useState("ALL");

  const filteredPlayers =
    sportFilter === "ALL"
      ? players
      : players.filter((player) => player.sport === sportFilter);

  return (
    <main className="players-page">
      <section className="players-header">
        <div>
          <p className="eyebrow">PLAYERS</p>

          <h1>Players</h1>

          <p>Explore players, teams and their latest statistics.</p>
        </div>

        <div className="player-count">{filteredPlayers.length} Players</div>
      </section>

      <div className="player-filters">
        <button
          className={sportFilter === "ALL" ? "active" : ""}
          onClick={() => setSportFilter("ALL")}
        >
          All
        </button>

        <button
          className={sportFilter === "Football" ? "active" : ""}
          onClick={() => setSportFilter("Football")}
        >
          Football
        </button>

        <button
          className={sportFilter === "Basketball" ? "active" : ""}
          onClick={() => setSportFilter("Basketball")}
        >
          Basketball
        </button>
      </div>

      <section className="players-list">
        <div className="players-list-header">
          <div>
            <h2>
              {sportFilter === "ALL" ? "All Players" : `${sportFilter} Players`}
            </h2>

            <p>Browse player statistics and team information.</p>
          </div>

          <span>{filteredPlayers.length} players</span>
        </div>

        <div className="players-grid">
          {filteredPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Players;
