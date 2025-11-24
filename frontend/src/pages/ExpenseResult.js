import { useLocation, useNavigate } from "react-router-dom";

export default function ExpenseResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Expense Report</h1>

      <div className="p-4 bg-gray-100 rounded-xl whitespace-pre-wrap">
        {state?.result || "No data found"}
      </div>

      <button
        onClick={() => navigate("/expenses")}
        className="p-3 bg-green-600 text-white rounded-xl w-full"
      >
        Calculate Again
      </button>
    </div>
  );
}
