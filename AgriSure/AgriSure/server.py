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


# UI / API aliases → CSV column names
FIELD_ALIASES = {
    "district": "level3name",
    "season": "sssyname_seasonname",
    "suminsured": "suminsured",
    "reference_suminsured": "suminsured",
}


def normalize_payload(data: dict) -> dict:
    normalized: dict = {}
    for key, value in data.items():
        if value is None or (isinstance(value, str) and not value.strip()):
            continue
        col = FIELD_ALIASES.get(key, key)
        normalized[col] = value
    return normalized


def select_base_row(data: dict) -> pd.DataFrame:
    """Pick a PMFBY row that best matches user inputs (district, season, etc.)."""
    criteria = normalize_payload(data)
    matched = df_original.copy()

    for col, value in criteria.items():
        if col not in matched.columns:
            continue
        if col == "suminsured":
            try:
                target = float(value)
                matched = matched[
                    (matched[col].astype(float) - target).abs() < 1.0
                ]
            except (TypeError, ValueError):
                continue
        else:
            matched = matched[
                matched[col].astype(str).str.lower() == str(value).lower()
            ]

    if matched.empty:
        return df_original.iloc[[0]].copy()
    return matched.iloc[[0]].copy()


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
    criteria = normalize_payload(data)
    base = select_base_row(data)

    for key, value in criteria.items():
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
