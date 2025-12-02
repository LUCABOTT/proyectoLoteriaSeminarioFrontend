import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  
  const [token, setToken] = useState(storedToken || null);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (jwt, userData) => {
    setToken(jwt);
    setUser(userData);
    navigate("/dashboard");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};