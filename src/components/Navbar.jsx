import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/" className="logo">
        Sports Tracker
      </Link>

      <div>
        <Link to="/">Home</Link>
        <Link to="/scores">Scores</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/standings">Standings</Link>
      </div>
    </nav>
  );
}

export default Navbar;
