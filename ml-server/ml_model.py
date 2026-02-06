# ml-server/ml_model.py
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report
from flask_cors import CORS
CORS(app)

# ====== STEP 1: Load dataset ======
data = pd.read_csv("final_food_disease_dataset.csv")

# Encode labels
le_label = LabelEncoder()
data["Label"] = le_label.fit_transform(data["Label"])  # 0=Avoid, 1=Recommended

le_disease = LabelEncoder()
data["Disease"] = le_disease.fit_transform(data["Disease"])

# Features
features = ["GI","Sugar_g","Iron_mg","Sodium_mg","Cholesterol_mg","Fiber_g",
            "Fat_g","Protein_g","Calories","Disease"]

X = data[features]
y = data["Label"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=50)

# ====== Train Model ======
xgb = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
xgb.fit(X_train, y_train)
y_pred_xgb = xgb.predict(X_test)

print("✅ XGBoost Accuracy:", accuracy_score(y_test, y_pred_xgb))
print(classification_report(y_test, y_pred_xgb, target_names=le_label.classes_))

# Save trained model + encoders + dataset
joblib.dump(xgb, "diet_model.pkl")
joblib.dump(le_label, "le_label.pkl")
joblib.dump(le_disease, "le_disease.pkl")
joblib.dump(data, "dataset.pkl")

print("🎯 Model and encoders saved successfully!")
