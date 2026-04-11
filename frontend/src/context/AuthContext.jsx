import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get(`${API_BASE_URL}/api/auth/me`)
        .then((res) => setUser(res.data.user))
        .catch(() => {
          setToken(null);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    return u;
  };

  const register = async (name, email, password, monthlyBudget) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      name,
      email,
      password,
      monthlyBudget,
    });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    return u;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
