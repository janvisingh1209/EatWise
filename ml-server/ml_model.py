import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report

# ====== STEP 1: Load dataset ======

data = pd.read_csv("final_food_disease_dataset.csv")

# ====== STEP 2: Encode labels ======

le_label = LabelEncoder()
data["Label"] = le_label.fit_transform(data["Label"])
# 0 = Avoid, 1 = Recommended

le_disease = LabelEncoder()
data["Disease"] = le_disease.fit_transform(data["Disease"])

# ====== STEP 3: Features ======

features = [
    "GI",
    "Sugar_g",
    "Iron_mg",
    "Sodium_mg",
    "Cholesterol_mg",
    "Fiber_g",
    "Fat_g",
    "Protein_g",
    "Calories",
    "Disease"
]

X = data[features]
y = data["Label"]

# ====== STEP 4: Split dataset ======

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=50
)

# ====== STEP 5: Train XGBoost Model ======

xgb = XGBClassifier(
    eval_metric="logloss"
)

xgb.fit(X_train, y_train)

# ====== STEP 6: Evaluate ======

y_pred_xgb = xgb.predict(X_test)

print(
    "XGBoost Accuracy:",
    accuracy_score(y_test, y_pred_xgb)
)

print(
    classification_report(
        y_test,
        y_pred_xgb,
        target_names=le_label.classes_
    )
)

# ====== STEP 7: Save model and encoders ======

joblib.dump(xgb, "diet_model.pkl")
joblib.dump(le_label, "le_label.pkl")
joblib.dump(le_disease, "le_disease.pkl")
joblib.dump(data, "dataset.pkl")

print("Model and encoders saved successfully!")
