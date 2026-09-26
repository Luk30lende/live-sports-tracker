import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlayerCard from "../components/PlayerCard";
import PlayerDetails from "../components/PlayerDetails";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";

import {
  getLeagueTeams,
  getTeamPlayers,
  getPlayer,
  getPlayerStats,
  searchPlayer,
} from "../api/sportsApi";

import {
  normalizeTeam,
  normalizePlayer,
  normalizePlayerStats,
} from "../api/normalizers";

function Players() {
  const { playerId } = useParams();

  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [players, setPlayers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

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

        if (!playerId) {
          const arsenal = apiTeams.find((team) => team.name === "Arsenal");

          if (arsenal) {
            setSelectedTeamId(arsenal.id);
          }
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

  const handlePlayerSearch = () => {
    const query = searchTerm.trim();

    if (!query) {
      setSearchResults([]);
      setSearchError("");
      setHasSearched(false);
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setHasSearched(true);

    searchPlayer(query)
      .then((data) => {
        const apiPlayers = (data.player || []).map(normalizePlayer);

        setSearchResults(apiPlayers);
      })
      .catch((error) => {
        setSearchError(error.message);
        setSearchResults([]);
      })
      .finally(() => {
        setSearchLoading(false);
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

  const openPlayerFromUrl = (id) => {
    if (!id) {
      return;
    }

    getPlayer(id)
      .then((data) => {
        const playerResult = data.players?.[0];

        if (!playerResult) {
          throw new Error("Player not found.");
        }

        const player = normalizePlayer(playerResult);

        loadPlayerStats(player);
      })
      .catch((error) => {
        setStatsError(error.message);
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

  useEffect(() => {
    openPlayerFromUrl(playerId);
  }, [playerId]);

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

          <section className="player-search">
            <div className="player-selector-header">
              <div>
                <p className="eyebrow">SEARCH</p>

                <h2>Find a Player</h2>

                <p>Search for a player by name.</p>
              </div>
            </div>

            <div className="player-search-controls">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handlePlayerSearch();
                  }
                }}
                placeholder="Search for a player..."
                aria-label="Search for a player"
              />

              <button
                type="button"
                onClick={handlePlayerSearch}
                disabled={searchLoading}
              >
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </section>

          {hasSearched && (
            <section className="players-list">
              <div className="players-list-header">
                <div>
                  <h2>Search Results</h2>

                  <p>Players matching your search</p>
                </div>

                {!searchLoading && !searchError && (
                  <span>
                    {searchResults.length}{" "}
                    {searchResults.length === 1 ? "player" : "players"}
                  </span>
                )}
              </div>

              {searchError && (
                <ErrorMessage
                  message={searchError}
                  onRetry={handlePlayerSearch}
                />
              )}

              {searchLoading && (
                <LoadingMessage message="Searching players..." />
              )}

              {!searchLoading && !searchError && searchResults.length > 0 && (
                <div className="players-grid">
                  {searchResults.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      onSelect={handlePlayerSelect}
                    />
                  ))}
                </div>
              )}

              {!searchLoading && !searchError && searchResults.length === 0 && (
                <div className="status-message players-empty-state">
                  <div className="empty-state-icon" aria-hidden="true">
                    —
                  </div>

                  <h3>No players found</h3>

                  <p>No players matched "{searchTerm.trim()}".</p>
                </div>
              )}
            </section>
          )}

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
              <div className="status-message players-empty-state">
                <div className="empty-state-icon" aria-hidden="true">
                  —
                </div>

                <h3>No players found</h3>

                <p>
                  There is currently no squad information available for{" "}
                  {selectedTeam.name}.
                </p>
              </div>
            )}
        </>
      )}
    </main>
  );
}

export default Players;
