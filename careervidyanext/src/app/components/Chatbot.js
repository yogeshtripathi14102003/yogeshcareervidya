// "use client";

// import { useState, useEffect, useRef } from "react";
// import { X, Send, MessageCircle } from "lucide-react";
// import api from "@/utlis/api";

// const STATES = [
//   "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
//   "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
//   "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
//   "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
//   "Delhi","Jammu & Kashmir","Ladakh","Chandigarh","Puducherry",
// ];

// const OPTIONS = [
//   { key: "admission", label: "🎓 Admission" },
//   { key: "existing", label: "📚 Existing Student Query" },
//   { key: "other", label: "💬 Other Query" },
// ];

// export default function CareervidyaChatBot() {
//   const [open, setOpen] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);

//   // messages: { from: "bot" | "user", text }
//   const [messages, setMessages] = useState([
//     { from: "bot", text: "Welcome to Career Vidya 👋" },
//     { from: "bot", text: "How can I assist you?" },
//   ]);

//   // step: menu | step1 | step2 | other | done
//   const [step, setStep] = useState("menu");
//   const [flow, setFlow] = useState("");
//   const [sending, setSending] = useState(false);

//   const [data, setData] = useState({
//     name: "", email: "", mobile: "",
//     course: "", branch: "", state: "", city: "",
//     message: "",
//   });

//   const bodyRef = useRef(null);

//   useEffect(() => {
//     if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
//   }, [messages, step, open]);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");
//         const arr = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data || res.data?.courses || [];
//         setCourses(arr);
//       } catch (err) {
//         console.error("Course fetch error", err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const addMsg = (from, text) =>
//     setMessages((m) => [...m, { from, text }]);

//   const handleOption = (opt) => {
//     addMsg("user", opt.label);
//     setFlow(opt.key);

//     setTimeout(() => {
//       if (opt.key === "admission") {
//         addMsg("bot", "Great! Please share your basic details first.");
//         setStep("step1");
//       } else if (opt.key === "existing") {
//         addMsg("bot", "Please tell us your name, phone and your query. Our team will call you back.");
//         setStep("other");
//       } else {
//         addMsg("bot", "Please tell us your name, phone and your query. Our team will call you back.");
//         setStep("other");
//       }
//     }, 300);
//   };

//   const onChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "course") {
//       const selected = courses.find((c) => c.name === value);
//       setSpecializations(selected?.specializations || []);
//       setData((p) => ({ ...p, course: value, branch: "" }));
//     } else {
//       setData((p) => ({ ...p, [name]: value }));
//     }
//   };

//   // Step 1 -> Step 2
//   const handleNext = (e) => {
//     e.preventDefault();
//     addMsg("user", `${data.name} | ${data.email} | ${data.mobile}`);
//     setTimeout(() => {
//       addMsg("bot", `Thanks ${data.name}! Now select your course and location.`);
//       setStep("step2");
//     }, 300);
//   };

//   const submitLead = async (payload, successText) => {
//     setSending(true);
//     try {
//       await api.post("/api/v1/getintouch", payload);
//       addMsg("bot", successText);
//       setStep("done");
//     } catch (err) {
//       console.error(err);
//       addMsg("bot", "❌ Submission failed. Please try again.");
//     } finally {
//       setSending(false);
//     }
//   };

//   // Admission final submit
//   const handleAdmissionSubmit = async (e) => {
//     e.preventDefault();
//     addMsg("user", `${data.course} - ${data.branch} | ${data.city}, ${data.state}`);
//     await submitLead(
//       {
//         name: data.name,
//         email: data.email,
//         mobile: data.mobile,
//         course: data.course,
//         branch: data.branch,
//         state: data.state,
//         city: data.city,
//         message: `Chatbot Admission Enquiry | State: ${data.state}`,
//       },
//       "✅ Thank you! Our counsellor will contact you shortly."
//     );
//   };

//   // Existing / Other submit
//   const handleOtherSubmit = async (e) => {
//     e.preventDefault();
//     addMsg("user", `${data.name} | ${data.mobile} | ${data.message}`);
//     await submitLead(
//       {
//         name: data.name,
//         email: "This is  EQ leads ",
//         mobile: data.mobile,
//         course: "NA",
//         branch: "NA",
//         city: "NA",
//         message: `Chatbot ${flow === "existing" ? "Existing Student" : "Other"} Query: ${data.message}`,
//       },
//       "✅ Query received! Our team will get back to you soon."
//     );
//   };

//   const resetChat = () => {
//     setMessages([
//       { from: "bot", text: "Welcome to Career Vidya 👋" },
//       { from: "bot", text: "How can I assist you?" },
//     ]);
//     setStep("menu");
//     setFlow("");
//     setSpecializations([]);
//     setData({ name: "", email: "", mobile: "", course: "", branch: "", state: "", city: "", message: "" });
//   };

//   return (
//     <>
//       {/* Floating chat button */}
//       {!open && (
//         <button onClick={() => setOpen(true)} style={fabStyle} aria-label="Open chat">
//           <MessageCircle size={26} />
//         </button>
//       )}

//       {open && (
//         <div style={windowStyle}>
//           {/* Header */}
//           <div style={headerStyle}>
//             <div>
//               <div style={{ fontWeight: 700, fontSize: 15 }}>Career Vidya</div>
//               <div style={{ fontSize: 11, opacity: 0.9 }}>Online • We reply instantly</div>
//             </div>
//             <button onClick={() => setOpen(false)} style={headerCloseStyle} aria-label="Close chat">
//               <X size={18} />
//             </button>
//           </div>

//           {/* Body */}
//           <div ref={bodyRef} style={bodyStyle}>
//             {messages.map((m, i) => (
//               <div
//                 key={i}
//                 style={{
//                   display: "flex",
//                   justifyContent: m.from === "user" ? "flex-end" : "flex-start",
//                   marginBottom: 8,
//                 }}
//               >
//                 <div style={m.from === "user" ? userBubble : botBubble}>{m.text}</div>
//               </div>
//             ))}

