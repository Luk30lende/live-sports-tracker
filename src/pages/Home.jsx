import GameCard from "../components/GameCard";
import { games } from "../data/mockData";

function Home() {
  const liveGames = games.filter((game) => game.status === "LIVE");

  const upcomingGames = games.filter((game) => game.status === "UPCOMING");

  return (
    <main className="dashboard">
      <section className="welcome">
        <div>
          <p className="eyebrow">SPORTS TRACKER</p>

          <h1>
            Stay on top of
            <br />
            the game.
          </h1>

          <p className="welcome-text">
            Follow live scores, upcoming games and your favourite teams all in
            one place.
          </p>
        </div>
      </section>

      <section className="sports-section">
        <div className="section-heading">
          <div>
            <h2>Live Now</h2>
            <p>Games currently in progress</p>
          </div>

          <span className="live-count">{liveGames.length} LIVE</span>
        </div>

        <div className="games-grid">
          {liveGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section className="sports-section">
        <div className="section-heading">
          <div>
            <h2>Upcoming</h2>
            <p>Don't miss the next game</p>
          </div>
        </div>

        <div className="games-grid">
          {upcomingGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
