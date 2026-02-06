import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const FormPage = () => {
  const [age, setAge] = useState("");
  const [disease, setDisease] = useState("");
  const [foodPref, setFoodPref] = useState("Vegetarian");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (age < 0) {
      setError("Age cannot be negative!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        age,
        disease,
        preference: foodPref,
      });

      // ✅ Redirect to result page with ML result data
      navigate("/results", { state: { mlResult: response.data.mlResult } });
    } catch (err) {
      console.error("❌ Error sending data:", err);
      setError("Failed to connect to backend or ML API.");
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

          <button type="submit">Get Diet Plan</button>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