//             {/* Menu options */}
//             {step === "menu" && (
//               <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
//                 {OPTIONS.map((o) => (
//                   <button key={o.key} onClick={() => handleOption(o)} style={optionBtn}>
//                     {o.label}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Admission - Step 1 */}
//             {step === "step1" && (
//               <form onSubmit={handleNext} style={formBox}>
//                 <input name="name" value={data.name} onChange={onChange} placeholder="Full Name *" required style={inputStyle} />
//                 <input type="email" name="email" value={data.email} onChange={onChange} placeholder="Email *" required style={inputStyle} />
//                 <input type="tel" name="mobile" value={data.mobile} onChange={onChange} placeholder="Phone Number *" required pattern="[0-9]{10}" title="Enter 10 digit mobile number" style={inputStyle} />
//                 <button type="submit" style={primaryBtn}>
//                   Next <Send size={13} />
//                 </button>
//               </form>
//             )}

//             {/* Admission - Step 2 */}
//             {step === "step2" && (
//               <form onSubmit={handleAdmissionSubmit} style={formBox}>
//                 <select name="course" value={data.course} onChange={onChange} required style={inputStyle}>
//                   <option value="">Select Course</option>
//                   {courses.map((c) => (
//                     <option key={c._id} value={c.name}>{c.name}</option>
//                   ))}
//                 </select>

//                 <select
//                   name="branch"
//                   value={data.branch}
//                   onChange={onChange}
//                   required
//                   disabled={!specializations.length}
//                   style={{ ...inputStyle, color: !specializations.length ? "#999" : "#222" }}
//                 >
//                   <option value="">Select Branch</option>
//                   {specializations.map((sp, i) => (
//                     <option key={i} value={sp}>{sp}</option>
//                   ))}
//                 </select>

//                 <select name="state" value={data.state} onChange={onChange} required style={inputStyle}>
//                   <option value="">Select State</option>
//                   {STATES.map((s) => (
//                     <option key={s} value={s}>{s}</option>
//                   ))}
//                 </select>

//                 <input name="city" value={data.city} onChange={onChange} placeholder="City *" required style={inputStyle} />

//                 <button type="submit" disabled={sending} style={{ ...primaryBtn, opacity: sending ? 0.7 : 1 }}>
//                   {sending ? "Submitting..." : "Submit"} <Send size={13} />
//                 </button>
//               </form>
//             )}

//             {/* Existing / Other */}
//             {step === "other" && (
//               <form onSubmit={handleOtherSubmit} style={formBox}>
//                 <input name="name" value={data.name} onChange={onChange} placeholder="Full Name *" required style={inputStyle} />
//                 <input type="tel" name="mobile" value={data.mobile} onChange={onChange} placeholder="Phone Number *" required pattern="[0-9]{10}" title="Enter 10 digit mobile number" style={inputStyle} />
//                 <textarea name="message" value={data.message} onChange={onChange} placeholder="Type your query *" required rows={3} style={{ ...inputStyle, height: "auto", padding: 10, resize: "none" }} />
//                 <button type="submit" disabled={sending} style={{ ...primaryBtn, opacity: sending ? 0.7 : 1 }}>
//                   {sending ? "Submitting..." : "Submit"} <Send size={13} />
//                 </button>
//               </form>
//             )}

//             {step === "done" && (
//               <button onClick={resetChat} style={{ ...optionBtn, marginTop: 6 }}>
//                 Start a new chat
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// /* ---------- Styles ---------- */

// const fabStyle = {
//   position: "fixed",
//   right: 20,
//   bottom: 20,
//   width: 56,
//   height: 56,
//   borderRadius: "50%",
//   border: "none",
//   background: "linear-gradient(135deg, #073d91, #05347f)",
//   color: "#fff",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   cursor: "pointer",
//   zIndex: 9998,
//   boxShadow: "0 8px 22px rgba(5,52,127,0.35)",
// };

// const windowStyle = {
//   position: "fixed",
//   right: 20,
//   bottom: 20,
//   width: "min(360px, calc(100vw - 24px))",
//   height: "min(560px, calc(100vh - 40px))",
//   background: "#fff",
//   borderRadius: 14,
//   border: "2px solid #ec7425",
//   boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
//   display: "flex",
//   flexDirection: "column",
//   overflow: "hidden",
//   zIndex: 10001,
// };

// const headerStyle = {
//   background: "linear-gradient(135deg, #073d91, #05347f)",
//   color: "#fff",
//   padding: "12px 14px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
// };

// const headerCloseStyle = {
//   background: "rgba(255,255,255,0.15)",
//   border: "none",
//   color: "#fff",
//   width: 30,
//   height: 30,
//   borderRadius: "50%",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   cursor: "pointer",
// };

// const bodyStyle = {
//   flex: 1,
//   overflowY: "auto",
//   padding: 14,
//   background: "#f6f8fb",
// };

// const botBubble = {
//   background: "#fff",
//   color: "#14213d",
//   padding: "9px 12px",
//   borderRadius: "12px 12px 12px 3px",
//   fontSize: 13,
//   maxWidth: "82%",
//   border: "1px solid #e3e8ef",
//   lineHeight: 1.4,
// };

// const userBubble = {
//   background: "#ec7425",
//   color: "#fff",
//   padding: "9px 12px",
//   borderRadius: "12px 12px 3px 12px",
//   fontSize: 13,
//   maxWidth: "82%",
//   lineHeight: 1.4,
//   wordBreak: "break-word",
// };

// const optionBtn = {
//   background: "#fff",
//   border: "1.5px solid #ec7425",
//   color: "#c15304",
//   padding: "10px 12px",
//   borderRadius: 8,
//   fontSize: 13,
//   fontWeight: 600,
//   cursor: "pointer",
//   textAlign: "left",
// };

