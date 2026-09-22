import { useEffect, useState } from "react";

import PlayerCard from "../components/PlayerCard";
import PlayerDetails from "../components/PlayerDetails";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

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

  const [teamsError, setTeamsError] = useState("");
  const [playersError, setPlayersError] = useState("");

  const loadTeams = () => {
    setLoadingTeams(true);
    setTeamsError("");

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
        setTeamsError(error.message);
        setTeams([]);
      })
      .finally(() => {
        setLoadingTeams(false);
      });
  };

  const loadPlayers = (teamId) => {
    if (!teamId) {
      setPlayers([]);
      return;
    }

    setLoadingPlayers(true);
    setPlayersError("");

    getTeamPlayers(teamId)
      .then((data) => {
        const apiPlayers = (data.player || []).map(normalizePlayer);

        setPlayers(apiPlayers);
      })
      .catch((error) => {
        setPlayersError(error.message);
        setPlayers([]);
      })
      .finally(() => {
        setLoadingPlayers(false);
      });
  };

  const loadPlayerStats = (player) => {
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
        setPlayerStats([]);
      })
      .finally(() => {
        setLoadingStats(false);
      });
  };

  const handlePlayerSelect = (player) => {
    loadPlayerStats(player);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    loadPlayers(selectedTeamId);
  }, [selectedTeamId]);

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);

  return (
    <main className="players-page">
      {selectedPlayer ? (
        <PlayerDetails
          player={selectedPlayer}
          stats={playerStats}
          loading={loadingStats}
          error={statsError}
          onClose={() => setSelectedPlayer(null)}
          onRetry={() => loadPlayerStats(selectedPlayer)}
        />
      ) : (
        <>
          <section className="players-header">
            <div>
              <p className="eyebrow">PLAYERS</p>

              <h1>Players</h1>

              <p>
                Explore players and squad information from the Premier League.
              </p>
            </div>

            {!loadingPlayers && !playersError && selectedTeam && (
              <div className="player-count">{players.length} Players</div>
            )}
          </section>

          <section className="player-team-selector">
            <div className="player-selector-header">
              <div>
                <p className="eyebrow">SQUAD</p>

                <h2>Select a Team</h2>

                <p>
                  Choose a Premier League team to explore its current squad.
                </p>
              </div>
            </div>

            {loadingTeams ? (
              <LoadingMessage message="Loading teams..." />
            ) : (
              <div className="player-select-wrapper">
                <label htmlFor="team">Team</label>

                <select
                  id="team"
                  value={selectedTeamId}
                  onChange={(event) => setSelectedTeamId(event.target.value)}
                  disabled={teamsError}
                >
                  <option value="">Select a team</option>

                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {teamsError && (
              <ErrorMessage message={teamsError} onRetry={loadTeams} />
            )}
          </section>

          {playersError && (
            <ErrorMessage
              message={playersError}
              onRetry={() => loadPlayers(selectedTeamId)}
            />
          )}

          {loadingPlayers && <LoadingMessage message="Loading players..." />}

          {!loadingPlayers &&
            !playersError &&
            selectedTeam &&
            players.length > 0 && (
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

          {!loadingPlayers &&
            !playersError &&
            selectedTeam &&
            players.length === 0 && (
              <div className="status-message">
                No players found for this team.
              </div>
            )}
        </>
      )}
    </main>
  );
}

export default Players;
