import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const NAV = [
  { path: "/", icon: "📊", label: "Dashboard" },
  { path: "/transactions", icon: "💳", label: "Transactions" },
  { path: "/subscriptions", icon: "🔄", label: "Subscriptions" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user?.name?.split(" ")[0] || "there"}! 👋 I'm FinanceAI. Ask me anything about your finances, budgeting tips, or investment advice!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const msgEndRef = useRef(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || thinking) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    try {
      const history = [...messages, userMsg]
        .filter((m) => m.role !== "system")
        .slice(-10);
      const res = await axios.post("/api/ai/chat", { messages: history });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble connecting. Please try again.",
        },
      ]);
    }
    setThinking(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Finance<span>AI</span>
        </div>
        {NAV.map((n) => (
          <Link
            key={n.path}
            to={n.path}
            className={`nav-item${location.pathname === n.path ? " active" : ""}`}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </Link>
        ))}
        <div
          style={{
            marginTop: "auto",
            padding: "20px 20px 0",
            borderTop: "1px solid #1e293b",
            marginTop: "40px",
          }}
        >
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
            {user?.name}
          </div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 12 }}>
            {user?.email}
          </div>
          <button
            onClick={logout}
            className="btn btn-outline"
            style={{ width: "100%", fontSize: 13 }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>

      <div className="chatbot">
        {chatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div>
                <div className="chat-title">FinanceAI Assistant</div>
                <div className="chat-subtitle">● Powered by Claude AI</div>
              </div>
              <button className="chat-close" onClick={() => setChatOpen(false)}>
                ×
              </button>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`chat-msg ${m.role === "user" ? "user" : "ai"}`}
                >
                  {m.content}
                </div>
              ))}
              {thinking && (
                <div className="chat-msg ai" style={{ color: "#475569" }}>
                  Thinking...
                </div>
              )}
              <div ref={msgEndRef} />
            </div>
            <div className="chat-input-row">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about your finances..."
                disabled={thinking}
              />
              <button
                className="chat-send"
                onClick={sendMessage}
                disabled={thinking}
              >
                ↑
              </button>
            </div>
          </div>
        )}
        <button className="chat-toggle" onClick={() => setChatOpen((o) => !o)}>
          {chatOpen ? "×" : "🤖"}
        </button>
      </div>
    </div>
  );
}