// const formBox = {
//   display: "flex",
//   flexDirection: "column",
//   gap: 8,
//   background: "#fff",
//   border: "1px solid #e3e8ef",
//   borderRadius: 10,
//   padding: 12,
//   marginTop: 6,
// };

// const inputStyle = {
//   width: "100%",
//   height: 40,
//   padding: "0 10px",
//   borderRadius: 7,
//   border: "1px solid #dce3eb",
//   background: "#fff",
//   fontSize: 13,
//   color: "#222",
//   outline: "none",
//   boxSizing: "border-box",
//   fontFamily: "inherit",
// };

// const primaryBtn = {
//   minHeight: 40,
//   background: "linear-gradient(135deg, #073d91, #05347f)",
//   color: "#fff",
//   border: "none",
//   borderRadius: 7,
//   fontWeight: 700,
//   fontSize: 13,
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: 7,
// };


// "use client";

// import { useState, useEffect, useRef } from "react";
// import { X, Send, MessageCircle } from "lucide-react";
// import api from "@/utlis/api";

// // Chatbot ko upar/neeche karne ke liye ye number badlo (px)
// const BOTTOM_OFFSET = 90;

// // Teaser bubble me baar-baar type hone wala text
// const TYPING_PHRASES = ["Hii 👋 Welcome to Career Vidya", "Need help with admission?", "Chat with us!"];

// const STATES = [
//   "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
//   "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
//   "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
//   "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
//   "Delhi","Jammu & Kashmir","Ladakh","Chandigarh","Puducherry",
// ];

// const OPTIONS = [
//   { key: "admission", label: "🎓 Admission" },
//   { key: "existing", label: "📚 Existing Student Query" },
//   { key: "other", label: "💬 Other Query" },
// ];

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// const timeNow = () =>
//   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// function useTyping(phrases, active) {
//   const [text, setText] = useState("");
//   useEffect(() => {
//     if (!active) return;
//     let i = 0, j = 0, deleting = false, t;
//     const tick = () => {
//       const word = phrases[i];
//       if (!deleting) {
//         j++;
//         setText(word.slice(0, j));
//         if (j === word.length) { deleting = true; t = setTimeout(tick, 1600); return; }
//         t = setTimeout(tick, 70);
//       } else {
//         j--;
//         setText(word.slice(0, j));
//         if (j === 0) { deleting = false; i = (i + 1) % phrases.length; t = setTimeout(tick, 400); return; }
//         t = setTimeout(tick, 30);
//       }
//     };
//     t = setTimeout(tick, 800);
//     return () => clearTimeout(t);
//   }, [phrases, active]);
//   return text;
// }

// function Avatar({ size = 28 }) {
//   return (
//     <div style={{ ...avatarStyle, width: size, height: size, fontSize: size * 0.38 }}>CV</div>
//   );
// }

// export default function CareervidyaChatBot() {
//   const [open, setOpen] = useState(false);
//   const [seen, setSeen] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);

//   const [messages, setMessages] = useState([]);
//   const [botTyping, setBotTyping] = useState(false);
//   // init | menu | busy | step1 | step2 | other | done
//   const [step, setStep] = useState("init");
//   const [flow, setFlow] = useState("");
//   const [sending, setSending] = useState(false);

//   const [data, setData] = useState({
//     name: "", email: "", mobile: "",
//     course: "", branch: "", state: "", city: "", message: "",
//   });

//   const bodyRef = useRef(null);
//   const started = useRef(false);
//   const typedText = useTyping(TYPING_PHRASES, !open);

//   useEffect(() => {
//     if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
//   }, [messages, step, botTyping, open]);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");
//         const arr = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data || res.data?.courses || [];
//         setCourses(arr);
//       } catch (err) {
//         console.error("Course fetch error", err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const addMsg = (from, text) =>
//     setMessages((m) => [...m, { from, text, time: timeNow() }]);

//   // Bot pehle "typing..." dikhata hai, phir message
//   const botSay = async (texts) => {
//     for (const t of texts) {
//       setBotTyping(true);
//       await sleep(Math.min(500 + t.length * 18, 1400));
//       setBotTyping(false);
//       addMsg("bot", t);
//       await sleep(250);
//     }
//   };

//   const startChat = async () => {
//     await botSay(["Welcome to Career Vidya 👋", "How can I assist you?"]);
//     setStep("menu");
//   };

//   const openChat = () => {
//     setOpen(true);
//     setSeen(true);
//     if (!started.current) {
//       started.current = true;
//       startChat();
//     }
//   };

//   const handleOption = async (opt) => {
//     addMsg("user", opt.label);
//     setFlow(opt.key);
//     setStep("busy");
//     if (opt.key === "admission") {
//       await botSay(["Great choice! 🎓", "Please share your basic details first."]);
//       setStep("step1");
//     } else {
//       await botSay(["Sure, happy to help!", "Please share your name, phone and your query. Our team will call you back."]);
//       setStep("other");
//     }
//   };

//   const onChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "course") {
//       const selected = courses.find((c) => c.name === value);
//       setSpecializations(selected?.specializations || []);
//       setData((p) => ({ ...p, course: value, branch: "" }));
//     } else {
//       setData((p) => ({ ...p, [name]: value }));
//     }
//   };

//   const handleNext = async (e) => {
//     e.preventDefault();
//     addMsg("user", `${data.name}\n${data.email}\n${data.mobile}`);
//     setStep("busy");
//     await botSay([`Thanks ${data.name.split(" ")[0]}! 😊`, "Now select your course and location."]);
//     setStep("step2");
//   };

