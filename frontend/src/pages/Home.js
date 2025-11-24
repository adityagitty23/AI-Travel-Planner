import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "./Travel.json"; 
import "./Home.css";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`home-container ${darkMode ? "dark" : ""}`}>
      <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div className="home-card">
        <Lottie animationData={animationData} className="lottie-animation" />

        <h1 className="home-title">AI Travel Assistant 🌍</h1>
        <p className="home-subtext">
          Smart AI-powered travel planning & expense management
        </p>

        <div className="home-buttons">
          <Link to="/travel" className="home-btn primary-btn">✈️ AI Travel Plan</Link>
          <Link to="/expenses" className="home-btn secondary-btn">💰 Expense Splitter</Link>
        </div>
      </div>
    </div>
  );
}
