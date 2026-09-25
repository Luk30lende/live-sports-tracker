import { useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import { getLeagueTeams, searchTeam } from "../api/sportsApi";
import { normalizeTeam } from "../api/normalizers";
import LoadingMessage from "../components/LoadingMessage";
import ErrorMessage from "../components/ErrorMessage";
import { useFavouriteTeamsContext } from "../context/FavouriteTeamsContext";

function Teams() {
  const [sportFilter, setSportFilter] = useState("ALL");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const { favouriteTeams, toggleFavourite } = useFavouriteTeamsContext();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeams = () => {
    setLoading(true);
    setError("");

    getLeagueTeams("English Premier League")
      .then((data) => {
        const apiTeams = (data.teams || []).map(normalizeTeam);

        setTeams(apiTeams);
      })
      .catch((error) => {
        setError(error.message);
        setTeams([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = () => {
    const query = searchTerm.trim();

    if (!query) {
      setSearchResults([]);
      setSearchError("");
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    searchTeam(query)
      .then((data) => {
        const results = (data.teams || []).map(normalizeTeam);

        setSearchResults(results);
      })
      .catch((error) => {
        setSearchError(error.message);
        setSearchResults([]);
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const filteredTeams =
    sportFilter === "ALL"
      ? teams
      : teams.filter((team) => team.sport === sportFilter);

  return (
    <main className="teams-page">
      <section className="teams-header">
        <div>
          <p className="eyebrow">TEAMS</p>

          <h1>Find Your Teams</h1>

          <p>
            Follow your favourite teams and keep up with their latest games.
          </p>
        </div>

        <div className="favourite-count">
          <strong>{favouriteTeams.length}</strong>
          <span>
            {favouriteTeams.length === 1 ? "Team Following" : "Teams Following"}
          </span>
        </div>
      </section>

      <div className="team-filters">
        <div className="team-search">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search for a team..."
            aria-label="Search for a team"
          />

          <button type="button" onClick={handleSearch} disabled={searchLoading}>
            {searchLoading ? "Searching..." : "Search"}
          </button>
        </div>

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
      </div>

      {loading && <LoadingMessage message="Loading teams..." />}

      {error && <ErrorMessage message={error} onRetry={loadTeams} />}

      <section className="teams-list">
        {searchTerm.trim() && (
          <div className="teams-search-results">
            <div className="teams-list-header">
              <h2>Search Results</h2>

              <span>{searchResults.length} teams</span>
            </div>

            {searchError && (
              <ErrorMessage message={searchError} onRetry={handleSearch} />
            )}

            {!searchLoading && !searchError && searchResults.length > 0 && (
              <div className="teams-grid">
                {searchResults.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    isFavourite={favouriteTeams.includes(team.id)}
                    onToggleFavourite={toggleFavourite}
                  />
                ))}
              </div>
            )}

            {!searchLoading && !searchError && searchResults.length === 0 && (
              <div className="status-message teams-empty-state">
                <div className="empty-state-icon" aria-hidden="true">
                  —
                </div>

                <h3>No teams found</h3>

                <p>No teams matched your search.</p>
              </div>
            )}
          </div>
        )}

        {!searchTerm.trim() && (
          <>
            <div className="teams-list-header">
              <h2>Teams</h2>

              <span>{filteredTeams.length} teams</span>
            </div>

            {!loading && !error && filteredTeams.length > 0 && (
              <div className="teams-grid">
                {filteredTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    isFavourite={favouriteTeams.includes(team.id)}
                    onToggleFavourite={toggleFavourite}
                  />
                ))}
              </div>
            )}

            {!loading && !error && filteredTeams.length === 0 && (
              <div className="status-message teams-empty-state">
                <div className="empty-state-icon" aria-hidden="true">
                  —
                </div>

                <h3>No teams found</h3>

                <p>
                  There are currently no teams available for this selection.
                </p>

                {sportFilter !== "ALL" && (
                  <button
                    type="button"
                    className="empty-state-action empty-state-button"
                    onClick={() => setSportFilter("ALL")}
                  >
                    View All Teams
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default Teams;