//   const submitLead = async (payload, successTexts, backStep) => {
//     setSending(true);
//     setStep("busy");
//     try {
//       await api.post("/api/v1/getintouch", payload);
//       await botSay(successTexts);
//       setStep("done");
//     } catch (err) {
//       console.error(err);
//       await botSay(["❌ Submission failed. Please try again."]);
//       setStep(backStep);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleAdmissionSubmit = (e) => {
//     e.preventDefault();
//     addMsg("user", `${data.course} - ${data.branch}\n${data.city}, ${data.state}`);
//     submitLead(
//       {
//         name: data.name,
//         email: data.email,
//         mobile: data.mobile,
//         course: data.course,
//         branch: data.branch,
//         state: data.state,
//         city: data.city,
//         message: `Chatbot Admission Enquiry | State: ${data.state}`,
//       },
//       ["✅ Thank you! Your details are submitted.", "Our counsellor will contact you shortly."],
//       "step2"
//     );
//   };

//   const handleOtherSubmit = (e) => {
//     e.preventDefault();
//     addMsg("user", `${data.name} | ${data.mobile}\n${data.message}`);
//     submitLead(
//       {
//         name: data.name,
//         email: "This is  EQ leads ",
//         mobile: data.mobile,
//         course: "NA",
//         branch: "NA",
//         city: "NA",
//         message: `Chatbot ${flow === "existing" ? "Existing Student" : "Other"} Query: ${data.message}`,
//       },
//       ["✅ Query received!", "Our team will get back to you soon."],
//       "other"
//     );
//   };

//   const resetChat = () => {
//     setMessages([]);
//     setStep("init");
//     setFlow("");
//     setSpecializations([]);
//     setData({ name: "", email: "", mobile: "", course: "", branch: "", state: "", city: "", message: "" });
//     startChat();
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes cvBlink{0%,49%{opacity:1}50%,100%{opacity:0}}
//         @keyframes cvDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}
//         @keyframes cvPop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
//         @keyframes cvPulse{0%{box-shadow:0 0 0 0 rgba(7,61,145,.45)}70%{box-shadow:0 0 0 14px rgba(7,61,145,0)}100%{box-shadow:0 0 0 0 rgba(7,61,145,0)}}
//       `}</style>

//       {/* Closed state: teaser bubble + round button */}
//       {!open && (
//         <>
//           <div onClick={openChat} style={teaserStyle}>
//             <span>{typedText}</span>
//             <span style={{ animation: "cvBlink 1s step-end infinite" }}>|</span>
//             <span style={teaserTail} />
//           </div>

//           <button onClick={openChat} style={fabStyle} aria-label="Open chat">
//             <MessageCircle size={26} />
//             <span style={onlineDot} />
//             {!seen && <span style={badgeStyle}>1</span>}
//           </button>
//         </>
//       )}

//       {open && (
//         <div style={windowStyle}>
//           {/* Header */}
//           <div style={headerStyle}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{ position: "relative" }}>
//                 <Avatar size={38} />
//                 <span style={{ ...onlineDot, right: 0, bottom: 0, width: 10, height: 10 }} />
//               </div>
//               <div>
//                 <div style={{ fontWeight: 700, fontSize: 15 }}>Career Vidya Assistant</div>
//                 <div style={{ fontSize: 11, opacity: 0.9 }}>
//                   {botTyping ? "typing..." : "Online"}
//                 </div>
//               </div>
//             </div>
//             <button onClick={() => setOpen(false)} style={headerCloseStyle} aria-label="Close chat">
//               <X size={18} />
//             </button>
//           </div>

//           {/* Body */}
//           <div ref={bodyRef} style={bodyStyle}>
//             {messages.map((m, i) => (
//               <div
//                 key={i}
//                 style={{
//                   display: "flex",
//                   justifyContent: m.from === "user" ? "flex-end" : "flex-start",
//                   alignItems: "flex-end",
//                   gap: 6,
//                   marginBottom: 10,
//                   animation: "cvPop .25s ease",
//                 }}
//               >
//                 {m.from === "bot" && <Avatar />}
//                 <div style={{ maxWidth: "78%" }}>
//                   <div style={m.from === "user" ? userBubble : botBubble}>{m.text}</div>
//                   <div style={{ ...timeStyle, textAlign: m.from === "user" ? "right" : "left" }}>
//                     {m.time}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {/* Bot typing indicator */}
//             {botTyping && (
//               <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 10 }}>
//                 <Avatar />
//                 <div style={{ ...botBubble, display: "flex", gap: 4, padding: "12px 14px" }}>
//                   {[0, 1, 2].map((d) => (
//                     <span
//                       key={d}
//                       style={{
//                         width: 6, height: 6, borderRadius: "50%", background: "#8a94a6",
//                         animation: `cvDot 1.2s ${d * 0.15}s infinite`,
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quick replies */}
//             {step === "menu" && !botTyping && (
//               <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginLeft: 34, animation: "cvPop .3s ease" }}>
//                 {OPTIONS.map((o) => (
//                   <button key={o.key} onClick={() => handleOption(o)} style={chipBtn}>
//                     {o.label}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Admission - Step 1 */}
//             {step === "step1" && !botTyping && (
//               <form onSubmit={handleNext} style={formBox}>
//                 <input name="name" value={data.name} onChange={onChange} placeholder="Full Name *" required style={inputStyle} />
//                 <input type="email" name="email" value={data.email} onChange={onChange} placeholder="Email *" required style={inputStyle} />
//                 <input type="tel" name="mobile" value={data.mobile} onChange={onChange} placeholder="Phone Number *" required pattern="[0-9]{10}" title="Enter 10 digit mobile number" style={inputStyle} />
//                 <button type="submit" style={primaryBtn}>Next <Send size={13} /></button>
//               </form>
//             )}

