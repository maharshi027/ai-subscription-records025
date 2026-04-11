import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transactions from "./pages/Transactions";
import Subscriptions from "./pages/Subscriptions";
import Layout from "./components/Layout";
import "./index.css";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading FinanceAI...</p>
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/"
        element={
          <Protected>
            <Layout>
              <Dashboard />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/transactions"
        element={
          <Protected>
            <Layout>
              <Transactions />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <Protected>
            <Layout>
              <Subscriptions />
            </Layout>
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
