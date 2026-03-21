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
            wordBreak: "break-all",
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
            boxShadow: "0 10px 30px rgba(0,0,0,.2)",
            background: "#fff",
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "50%",
                  padding: 5,
                  display: "flex",
                }}
              >
                <Image
                  src="/images/LogoUpdated1.png"
                  alt="logo"
                  width={25}
                  height={25}
                />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Careervidya Chatbot </div>
                <div style={{ fontSize: 11 }}>Online | Careervidya Support</div>
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

          {/* CHAT AREA */}
          <div
            style={{
              flex: 1,
              padding: 15,
              overflowY: "auto",
              background: "#f9f9f9",
            }}
          >
            {selectedTab === "Home" ? (
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Image
                  src="/images/LogoUpdated1.png"
                  alt="logo"
                  width={60}
                  height={60}
                  style={{ opacity: 1.2 }}
                />
                <p style={{ color: "#888", fontSize: 14 }}>
                  Welcome! Click on Chat to start.
                </p>
                <button
                  onClick={() => setSelectedTab("Conversation")}
                  style={{
                    background: PRIMARY_BLUE,
                    color: "#fff",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: 20,
                    cursor: "pointer",
                  }}
                >
                  Start Conversation
                </button>
              </div>
            ) : (
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
                    <div style={{ fontSize: 10, color: "#999" }}>
                      {formatTime(m.timestamp)}
                    </div>
                  </div>
                )
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
                borderTop: "1px solid #eee",
                padding: "10px 15px",
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
                  border: "1px solid #eee",
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  marginLeft: 10,
                  background: PRIMARY_BLUE,
                  color: "#fff",
                  border: "none",
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

          {/* TABS */}
          <div style={{ display: "flex", borderTop: "1px solid #eee" }}>
            {["Home", "Conversation"].map((t) => (
              <div
                key={t}
                onClick={() => setSelectedTab(t)}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: 12,
                  cursor: "pointer",
                  fontWeight: selectedTab === t ? 600 : 400,
                  color: selectedTab === t ? PRIMARY_BLUE : "#777",
                  borderTop:
                    selectedTab === t
                      ? `2px solid ${PRIMARY_BLUE}`
                      : "none",
                }}
              >
                {t === "Home" ? "Home" : "Messages"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



// "use client";

// import { useState, useRef } from "react";
// import { X } from "lucide-react";

// export default function FounderVideoWidget() {
//   const [open, setOpen] = useState(false);
//   const videoRef = useRef(null);

//   const handleOpen = () => {
//     setOpen(true);

//     setTimeout(() => {
//       if (videoRef.current) {
//         videoRef.current.muted = false;
//         videoRef.current.play().catch(() => {});
//       }
//     }, 100);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     if (videoRef.current) {
//       videoRef.current.pause();
//     }
//   };

//   return (
//     <>
//       {/* FLOATING BUTTON */}
//       {!open && (
//         <div
//           onClick={handleOpen}
//           style={{
//             position: "fixed",
//             bottom: 20,
//             right: 20,
//             zIndex: 9999,
//             width: 85,
//             textAlign: "center",
//             cursor: "pointer",
//           }}
//         >
//           {/* IMAGE */}
//           <div
//             style={{
//               width: 85,
//               height: 85,
//               borderRadius: "50%",
//               border: "3px solid #fff",
//               overflow: "hidden",
//               boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
//               position: "relative",
//             }}
//           >
//             <img
//               src="/images/yogesh.jpeg"
//               alt="Founder"
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//               }}
//             />

//             {/* ONLINE DOT */}
//             <span
//               style={{
//                 position: "absolute",
//                 bottom: 6,
//                 right: 6,
//                 width: 12,
//                 height: 12,
//                 background: "#2ecc71",
//                 borderRadius: "50%",
//                 border: "2px solid #fff",
//               }}
//             ></span>
//           </div>

//           {/* TAGLINE */}
//           <div
//             style={{
//               marginTop: 6,
//               fontSize: 11,
//               fontWeight: 600,
//               color: "#fff",
//               textShadow: "0 2px 6px rgba(0,0,0,0.6)",
//             }}
//           >
//             Vidya hai to Success hai
//           </div>
//         </div>
//       )}

//       {/* VIDEO MODAL */}
//       {open && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             background: "rgba(0,0,0,0.85)",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 99999,
//           }}
//         >
//           {/* CLOSE BUTTON */}
//           <button
//             onClick={handleClose}
//             style={{
//               position: "absolute",
//               top: 20,
//               right: 20,
//               background: "rgba(0,0,0,0.6)",
//               border: "none",
//               color: "#fff",
//               padding: 8,
//               borderRadius: "50%",
//               cursor: "pointer",
//             }}
//           >
//             <X size={24} />
//           </button>

//           {/* VIDEO WRAPPER */}
//           <div
//             style={{
//               width: "90%",
//               maxWidth: "900px",
//               aspectRatio: "16 / 9",
//               background: "#000",
//               borderRadius: "12px",
//               overflow: "hidden",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               muted
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "contain", // ✅ NO CROP
//               }}
//             >
//               <source src="/images/vd.mp4" type="video/mp4" />
//             </video>
//           </div>

//           {/* CTA BUTTON */}
//           <a
//             href="https://careervidya.in/topunivers/"
//             target="_blank" 
//             style={{
//               marginTop: 20,
//               padding: "10px 18px",
//               background: "#3498db",
//               color: "#fff",
//               borderRadius: "8px",
//               textDecoration: "none",
//               fontWeight: "600",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
//             }}
//           >
//             Explore Top Universities
//           </a>
//         </div>
//       )}
//     </>
//   );
// }