import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAuthData, getAuthData, saveAuthData } from "../utils/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = getAuthData();
    setAuth(storedAuth);
    setLoading(false);
  }, []);

  const login = (loginData) => {
    saveAuthData(loginData);
    setAuth(loginData);
  };

  const logout = () => {
    clearAuthData();
    setAuth(null);

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  };

  const value = useMemo(
    () => ({
      auth,
      loading,
      login,
      logout,
      isLoggedIn: !!auth?.token,
      role: auth?.role || null,
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);