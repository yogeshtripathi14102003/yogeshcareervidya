// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import api from "@/utlis/api";
// import { X } from "lucide-react";
// import { useRouter } from "next/navigation";

// /* ================= FLOATING SELECT ================= */
// const FloatingSelect = ({ label, name, value, onChange, options = [] }) => (
//   <div className="relative w-full">
//     <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] md:text-[11px] font-semibold text-[#05347f] z-10">
//       {label}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className="w-full rounded-md border border-[#05347f] px-3 py-2.5 md:py-2 text-[13px] bg-white outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
//     >
//       <option value="">Select</option>
//       {options.map((opt, i) => (
//         <option key={i} value={opt}>
//           {opt}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// /* ================= FLOATING INPUT ================= */
// const FloatingInput = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   showNoSpam = false,
//   noSpamText = "✓ No Spam",
// }) => (
//   <div className="relative w-full">
//     <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] md:text-[11px] font-semibold text-[#05347f] z-10">
//       {label}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full rounded-md border border-[#05347f] px-3 py-2.5 md:py-2 text-[13px] outline-none focus:ring-1 focus:ring-blue-500 ${
//         showNoSpam ? "pr-24 md:pr-36" : ""
//       }`}
//     />
//     {showNoSpam && (
//       <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] md:text-[11px] text-green-600 border border-green-500 rounded-full px-1.5 py-[1px] bg-white whitespace-nowrap">
//         {noSpamText}
//       </span>
//     )}
//   </div>
// );

