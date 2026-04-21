"use client";

import { useState, useRef } from "react";
import { X, GraduationCap } from "lucide-react";

export default function CareerVidyaPremiumWidget() {
  const [showPreview, setShowPreview] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setTimeout(() => videoRef.current?.play(), 100);
  };

  return (
    <>
      {/* 1. SQUARE BUBBLE */}
      {showPreview && !isOpen && (
        <div onClick={toggleModal} style={bubbleWrapperStyle}>
          <div style={bubbleContainer}>
            <video autoPlay muted loop playsInline style={{width: "100%", height: "120%", objectFit: "cover"}}>
              <source src="/video/v2.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* 2. SIDE-OPENING CARD */}
      {isOpen && (
        <div style={modalOverlay}>
          <div style={glassCardStyle}>
            <button onClick={toggleModal} style={closeBtnStyle}>
              <X size={16} />
            </button>

            <div style={videoSectionStyle}>
              <video ref={videoRef} controls style={videoStyle}>
                <source src="/video/v2.mp4" type="video/mp4" />
              </video>
            </div>

            <div style={contentAreaStyle}>
              <h3 style={titleStyle}>Need Expert Career Advice?</h3>
              {/* <p style={descStyle}>Get a 1-on-1 strategy session with our mentor to plan your future effectively.</p> */}
              
              <button 
                onClick={() => { window.location.href = "/teamexpand"; toggleModal(); }}
                style={premiumCtaBtn}
              >
                <GraduationCap size={16} /> Book Free Counselling
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- Styles ---

const bubbleWrapperStyle = { position: "fixed", bottom: "25px", right: "25px", zIndex: 9999, cursor: "pointer" };
const bubbleContainer = { width: "100px", height: "140px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", border: "2px solid #ec7425" };

const modalOverlay = { position: "fixed", bottom: "25px", right: "25px", zIndex: 10000 };

const glassCardStyle = { 
  width: "320px", 
  background: "#fff", 
  borderRadius: "20px", 
  overflow: "hidden", 
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)", 
  border: "1px solid #eee"
};

const videoSectionStyle = { width: "100%", height: "380px", background: "#000" };
const videoStyle = { width: "100%", height: "100%", objectFit: "cover" };

const closeBtnStyle = { 
  position: "absolute", top: "10px", right: "10px", zIndex: 10,
  background: "rgba(255,255,255,0.8)", border: "none", borderRadius: "50%",
  width: "28px", height: "28px", cursor: "pointer", color: "#333",
  display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

const contentAreaStyle = { 
  padding: "20px", 
  textAlign: "center",
  display: "flex", 
  flexDirection: "column", 
  alignItems: "center" 
};

const titleStyle = { margin: "0 0 10px 0", fontSize: "17px", fontWeight: "700", color: "#1a202c" };
const descStyle = { margin: "0 0 15px 0", fontSize: "13px", color: "#4a5568", lineHeight: "1.4" };

const premiumCtaBtn = { 
  width: "100%", 
  maxWidth: "220px",
  padding: "10px 16px", 
  background: "#1a73e8", 
  color: "#fff",
  border: "none", 
  borderRadius: "30px", 
  fontWeight: "600", 
  cursor: "pointer", 
  fontSize: "13px",
  display: "flex", 
  alignItems: "center", 
  justifyContent: "center", 
  gap: "8px" 
};