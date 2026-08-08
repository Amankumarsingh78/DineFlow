const TOKEN_KEY = "dineflow_admin_token";
const ADMIN_KEY = "dineflow_admin";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setAdmin = (admin) => {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};

export const getAdmin = () => {
  const admin = localStorage.getItem(ADMIN_KEY);

  return admin ? JSON.parse(admin) : null;
};

export const removeAdmin = () => {
  localStorage.removeItem(ADMIN_KEY);
};

export const clearAuth = () => {
  removeToken();
  removeAdmin();
};
