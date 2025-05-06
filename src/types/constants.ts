const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_HTTPS = process.env.NEXT_PUBLIC_USE_HTTPS === "true";
export const API_BASE_URL = `${USE_HTTPS ? "https" : "http"}://${API_URL ?? "localhost:8080"}/api`;
export const WS_BASE_URL = `${USE_HTTPS ? "wss" : "ws":}//${API_URL}/ws`;
