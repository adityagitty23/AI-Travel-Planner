// src/pages/AIPlanResult.js
import { useLocation, useNavigate } from "react-router-dom";
import "./AIPlanResult.css";
import { motion } from "framer-motion";

export default function AIPlanResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const plan = state?.plan;

  if (!plan) {
    return (
      <div className="result-container">
        <h1 className="result-title">No Plan Found</h1>
        <button className="result-btn" onClick={() => navigate("/travel")}>
          Generate New Plan
        </button>
      </div>
    );
  }

  const formatMoney = (value) => {
    if (typeof value !== "number") return value;
    return value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  return (
    <motion.div
      className="result-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="result-title">Your AI Travel Plan ✈️</h1>

      {/* Budget Section */}
      {plan.budget_breakdown && (
        <motion.section
          className="section card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="section-title">💰 Budget Breakdown</h2>

          <div className="budget-grid">
            {Object.entries(plan.budget_breakdown).map(([key, value]) => (
              <div key={key} className="budget-box">
                <h4 className="budget-key">{key}</h4>
                {typeof value === "object" ? (
                  <>
                    <p>Per Day: {formatMoney(value.per_day)}</p>
                    <p>Total: {formatMoney(value.total)}</p>
                  </>
                ) : (
                  <p>{formatMoney(value)}</p>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Itinerary */}
      <motion.section className="section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="section-title">📍 Itinerary</h2>

        {Array.isArray(plan.itinerary) && plan.itinerary.length > 0 ? (
          <div className="timeline">
            {plan.itinerary.map((day, idx) => (
              <motion.div
                key={idx}
                className="timeline-item"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.15 }}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>Day {day.day ?? idx + 1}: {day.title || "No Title"}</h3>

                  <p><strong>Places:</strong> {day.places?.join(", ") || "Not provided"}</p>
                  <p><strong>Food:</strong> {day.food?.join(", ") || "Not provided"}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p>No itinerary data found.</p>
        )}
      </motion.section>

      <button className="result-btn" onClick={() => navigate("/travel")}>
        🔄 Generate New Plan
      </button>
    </motion.div>
  );
}
