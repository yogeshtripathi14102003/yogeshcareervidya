"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";

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

export default function CareervidyaChatbot() {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Home");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Please enter your name",
      timestamp: Date.now(),
      name: "Careervidya",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
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
      }, 500);
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
    <div style={{ display: "flex", marginBottom: "10px" }}>
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
          }}
        >
          {message.text}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", bottom: 30, right: 20, zIndex: 9999 }}>
      {/* ================= CHAT OPEN IMAGE BUTTON ================= */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "none",
            padding: 0,
            cursor: "pointer",
            background: "transparent",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <Image
            src="/images/giphy.gif"
            alt="Chatbot"
            width={60}
            height={60}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </button>
      )}

      {/* ================= CHAT WINDOW ================= */}
      {open && (
        <div
          style={{
            width: 400,
            height: 520,
            borderRadius: 14,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 24px rgba(0,0,0,.35)",
            background: "#fff",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: PRIMARY_BLUE,
              color: "#fff",
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Image
                src="/images/LogoUpdated1.png"
                alt="logo"
                width={40}
                height={40}
                style={{ filter: "invert(1)" }}
              />
              <div>
                <div style={{ fontWeight: "bold" }}>Careervidya</div>
                <div style={{ fontSize: 12 }}>We are here to help you</div>
              </div>
            </div>
          </div>

          {/* CHAT AREA */}
          <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
            {selectedTab === "Home" && (
              <div
                style={{
                  background: "#fff",
                  padding: 12,
                  borderRadius: 12,
                  boxShadow: "0 4px 10px rgba(0,0,0,.1)",
                }}
              >
                {messages[0].text}
              </div>
            )}

            {selectedTab === "Conversation" &&
              messages.map((m, i) =>
                m.type === "bot" ? (
                  <BotMessageBubble key={i} message={m} />
                ) : (
                  <div
                    key={i}
                    style={{ textAlign: "right", marginBottom: 10 }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        background: PRIMARY_BLUE,
                        color: "#fff",
                        padding: "8px 12px",
                        borderRadius: 12,
                        maxWidth: 260,
                      }}
                    >
                      {m.text}
                    </div>
                    <div style={{ fontSize: 10 }}>
                      {formatTime(m.timestamp)}
                    </div>
                  </div>
                )
              )}

            {loading && <div>Bot is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          {selectedTab === "Conversation" && (
            <div
              style={{
                display: "flex",
                borderTop: "1px solid #ddd",
                padding: 8,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 12,
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  marginLeft: 6,
                  background: PRIMARY_BLUE,
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 12,
                }}
              >
                Send
              </button>
            </div>
          )}

          {/* TABS */}
          <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
            {["Home", "Conversation"].map((t) => (
              <div
                key={t}
                onClick={() => setSelectedTab(t)}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: 10,
                  cursor: "pointer",
                  fontWeight: selectedTab === t ? "bold" : "normal",
                  color: selectedTab === t ? PRIMARY_BLUE : "#555",
                }}
              >
                {t === "Home" ? "🏠 Home" : "💬 Chat"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLOSE BUTTON */}
      {open && (
        <button
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            right: 0,
            bottom: -45,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: PRIMARY_BLUE,
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
      )}
    </div>
  );
}
