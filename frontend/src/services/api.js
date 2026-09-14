/** Shared API client for CyberRakshak. */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
const DEFAULT_TIMEOUT_MS = 15000;

export const getAuthToken = () => localStorage.getItem("authToken");
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async (path, options = {}) => {
  const controller = new AbortController();
  const timeoutMs = Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : DEFAULT_TIMEOUT_MS;
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const { timeoutMs: ignoredTimeoutMs, ...fetchOptions } = options;
  void ignoredTimeoutMs;
  const headers = {
    ...(fetchOptions.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...getAuthHeaders(),
    ...(fetchOptions.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { ...fetchOptions, headers, signal: fetchOptions.signal || controller.signal });
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = { message: text || "Unexpected server response" }; }
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("cyberrakshak:auth-changed"));
      }
      const requestError = new Error(data?.message || `Request failed (${response.status})`);
      requestError.status = response.status;
      throw requestError;
    }
    return data;
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error(`Request timed out after ${Math.round(timeoutMs / 1000)} seconds`, { cause: error });
      timeoutError.code = "TIMEOUT";
      throw timeoutError;
    }
    if (error instanceof TypeError) {
      const networkError = new Error("Unable to reach the CyberRakshak server. Check your connection and try again.", { cause: error });
      networkError.code = "NETWORK_ERROR";
      throw networkError;
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};