// /* ================= MAIN COMPONENT ================= */
// // ✅ added selectedUnis prop
// const Signup = ({ onClose, selectedUnis = [] }) => {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "", email: "", mobileNumber: "", city: "", state: "",
//     course: "", branch: "", gender: "", subsidyCoupon: "",
//     addresses: "", dob: "", otp: "",
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [subsidyOptions, setSubsidyOptions] = useState([]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const res = await api.get("/api/v1/states");
//         setStates(res.data.states || []);
//       } catch (err) { console.error("States fetch error", err); }
//     };
//     fetchStates();
//   }, []);

//   const handleStateChange = (e) => {
//     const state = e.target.value;
//     setFormData((prev) => ({ ...prev, state, city: "" }));
//     if (state) {
//       api.get(`/api/v1/districts/${state}`).then(res => setDistricts(res.data.districts || []));
//     } else {
//       setDistricts([]);
//     }
//   };

//   useEffect(() => {
//     api.get("/api/v1/course").then(res => {
//       let list = res.data.courses || res.data.data || res.data || [];
//       setCourses(list);
//     });
//   }, []);

//   const handleCourseChange = (e) => {
//     const name = e.target.value;
//     setFormData((prev) => ({ ...prev, course: name, branch: "" }));
//     const selected = courses.find((c) => c.name === name);
//     setSpecializations(selected?.specializations || []);
//   };

//   useEffect(() => {
//     api.get("/api/v1/offer/type/subsidy").then(res => {
//       let list = res.data.data || res.data || [];
//       setSubsidyOptions(list.map((item) => `${item.provider} ₹${item.amount} ${item.eligibility}`));
//     });
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (otpSent) {
//       if (!formData.otp) return alert("Enter OTP");
//       try {
//         setLoading(true);
//         const res = await api.post("/api/v1/verify-otp", { ...formData, emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
        
//         // Token save karna mat bhulna agar API de raha hai
//         if(res.data.token) localStorage.setItem("accessToken", res.data.token);

//         alert("Registration Successful");
        
//         // ✅ Redirect logic with University IDs
//         if (selectedUnis && selectedUnis.length > 0) {
//           const ids = selectedUnis.map(u => u._id).join(",");
//           router.push(`/comparedetail?ids=${ids}`);
//         } else {
//           router.push("/comparedetail");
//         }
        
//         onClose?.();
//       } catch (err) { 
//         alert("Invalid OTP or Registration failed"); 
//       } finally { 
//         setLoading(false); 
//       }
//     } else {
//       try {
//         setLoading(true);
//         await api.post("/api/v1/send-otp", { emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" });
//         setOtpSent(true);
//         alert("OTP Sent Successfully");
//       } catch { alert("User already exists or error sending OTP"); } finally { setLoading(false); }
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] p-2 md:p-4" onClick={onClose}>
//       <div 
//         className="bg-white w-full max-w-[850px] rounded-2xl p-4 md:p-8 relative overflow-y-auto max-h-[95vh] shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500  cursor-pointer  hover:text-black">
//           <X size={24} />
//         </button>

//         <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
//           <Image src="/images/n12.png" alt="Logo" width={90} height={45} className="w-[80px] md:w-[90px]" />
//           <div>
//             <p className="text-sm md:text-base font-bold text-[#253b7a]">#VidyaHaiTohSuccessHai</p>
//             <p className="text-[11px] md:text-[12px] text-gray-500">Student's Trusted Education Guidance Platform</p>
//           </div>
//         </div>

//         <div className="mb-6 overflow-x-auto no-scrollbar">
//           <div className="flex min-w-max gap-3 text-[10px] md:text-[11px] font-bold text-green-700 bg-green-50 p-2 rounded-lg border border-green-100">
//             <span>✅ No-Cost EMI</span> | <span>🎓 Govt-Approved</span> | <span>💼 100% Placement</span> | <span>📞 Free Counselling</span>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <FloatingInput label="Full Name" name="name" value={formData.name} onChange={handleChange} />

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             <FloatingInput label="Email Address" name="email" value={formData.email} onChange={handleChange} showNoSpam />
//             <FloatingInput label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} showNoSpam />
//             <FloatingSelect label="State" name="state" value={formData.state} onChange={handleStateChange} options={states} />
//             <FloatingSelect label="City / District" name="city" value={formData.city} onChange={handleChange} options={districts} />
//             <FloatingSelect label="Course" name="course" value={formData.course} onChange={handleCourseChange} options={courses.map((c) => c.name)} />
//             <FloatingSelect label="Specialization" name="branch" value={formData.branch} onChange={handleChange} options={specializations} />
//             <FloatingSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["male", "female", "other"]} />
//             <FloatingInput label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
//             <FloatingSelect label="Subsidy Option" name="subsidyCoupon" value={formData.subsidyCoupon} onChange={handleChange} options={subsidyOptions} />
//           </div>

//           <FloatingInput label="Full Address" name="addresses" value={formData.addresses} onChange={handleChange} />

//           {otpSent && (
//             <div className="animate-pulse">
//               <FloatingInput label="Enter 6-Digit OTP" name="otp" value={formData.otp} onChange={handleChange} />
//             </div>
//           )}

//           <button 
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#f15a24]  cursor-pointer hover:bg-[#d64d1d] text-white py-3 md:py-4 rounded-lg font-bold text-sm md:text-base transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
//           >
//             {loading ? "Processing..." : otpSent ? "VERIFY & REGISTER" : "COMPARE BEST UNIVERSITIES"}
//           </button>
//         </form>

//         <p className="text-center text-xs md:text-sm mt-5">
//           Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
//         </p>

//         <div className="text-center text-[10px] md:text-[11px] text-gray-500 mt-4 bg-gray-50 py-2 rounded-lg border border-dashed border-gray-300">
//           🔒 Your data is encrypted and 100% secure.
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/utlis/api";
import { X, ChevronDown, Check, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

/* ================= SHARED STYLES ================= */
const fieldStyle = {
  border: "1px solid var(--cv-neutral-border, #e3e8eb)",
  background: "var(--cv-surface, #ffffff)",
  color: "var(--cv-neutral-dark, #1f2a30)",
  colorScheme: "light dark",
};

const labelStyle = {
  background: "var(--cv-surface, #ffffff)",
  color: "var(--cv-primary, #51636e)",
};

const fieldClass =
  "w-full rounded-md px-2.5 py-2 text-[12px] outline-none transition focus:border-[var(--cv-accent,#c15304)] focus:ring-2 focus:ring-[var(--cv-accent,#c15304)]/20";

/* ================= FLOATING SELECT ================= */
const FloatingSelect = ({ label, name, value, onChange, options = [] }) => (
  <div className="relative w-full">
    <label
      className="absolute -top-1.5 left-2 px-1 text-[9px] font-bold uppercase tracking-wide z-10 rounded"
      style={labelStyle}
    >
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`${fieldClass} appearance-none pr-7 cursor-pointer`}
      style={fieldStyle}
    >
      <option value="">Select</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <ChevronDown
      className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
      style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}
      aria-hidden="true"
    />
  </div>
);

