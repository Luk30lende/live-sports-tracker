import { useEffect, useState } from "react";
import PlayerCard from "../components/PlayerCard";
import PlayerDetails from "../components/PlayerDetails";

import {
  getLeagueTeams,
  getTeamPlayers,
  getPlayerStats,
} from "../api/sportsApi";

import {
  normalizeTeam,
  normalizePlayer,
  normalizePlayerStats,
} from "../api/normalizers";

function Players() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [players, setPlayers] = useState([]);

  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [playerStats, setPlayerStats] = useState([]);

  const [loadingStats, setLoadingStats] = useState(false);

  const [statsError, setStatsError] = useState("");

  const [error, setError] = useState("");

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setPlayerStats([]);
    setStatsError("");
    setLoadingStats(true);

    getPlayerStats(player.id)
      .then((data) => {
        const apiStats = (data.playerstats || []).map(normalizePlayerStats);

        setPlayerStats(apiStats);
      })
      .catch((error) => {
        setStatsError(error.message);
      })
      .finally(() => {
        setLoadingStats(false);
      });
  };

  useEffect(() => {
    setLoadingTeams(true);
    setError("");

    getLeagueTeams("English Premier League")
      .then((data) => {
        const apiTeams = (data.teams || []).map(normalizeTeam);

        setTeams(apiTeams);

        const arsenal = apiTeams.find((team) => team.name === "Arsenal");

        if (arsenal) {
          setSelectedTeamId(arsenal.id);
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoadingTeams(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedTeamId) {
      return;
    }

    setLoadingPlayers(true);
    setError("");

    getTeamPlayers(selectedTeamId)
      .then((data) => {
        const apiPlayers = (data.player || []).map(normalizePlayer);

        setPlayers(apiPlayers);
      })
      .catch((error) => {
        setError(error.message);
        setPlayers([]);
      })
      .finally(() => {
        setLoadingPlayers(false);
      });
  }, [selectedTeamId]);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);

  return (
    <main className="players-page">
      <section className="players-header">
        <div>
          <p className="eyebrow">PLAYERS</p>

          <h1>Players</h1>

          <p>Explore players and squad information from the Premier League.</p>
        </div>

        {!loadingPlayers && !error && (
          <div className="player-count">{players.length} Players</div>
        )}
      </section>

      <section className="player-team-selector">
        <label htmlFor="team">Select Team</label>

        {loadingTeams ? (
          <p>Loading teams...</p>
        ) : (
          <select
            id="team"
            value={selectedTeamId}
            onChange={(event) => setSelectedTeamId(event.target.value)}
          >
            <option value="">Select a team</option>

            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        )}
      </section>

      {error && <div className="status-message error">{error}</div>}

      {loadingPlayers && (
        <div className="status-message">Loading players...</div>
      )}

      {selectedPlayer ? (
        <PlayerDetails
          player={selectedPlayer}
          stats={playerStats}
          loading={loadingStats}
          error={statsError}
          onClose={() => setSelectedPlayer(null)}
        />
      ) : (
        <>
          {!loadingPlayers && !error && selectedTeam && players.length > 0 && (
            <section className="players-list">
              <div className="players-list-header">
                <div>
                  <h2>{selectedTeam.name}</h2>

                  <p>Current squad information</p>
                </div>

                <span>{players.length} players</span>
              </div>

              <div className="players-grid">
                {players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onSelect={handlePlayerSelect}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {!loadingPlayers && !error && selectedTeam && players.length === 0 && (
        <div className="status-message">No players found for this team.</div>
      )}
    </main>
  );
}

export default Players;
