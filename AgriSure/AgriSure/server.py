import json
from pathlib import Path

import lightgbm as lgb
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="AgriSure ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

policy_model = lgb.Booster(model_file=str(BASE_DIR / "policy_model.txt"))

with open(BASE_DIR / "policy_model_features.json", encoding="utf-8") as f:
    policy_meta = json.load(f)

features = policy_meta["features"]

df_original = pd.read_csv(BASE_DIR / "PMFBY coverage.csv")
df_original.columns = (
    df_original.columns.str.lower()
    .str.replace(r"[^\w]+", "_", regex=True)
    .str.replace("__", "_", regex=False)
    .str.strip("_")
)


def align(df: pd.DataFrame, feature_cols: list[str]) -> pd.DataFrame:
    df = df.copy()
    for col in feature_cols:
        if col not in df.columns:
            df[col] = np.nan
    df = df[feature_cols]

    cat_cols = policy_meta.get("categorical_features", [])
    for col in cat_cols:
        if col not in df.columns:
            continue
        training_cats = df_original[col].astype("category").cat.categories
        df[col] = pd.Categorical(df[col], categories=training_cats)

    return df


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(data: dict):
    base = df_original.iloc[[0]].copy()

    for key, value in data.items():
        if key in base.columns:
            base[key] = value

    X = align(base, features)
    pred = float(policy_model.predict(X, validate_features=False)[0])

    explainer = shap.TreeExplainer(policy_model)
    shap_vals = explainer.shap_values(X)[0]
    shap_dict = dict(zip(X.columns, shap_vals))

    top_features = sorted(
        shap_dict.items(),
        key=lambda x: abs(x[1]),
        reverse=True,
    )[:4]

    return {
        "prediction": round(pred, 2),
        "top_features": top_features,
    }
