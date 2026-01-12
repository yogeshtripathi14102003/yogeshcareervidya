// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { X, Zap } from "lucide-react";
// import API from "@/utlis/api.js"; // your centralized axios instance

// const CelebrationPopup = ({ targetId = "signup-section" }) => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(10);
//   const [confetti, setConfetti] = useState([]);
//   const [offer, setOffer] = useState(null); // <-- store latest offer
//   const router = useRouter();

//   // ✅ Fetch latest offer on mount
//   useEffect(() => {
//     const fetchOffer = async () => {
//       try {
// const res = await API.get("/api/v1/offer/type/offer");
//  // fetch all offers
//         if (res.data.data.length > 0) {
//           // pick the latest one
//           const latestOffer = res.data.data.sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           )[0];
//           setOffer(latestOffer);

//           // calculate time left in seconds until offer expires
//           const now = new Date();
//           const validTill = new Date(latestOffer.validTill);
//           const secondsLeft = Math.max(Math.floor((validTill - now) / 1000), 0);
//           setTimeLeft(secondsLeft);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchOffer();

//     // show popup
//     setShowPopup(true);

//     // generate confetti
//     const items = Array.from({ length: 30 }).map(() => ({
//       left: `${Math.random() * 100}%`,
//       delay: `${Math.random() * 3}s`,
//       duration: `${2 + Math.random() * 3}s`,
//       rotate: `${Math.random() * 360}deg`,
//       color: ["#4ade80", "#fbbf24", "#60a5fa", "#f472b6", "#ffffff"][
//         Math.floor(Math.random() * 5)
//       ],
//     }));
//     setConfetti(items);
//   }, []);

//   // Countdown timer
//   useEffect(() => {
//     if (!showPopup || !offer) return;

//     if (timeLeft <= 0) {
//       setShowPopup(false);
//       return;
//     }

//     const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [timeLeft, showPopup, offer]);

//   if (!showPopup || !offer) return null;

//   // Convert timeLeft seconds into hours & minutes
//   const hours = Math.floor(timeLeft / 3600);
//   const minutes = Math.floor((timeLeft % 3600) / 60);
//   const seconds = timeLeft % 60;

//   const handleGetClick = () => {
//     setShowPopup(false);
//     const el = document.getElementById(targetId);
//     if (el) el.scrollIntoView({ behavior: "smooth" });
//     else router.push("/signup");
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//         onClick={() => setShowPopup(false)}
//       />

//       {/* Card */}
//       <div className="relative w-full max-w-lg aspect-[4/3] bg-[#E14D56] rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8">

//         {/* Confetti */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
//           {confetti.map((c, i) => (
//             <div
//               key={i}
//               className="absolute w-3 h-6 animate-fall"
//               style={{
//                 left: c.left,
//                 top: "-10%",
//                 backgroundColor: c.color,
//                 animationDelay: c.delay,
//                 animationDuration: c.duration,
//                 transform: `rotate(${c.rotate})`,
//               }}
//             />
//           ))}
//         </div>

//         {/* Close */}
//         <button
//           onClick={() => setShowPopup(false)}
//           className="absolute top-4 right-4 bg-black/20 text-white rounded-full p-1.5"
//         >
//           <X size={20} />
//         </button>

//         {/* Content */}
//         <div className="text-white text-center space-y-4">
//           <h2 className="text-5xl font-serif italic font-bold">GetAdmission</h2>
//           <p className="text-xs uppercase tracking-widest text-yellow-200">
//             Early bird discount
//           </p>

//           <div className="flex justify-center items-center gap-2">
//             <span className="text-9xl font-bold text-yellow-300">{offer.discountPercentage}</span>
//             <span className="text-5xl font-bold text-yellow-300">%</span>
//           </div>

//           <button
//             onClick={handleGetClick}
//             className="bg-[#5D5FEF] hover:bg-[#4a4cd8] text-white py-4 px-10 rounded-full text-xl font-black flex items-center gap-2 mx-auto"
//           >
//             GET! <Zap size={20} />
//           </button>

//           <p className="text-xs tracking-widest">
//             Valid for {hours}h {minutes}m {seconds}s
//           </p>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fall {
//           from { transform: translateY(0); opacity: 1; }
//           to { transform: translateY(600px); opacity: 0; }
//         }
//         .animate-fall {
//           animation: fall linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CelebrationPopup;

"use client";

import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import Image from "next/image";
import API from "@/utlis/api.js";

