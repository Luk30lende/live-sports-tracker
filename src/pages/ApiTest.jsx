import { useEffect, useState } from "react";
import { searchTeam } from "../api/sportsApi";

function ApiTest() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    searchTeam("Arsenal")
      .then((data) => {
        setTeam(data.teams?.[0] || null);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading team...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!team) {
    return <p>Team not found.</p>;
  }

  return (
    <main className="page-container">
      <h1>{team.strTeam}</h1>

      <p>{team.strLeague}</p>

      <p>{team.strStadium}</p>
    </main>
  );
}

export default ApiTest;
