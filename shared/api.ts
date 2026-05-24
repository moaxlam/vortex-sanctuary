/**
 * Shared types between client and server
 */

export interface DemoResponse {
  message: string;
}
export interface PingResponse {
  message: string;
}

// Chat
export interface ChatRequest {
  prompt: string;
  system?: string;
}
export interface ChatResponse {
  model: string;
  text: string;
}

// Weather
export interface WeatherForecast {
  current?: {
    temperature_2m?: number;
    precipitation?: number;
    windspeed_10m?: number;
    time?: string;
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    precipitation?: number[];
  };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
    sunrise?: string[];
    sunset?: string[];
  };
}

export interface ClimateMonthly {
  time?: string[];
  temperature_2m_mean?: number[];
  precipitation_sum?: number[];
}

// AgriSure ML (PMFBY coverage model)
export interface AgriSurePredictRequest {
  cropname?: string;
  categoryname?: string;
  insurancecompany_insurancecompanyname?: string;
  sssyname_statename?: string;
  sssyname_seasonname?: string;
  sssyname_schemename?: string;
  /** District name, e.g. North Goa (maps to level3name in PMFBY data) */
  district?: string;
  level3name?: string;
  /** Season, e.g. Kharif (maps to sssyname_seasonname) */
  season?: string;
  /** Optional reference amount to match PMFBY records; model still predicts sum insured */
  suminsured?: number | string;
  reference_suminsured?: number | string;
  level3?: string;
  [key: string]: string | number | undefined;
}

export type AgriSureTopFeature = [string, number];

export interface AgriSurePredictResponse {
  prediction: number;
  top_features: AgriSureTopFeature[];
  explanation: string;
}
