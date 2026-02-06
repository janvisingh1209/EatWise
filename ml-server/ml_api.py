# ml-server/ml_api.py

from flask import Flask, request, jsonify
import joblib
import numpy as np

# -------------------------
# Initialize Flask App
# -------------------------
app = Flask(__name__)

# -------------------------
# Load Model & Encoders
# -------------------------
try:
    model = joblib.load("diet_model.pkl")
    le_label = joblib.load("le_label.pkl")
    le_disease = joblib.load("le_disease.pkl")
    data = joblib.load("dataset.pkl")
    print("✅ Model and encoders loaded successfully!")
except Exception as e:
    print("❌ Error loading model or encoders:", str(e))


# -------------------------
# Test Route
# -------------------------
@app.route("/", methods=["GET"])
def home():
    return "🚀 ML Model API is running!"


# -------------------------
# Predict Route
# -------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        input_data = request.get_json()
        print("📩 Received data:", input_data)

        # Validate input
        if not input_data:
            return jsonify({"error": "No data provided"}), 400

        age = input_data.get("age")
        disease_name = input_data.get("disease")
        preference = input_data.get("preference")

        if not all([age, disease_name, preference]):
            return jsonify({"error": "Missing fields in request"}), 400

        # Check if disease exists in encoder classes
        if disease_name not in le_disease.classes_:
            raise ValueError(f"Disease '{disease_name}' not found in training data")

        # Encode disease
        disease_enc = le_disease.transform([disease_name])[0]
        foods = data["Food"].unique()
        results = []

        # Loop through each food item and predict
        for food in foods:
            row = data[data["Food"] == food].iloc[0]
            features = [
                row["GI"], row["Sugar_g"], row["Iron_mg"], row["Sodium_mg"],
                row["Cholesterol_mg"], row["Fiber_g"], row["Fat_g"],
                row["Protein_g"], row["Calories"], disease_enc
            ]
            pred = model.predict([features])[0]
            label = le_label.inverse_transform([pred])[0]
            results.append((food, label, row["Type"]))

        # Separate recommended and avoid foods
        recommended = [(f, c) for f, l, c in results if l == "Recommended"]
        avoid = [(f, c) for f, l, c in results if l == "Avoid"]

        # Apply preference filter
        if preference.lower() == "vegetarian":
            recommended = [f for f, c in recommended if c.lower() == "veg"]
            avoid = [f for f, c in avoid if c.lower() == "veg"]
        elif preference.lower() == "non-vegetarian":
            recommended = [f for f, c in recommended if c.lower() == "non-veg"]
            avoid = [f for f, c in avoid if c.lower() == "non-veg"]
        else:
            recommended = [f for f, c in recommended]
            avoid = [f for f, c in avoid]

        # Return response
        return jsonify({
            "recommended": recommended[:10],
            "avoid": avoid[:10]
        })

    except Exception as e:
        print("❌ Error in /predict:", str(e))  # Log in console
        return jsonify({"error": str(e)}), 500


# -------------------------
# Run the App
# -------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000)
