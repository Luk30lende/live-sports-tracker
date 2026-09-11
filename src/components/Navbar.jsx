import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        Sports Tracker
      </Link>

      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link
          to="/"
          className={isActive("/") ? "active" : ""}
          onClick={closeMenu}
        >
          Home
        </Link>

        <Link
          to="/scores"
          className={isActive("/scores") ? "active" : ""}
          onClick={closeMenu}
        >
          Scores
        </Link>

        <Link
          to="/teams"
          className={isActive("/teams") ? "active" : ""}
          onClick={closeMenu}
        >
          Teams
        </Link>

        <Link
          to="/standings"
          className={isActive("/standings") ? "active" : ""}
          onClick={closeMenu}
        >
          Standings
        </Link>

        <Link
          to="/players"
          className={isActive("/players") ? "active" : ""}
          onClick={closeMenu}
        >
          Players
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
