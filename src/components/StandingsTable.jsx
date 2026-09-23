import { Link } from "react-router-dom";

function StandingsTable({ teams }) {
  return (
    <div className="standings-table-wrapper">
      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>PL</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>Pts</th>
            <th>Form</th>
          </tr>
        </thead>

        <tbody>
          {teams.map((team) => (
            <tr key={team.position}>
              <td className="position">{team.position}</td>

              <td className="standing-team">
                <div className="standing-team-logo">
                  {team.badge && (
                    <img src={team.badge} alt={`${team.team} badge`} />
                  )}
                </div>

                <td>
                  <Link
                    to={`/teams/${team.id}`}
                    className="standings-team-link"
                  >
                    {team.team}
                  </Link>
                </td>
              </td>

              <td>{team.played}</td>
              <td>{team.won}</td>
              <td>{team.drawn}</td>
              <td>{team.lost}</td>

              <td className="points">{team.points}</td>

              <td>
                <div className="form">
                  {team.form.map((result, index) => (
                    <span
                      key={index}
                      className={`form-${result.toLowerCase()}`}
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StandingsTable;
