import React, { useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import ResultPage from "./pages/ResultPage";
import "./App.css";

// ---------------------------
// Form Page Component
// ---------------------------
const EatWiseForm = () => {
  const [age, setAge] = useState("");
  const [disease, setDisease] = useState("");
  const [foodPref, setFoodPref] = useState("Vegetarian");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (age < 0) {
      setError("Age cannot be negative!");
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        {
          age,
          disease,
          preference: foodPref,
        }
      );

      setMessage("✅ " + response.data.message);

      console.log("Response from backend:", response.data);

      // Save ML result so it survives page refresh
      if (response.data.mlResult) {
        sessionStorage.setItem(
          "mlResult",
          JSON.stringify(response.data.mlResult)
        );

        navigate("/result");
      } else {
        setError("No ML result received from backend.");
      }
    } catch (error) {
      console.error("❌ Error sending data:", error);

      setMessage(
        "❌ Failed to connect to backend. Check console."
      );
    }
  };

  return (
    <div className="background-container">
      <div className="overlay"></div>

      <div className="content-box">
        <h1 className="title">🥗 EatWise</h1>

        <p className="subtitle">
          Your personalized diet companion
        </p>

        <form onSubmit={handleSubmit} className="form">

          <label>Age:</label>

          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            required
            min="0"
          />

          <label>Disease / Condition:</label>

          <input
            type="text"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            placeholder="e.g. Diabetes, Hypertension"
            required
          />

          <label>Food Preference:</label>

          <select
            value={foodPref}
            onChange={(e) => setFoodPref(e.target.value)}
            required
          >
            <option value="Vegetarian">
              Vegetarian
            </option>

            <option value="Non-Vegetarian">
              Non-Vegetarian
            </option>
          </select>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {message && (
            <p className="message">
              {message}
            </p>
          )}

          <button type="submit">
            Get Diet Plan
          </button>

        </form>
      </div>
    </div>
  );
};

// ---------------------------
// Main App Component
// ---------------------------
const App = () => {
  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={<EatWiseForm />}
        />

        <Route
          path="/result"
          element={<ResultPage />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </Router>
  );
};

export default App;