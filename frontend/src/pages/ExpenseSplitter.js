import React, { useState } from "react";
import "./ExpenseSplitter.css";
import Lottie from "lottie-react";
import loaderAnimation from "./loader.json";

export default function ExpenseSplitter() {
  const [people, setPeople] = useState(1);
  const [expenses, setExpenses] = useState("");
  const [result, setResult] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const formatMoney = (value) =>
    value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

  function splitExpenses() {
    if (clicked) return;

    if (!expenses.trim()) {
      alert("Please enter expenses.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const expensesArray = expenses
        .split(",")
        .map((e) => parseFloat(e.trim()))
        .filter((v) => !isNaN(v));

      const grandTotal = expensesArray.reduce((s, v) => s + v, 0);
      const perPerson = grandTotal / people;

      setResult({
        expenses: expensesArray,
        grandTotal,
        perPerson,
      });

      setClicked(true);
      setLoading(false);
    }, 1500);
  }

  function handleReset() {
    setPeople(1);
    setExpenses("");
    setClicked(false);
    setResult(null);
  }

  return (
    <div className={`expense-container ${darkMode ? "dark" : ""}`}>
      <div className="top-bar">
       

        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {loading ? (
        <div className="loader-box">
          <Lottie animationData={loaderAnimation} loop={true} />
          <p>Calculating...</p>
        </div>
      ) : (
        <div className="expense-card">
           <h1 className="expense-title">💰 Expense Splitter</h1>
          <label>Number of People</label>
          <input
            type="number"
            value={people}
            min="1"
            onChange={(e) => {
              setPeople(parseInt(e.target.value));
              setClicked(false);
              setResult(null);
            }}
          />

          <label>Enter Expenses (comma separated)</label>
          <input
            type="text"
            placeholder="Example: 120, 450, 90"
            value={expenses}
            onChange={(e) => {
              setExpenses(e.target.value);
              setClicked(false);
              setResult(null);
            }}
          />

          <button onClick={splitExpenses} disabled={clicked}>
            {clicked ? "Calculated ✔" : "Split Expenses"}
          </button>
        </div>
      )}

      {result && !loading && (
        <div className="result-card">
          <h2>Result</h2>

          <h3>Entered Expenses</h3>
          <ul>
            {result.expenses.map((amt, idx) => (
              <li key={idx}>
                Expense {idx + 1}: {formatMoney(amt)}
              </li>
            ))}
          </ul>

          <h3>Grand Total</h3>
          <p className="highlight">{formatMoney(result.grandTotal)}</p>

          <h3>Per Person</h3>
          <p className="highlight">{formatMoney(result.perPerson)}</p>

          <button className="reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
