import { useState, useEffect } from "react";
import { loginUser, setOnUnauthorized } from "../api/client.js";
import { AuthContext } from "./authContextDef.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("matrix_jwt"),
  );
  const [user, setUser] = useState(
    () => sessionStorage.getItem("matrix_user") || "admin",
  );
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOnUnauthorized(() => {
      setToken(null);
      setUser(null);
      setError(
        "Tu sesión ha expirado o el token es inválido. Por favor inicia sesión nuevamente.",
      );
    });
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(username, password);
      sessionStorage.setItem("matrix_jwt", data.token);
      sessionStorage.setItem("matrix_user", data.user);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Error al conectar con el servidor";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("matrix_jwt");
    sessionStorage.removeItem("matrix_user");
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        error,
        setError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
