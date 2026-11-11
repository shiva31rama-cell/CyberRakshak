import { apiRequest, getAuthToken } from "./api";

export const register = async (name, email, password, confirmPassword) => {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });

  if (data.token) {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
};

export const login = async (email, password) => {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data.token) {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
};

export const getCurrentUser = async () => {
  if (!getAuthToken()) throw new Error("Please log in first");
  const data = await apiRequest("/auth/me");
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

export const logout = async () => {
  const token = getAuthToken();
  try {
    if (token) {
      await apiRequest("/auth/logout", { method: "POST" });
    }
  } finally {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
};

export const isAuthenticated = () => Boolean(getAuthToken());

export const getStoredUser = () => {
  try {
    const value = localStorage.getItem("user");
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export { getAuthToken };