/* ================= FLOATING INPUT ================= */
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  showNoSpam = false,
  noSpamText = "No spam",
  ...rest
}) => (
  <div className="relative w-full">
    <label
      className="absolute -top-1.5 left-2 px-1 text-[9px] font-bold uppercase tracking-wide z-10 rounded"
      style={labelStyle}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`${fieldClass} ${showNoSpam ? "pr-14" : ""}`}
      style={fieldStyle}
      {...rest}
    />
    {showNoSpam && (
      <span
        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[8px] font-bold uppercase rounded-full px-1.5 py-0.5 whitespace-nowrap"
        style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
      >
        <Check className="w-2 h-2" aria-hidden="true" />
        {noSpamText}
      </span>
    )}
  </div>
);

/* ================= SECTION TITLE (chip style) ================= */
const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-1.5 mb-0.5">
    <h3
      className="text-[10px] font-bold uppercase tracking-[0.08em]"
      style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}
    >
      {children}
    </h3>
    <div
      className="flex-1 h-px"
      style={{ background: "var(--cv-neutral-border, #e3e8eb)" }}
    />
  </div>
);

/* ================= CIRCULAR LOGO ================= */
const CircleLogo = ({ size = 64 }) => (
  <div
    className="rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
    style={{
      width: size,
      height: size,
      background: "#ffffff",
      border: "2.5px solid var(--cv-accent, #c15304)",
    }}
  >
    <Image
      src="/images/n12.png"
      alt="Logo"
      width={size - 20}
      height={size - 20}
      className="object-contain"
    />
  </div>
);

const BENEFITS = [
  "No-cost EMI options",
  "Government-approved universities",
  "Placement support",
  "Free counselling",
];

