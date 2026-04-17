"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, GraduationCap } from "lucide-react";

export default function CareerVidyaPremiumWidget() {
  const [showPreview, setShowPreview] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80 && !isOpen) setShowPreview(false);
      else if (window.scrollY <= 80) setShowPreview(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (videoRef.current) {
      if (!isOpen) videoRef.current.play();
      else videoRef.current.pause();
    }
  };

  return (
    <>
      {/* 1. FLOATING BUBBLE (Preview) */}
      {showPreview && !isOpen && (
        <div onClick={toggleModal} style={bubbleWrapperStyle}>
          <div style={pulseEffect}></div>
          <div style={bubbleContainer}>
            <video autoPlay muted loop playsInline style={videoStyle("cover")}>
              <source src="/video/v2.mp4" type="video/mp4" />
            </video>
            {/* <div style={bubbleLabel}><Sparkles size={10} /> live  </div> */}
          </div>
        </div>
      )}

      {/* 2. UNIQUE VERTICAL CARD (No Cropping) */}
      {isOpen && (
        <div style={modalOverlay}>
          <div style={glassCardStyle}>
            {/* Close Button */}
            <button onClick={toggleModal} style={closeBtnStyle}>
              <X size={18} color="#fff" />
            </button>

            {/* Video Area - Aspect Ratio Box */}
            <div style={videoSectionStyle}>
              <video 
                ref={videoRef} 
                controls 
                autoPlay 
                style={videoStyle("contain")} // Yeh video ko crop hone se bachayega
              >
                <source src="/video/v2.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Content Area */}
            <div style={contentAreaStyle}>
              <h3 style={titleStyle}>Choose the Right Career!</h3>
              <p style={descStyle}>Get expert guidance directly from our founder.</p>
              
              <button 
                onClick={() => { window.location.href = "#enquiry-form"; toggleModal(); }}
                style={premiumCtaBtn}
              >
                <GraduationCap size={18} /> Take Free Counselling
              </button>

              <div style={footerStyle}>Powered by CareerVidya</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- Styles (Unique & Non-Cropping) ---

const videoStyle = (fit) => ({
  width: "100%",
  height: "100%",
  objectFit: fit, // 'contain' ensure karega ki video full dikhe
  display: "block"
});

const bubbleWrapperStyle = {
  position: "fixed", bottom: "30px", right: "30px", zIndex: 9999, cursor: "pointer"
};

const bubbleContainer = {
  width: "200px", height: "200px", borderRadius: "24px", overflow: "hidden",
  border: "3px solid #1a73e8", boxShadow: "0 15px 30px rgba(0,0,0,0.2)", position: "relative"
};

const bubbleLabel = {
  position: "absolute", top: "8px", left: "8px", background: "#ff0000",
  color: "#fff", fontSize: "10px", padding: "2px 8px", borderRadius: "10px",
  fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px"
};

const pulseEffect = {
  position: "absolute", width: "100%", height: "100%", borderRadius: "24px",
  border: "2px solid #1a73e8", animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"
};

const modalOverlay = {
  position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
  background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
  display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: "30px", zIndex: 10000
};

const glassCardStyle = {
  width: "350px", background: "#fff", borderRadius: "28px", overflow: "hidden",
  boxShadow: "0 25px 50px rgba(0,0,0,0.3)", position: "relative",
  animation: "slideUp 0.5s ease-out"
};

const videoSectionStyle = {
  width: "100%", height: "450px", background: "#000", display: "flex", alignItems: "center"
};

const closeBtnStyle = {
  position: "absolute", top: "15px", right: "15px", zIndex: 10,
  background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%",
  width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
};

const contentAreaStyle = { padding: "20px", textAlign: "center", background: "#fff" };

const titleStyle = { margin: "0 0 8px", fontSize: "18px", fontWeight: "800", color: "#1a202c" };
const descStyle = { margin: "0 0 20px", fontSize: "13px", color: "#4a5568", lineHeight: "1.4" };

const premiumCtaBtn = {
  width: "100%", padding: "14px", background: "#1a73e8", color: "#fff",
  border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
  boxShadow: "0 4px 12px rgba(26,115,232,0.4)"
};

const footerStyle = { marginTop: "15px", fontSize: "10px", color: "#a0aec0", textTransform: "uppercase", letterSpacing: "1px" };






// "use client";

// import { useState, useEffect, useRef } from "react";
// import { X, Play, ArrowRight } from "lucide-react";
// import { useRouter } from "next/navigation";


// export default function CareerVidyaCircularVideo() {
//   const [showPreview, setShowPreview] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 80 && !isOpen) setShowPreview(false);
//       else if (window.scrollY <= 80) setShowPreview(true);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isOpen]);

//   useEffect(() => {
//     if (isOpen && videoRef.current) {
//       const playVideo = async () => {
//         try {
//           videoRef.current.currentTime = 0;
//           await videoRef.current.play();
//           setIsPlaying(true);
//         } catch (err) {
//           console.log("Autoplay blocked", err);
//         }
//       };
//       playVideo();
//     }
//   }, [isOpen]);

//   const toggleModal = () => setIsOpen(!isOpen);

//   const handleVideoClick = () => {
//     if (videoRef.current) {
//       if (videoRef.current.paused) {
//         videoRef.current.play();
//         setIsPlaying(true);
//       } else {
//         videoRef.current.pause();
//         setIsPlaying(false);
//       }
//     }
//   };
//   const router = useRouter();

//   return (
//     <>
//       {/* --- BIGGER PREVIEW BUBBLE (CLEAN LOOK) --- */}
//       {showPreview && !isOpen && (
//         <div onClick={toggleModal} style={bubbleStyle}>
//           <div style={videoContainerStyle}>
//             <video autoPlay muted loop playsInline style={videoFillStyle}>
//               <source src="/video/v12.mp4" type="video/mp4" />
//             </video>
//             {/* ICON REMOVED FROM HERE FOR CLEAN LOOK */}
//           </div>
//           <div style={glowEffect}></div>
//         </div>
//       )}

//       {/* --- EXPANDED MODAL --- */}
//       {isOpen && (
//         <div style={modalOverlayStyle}>
//           <div style={circularModalContainer}>
//             <button onClick={toggleModal} style={closeBtnStyle}>
//               <X size={20} color="#333" />
//             </button>

//             <div style={largeCircleStyle} onClick={handleVideoClick}>
//               <video 
//                 ref={videoRef}
//                 playsInline
//                 autoPlay
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   position: "relative",
//                   zIndex: 2,
//                   cursor: "pointer"
//                 }}
//               >
//                 <source src="/video/v12.mp4" type="video/mp4" />
//               </video>

//               {!isPlaying && (
//                 <div style={centerPlayIconStyle}>
//                   <Play size={40} fill="white" color="white" />
//                 </div>
//               )}
//             </div>

//             <div style={infoPanelStyle}>
//               <h4 style={{ margin: 0, fontSize: "18px", color: "#1a73e8" }}>Abhimanyu Singh Chouhan</h4>
//               <p style={{ margin: "2px 0 12px", fontSize: "12px", color: "#666" }}>FOUNDER & CEO, CAREERVIDYA</p>
//              <button 
//   onClick={() => { 
//     router.push("/teamexpand"); // 👈 smooth client-side navigation
//     toggleModal();
//   }}
//   style={ctaBtnStyle}
// >
//   Start Counseling <ArrowRight size={14} />
// </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // --- Styles ---
// const videoFillStyle = { width: "100%", height: "100%", objectFit: "cover" };

// const bubbleStyle = { 
//   position: "fixed", 
//   bottom: "30px", 
//   right: "30px", 
//   zIndex: 9999, 
//   width: "180px", 
//   height: "180px", 
//   cursor: "pointer"
// };

// const videoContainerStyle = { 
//   width: "100%", 
//   height: "100%", 
//   borderRadius: "50%", 
//   overflow: "hidden", 
//   border: "4px solid #ef814e", 
//   boxShadow: "0 15px 35px rgba(0,0,0,0.3)", 
//   position: "relative",
//   zIndex: 2
// };

// const glowEffect = {
//   position: "absolute",
//   top: 0, left: 0, width: "100%", height: "100%",
//   borderRadius: "50%",
//   boxShadow: "0 0 20px rgba(26,115,232,0.4)",
// };

// const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 };
// const circularModalContainer = { position: "relative", display: "flex", flexDirection: "column", alignItems: "center" };

// const largeCircleStyle = { 
//   width: "400px", 
//   height: "400px", 
//   borderRadius: "50%", 
//   overflow: "hidden", 
//   background: "#000", 
//   border: "8px solid #fff", 
//   boxShadow: "0 30px 60px rgba(0,0,0,0.5)", 
//   display: "flex", 
//   alignItems: "center", 
//   justifyContent: "center",
//   position: "relative"
// };

// const centerPlayIconStyle = {
//   position: "absolute",
//   zIndex: 10,
//   background: "rgba(0,0,0,0.3)",
//   borderRadius: "50%",
//   padding: "20px",
//   pointerEvents: "none"
// };

// const infoPanelStyle = { background: "#fff", padding: "2px 3px", borderRadius: "5px", marginTop: "-50px", zIndex: 3, textAlign: "center", boxShadow: "0 15px 35px rgba(0,0,0,0.2)", width: "250px" };
// const ctaBtnStyle = { background: "#1a73e8", color: "#fff", border: "none", borderRadius: "5px", padding: "5px 5px", fontWeight: "bold", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px", width: "100%" };
// const closeBtnStyle = { position: "absolute", top: "-15px", right: "-15px", zIndex: 10, background: "#fff", border: "none", borderRadius: "50%", padding: "10px", cursor: "pointer", boxShadow: "0 5px 15px rgba(0,0,0,0.2)" };