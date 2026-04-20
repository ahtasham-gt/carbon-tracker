import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <h1>🌱 Track Your Carbon Footprint</h1>

      <p>
        Understand how your daily travel impacts the environment and take steps
        toward a greener future.
      </p>

      <Link to="/tracker">
        <button>Start Tracking 🚀</button>
      </Link>
    </div>
  );
}

export default Home;