import React, { useState, useRef, useEffect } from "react";
import { useFarmer } from "../context/FarmerContext";
import { askAssistant } from "../services/api";
import {
  BotMessageSquare,
  Send,
  Wrench,
  RefreshCw,
  Camera
} from "lucide-react";

export default function AIAssistant() {
  const { 
    profile, 
    pendingAiContext, 
    setPendingAiContext, 
    setShowCameraScanner 
  } = useFarmer();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Namaste ${profile.name}! 🙏 I am your **Entre Help AI Assistant**.\n\nI combine real-time scheme data, loan calculators, and Channel Partner directories to assist your business decisions.\n\nHow can I help your enterprise today?`,
      tools: ["Entrepreneur Intelligence Hub", "Profile Context"],
      followups: [
        "What government schemes apply to me?",
        "What is my Max Loan Eligibility?",
        `Find Channel Partners in ${profile.state}`,
        "What documents are required for NSFDC?",
        "How is Margin Money calculated?"
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.closest(".chat-messages");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle cross-module pending context if any
  useEffect(() => {
    if (pendingAiContext && pendingAiContext.type === "scheme") {
      const d = pendingAiContext;
      const schemeSummaryMsg = {
        role: "assistant",
        content: `🔍 **Context Received from Scheme Recommender**:\n\n• **Target Scheme:** ${d.scheme_name}\n• **Match Score:** ${(d.match_score * 100).toFixed(0)}%\n\nHow can I assist further with this scheme application?`,
        tools: ["Scheme Match Guide"],
        followups: [
          `What documents are needed for ${d.scheme_name}?`,
          "Where is the nearest SCA to apply?",
          "Can you calculate my loan EMIs?"
        ]
      };
      setMessages((prev) => [...prev, schemeSummaryMsg]);
      setPendingAiContext(null);
    }
  }, [pendingAiContext]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await askAssistant(textToSend, historyPayload, profile);
      
      const botMsg = {
        role: "assistant",
        content: res.reply,
        tools: res.tools_used,
        intent: res.detected_intent,
        followups: res.suggested_followups
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "We're having trouble connecting right now. Please try again.",
          tools: ["Service Assistant"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color: #059669; text-decoration: underline; font-weight: 600;">$1</a>')
      .replace(/\n/g, "<br />");
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span className="badge badge-green">AI Scheme Assistant</span>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Multi-Tool Scheme Support</span>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
          AI Scheme Assistant
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
          Ask natural-language questions in English or Hindi. Grounded in scheme rules, loan data, and partner directories.
        </p>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        {/* Messages Body */}
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}
            >
              {msg.role === "assistant" && msg.tools && msg.tools.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                  {msg.tools.map((tool, ti) => (
                    <span
                      key={ti}
                      style={{
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        color: "#047857",
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Wrench size={10} /> {tool}
                    </span>
                  ))}
                </div>
              )}

              <div
                style={{ lineHeight: 1.55, fontSize: "13px" }}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
              />

              {msg.followups && msg.followups.length > 0 && (
                <div style={{ marginTop: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
                    Suggested Questions:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {msg.followups.map((f, fi) => (
                      <button
                        key={fi}
                        onClick={() => handleSend(f)}
                        style={{
                          background: "#f1f5f9",
                          border: "1px solid #e2e8f0",
                          borderRadius: "9999px",
                          padding: "5px 10px",
                          fontSize: "11px",
                          color: "#334155",
                          cursor: "pointer",
                          fontWeight: 500,
                          transition: "all 0.15s ease",
                          textAlign: "left"
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-bot" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "inline-block", animation: "spin 1s infinite linear" }}>
                <RefreshCw size={16} color="#059669" />
              </div>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Analyzing scheme insights & advice...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div style={{ padding: "12px 14px", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about schemes, margin money, or SCAs..."
              className="form-input"
              style={{ padding: "10px 14px", fontSize: "13px", margin: 0, flex: 1 }}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: "10px 16px", flexShrink: 0 }}
              aria-label="Send Message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