/* ================= MAIN COMPONENT ================= */
const Signup = ({ onClose, selectedUnis = [], isLoggedIn = false }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", email: "", mobileNumber: "", city: "", state: "",
    course: "", branch: "", gender: "", subsidyCoupon: "",
    addresses: "", dob: "", otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [subsidyOptions, setSubsidyOptions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    if (isLoggedIn) {
      const ids = selectedUnis.map((u) => u._id).join(",");
      router.push(ids ? `/comparedetail?ids=${ids}` : "/comparedetail");
      onClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) return;
    const fetchStates = async () => {
      try {
        const res = await api.get("/api/v1/states");
        setStates(res.data.states || []);
      } catch (err) {
        console.error("States fetch error", err);
      }
    };
    fetchStates();
  }, [isLoggedIn]);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData((prev) => ({ ...prev, state, city: "" }));
    if (state) {
      api
        .get(`/api/v1/districts/${state}`)
        .then((res) => setDistricts(res.data.districts || []))
        .catch((err) => console.error("Districts fetch error", err));
    } else {
      setDistricts([]);
    }
  };

  useEffect(() => {
    if (isLoggedIn) return;
    api
      .get("/api/v1/course")
      .then((res) => {
        const list = res.data.courses || res.data.data || res.data || [];
        setCourses(list);
      })
      .catch((err) => console.error("Courses fetch error", err));
  }, [isLoggedIn]);

  const handleCourseChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({ ...prev, course: name, branch: "" }));
    const selected = courses.find((c) => c.name === name);
    setSpecializations(selected?.specializations || []);
  };

  useEffect(() => {
    if (isLoggedIn) return;
    api
      .get("/api/v1/offer/type/subsidy")
      .then((res) => {
        const list = res.data.data || res.data || [];
        setSubsidyOptions(
          list.map((item) => `${item.provider} ₹${item.amount} ${item.eligibility}`)
        );
      })
      .catch((err) => console.error("Subsidy fetch error", err));
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpSent) {
      if (!formData.otp) return alert("Enter OTP");
      try {
        setLoading(true);
        const res = await api.post("/api/v1/verify-otp", {
          ...formData,
          emailOrPhone: formData.email || formData.mobileNumber,
          purpose: "register",
        });

        if (res.data.token) localStorage.setItem("accessToken", res.data.token);

        alert("Registration Successful");

        if (selectedUnis && selectedUnis.length > 0) {
          const ids = selectedUnis.map((u) => u._id).join(",");
          router.push(`/comparedetail?ids=${ids}`);
        } else {
          router.push("/comparedetail");
        }

        onClose?.();
      } catch (err) {
        alert("Invalid OTP or Registration failed");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        await api.post("/api/v1/send-otp", {
          emailOrPhone: formData.email || formData.mobileNumber,
          purpose: "register",
        });
        setOtpSent(true);
        alert("OTP Sent Successfully");
      } catch {
        alert("User already exists or error sending OTP");
      } finally {
        setLoading(false);
      }
    }
  };

  if (isLoggedIn) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-[100] p-2 md:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[820px] rounded-2xl relative overflow-hidden shadow-2xl max-h-[92vh] grid grid-cols-1 md:grid-cols-[230px_1fr]"
        style={{ background: "var(--cv-surface, #ffffff)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 p-1 rounded-full cursor-pointer transition hover:opacity-80"
          style={{
            background: "var(--cv-neutral-light, #f5f7f8)",
            color: "var(--cv-neutral-mid, #5b6b75)",
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* LEFT PANEL */}
        <aside
          className="hidden md:flex flex-col justify-between p-4 relative overflow-hidden"
          style={{
            background:
              "radial-gradient(circle at 85% 10%, rgba(240,138,60,0.35) 0%, transparent 50%), linear-gradient(160deg, #3d4c56 0%, #26323a 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            <CircleLogo size={76} />
            <h2 className="mt-3 text-[15px] font-extrabold leading-snug" style={{ color: "#ffffff" }}>
              Compare the best universities
            </h2>
            <p className="mt-1 text-[10px] leading-relaxed" style={{ color: "#ffffff", opacity: 0.8 }}>
              Trusted education guidance for students.
            </p>

            {selectedUnis.length > 0 && (
              <div className="mt-4">
                <p className="text-[9px] font-bold mb-1 uppercase tracking-wider" style={{ color: "#ffffff", opacity: 0.7 }}>
                  You selected
                </p>
                <ul className="space-y-1">
                  {selectedUnis.map((u) => (
                    <li
                      key={u._id}
                      className="flex items-start gap-1.5 text-[10px] rounded px-1.5 py-1"
                      style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff" }}
                    >
                      <Check className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" style={{ color: "#f08a3c" }} />
                      <span className="line-clamp-2">{u.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <ul className="relative z-10 mt-4 space-y-1">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-1.5 text-[10px]" style={{ color: "#ffffff" }}>
                <span
                  className="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#f08a3c" }}
                >
                  <Check className="w-1.5 h-1.5" style={{ color: "#26323a" }} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </aside>

        {/* RIGHT: FORM */}
        <div className="overflow-y-auto max-h-[92vh] p-3.5 md:p-5">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-2 mb-3 pr-7">
            <CircleLogo size={52} />
            <div>
              <p className="text-[12px] font-bold" style={{ color: "var(--cv-neutral-dark, #1f2a30)" }}>
                Compare best universities
              </p>
              <p className="text-[9px]" style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}>
                Free counselling · Govt-approved
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--cv-accent, #c15304)" }} />
            <h1
              className="text-[15px] font-extrabold tracking-tight"
              style={{ color: "var(--cv-neutral-dark, #1f2a30)" }}
            >
              Create your free account
            </h1>
          </div>
          <p
            className="hidden md:block text-[10px] mb-3"
            style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}
          >
            Takes a minute. We'll show the right comparison.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Personal */}
            <section className="space-y-2">
              {/* <SectionTitle>Your details</SectionTitle> */}
              <FloatingInput label="Full name" name="name" value={formData.name} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-2">
                <FloatingInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} showNoSpam />
                <FloatingInput label="Mobile" name="mobileNumber" type="tel" inputMode="numeric" value={formData.mobileNumber} onChange={handleChange} showNoSpam />
                <FloatingSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["male", "female", "other"]} />
                <FloatingInput label="DOB" name="dob" type="date" value={formData.dob} onChange={handleChange} />
              </div>
            </section>

            {/* Education */}
            <section className="space-y-2">
              {/* <SectionTitle>Study preference</SectionTitle> */}
              <div className="grid grid-cols-2 gap-2">
                <FloatingSelect label="Course" name="course" value={formData.course} onChange={handleCourseChange} options={courses.map((c) => c.name)} />
                <FloatingSelect label="Specialization" name="branch" value={formData.branch} onChange={handleChange} options={specializations} />
              </div>
              <FloatingSelect label="Subsidy option" name="subsidyCoupon" value={formData.subsidyCoupon} onChange={handleChange} options={subsidyOptions} />
            </section>

            {/* Location */}
            <section className="space-y-2">
              {/* <SectionTitle>Your location</SectionTitle> */}
              <div className="grid grid-cols-2 gap-2">
                <FloatingSelect label="State" name="state" value={formData.state} onChange={handleStateChange} options={states} />
                <FloatingSelect label="City / District" name="city" value={formData.city} onChange={handleChange} options={districts} />
              </div>
              {/* <FloatingInput label="Full address" name="addresses" value={formData.addresses} onChange={handleChange} /> */}
            </section>

            {/* OTP */}
            {otpSent && (
              <section
                className="rounded-md p-2.5 space-y-2"
                style={{
                  background: "var(--cv-accent-light, #fdf0e6)",
                  border: "1px solid var(--cv-accent, #c15304)",
                }}
              >
                <p className="text-[10px] font-semibold leading-snug" style={{ color: "var(--cv-accent-dark, #8f3c03)" }}>
                  Code sent to {formData.email || formData.mobileNumber}
                </p>
                <FloatingInput
                  label="6-digit OTP"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={6}
                />
              </section>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-2.5 rounded-md font-bold text-[12px] md:text-[13px] transition cursor-pointer hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{
                background: "var(--cv-grad-cta, linear-gradient(180deg, #e0701a, #c15304))",
                boxShadow: "0 6px 16px rgba(193, 83, 4, 0.22)",
              }}
            >
              {loading
                ? "Processing..."
                : otpSent
                ? "Verify & register"
                : "Compare best universities"}
            </button>
          </form>

          <p
            className="text-center text-[10px] md:text-[11px] mt-3"
            style={{ color: "var(--cv-neutral-mid, #5b6b75)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold hover:underline"
              style={{ color: "var(--cv-accent, #c15304)" }}
            >
              Login
            </Link>
          </p>

          <div
            className="flex items-center justify-center gap-1 text-[9px] mt-2 py-1 rounded-md"
            style={{
              color: "var(--cv-neutral-mid, #5b6b75)",
              background: "var(--cv-neutral-light, #f5f7f8)",
              border: "1px dashed var(--cv-neutral-border, #e3e8eb)",
            }}
          >
            <ShieldCheck className="w-2.5 h-2.5" aria-hidden="true" />
            Data encrypted · 100% secure
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;