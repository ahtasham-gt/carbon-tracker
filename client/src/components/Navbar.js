import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🌍 CarbonTracker</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/tracker">Calculator</Link>
      </div>
    </nav>
  );
}

export default Navbar;