/* ================= FLOATING INPUT ================= */
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  readOnly,
  insideText,
}) => (
  <div className="relative w-full mb-3">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full rounded-md border border-[#05347f] px-3 py-2 ${
        insideText ? "pr-28" : ""
      } text-[13px] outline-none ${
        readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"
      }`}
    />

    {insideText && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-green-700">
        {insideText}
      </span>
    )}

    <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
      {label}
    </label>
  </div>
);

/* ================= FLOATING SELECT ================= */
const FloatingSelect = ({ label, name, value, onChange }) => (
  <div className="relative w-full mb-3">
    <label className="absolute -top-2 left-3 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-[#05347f] px-3 py-2 text-[13px] outline-none cursor-pointer"
    >
      <option value="">Select</option>
      <option>male</option>
      <option>female</option>
      <option>other</option>
    </select>
  </div>
);

/* ================= MAIN ================= */
const CelebrationSignupPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [offer, setOffer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [confetti, setConfetti] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    city: "",
    state: "",
    course: "",
    gender: "",
    addresses: "",
    branch: "",
    otp: "",
    specialization: "",
    dob: "",
    subsidyCoupon: "",
  });

  /* ================= FETCH OFFER ================= */
  useEffect(() => {
    const fetchOffer = async () => {
      const res = await API.get("/api/v1/offer/type/offer");
      const latest = res.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];
      setOffer(latest);

      const seconds = Math.max(
        Math.floor((new Date(latest.validTill) - new Date()) / 1000),
        0
      );
      setTimeLeft(seconds);
    };

    fetchOffer();
    setShowPopup(true);

    /* CONFETTI */
    const items = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
      rotate: `${Math.random() * 360}deg`,
      color: ["#4ade80", "#fbbf24", "#60a5fa", "#f472b6", "#ffffff"][
        Math.floor(Math.random() * 5)
      ],
    }));
    setConfetti(items);
  }, []);

  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (!showPopup || !offer || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, showPopup, offer]);

  if (!showPopup || !offer) return null;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGetClick = () => {
    setShowSignup(true);
    setFormData((p) => ({
      ...p,
      subsidyCoupon: `${offer.couponCode} - ${offer.discountPercentage}%`,
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowPopup(false)}
      />

      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${
          showSignup ? "bg-white" : "bg-[#E14D56]"
        }`}
      >
        {/* CONFETTI */}
        {!showSignup && (
          <div className="absolute inset-0 pointer-events-none">
            {confetti.map((c, i) => (
              <div
                key={i}
                className="absolute w-3 h-6 animate-fall"
                style={{
                  left: c.left,
                  top: "-10%",
                  backgroundColor: c.color,
                  animationDelay: c.delay,
                  animationDuration: c.duration,
                  transform: `rotate(${c.rotate})`,
                }}
              />
            ))}
          </div>
        )}

        {/* CLOSE */}
        <button
          onClick={() => setShowPopup(false)}
          className={`absolute top-4 right-4 ${
            showSignup ? "text-black" : "text-white"
          }`}
        >
          <X />
        </button>

        {!showSignup ? (
          /* ================= OFFER ================= */
          <div className="p-6 text-white text-center space-y-4">
            <h2 className="text-5xl font-serif italic font-bold">
              GetAdmission
            </h2>
             <h6 className="text-xl  font-bold">
              Early Bird Offer Live!
            </h6>

            <div className="flex justify-center gap-2">
              <span className="text-9xl font-bold text-yellow-300">
                {offer.discountPercentage}
              </span>
              <span className="text-5xl text-yellow-300">%</span>
            </div>

            <button
              onClick={handleGetClick}
              className="bg-[#5D5FEF] py-4 px-10 rounded-full text-xl font-black flex gap-2 mx-auto"
            >
              GET! <Zap />
            </button>

            <p className="text-xs tracking-widest">
              Valid for {hours}h {minutes}m {seconds}s
            </p>
          </div>
        ) : (
          /* ================= SIGNUP FORM (PEHLE JAISA) ================= */
          <div className="p-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-3">
              <Image src="/images/n12.png" alt="logo" width={80} height={40} />
              <div>
                <p className="text-sm font-bold text-[#253b7a]">
                  #VidyaHaiTohSuccessHai
                </p>
                <p className="text-xs text-gray-500">
                  Students’ most trusted guide
                </p>
              </div>
            </div>

            <form className="space-y-3">
              <FloatingInput label="Name" name="name" value={formData.name} onChange={handleChange} />

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <FloatingInput label="Email" name="email" value={formData.email} onChange={handleChange} />
                  <p className="text-[11px] text-[#4ade80] font-bold ">We Do Dot Spam</p>
                </div>
                <div>
                  <FloatingInput label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                  <p className="text-[11px] text-[#4ade80] font-bold ">We Do Not Spam</p>
                </div>
              </div>

              <FloatingInput label="City" name="city" value={formData.city} onChange={handleChange} />
              <FloatingInput label="State" name="state" value={formData.state} onChange={handleChange} />

              <div className="grid sm:grid-cols-2 gap-3">
                <FloatingInput label="Course" name="course" value={formData.course} onChange={handleChange} />
                <FloatingInput label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
              </div>

              <FloatingSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} />

              <div className="grid sm:grid-cols-2 gap-3">
                <FloatingInput label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} />
                <FloatingInput label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
              </div>

              <FloatingInput
                label="Subsidy Coupon"
                name="subsidyCoupon"
                value={formData.subsidyCoupon}
                readOnly
                insideText={`${offer.discountPercentage}% OFF`}
              />

              <FloatingInput label="Address" name="addresses" value={formData.addresses} onChange={handleChange} />

              <button className="w-full py-3 rounded-md text-white font-bold bg-orange-500">
                Send OTP
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fall {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(600px);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CelebrationSignupPopup;