//             {/* Admission - Step 2 */}
//             {step === "step2" && !botTyping && (
//               <form onSubmit={handleAdmissionSubmit} style={formBox}>
//                 <select name="course" value={data.course} onChange={onChange} required style={inputStyle}>
//                   <option value="">Select Course</option>
//                   {courses.map((c) => (
//                     <option key={c._id} value={c.name}>{c.name}</option>
//                   ))}
//                 </select>

//                 <select
//                   name="branch"
//                   value={data.branch}
//                   onChange={onChange}
//                   required
//                   disabled={!specializations.length}
//                   style={{ ...inputStyle, color: !specializations.length ? "#999" : "#222" }}
//                 >
//                   <option value="">Select Branch</option>
//                   {specializations.map((sp, i) => (
//                     <option key={i} value={sp}>{sp}</option>
//                   ))}
//                 </select>

//                 <select name="state" value={data.state} onChange={onChange} required style={inputStyle}>
//                   <option value="">Select State</option>
//                   {STATES.map((s) => (
//                     <option key={s} value={s}>{s}</option>
//                   ))}
//                 </select>

//                 <input name="city" value={data.city} onChange={onChange} placeholder="City *" required style={inputStyle} />

//                 <button type="submit" disabled={sending} style={{ ...primaryBtn, opacity: sending ? 0.7 : 1 }}>
//                   Submit <Send size={13} />
//                 </button>
//               </form>
//             )}

//             {/* Existing / Other */}
//             {step === "other" && !botTyping && (
//               <form onSubmit={handleOtherSubmit} style={formBox}>
//                 <input name="name" value={data.name} onChange={onChange} placeholder="Full Name *" required style={inputStyle} />
//                 <input type="tel" name="mobile" value={data.mobile} onChange={onChange} placeholder="Phone Number *" required pattern="[0-9]{10}" title="Enter 10 digit mobile number" style={inputStyle} />
//                 <textarea name="message" value={data.message} onChange={onChange} placeholder="Type your query *" required rows={3} style={{ ...inputStyle, height: "auto", padding: 10, resize: "none" }} />
//                 <button type="submit" disabled={sending} style={{ ...primaryBtn, opacity: sending ? 0.7 : 1 }}>
//                   Submit <Send size={13} />
//                 </button>
//               </form>
//             )}

//             {step === "done" && !botTyping && (
//               <div style={{ marginLeft: 34 }}>
//                 <button onClick={resetChat} style={chipBtn}>🔄 Start a new chat</button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// /* ---------- Styles ---------- */

// const avatarStyle = {
//   borderRadius: "50%",
//   background: "#fff",
//   color: "#073d91",
//   border: "2px solid #ec7425",
//   fontWeight: 800,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   flexShrink: 0,
//   boxSizing: "border-box",
// };

// const fabStyle = {
//   position: "fixed",
//   right: 20,
//   bottom: BOTTOM_OFFSET,
//   width: 58,
//   height: 58,
//   borderRadius: "50%",
//   border: "none",
//   background: "linear-gradient(135deg, #073d91, #05347f)",
//   color: "#fff",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   cursor: "pointer",
//   zIndex: 9998,
//   animation: "cvPulse 2s infinite",
// };

// const onlineDot = {
//   position: "absolute",
//   right: 3,
//   bottom: 3,
//   width: 12,
//   height: 12,
//   borderRadius: "50%",
//   background: "#22c55e",
//   border: "2px solid #fff",
//   boxSizing: "border-box",
// };

// const badgeStyle = {
//   position: "absolute",
//   top: -2,
//   right: -2,
//   minWidth: 20,
//   height: 20,
//   borderRadius: 10,
//   background: "#ec7425",
//   color: "#fff",
//   fontSize: 11,
//   fontWeight: 700,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   border: "2px solid #fff",
//   boxSizing: "border-box",
// };

// const teaserStyle = {
//   position: "fixed",
//   right: 20,
//   bottom: BOTTOM_OFFSET + 72,
//   background: "#fff",
//   color: "#14213d",
//   fontSize: 13,
//   fontWeight: 600,
//   padding: "10px 14px",
//   borderRadius: 14,
//   border: "1.5px solid #ec7425",
//   boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
//   zIndex: 9998,
//   cursor: "pointer",
//   minWidth: 190,
//   maxWidth: "calc(100vw - 40px)",
//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
// };

// const teaserTail = {
//   position: "absolute",
//   right: 22,
//   bottom: -7,
//   width: 12,
//   height: 12,
//   background: "#fff",
//   borderRight: "1.5px solid #ec7425",
//   borderBottom: "1.5px solid #ec7425",
//   transform: "rotate(45deg)",
// };

// const windowStyle = {
//   position: "fixed",
//   right: 20,
//   bottom: BOTTOM_OFFSET,
//   width: "min(370px, calc(100vw - 24px))",
//   height: `min(580px, calc(100vh - ${BOTTOM_OFFSET + 20}px))`,
//   background: "#fff",
//   borderRadius: 16,
//   border: "2px solid #ec7425",
//   boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
//   display: "flex",
//   flexDirection: "column",
//   overflow: "hidden",
//   zIndex: 10001,
// };

// const headerStyle = {
//   background: "linear-gradient(135deg, #073d91, #05347f)",
//   color: "#fff",
//   padding: "12px 14px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
// };

// const headerCloseStyle = {
//   background: "rgba(255,255,255,0.15)",
//   border: "none",
//   color: "#fff",
//   width: 30,
//   height: 30,
//   borderRadius: "50%",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   cursor: "pointer",
// };

// const bodyStyle = {
//   flex: 1,
//   overflowY: "auto",
//   padding: 14,
//   background: "#f3f6fb",
// };

// const botBubble = {
//   background: "#fff",
//   color: "#14213d",
//   padding: "9px 12px",
//   borderRadius: "14px 14px 14px 3px",
//   fontSize: 13,
//   border: "1px solid #e3e8ef",
//   lineHeight: 1.45,
//   whiteSpace: "pre-line",
//   wordBreak: "break-word",
// };

