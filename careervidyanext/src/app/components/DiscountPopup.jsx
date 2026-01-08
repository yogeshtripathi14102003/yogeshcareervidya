"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Zap } from "lucide-react";

const CelebrationPopup = ({ targetId = "signup-section" }) => {
  const [showPopup, setShowPopup] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const router = useRouter();

  useEffect(() => {
    if (timeLeft > 0 && showPopup) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } 
    // समय खत्म होते ही पॉपअप बंद हो जाएगा
    else if (timeLeft === 0) {
      setShowPopup(false);
    }
  }, [timeLeft, showPopup]);

  if (!showPopup) return null;

  const handleGetClick = () => {
    setShowPopup(false);
    
    // टारगेट सेक्शन पर स्क्रॉल करें या नेविगेट करें
    const signupSection = document.getElementById(targetId);
    if (signupSection) {
      signupSection.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/signup");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500" 
        onClick={() => setShowPopup(false)} 
      />

      {/* Main Card */}
      <div className="relative w-full max-w-lg aspect-[4/3] bg-[#E14D56] rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center p-8 animate-in zoom-in-95 duration-300">
        
        {/* Confetti Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-6 opacity-80 animate-fall`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                backgroundColor: ['#4ade80', '#fbbf24', '#60a5fa', '#f472b6', '#ffffff'][i % 5],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>

        {/* Close Button */}
        <button 
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 bg-black/20 text-white rounded-full p-1.5 hover:bg-black/40 transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative z-10 text-white space-y-4 px-4">
          <h2 className="text-5xl font-serif font-bold tracking-tight italic">GetAdmission</h2>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-90 text-yellow-200">
             Get early bird discount
          </p>
          
          <div className="flex items-center justify-center gap-1 py-4">
            <span className="text-9xl font-bold leading-none text-yellow-300 drop-shadow-xl">10</span>
            <div className="flex flex-col items-start leading-none">
              <span className="text-5xl font-bold text-yellow-300">%</span>
              <span className="text-4xl font-serif italic text-white">Off</span>
              <span className="text-xl font-serif text-white">on Admission</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="relative w-full max-w-[240px] mx-auto mt-6">
            <button 
              onClick={handleGetClick}
              className="group w-full bg-[#5D5FEF] hover:bg-[#4a4cd8] text-white py-4 rounded-full text-xl font-black italic shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              GET! <Zap size={20} fill="currentColor" />
            </button>
          </div>

          {/* Automatic Close Timer Text */}
          <div className="pt-6">
            <p className="text-[10px] font-medium tracking-widest uppercase opacity-70">
              Closing in <span className="text-yellow-300 font-bold">{timeLeft}s</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CelebrationPopup;



// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { X, Zap } from "lucide-react";

// const CelebrationPopup = ({ targetId = "signup-section" }) => {
//   const [showPopup, setShowPopup] = useState(true);
//   const [timeLeft, setTimeLeft] = useState(10);
//   const router = useRouter();

//   useEffect(() => {
//     if (timeLeft > 0 && showPopup) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (timeLeft === 0) {
//       setShowPopup(false);
//     }
//   }, [timeLeft, showPopup]);

//   if (!showPopup) return null;

//   // GET! बटन का फंक्शन
//   const handleGetClick = () => {
//     setShowPopup(false); // पहले पॉपअप बंद करें

//     // चेक करें कि क्या Signup Section इसी पेज पर है
//     const signupSection = document.getElementById(targetId);
//     if (signupSection) {
//       signupSection.scrollIntoView({ behavior: "smooth" });
//     } else {
//       // अगर उस पेज पर नहीं है, तो सीधा Signup पेज पर भेजें
//       router.push("/signup");
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
//       {/* Dark Overlay */}
//       <div 
//         className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-500" 
//         onClick={() => setShowPopup(false)} 
//       />

//       {/* Main Card */}
//       <div className="relative w-full max-w-lg aspect-[4/3] bg-[#E14D56] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center text-center p-8 animate-in zoom-in-90 duration-300 border-4 border-white/10">
        
//         {/* Confetti Elements */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
//           {[...Array(40)].map((_, i) => (
//             <div
//               key={i}
//               className={`absolute w-2 h-5 opacity-70 animate-fall`}
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `-10%`,
//                 backgroundColor: ['#4ade80', '#fbbf24', '#60a5fa', '#f472b6', '#ffffff'][i % 5],
//                 animationDelay: `${Math.random() * 4}s`,
//                 animationDuration: `${2.5 + Math.random() * 2}s`,
//                 transform: `rotate(${Math.random() * 360}deg)`,
//               }}
//             />
//           ))}
//         </div>

//         {/* Close Button */}
//         <button 
//           onClick={() => setShowPopup(false)}
//           className="absolute top-5 right-5 bg-black/20 text-white/80 hover:text-white rounded-full p-2 hover:bg-black/40 transition-all z-20"
//         >
//           <X size={20} />
//         </button>

//         {/* Content */}
//         <div className="relative z-10 text-white space-y-4">
//           <h2 className="text-6xl font-serif font-black tracking-tight italic drop-shadow-lg">
//             GetAdmission
//           </h2>
//           <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-200 opacity-90">
//             Exclusive Student Discount
//           </p>
          
//           <div className="flex items-center justify-center gap-2 py-2">
//             <span className="text-[10rem] font-black leading-none text-white drop-shadow-2xl">25</span>
//             <div className="flex flex-col items-start leading-none">
//               <span className="text-6xl font-bold text-yellow-300">%</span>
//               <span className="text-5xl font-serif italic text-white/90">Off</span>
//             </div>
//           </div>

//           {/* Action Button */}
//           <div className="relative w-full max-w-xs mx-auto mt-8">
//             <button 
//               onClick={handleGetClick}
//               className="group w-full bg-[#5D5FEF] hover:bg-[#4a4cd8] text-white py-5 rounded-2xl text-2xl font-black italic shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
//             >
//               {/* Shimmer Effect */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_0.8s_infinite] skew-x-12" />
              
//               GET IT NOW <Zap size={24} fill="currentColor" />
//             </button>
//           </div>

//           <div className="flex items-center justify-center gap-2 pt-6">
//             <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
//             <p className="text-xs font-medium text-white/80 tracking-wide">
//               Hurry! Valid for {timeLeft} seconds only
//             </p>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fall {
//           0% { transform: translateY(0) rotate(0deg); opacity: 1; }
//           100% { transform: translateY(800px) rotate(720deg); opacity: 0; }
//         }
//         @keyframes shimmer {
//           0% { transform: translateX(-150%) skewX(-12deg); }
//           100% { transform: translateX(250%) skewX(-12deg); }
//         }
//         .animate-fall {
//           animation: fall linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CelebrationPopup;