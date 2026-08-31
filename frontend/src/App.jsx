import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route,  Navigate, useNavigate, useLocation } from "react-router-dom";
import "./App.css";

// ---------------------------
//  Form Page Component
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
        age,
        disease,
        preference: foodPref,
      });

      setMessage("✅ " + response.data.message);
      console.log("Response from backend:", response.data);

      // ✅ Redirect to results page with ML results
      if (response.data.mlResult) {
        navigate("/result", { state: { mlResult: response.data.mlResult } });
      } else {
        setError("No ML result received from backend.");
      }
    } catch (error) {
      console.error("❌ Error sending data:", error);
      setMessage("❌ Failed to connect to backend. Check console.");
    }
  };

  return (
    <div className="background-container">
      <div className="overlay"></div>
      <div className="content-box">
        <h1 className="title">🥗 EatWise</h1>
        <p className="subtitle">Your personalized diet companion</p>

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
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
          </select>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="message">{message}</p>}

          <button type="submit">Get Diet Plan</button>
        </form>
      </div>
    </div>
  );
};

// ---------------------------
//  Result Page Component
// ---------------------------
const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mlResult = location.state?.mlResult;

  if (!mlResult) {
    return (
      <div className="background-container">
        <div className="overlay"></div>
        <div className="content-box">
          <h2>No results available 😕</h2>
          <button onClick={() => navigate("/")}>🔙 Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="background-container">
      <div className="overlay"></div>
      <div className="content-box">
        <h1 className="title">🍏 Recommended Foods</h1>
        {mlResult.recommended && mlResult.recommended.length > 0 ? (
          <ul>
            {mlResult.recommended.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        ) : (
          <p>No recommended foods found.</p>
        )}

        <h1 className="title" style={{ color: "#e53935" }}>
          ❌ Foods to Avoid
        </h1>
        {mlResult.avoid && mlResult.avoid.length > 0 ? (
          <ul>
            {mlResult.avoid.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        ) : (
          <p>No foods to avoid found.</p>
        )}

        <button onClick={() => navigate("/")}>🔙 Back to Form</button>
      </div>
    </div>
  );
};

// ---------------------------
//  Main App Component with Router
// ---------------------------
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EatWiseForm />} />
        <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