// const userBubble = {
//   background: "linear-gradient(135deg, #ec7425, #c15304)",
//   color: "#fff",
//   padding: "9px 12px",
//   borderRadius: "14px 14px 3px 14px",
//   fontSize: 13,
//   lineHeight: 1.45,
//   whiteSpace: "pre-line",
//   wordBreak: "break-word",
// };

// const timeStyle = {
//   fontSize: 10,
//   color: "#9aa4b5",
//   marginTop: 3,
// };

// const chipBtn = {
//   background: "#fff",
//   border: "1.5px solid #073d91",
//   color: "#073d91",
//   padding: "8px 14px",
//   borderRadius: 20,
//   fontSize: 13,
//   fontWeight: 600,
//   cursor: "pointer",
// };

// const formBox = {
//   display: "flex",
//   flexDirection: "column",
//   gap: 8,
//   background: "#fff",
//   border: "1px solid #e3e8ef",
//   borderRadius: 12,
//   padding: 12,
//   marginLeft: 34,
//   animation: "cvPop .3s ease",
// };

// const inputStyle = {
//   width: "100%",
//   height: 40,
//   padding: "0 10px",
//   borderRadius: 8,
//   border: "1px solid #dce3eb",
//   background: "#fff",
//   fontSize: 13,
//   color: "#222",
//   outline: "none",
//   boxSizing: "border-box",
//   fontFamily: "inherit",
// };

// const primaryBtn = {
//   minHeight: 40,
//   background: "linear-gradient(135deg, #073d91, #05347f)",
//   color: "#fff",
//   border: "none",
//   borderRadius: 8,
//   fontWeight: 700,
//   fontSize: 13,
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: 7,
// };

"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import api from "@/utlis/api";

// Chatbot ko upar/neeche karne ke liye ye number badlo (px)
const BOTTOM_OFFSET = 90;

// Apni agent photo lagani ho to path likho, e.g. "/images/agent.png" (khali = built-in girl avatar)
const AGENT_IMG = "";

// Avatar ke bagal wali bubble me baar-baar type hone wala text
const TYPING_PHRASES = ["Welcome to Career Vidya!!", "How can I help you?", "Admission ke liye chat karein"];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Chandigarh","Puducherry",
];

const OPTIONS = [
  { key: "admission", label: "🎓 Admission" },
  { key: "existing", label: "📚 Existing Student Query" },
  { key: "other", label: "💬 Other Query" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function useTyping(phrases, active) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) return;
    let i = 0, j = 0, deleting = false, t;
    const tick = () => {
      const word = phrases[i];
      if (!deleting) {
        j++;
        setText(word.slice(0, j));
        if (j === word.length) { deleting = true; t = setTimeout(tick, 1600); return; }
        t = setTimeout(tick, 70);
      } else {
        j--;
        setText(word.slice(0, j));
        if (j === 0) { deleting = false; i = (i + 1) % phrases.length; t = setTimeout(tick, 400); return; }
        t = setTimeout(tick, 30);
      }
    };
    t = setTimeout(tick, 800);
    return () => clearTimeout(t);
  }, [phrases, active]);
  return text;
}

function Avatar({ size = 28 }) {
  const wrap = { width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#f39a3d", display: "block" };
  if (AGENT_IMG) return <img src={AGENT_IMG} alt="Career Vidya" style={{ ...wrap, objectFit: "cover" }} />;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={wrap} aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="#f39a3d" />
      <path d="M12 100 C12 78 30 70 50 70 C70 70 88 78 88 100 Z" fill="#1f6fc5" />
      <rect x="44" y="58" width="12" height="16" fill="#eeb08a" />
      <ellipse cx="50" cy="42" rx="24" ry="27" fill="#3b2418" />
      <ellipse cx="50" cy="45" rx="17" ry="20" fill="#f6c3a0" />
      <path d="M32 42 C33 22 67 22 68 42 C60 31 41 31 32 42Z" fill="#3b2418" />
      <circle cx="43" cy="46" r="1.8" fill="#222" />
      <circle cx="57" cy="46" r="1.8" fill="#222" />
      <path d="M43 54 Q50 60 57 54" stroke="#b3563f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M30 46 C26 20 74 20 70 46" stroke="#444" strokeWidth="3" fill="none" />
      <rect x="26" y="42" width="6" height="12" rx="3" fill="#444" />
      <rect x="68" y="42" width="6" height="12" rx="3" fill="#444" />
      <path d="M30 54 Q33 64 44 64" stroke="#444" strokeWidth="2" fill="none" />
      <circle cx="45" cy="64" r="2.2" fill="#444" />
    </svg>
  );
}

