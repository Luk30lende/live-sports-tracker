import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { getLeagueNextEvents, getLeaguePreviousEvents } from "../api/sportsApi";
import { leagueIds } from "../api/leagueIds";
import { normalizeGame } from "../api/normalizers";
import { getFavouriteTeams } from "../utils/storage";
import { getLeagueTeams } from "../api/sportsApi";
import { normalizeTeam } from "../api/normalizers";

function Home() {
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const [error, setError] = useState("");
  const [teamsError, setTeamsError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      getLeagueNextEvents(leagueIds.premierLeague),
      getLeaguePreviousEvents(leagueIds.premierLeague),
    ])
      .then(([nextData, previousData]) => {
        const nextGames = (nextData.events || []).map(normalizeGame);

        const previousGames = (previousData.events || []).map(normalizeGame);

        setGames([...previousGames, ...nextGames]);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoadingTeams(true);
    setTeamsError("");

    getLeagueTeams("English Premier League")
      .then((data) => {
        const apiTeams = (data.teams || []).map(normalizeTeam);

        setTeams(apiTeams);
      })
      .catch((error) => {
        setTeamsError(error.message);
      })
      .finally(() => {
        setLoadingTeams(false);
      });
  }, []);

  const favouriteTeamIds = getFavouriteTeams();

  const favouriteTeams = teams.filter((team) =>
    favouriteTeamIds.includes(team.id),
  );

  const liveGames = games.filter((game) => game.status === "LIVE");

  const upcomingGames = games.filter((game) => game.status === "UPCOMING");

  const finishedGames = games.filter((game) => game.status === "FINISHED");

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
            Follow scores, upcoming games and your favourite teams all in one
            place.
          </p>
        </div>
      </section>

      {error && <div className="status-message error">{error}</div>}

      {loading && <div className="status-message">Loading games...</div>}

      {!loading && !error && (
        <>
          <section className="sports-section">
            <div className="section-heading">
              <div>
                <h2>My Teams</h2>
                <p>Teams you are following</p>
              </div>

              <span>{favouriteTeams.length} teams</span>
            </div>

            {loadingTeams ? (
              <div className="status-message">Loading your teams...</div>
            ) : teamsError ? (
              <div className="status-message error">{teamsError}</div>
            ) : favouriteTeams.length > 0 ? (
              <div className="teams-grid">
                {favouriteTeams.map((team) => (
                  <div className="team-card" key={team.id}>
                    <div className="team-card-top">
                      <div className="team-logo-large">
                        {team.badge ? (
                          <img src={team.badge} alt={`${team.name} badge`} />
                        ) : (
                          team.shortName
                        )}
                      </div>

                      <span className="live-badge">Following</span>
                    </div>

                    <div className="team-card-info">
                      <h3>{team.name}</h3>
                      <p>{team.league}</p>
                      <span>{team.sport}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="status-message">
                You are not following any teams yet. Visit the Teams page to
                follow your favourites.
              </div>
            )}
          </section>

          <section className="sports-section">
            <div className="section-heading">
              <div>
                <h2>Live Now</h2>
                <p>Games currently in progress</p>
              </div>

              <span className="live-count">{liveGames.length} LIVE</span>
            </div>

            {liveGames.length > 0 ? (
              <div className="games-grid">
                {liveGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="status-message">No live games right now.</div>
            )}
          </section>

          <section className="sports-section">
            <div className="section-heading">
              <div>
                <h2>Upcoming</h2>
                <p>Don't miss the next game</p>
              </div>

              <span>{upcomingGames.length} games</span>
            </div>

            {upcomingGames.length > 0 ? (
              <div className="games-grid">
                {upcomingGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="status-message">No upcoming games found.</div>
            )}
          </section>

          <section className="sports-section">
            <div className="section-heading">
              <div>
                <h2>Recent Results</h2>
                <p>Latest completed games</p>
              </div>

              <span>{finishedGames.length} games</span>
            </div>

            {finishedGames.length > 0 ? (
              <div className="games-grid">
                {finishedGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="status-message">No recent results found.</div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default Home;
