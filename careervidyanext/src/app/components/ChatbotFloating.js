"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const PRIMARY_BLUE = "#3498db"; 
const BOT_MESSAGE_BUBBLE_COLOR = "#f1f1f1";

// --- Utility function for real-time calculation ---
const formatTime = (timestamp) => {
  if (!timestamp) return "Now";
  
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMinutes = Math.floor((now - past) / 1000 / 60);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  
  // Format as HH:MM if it's today
  if (past.getDate() === now.getDate() && past.getMonth() === now.getMonth() && past.getFullYear() === now.getFullYear()) {
    const hours = past.getHours().toString().padStart(2, '0');
    const minutes = past.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Fallback for older messages
  return past.toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
};

export default function CareervidyaChatbot() {
  const [open, setOpen] = useState(false); 
  const [selectedTab, setSelectedTab] = useState("Home");
  const [messages, setMessages] = useState([
    { 
      type: "bot", 
      text: "Please enter your name", 
      timestamp: Date.now() - 4 * 60 * 1000, 
      name: "Careervidya" 
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedTab === "Conversation" && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedTab]);

  const handleSend = async () => {
    if (!input) return;
    const userMessage = input;
    const newTimestamp = Date.now();
    
    setMessages(prev => [...prev, { type: "user", text: userMessage, timestamp: newTimestamp, name: "User" }]);
    setInput("");
    setLoading(true);

    try {
      // Simulate API call
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: "bot", 
          text: data.reply || "Hello! How can I help you further?",
          timestamp: Date.now(), 
          name: "Careervidya" 
        }]);
        setLoading(false);
        if (selectedTab === "Home") {
            setSelectedTab("Conversation");
        }
      }, 500); 

    } catch {
      setMessages(prev => [...prev, { 
        type: "bot", 
        text: "Sorry, something went wrong. Please try again.", 
        timestamp: Date.now(), 
        name: "Careervidya" 
      }]);
      setLoading(false);
    }
  };

  // Helper component for the bot message bubble
  const BotMessageBubble = ({ message }) => (
    <div 
      style={{
        display: "flex", 
        alignItems: "flex-start", 
        margin: "10px 0",
        textAlign: "left"
      }}
    >
      <div 
        style={{
          width: "30px", 
          height: "30px", 
          minWidth: "30px", 
          borderRadius: "50%", 
          backgroundColor: PRIMARY_BLUE, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          marginRight: "8px",
        }}
      >
        <Image src="/images/LogoUpdated1.png" alt="Careervidya Logo" width={18} height={18} style={{ filter: 'brightness(0) invert(1)' }}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>{message.name || "Careervidya"}</div>
          <div style={{ fontSize: "10px", color: "#888" }}>{formatTime(message.timestamp)}</div>
        </div>
        <div 
          style={{
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "12px",
            backgroundColor: BOT_MESSAGE_BUBBLE_COLOR,
            color: "#000",
            maxWidth: "80%",
            wordBreak: "break-word",
          }}
        >
          {message.text}
        </div>
      </div>
    </div>
  );

  return (
    // *** ADJUSTED BOTTOM POSITION ***
    <div style={{ position: "fixed", bottom: "40px", right: "20px", zIndex: 1000 }}>
      
      {/* --- CLOSED BUTTON: Shown when 'open' is false --- */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: PRIMARY_BLUE,
            color: "#fff",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }}
        >
          💬
        </button>
      )}

      {/* --- OPEN CHAT WINDOW: Shown when 'open' is true --- */}
      {open && (
        <div
          style={{
            width: "400px", 
            height: "500px",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            fontFamily: "'Segoe UI', sans-serif"
          }}
        >
          {/* Header */}
          <div style={{
            backgroundColor: PRIMARY_BLUE,
            color: "#fff",
            padding: "16px 16px 80px 16px", 
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            position: "relative",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Image 
                src="/images/LogoUpdated1.png" 
                alt="Careervidya" 
                width={40} 
                height={40}
                style={{ filter: 'brightness(0) invert(1)' }} 
              /> 
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>Careervidya</div>
            </div>
            <div style={{ fontSize: "14px" }}>We are here to help you!</div>
          </div>
          
          {/* Main Content Area */}
          <div style={{ 
            flex: 1, 
            padding: "10px", 
            overflowY: "auto",
            position: "relative",
            marginTop: selectedTab === "Home" ? "-70px" : "0", 
            background: "#fff",
            borderRadius: "12px 12px 0 0",
            minHeight: "0",
          }}>

            {/* --- HOME Tab View (Initial Message) --- */}
            {selectedTab === "Home" && (
                <div style={{ 
                    background: "#fff", 
                    borderRadius: "12px", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "12px",
                    margin: "0 0 10px 0"
                }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      marginBottom: "8px" 
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Image 
                                 src="/images/LogoUpdated1.png" 
                              alt="Careervidya Small Logo" 
                              width={24} 
                              height={24}
                          />
                          <div style={{ fontWeight: "bold", fontSize: "14px" }}>Careervidya</div>
                        </div>
                        <div style={{ fontSize: "10px", color: "#888" }}>{formatTime(messages[0].timestamp)}</div> 
                    </div>
                    <div style={{ fontSize: "14px" }}>{messages[0].text}</div>
                </div>
            )}


            {/* --- CONVERSATION Tab View (All Messages) --- */}
            {selectedTab === "Conversation" && (
                <>
                    {messages.map((m, i) => ( 
                        <div key={i} style={{ textAlign: m.type === "user" ? "right" : "left", margin: "5px 0" }}>
                          {m.type === "bot" ? (
                            <BotMessageBubble message={m} />
                          ) : (
                            <div style={{
                              display: "inline-block",
                              padding: "8px 14px",
                              borderRadius: "12px",
                              backgroundColor: PRIMARY_BLUE,
                              color: "#fff",
                              maxWidth: "80%",
                              wordBreak: "break-word"
                            }}>
                              {m.text}
                            </div>
                          )}
                          <div style={{ fontSize: "10px", color: "#888" }}>
                            {formatTime(m.timestamp)}
                          </div>
                        </div>
                    ))}
                    {loading && <div style={{ fontSize: "12px", color: "#555", marginTop: "10px" }}>Bot is typing...</div>}
                    <div ref={messagesEndRef} />
                </>
            )}
          </div>

          {/* Input - Only show input field in Conversation tab */}
          {selectedTab === "Conversation" && (
              <div style={{ display: "flex", borderTop: "1px solid #ddd", padding: "8px" }}>
                <input
                  type="text"
                  value={input}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    borderRadius: "12px",
                    border: "1px solid #ddd",
                    padding: "8px",
                    outline: "none"
                  }}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  style={{
                    marginLeft: "5px",
                    padding: "8px 12px",
                    backgroundColor: PRIMARY_BLUE,
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer"
                  }}
                >
                  Send
                </button>
              </div>
          )}

          {/* Footer Tabs */}
          <div style={{ 
            display: "flex", 
            borderTop: "1px solid #ddd", 
            padding: "8px 0",
          }}>
            <div 
              onClick={() => setSelectedTab("Home")}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 0",
                cursor: "pointer",
                fontWeight: selectedTab === "Home" ? "bold" : "normal",
                color: selectedTab === "Home" ? PRIMARY_BLUE : "#555",
                borderBottom: selectedTab === "Home" ? `2px solid ${PRIMARY_BLUE}` : "2px solid transparent"
              }}
            >
              🏠 Home
            </div>
            <div 
              onClick={() => setSelectedTab("Conversation")}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 0",
                cursor: "pointer",
                fontWeight: selectedTab === "Conversation" ? "bold" : "normal",
                color: selectedTab === "Conversation" ? PRIMARY_BLUE : "#555",
                borderBottom: selectedTab === "Conversation" ? `2px solid ${PRIMARY_BLUE}` : "2px solid transparent"
              }}
            >
              💬 Conversation
            </div>
          </div>

        </div>
      )}
      
      {/* Large Blue Circular 'X' Close Button: Only visible when chat is OPEN */}
      {open && (
        <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              bottom: "-40px",
              right: "0", 
              backgroundColor: PRIMARY_BLUE,
              borderRadius: "50%",
              width: "40px", 
              height: "40px", 
              border: "none",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              zIndex: 1001, 
            }}
          >
            ✖
          </button>
      )}
    </div>
  );
}