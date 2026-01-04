import Constants from "expo-constants";

const BACKEND_URL =
  Constants.manifest?.extra?.backendUrl || "http://localhost:3000";

export const API_BASE_URL = BACKEND_URL;
export const API_ENDPOINTS = {
  INVESTMENTS: `${API_BASE_URL}/api/investments`,
};
