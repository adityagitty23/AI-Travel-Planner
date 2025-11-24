import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AIPlanForm from "./pages/AIPlanForm";
import AIPlanResult from "./pages/AIPlanResult";
import ExpenseSplitter from "./pages/ExpenseSplitter";
import ExpenseResult from "./pages/ExpenseResult";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Travel Plan */}
        <Route path="/travel" element={<AIPlanForm />} />
        <Route path="/travel/result" element={<AIPlanResult />} />

        {/* Expense Splitter */}
        <Route path="/expenses" element={<ExpenseSplitter />} />
        <Route path="/expenses/result" element={<ExpenseResult />} />
      </Routes>
    </BrowserRouter>
  );
}
