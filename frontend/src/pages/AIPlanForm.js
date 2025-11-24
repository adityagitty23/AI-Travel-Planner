import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loaderAnimation from "./loader.json";
import "./AIPlanForm.css";

export default function AIPlanForm() {
  const [location, setLocation] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  async function generatePlan() {
    setLoading(true);

    // Auto switch Local ↔ Render server
    const API_BASE =
      window.location.hostname === "localhost"
        ? "http://127.0.0.1:5000"
        : "https://ai-travel-planner-82wx.onrender.com";

    try {
      const res = await fetch(`${API_BASE}/api/travel-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, days, budget, preferences }),
      });

      const data = await res.json();
      navigate("/travel/result", { state: { plan: data } });
    } catch (error) {
      console.error("ERROR generating plan:", error);
      alert("Failed to generate plan, try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`form-container ${darkMode ? "dark" : ""}`}>
      <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div className="home-card">
        <div className="top-bar">
          <h1>AI Travel Plan Generator</h1>
        </div>

        {loading ? (
          <div className="loader-box">
            <Lottie animationData={loaderAnimation} loop />
            <p>Generating Your Plan...</p>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter Travel Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              type="number"
              placeholder="Number of Days"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />

            <input
              type="text"
              placeholder="Total Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />

            <input
              type="text"
              placeholder="Preferences (Adventure, Food, Shopping...)"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
            />

            <button onClick={generatePlan} disabled={loading}>
              Generate Plan
            </button>
          </>
        )}
      </div>
    </div>
  );
}