export default function CareervidyaChatBot() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  // init | menu | busy | step1 | step2 | other | done
  const [step, setStep] = useState("init");
  const [flow, setFlow] = useState("");
  const [sending, setSending] = useState(false);

  const [data, setData] = useState({
    name: "", email: "", mobile: "",
    course: "", branch: "", state: "", city: "", message: "",
  });

  const bodyRef = useRef(null);
  const started = useRef(false);
  const typedText = useTyping(TYPING_PHRASES, !open);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, step, botTyping, open]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/course");
        const arr = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.courses || [];
        setCourses(arr);
      } catch (err) {
        console.error("Course fetch error", err);
      }
    };
    fetchCourses();
  }, []);

  const addMsg = (from, text) =>
    setMessages((m) => [...m, { from, text, time: timeNow() }]);

  // Bot pehle "typing..." dikhata hai, phir message
  const botSay = async (texts) => {
    for (const t of texts) {
      setBotTyping(true);
      await sleep(Math.min(500 + t.length * 18, 1400));
      setBotTyping(false);
      addMsg("bot", t);
      await sleep(250);
    }
  };

  const startChat = async () => {
    await botSay(["Welcome to Career Vidya 👋", "How can I assist you?"]);
    setStep("menu");
  };

  const openChat = () => {
    setOpen(true);
    setSeen(true);
    if (!started.current) {
      started.current = true;
      startChat();
    }
  };

  const handleOption = async (opt) => {
    addMsg("user", opt.label);
    setFlow(opt.key);
    setStep("busy");
    if (opt.key === "admission") {
      await botSay(["Great choice! 🎓", "Please share your basic details first."]);
      setStep("step1");
    } else {
      await botSay(["Sure, happy to help!", "Please share your name, phone and your query. Our team will call you back."]);
      setStep("other");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "course") {
      const selected = courses.find((c) => c.name === value);
      setSpecializations(selected?.specializations || []);
      setData((p) => ({ ...p, course: value, branch: "" }));
    } else {
      setData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();
    addMsg("user", `${data.name}\n${data.email}\n${data.mobile}`);
    setStep("busy");
    await botSay([`Thanks ${data.name.split(" ")[0]}! 😊`, "Now select your course and location."]);
    setStep("step2");
  };

  const submitLead = async (payload, successTexts, backStep) => {
    setSending(true);
    setStep("busy");
    try {
      await api.post("/api/v1/getintouch", payload);
      await botSay(successTexts);
      setStep("done");
    } catch (err) {
      console.error(err);
      await botSay(["❌ Submission failed. Please try again."]);
      setStep(backStep);
    } finally {
      setSending(false);
    }
  };

  const handleAdmissionSubmit = (e) => {
    e.preventDefault();
    addMsg("user", `${data.course} - ${data.branch}\n${data.city}, ${data.state}`);
    submitLead(
      {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        course: data.course,
        branch: data.branch,
        state: data.state,
        city: data.city,
        message: `Chatbot Admission Enquiry | State: ${data.state}`,
      },
      ["✅ Thank you! Your details are submitted.", "Our counsellor will contact you shortly."],
      "step2"
    );
  };

  const handleOtherSubmit = (e) => {
    e.preventDefault();
    addMsg("user", `${data.name} | ${data.mobile}\n${data.message}`);
    submitLead(
      {
        name: data.name,
        email: "This is  EQ leads ",
        mobile: data.mobile,
        course: "NA",
        branch: "NA",
        city: "NA",
        message: `Chatbot ${flow === "existing" ? "Existing Student" : "Other"} Query: ${data.message}`,
      },
      ["✅ Query received!", "Our team will get back to you soon."],
      "other"
    );
  };

  const resetChat = () => {
    setMessages([]);
    setStep("init");
    setFlow("");
    setSpecializations([]);
    setData({ name: "", email: "", mobile: "", course: "", branch: "", state: "", city: "", message: "" });
    startChat();
  };

  return (
    <>
      <style>{`
        @keyframes cvBlink{0%,49%{opacity:1}50%,100%{opacity:0}}
        @keyframes cvDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}
        @keyframes cvPop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cvPulse{0%{box-shadow:0 0 0 0 rgba(7,61,145,.45)}70%{box-shadow:0 0 0 14px rgba(7,61,145,0)}100%{box-shadow:0 0 0 0 rgba(7,61,145,0)}}
      `}</style>

      {/* Closed state: welcome bubble + agent avatar */}
      {!open && (
        <>
          <div onClick={openChat} style={teaserStyle}>
            <span>{typedText}</span>
            <span style={{ animation: "cvBlink 1s step-end infinite" }}>|</span>
            <span style={teaserTail} />
          </div>

          <button onClick={openChat} style={fabStyle} aria-label="Open chat">
            <Avatar size={76} />
            <span style={{ ...onlineDot, right: 4, bottom: 4, width: 14, height: 14 }} />
            {!seen && <span style={badgeStyle}>1</span>}
          </button>
        </>
      )}

      {open && (
        <div style={windowStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <Avatar size={38} />
                <span style={{ ...onlineDot, right: 0, bottom: 0, width: 10, height: 10 }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Career Vidya Assistant</div>
                <div style={{ fontSize: 11, opacity: 0.9 }}>
                  {botTyping ? "typing..." : "Online"}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={headerCloseStyle} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div ref={bodyRef} style={bodyStyle}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: 6,
                  marginBottom: 10,
                  animation: "cvPop .25s ease",
                }}
              >
                {m.from === "bot" && <Avatar />}
                <div style={{ maxWidth: "78%" }}>
                  <div style={m.from === "user" ? userBubble : botBubble}>{m.text}</div>
                  <div style={{ ...timeStyle, textAlign: m.from === "user" ? "right" : "left" }}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Bot typing indicator */}
            {botTyping && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 10 }}>
                <Avatar />
                <div style={{ ...botBubble, display: "flex", gap: 4, padding: "12px 14px" }}>
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      style={{
                        width: 6, height: 6, borderRadius: "50%", background: "#8a94a6",
                        animation: `cvDot 1.2s ${d * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick replies */}
            {step === "menu" && !botTyping && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginLeft: 34, animation: "cvPop .3s ease" }}>
                {OPTIONS.map((o) => (
                  <button key={o.key} onClick={() => handleOption(o)} style={chipBtn}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}

            {/* Admission - Step 1 */}
            {step === "step1" && !botTyping && (
              <form onSubmit={handleNext} style={formBox}>
                <input name="name" value={data.name} onChange={onChange} placeholder="Full Name *" required style={inputStyle} />
                <input type="email" name="email" value={data.email} onChange={onChange} placeholder="Email *" required style={inputStyle} />
                <input type="tel" name="mobile" value={data.mobile} onChange={onChange} placeholder="Phone Number *" required pattern="[0-9]{10}" title="Enter 10 digit mobile number" style={inputStyle} />
                <button type="submit" style={primaryBtn}>Next <Send size={13} /></button>
              </form>
            )}

            {/* Admission - Step 2 */}
            {step === "step2" && !botTyping && (
              <form onSubmit={handleAdmissionSubmit} style={formBox}>
                <select name="course" value={data.course} onChange={onChange} required style={inputStyle}>
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  name="branch"
                  value={data.branch}
                  onChange={onChange}
                  required
                  disabled={!specializations.length}
                  style={{ ...inputStyle, color: !specializations.length ? "#999" : "#222" }}
                >
                  <option value="">Select Branch</option>
                  {specializations.map((sp, i) => (
                    <option key={i} value={sp}>{sp}</option>
                  ))}
                </select>

                <select name="state" value={data.state} onChange={onChange} required style={inputStyle}>
                  <option value="">Select State</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <input name="city" value={data.city} onChange={onChange} placeholder="City *" required style={inputStyle} />

                <button type="submit" disabled={sending} style={{ ...primaryBtn, opacity: sending ? 0.7 : 1 }}>
                  Submit <Send size={13} />
                </button>
              </form>
            )}

            {/* Existing / Other */}
            {step === "other" && !botTyping && (
              <form onSubmit={handleOtherSubmit} style={formBox}>
                <input name="name" value={data.name} onChange={onChange} placeholder="Full Name *" required style={inputStyle} />
                <input type="tel" name="mobile" value={data.mobile} onChange={onChange} placeholder="Phone Number *" required pattern="[0-9]{10}" title="Enter 10 digit mobile number" style={inputStyle} />
                <textarea name="message" value={data.message} onChange={onChange} placeholder="Type your query *" required rows={3} style={{ ...inputStyle, height: "auto", padding: 10, resize: "none" }} />
                <button type="submit" disabled={sending} style={{ ...primaryBtn, opacity: sending ? 0.7 : 1 }}>
                  Submit <Send size={13} />
                </button>
              </form>
            )}

            {step === "done" && !botTyping && (
              <div style={{ marginLeft: 34 }}>
                <button onClick={resetChat} style={chipBtn}>🔄 Start a new chat</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Styles ---------- */

const fabStyle = {
  position: "fixed",
  right: 20,
  bottom: BOTTOM_OFFSET,
  width: 76,
  height: 76,
  padding: 0,
  borderRadius: "50%",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  zIndex: 9998,
  boxShadow: "0 8px 22px rgba(0,0,0,0.28)",
};

const onlineDot = {
  position: "absolute",
  right: 3,
  bottom: 3,
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: "#22c55e",
  border: "2px solid #fff",
  boxSizing: "border-box",
};

const badgeStyle = {
  position: "absolute",
  top: -2,
  right: -2,
  minWidth: 20,
  height: 20,
  borderRadius: 10,
  background: "#ec7425",
  color: "#fff",
  fontSize: 11,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #fff",
  boxSizing: "border-box",
};

const teaserStyle = {
  position: "fixed",
  right: 112,
  bottom: BOTTOM_OFFSET + 3,
  width: "min(190px, calc(100vw - 140px))",
  minHeight: 70,
  background: "#fff",
  color: "#14213d",
  fontSize: 16,
  lineHeight: 1.4,
  padding: "12px 16px",
  borderRadius: 14,
  boxShadow: "0 10px 28px rgba(0,0,0,0.22)",
  zIndex: 9998,
  cursor: "pointer",
  boxSizing: "border-box",
  display: "block",
};

const teaserTail = {
  position: "absolute",
  right: -6,
  top: "50%",
  width: 14,
  height: 14,
  background: "#fff",
  transform: "translateY(-50%) rotate(45deg)",
  borderRadius: 2,
};

const windowStyle = {
  position: "fixed",
  right: 20,
  bottom: BOTTOM_OFFSET,
  width: "min(370px, calc(100vw - 24px))",
  height: `min(580px, calc(100vh - ${BOTTOM_OFFSET + 20}px))`,
  background: "#fff",
  borderRadius: 16,
  border: "2px solid #ec7425",
  boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  zIndex: 10001,
};

const headerStyle = {
  background: "linear-gradient(135deg, #073d91, #05347f)",
  color: "#fff",
  padding: "12px 14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const headerCloseStyle = {
  background: "rgba(255,255,255,0.15)",
  border: "none",
  color: "#fff",
  width: 30,
  height: 30,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const bodyStyle = {
  flex: 1,
  overflowY: "auto",
  padding: 14,
  background: "#f3f6fb",
};

const botBubble = {
  background: "#fff",
  color: "#14213d",
  padding: "9px 12px",
  borderRadius: "14px 14px 14px 3px",
  fontSize: 13,
  border: "1px solid #e3e8ef",
  lineHeight: 1.45,
  whiteSpace: "pre-line",
  wordBreak: "break-word",
};

const userBubble = {
  background: "linear-gradient(135deg, #ec7425, #c15304)",
  color: "#fff",
  padding: "9px 12px",
  borderRadius: "14px 14px 3px 14px",
  fontSize: 13,
  lineHeight: 1.45,
  whiteSpace: "pre-line",
  wordBreak: "break-word",
};

const timeStyle = {
  fontSize: 10,
  color: "#9aa4b5",
  marginTop: 3,
};

const chipBtn = {
  background: "#fff",
  border: "1.5px solid #073d91",
  color: "#073d91",
  padding: "8px 14px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const formBox = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  background: "#fff",
  border: "1px solid #e3e8ef",
  borderRadius: 12,
  padding: 12,
  marginLeft: 34,
  animation: "cvPop .3s ease",
};

const inputStyle = {
  width: "100%",
  height: 40,
  padding: "0 10px",
  borderRadius: 8,
  border: "1px solid #dce3eb",
  background: "#fff",
  fontSize: 13,
  color: "#222",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const primaryBtn = {
  minHeight: 40,
  background: "linear-gradient(135deg, #073d91, #05347f)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
};