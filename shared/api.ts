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
