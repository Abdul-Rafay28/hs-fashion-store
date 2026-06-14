import axios from "axios";

const isLocalLikeHostname = (hostname) =>
  ["localhost", "127.0.0.1"].includes(hostname) ||
  /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
  /^192\.168\.\d+\.\d+$/.test(hostname) ||
  /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname);

const getApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof window === "undefined") {
    return configuredBaseUrl || "http://localhost:5000/api";
  }

  if (!configuredBaseUrl) {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }

  try {
    const configuredUrl = new URL(configuredBaseUrl);
    const currentHostname = window.location.hostname;
    const isConfiguredLocal = isLocalLikeHostname(configuredUrl.hostname);
    const isCurrentLocal = isLocalLikeHostname(currentHostname);

    if (import.meta.env.DEV && isConfiguredLocal && isCurrentLocal) {
      configuredUrl.hostname = currentHostname;
      return configuredUrl.toString().replace(/\/$/, "");
    }
  } catch (error) {
    return configuredBaseUrl;
  }

  return configuredBaseUrl;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Request failed.";

    return Promise.reject(new Error(message));
  },
);

export default api;
