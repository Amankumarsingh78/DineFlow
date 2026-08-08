import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import {
  clearAuth,
  getAdmin,
  getToken,
  setAdmin,
  setToken,
} from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdminState] = useState(getAdmin());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(getToken());

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();

        const profile = response.admin || response.data?.admin;

        if (profile) {
          setAdmin(profile);
          setAdminState(profile);
        }
      } catch (error) {
        clearAuth();
        setAdminState(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);

    const token = response.token;
    const loggedInAdmin = response.admin;

    if (!token || !loggedInAdmin) {
      throw new Error("Invalid login response from server");
    }

    setToken(token);
    setAdmin(loggedInAdmin);
    setAdminState(loggedInAdmin);

    return loggedInAdmin;
  };

  const logout = () => {
    clearAuth();
    setAdminState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
