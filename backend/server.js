// server.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios"); // ✅ to call Flask API

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Temporary storage
let formDataList = [];

// --- POST API: Receive data from frontend and forward to Flask ---
app.post("/api/register", async (req, res) => {
  const { age, disease, preference } = req.body;

  if (!age || !disease || !preference) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (isNaN(age) || age <= 0) {
    return res.status(400).json({ error: "Age must be a positive number." });
  }

  const newEntry = { id: formDataList.length + 1, age, disease, preference };
  formDataList.push(newEntry);

  console.log("✅ Data received from frontend:", newEntry);

  try {
    // 🔗 Send data to ML API (configurable via ML_SERVER_URL)
    const mlServerBase = process.env.ML_SERVER_URL || 'http://127.0.0.1:6000';
    const flaskResponse = await axios.post(`${mlServerBase.replace(/\/+$/, '')}/predict`, {
      age,
      disease,
      preference,
    },
  {
  timeout: 60000, // 60 seconds, enough to survive a cold start
});

    console.log("✅ Response from Flask ML:", flaskResponse.data);

    res.status(201).json({
      message: "Prediction successful!",
      userData: newEntry,
      mlResult: flaskResponse.data, // send ML results to frontend
    });
  } catch (err) {
    console.error("❌ Error connecting to Flask ML API:", err.message);
    res.status(500).json({
      error: "Failed to connect to ML model. Please check if Flask is running.",
    });
  }
});

// --- GET API ---
app.get("/api/data", (req, res) => {
  res.status(200).json({ data: formDataList });
});

app.get("/", (req, res) => {
  res.send("🚀 EatWise Backend is Running!");
});

app.listen(PORT, () => {
  console.log(`🚀 EatWise backend running on http://localhost:${PORT}`);
});
