import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

const ResultPage = () => {
  const navigate = useNavigate();

const storedResult = sessionStorage.getItem("mlResult");

const mlResult = storedResult
  ? JSON.parse(storedResult)
  : null;
  if (!mlResult) {
    return (
      <div className="background-container">
        <div className="content-box">
          <h2>No results found 😕</h2>
          <button onClick={() => navigate("/")}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="background-container">
      <div className="content-box">
        <h1 className="title">🍏 Recommended Foods</h1>
        <ul>
          {mlResult.recommended && mlResult.recommended.length > 0 ? (
            mlResult.recommended.map((food, index) => (
              <li key={index}>{food}</li>
            ))
          ) : (
            <p>No recommended foods found.</p>
          )}
        </ul>

        <h1 className="title" style={{ color: "#e53935" }}>
          ❌ Foods to Avoid
        </h1>
        <ul>
          {mlResult.avoid && mlResult.avoid.length > 0 ? (
            mlResult.avoid.map((food, index) => <li key={index}>{food}</li>)
          ) : (
            <p>No avoid foods found.</p>
          )}
        </ul>

        <button onClick={() => navigate("/")}>🔙 Back to Form</button>
      </div>
    </div>
  );
};

export default ResultPage;
