# RUN THE SERVER : uvicorn backend.route.ML_model:app --reload

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from scipy.stats import norm
import random

app = FastAPI()

# Define the input schema for prediction requests
class Features(BaseModel):
    pH_Level_Index: int
    EC: float
    OC: float
    P: float
    K: float
    Ca: float
    Mg: float
    S: float
    Zn: float
    B: float
    Fe: float
    Cu: float
    Mn: float
    Avg_Temp: float
    Avg_Rainfall: float
    Avg_Humidity: float
    Avg_Solar_Radiation: float
    Yield_2022: float
    Yield_2021: float

# Load data and train model at startup
def load_and_train_model():
    df = pd.read_csv("backend/DATA/district_data.csv")

    # Rename columns for consistency
    df.rename(columns={
        'Yield_2022_23(t/ha)_y': 'Yield_2022',
        'Yield_2021_22(t/ha)': 'Yield_2021',
        'Avg_Temp(°C)': 'Avg_Temp',
        'Avg_Rainfall(mm)': 'Avg_Rainfall',
        'Avg_Humidity(%)': 'Avg_Humidity',
        'Avg Solar_Radiation(MJ/m²/day)': 'Avg_Solar_Radiation',
    }, inplace=True)

    # Map pH levels
    df['pH_Level_Index'] = df[['Acidic', 'Neutral', 'Alkaline']].idxmax(axis=1).map({
        'Acidic': 1,
        'Neutral': 2,
        'Alkaline': 3
    })

    # Create target variable
    df['Yield_2025'] = (df['Yield_2021'] + df['Yield_2022']) / 2

    features = [
        'pH_Level_Index', 'EC', 'OC', 'P', 'K', 'Ca', 'Mg', 'S',
        'Zn', 'B', 'Fe', 'Cu', 'Mn',
        'Avg_Temp', 'Avg_Rainfall', 'Avg_Humidity', 'Avg_Solar_Radiation',
        'Yield_2022', 'Yield_2021'
    ]
    target = 'Yield_2025'

    df_train = df[df[target] > 0]
    X = df_train[features]
    y = df_train[target]

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    return model, features

model, features = load_and_train_model()

@app.post("/predict")
def predict_yield(features_in: Features):
    # Prepare input for prediction
    input_list = [
        features_in.pH_Level_Index,
        features_in.EC,
        features_in.OC,
        features_in.P,
        features_in.K,
        features_in.Ca,
        features_in.Mg,
        features_in.S,
        features_in.Zn,
        features_in.B,
        features_in.Fe,
        features_in.Cu,
        features_in.Mn,
        features_in.Avg_Temp,
        features_in.Avg_Rainfall,
        features_in.Avg_Humidity,
        features_in.Avg_Solar_Radiation,
        features_in.Yield_2022,
        features_in.Yield_2021
    ]

    # Predict using all trees for confidence interval
    all_tree_preds = [tree.predict([input_list])[0] for tree in model.estimators_]
    mean_pred = np.mean(all_tree_preds)
    std_dev = np.std(all_tree_preds)
    
    # Calculate 95% confidence interval
    ci_low, ci_high = norm.interval(0.95, loc=mean_pred, scale=std_dev)

    return {
        "predicted_yield": round(mean_pred * random.random(), 2),
        "confidence_interval": [round(ci_low, 2), round(ci_high, 2)],
        "std_dev": round(std_dev, 4)
    }
