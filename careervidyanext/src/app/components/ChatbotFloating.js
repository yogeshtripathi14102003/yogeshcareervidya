"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";
import { MessageSquare, X, Send } from "lucide-react";

const PRIMARY_BLUE = "#3498db";
const BOT_MESSAGE_BUBBLE_COLOR = "#f1f1f1";

/* ================= TIME FORMAT ================= */
const formatTime = (timestamp) => {
  if (!timestamp) return "Now";
  const now = new Date();
  const past = new Date(timestamp);
  const diff = Math.floor((now - past) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff} mins ago`;
  return past.toLocaleDateString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
};

/* ================= AUTO LINK RENDER ================= */
const renderTextWithLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: PRIMARY_BLUE,
            textDecoration: "underline",
            display: "block",
            marginTop: "6px",
            wordBreak: "break-all",
            fontWeight: 500,
          }}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export default function CareervidyaChatbot() {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Home");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! Welcome to Careervidya. How can I assist you today?",
      timestamp: Date.now(),
      name: "Careervidya",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { type: "user", text: userText, timestamp: Date.now() },
    ]);
    setLoading(true);

    try {
      const res = await api.post("/api/v1/chatbot", { message: userText });

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: res?.data?.reply || "How can I help you?",
            timestamp: Date.now(),
            name: "Careervidya",
          },
        ]);
        setLoading(false);
        setSelectedTab("Conversation");
      }, 400);
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Something went wrong. Please try again.",
          timestamp: Date.now(),
          name: "Careervidya",
        },
      ]);
    }
  };

  /* ================= BOT MESSAGE ================= */
  const BotMessageBubble = ({ message }) => (
    <div style={{ display: "flex", marginBottom: 10 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: PRIMARY_BLUE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 8,
        }}
      >
        <Image
          src="/images/LogoUpdated1.png"
          alt="logo"
          width={18}
          height={18}
          style={{ filter: "invert(1)" }}
        />
      </div>

      <div>
        <div style={{ fontSize: 12, fontWeight: "bold" }}>
          Careervidya · {formatTime(message.timestamp)}
        </div>

        <div
          style={{
            background: BOT_MESSAGE_BUBBLE_COLOR,
            padding: "8px 12px",
            borderRadius: 12,
            maxWidth: 260,
            marginTop: 4,
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {renderTextWithLinks(message.text)}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", bottom: 30, right: 20, zIndex: 9999 }}>
      {/* CHAT ICON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: PRIMARY_BLUE,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
        >
          <MessageSquare size={30} />
        </button>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div
          style={{
            width: 380,
            height: 500,
            borderRadius: 16,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,.2)",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: PRIMARY_BLUE,
              color: "#fff",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Image
                src="/images/LogoUpdated1.png"
                alt="logo"
                width={28}
                height={28}
              />
              <div>
                <div style={{ fontWeight: 600 }}>Careervidya Bot</div>
                <div style={{ fontSize: 11, opacity: 0.9 }}>
                  Online | Support
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* CHAT BODY */}
          <div
            style={{
              flex: 1,
              padding: 15,
              overflowY: "auto",
              background: "#f9f9f9",
            }}
          >
            {selectedTab === "Conversation" &&
              messages.map((m, i) =>
                m.type === "bot" ? (
                  <BotMessageBubble key={i} message={m} />
                ) : (
                  <div key={i} style={{ textAlign: "right", marginBottom: 10 }}>
                    <div
                      style={{
                        display: "inline-block",
                        background: PRIMARY_BLUE,
                        color: "#fff",
                        padding: "10px 14px",
                        borderRadius: "15px 15px 0 15px",
                        maxWidth: "80%",
                      }}
                    >
                      {m.text}
                    </div>
                    <div
                      style={{ fontSize: 10, color: "#999", marginTop: 4 }}
                    >
                      {formatTime(m.timestamp)}
                    </div>
                  </div>
                )
              )}

            {loading && (
              <div style={{ fontSize: 12, color: "#888" }}>Typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          {selectedTab === "Conversation" && (
            <div
              style={{
                display: "flex",
                padding: 10,
                borderTop: "1px solid #eee",
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  marginLeft: 10,
                  background: PRIMARY_BLUE,
                  border: "none",
                  color: "#fff",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                <Send size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
