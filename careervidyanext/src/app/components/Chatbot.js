


// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   X,
//   Send,
//   MessageCircle,
//   GraduationCap,
//   Headset,
//   BriefcaseBusiness,
//   PhoneCall,
//   ArrowLeft,
//   ExternalLink,
//   CheckCircle2,
//   RotateCcw,
//   ChevronRight,
//   Languages,
// } from "lucide-react";
// import api from "@/utlis/api";

// const BOTTOM_OFFSET = 90;

// const TEAM_URL = "https://careervidya.in/our-Team";
// const JOB_URL = "https://jobportal.careervidya.in/";
// const SUPPORT_PHONE = "9289716667";

// const STATES = [
//   "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
//   "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
//   "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
//   "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
//   "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
//   "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
//   "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
//   "Chandigarh", "Puducherry",
// ];

// // Values sent to the backend are always English (see EXPERIENCE_VALUES)
// const EXPERIENCE_VALUES = [
//   "Fresher",
//   "Less than 1 year",
//   "1-3 years",
//   "3-5 years",
//   "5+ years",
// ];

// /* ---------------- TRANSLATIONS ---------------- */

// const T = {
//   en: {
//     code: "en",
//     langName: "English",
//     online: "Online",
//     typing: "typing...",
//     teaserTitle: "Need career guidance?",
//     teaserSub: "Chat with our team 👋",
//     close: "Close chat",
//     welcome1: "Welcome to Career Vidya! 👋",
//     welcome2: "How can we help you today?",
//     welcomeBack1: "Welcome back to Career Vidya! 👋",
//     welcomeBack2: "How else can we help you?",

//     optAdmission: "Looking for Admission",
//     optAdmissionSub: "Find the right course for your future",
//     optCounselling: "Looking for Counselling",
//     optCounsellingSub: "Get guidance from our experts",
//     optJob: "Looking for a Job",
//     optJobSub: "Fill in your details and we'll help",
//     optExisting: "Existing Student Support",
//     optExistingSub: "Get help with your student query",

//     admIntro1: "Let's find the right course for you! 🎓",
//     admIntro2: "First, please share your basic details.",
//     counIntro1: "Great! Our counsellors can help you choose the right course.",
//     counIntro2: "Share your details and we'll call you back.",
//     jobIntro1: "We'd love to help you find a job. 💼",
//     jobIntro2: "Fill in the form below and our team will contact you.",
//     existIntro1: "We're happy to help you! 💬",
//     existIntro2: "Tell us your name, phone number and query.",
//     thanks: (n) => `Thank you, ${n}! 😊`,
//     admNext: "Now choose your course and location.",
//     admDone1: "Thank you! Your admission enquiry has been submitted. ✅",
//     admDone2: "Our counsellor will contact you shortly.",
//     counDone1: "Your counselling request has been received! ✅",
//     counDone2: "Our team will contact you soon.",
//     jobDone1: "Your job enquiry has been submitted. ✅",
//     jobDone2: "Our team will contact you soon. You can also browse the Job Portal.",
//     existDone1: "Your support query has been received! ✅",
//     existDone2: "Our team will get back to you soon.",
//     err1: "Sorry, your enquiry could not be submitted.",
//     err2: "Please check your connection and try again.",
//     errDefault: "Unable to submit your details. Please try again.",

//     fullName: "Full name",
//     email: "Email address",
//     emailOpt: "Email (optional)",
//     mobile: "10-digit mobile number",
//     mobileTitle: "Enter exactly 10 digits",
//     course: "Course",
//     specialization: "Specialization",
//     state: "State",
//     city: "City",
//     cityOpt: "Preferred city (optional)",
//     interestedCourse: "Interested course (optional)",
//     queryOpt: "Your query (optional)",
//     query: "Your query",
//     jobRole: "Job role / field (e.g. Sales, IT, HR)",
//     experience: "Experience",
//     selectCourse: "Select course",
//     selectSpec: "Select specialization",
//     noSpec: "No specialization available",
//     selectState: "Select state",
//     selectExp: "Select experience",
//     expLabels: ["Fresher", "Less than 1 year", "1-3 years", "3-5 years", "5+ years"],
//     counQueryPh: "What would you like guidance on?",
//     existQueryPh: "Course, LMS, exams, assignments, etc.",

//     hBasic: "Your basic details",
//     hCourse: "Course and location",
//     hCoun: "Talk to a counsellor",
//     hCounHelp: "Get guidance on courses, eligibility and university selection.",
//     hJob: "Job enquiry form",
//     hJobHelp: "Fill in your details and our team will find the right opportunity for you.",
//     hSupport: "Student support",
//     hSupportHelp: "Describe your issue and our team will get back to you.",

//     btnContinue: "Continue",
//     btnAdm: "Submit Admission Enquiry",
//     btnCallback: "Request a Callback",
//     btnJob: "Submit Job Enquiry",
//     btnQuery: "Submit Query",
//     submitting: "Submitting...",
//     back: "Back",
//     meetTeam: "Meet Our Counsellors",
//     viewJobs: "Browse Job Portal",
//     openJobs: "Open Job Portal",
//     call: "Call",
//     startNew: "Start a new chat",
//     thankYou: "Thank you!",
//     doneText: "Your request has been submitted. Our team will contact you soon.",
//     poweredBy: "Powered by",

//     notSpecified: "Course not specified",
//     callbackReq: "Counselling callback requested",
//   },

//   hi: {
//     code: "hi",
//     langName: "हिन्दी",
//     online: "ऑनलाइन",
//     typing: "टाइप कर रही है...",
//     teaserTitle: "करियर गाइडेंस चाहिए?",
//     teaserSub: "हमारी टीम से चैट करें 👋",
//     close: "चैट बंद करें",
//     welcome1: "Career Vidya में आपका स्वागत है! 👋",
//     welcome2: "आज हम आपकी कैसे मदद कर सकते हैं?",
//     welcomeBack1: "Career Vidya में आपका फिर से स्वागत है! 👋",
//     welcomeBack2: "हम आपकी और कैसे मदद कर सकते हैं?",

//     optAdmission: "एडमिशन लेना है",
//     optAdmissionSub: "अपने भविष्य के लिए सही कोर्स चुनें",
//     optCounselling: "काउंसलिंग चाहिए",
//     optCounsellingSub: "हमारे एक्सपर्ट्स से सलाह लें",
//     optJob: "नौकरी चाहिए",
//     optJobSub: "अपनी जानकारी भरें, हम मदद करेंगे",
//     optExisting: "मौजूदा स्टूडेंट सपोर्ट",
//     optExistingSub: "अपनी समस्या के लिए मदद पाएं",

//     admIntro1: "चलिए आपके लिए सही कोर्स ढूंढते हैं! 🎓",
//     admIntro2: "पहले अपनी बेसिक जानकारी भरें।",
//     counIntro1: "बढ़िया! हमारे काउंसलर सही कोर्स चुनने में आपकी मदद करेंगे।",
//     counIntro2: "अपनी जानकारी भरें, हम आपको कॉल करेंगे।",
//     jobIntro1: "हम नौकरी खोजने में आपकी मदद करेंगे। 💼",
//     jobIntro2: "नीचे फॉर्म भरें, हमारी टीम आपसे संपर्क करेगी।",
//     existIntro1: "हम आपकी मदद के लिए यहाँ हैं! 💬",
//     existIntro2: "अपना नाम, फ़ोन नंबर और सवाल बताएं।",
//     thanks: (n) => `धन्यवाद, ${n}! 😊`,
//     admNext: "अब अपना कोर्स और स्थान चुनें।",
//     admDone1: "धन्यवाद! आपकी एडमिशन एन्क्वायरी जमा हो गई है। ✅",
//     admDone2: "हमारे काउंसलर जल्द ही आपसे संपर्क करेंगे।",
//     counDone1: "आपकी काउंसलिंग रिक्वेस्ट मिल गई है! ✅",
//     counDone2: "हमारी टीम जल्द ही आपसे संपर्क करेगी।",
//     jobDone1: "आपकी जॉब एन्क्वायरी जमा हो गई है। ✅",
//     jobDone2: "हमारी टीम जल्द ही आपसे संपर्क करेगी। तब तक आप जॉब पोर्टल भी देख सकते हैं।",
//     existDone1: "आपकी सपोर्ट क्वेरी मिल गई है! ✅",
//     existDone2: "हमारी टीम जल्द ही आपको जवाब देगी।",
//     err1: "क्षमा करें, आपकी एन्क्वायरी जमा नहीं हो सकी।",
//     err2: "कृपया इंटरनेट जांचकर दोबारा कोशिश करें।",
//     errDefault: "आपकी जानकारी जमा नहीं हो सकी। कृपया दोबारा कोशिश करें।",

//     fullName: "पूरा नाम",
//     email: "ईमेल एड्रेस",
//     emailOpt: "ईमेल (वैकल्पिक)",
//     mobile: "10 अंकों का मोबाइल नंबर",
//     mobileTitle: "ठीक 10 अंक दर्ज करें",
//     course: "कोर्स",
//     specialization: "स्पेशलाइज़ेशन",
//     state: "राज्य",
//     city: "शहर",
//     cityOpt: "पसंदीदा शहर (वैकल्पिक)",
//     interestedCourse: "पसंदीदा कोर्स (वैकल्पिक)",
//     queryOpt: "आपका सवाल (वैकल्पिक)",
//     query: "आपका सवाल",
//     jobRole: "जॉब रोल / फील्ड (जैसे सेल्स, IT, HR)",
//     experience: "अनुभव",
//     selectCourse: "कोर्स चुनें",
//     selectSpec: "स्पेशलाइज़ेशन चुनें",
//     noSpec: "कोई स्पेशलाइज़ेशन उपलब्ध नहीं",
//     selectState: "राज्य चुनें",
//     selectExp: "अनुभव चुनें",
//     expLabels: ["फ्रेशर", "1 साल से कम", "1-3 साल", "3-5 साल", "5+ साल"],
//     counQueryPh: "आप किस बारे में सलाह चाहते हैं?",
//     existQueryPh: "कोर्स, LMS, परीक्षा, असाइनमेंट आदि",

//     hBasic: "आपकी बेसिक जानकारी",
//     hCourse: "कोर्स और स्थान",
//     hCoun: "काउंसलर से बात करें",
//     hCounHelp: "कोर्स, पात्रता और यूनिवर्सिटी चुनने में सलाह पाएं।",
//     hJob: "जॉब एन्क्वायरी फॉर्म",
//     hJobHelp: "अपनी जानकारी भरें, हमारी टीम आपके लिए सही अवसर ढूंढेगी।",
//     hSupport: "स्टूडेंट सपोर्ट",
//     hSupportHelp: "अपनी समस्या लिखें, हमारी टीम आपको जवाब देगी।",

//     btnContinue: "आगे बढ़ें",
//     btnAdm: "एडमिशन एन्क्वायरी भेजें",
//     btnCallback: "कॉलबैक का अनुरोध करें",
//     btnJob: "जॉब एन्क्वायरी भेजें",
//     btnQuery: "सवाल भेजें",
//     submitting: "जमा हो रहा है...",
//     back: "वापस",
//     meetTeam: "हमारे काउंसलर से मिलें",
//     viewJobs: "जॉब पोर्टल देखें",
//     openJobs: "जॉब पोर्टल खोलें",
//     call: "कॉल करें",
//     startNew: "नई चैट शुरू करें",
//     thankYou: "धन्यवाद!",
//     doneText: "आपकी रिक्वेस्ट जमा हो गई है। हमारी टीम जल्द ही आपसे संपर्क करेगी।",
//     poweredBy: "Powered by",

//     notSpecified: "कोर्स नहीं बताया",
//     callbackReq: "काउंसलिंग कॉलबैक चाहिए",
//   },
// };

// // First message is bilingual, before the person has chosen a language
// const GREETING = ["Hello! 👋  नमस्ते! 👋", "Please choose your language.\nकृपया अपनी भाषा चुनें।"];

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const timeNow = () =>
//   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// /* ---------- Girl avatar (inline SVG, no image needed) ---------- */
// function Avatar({ size = 34 }) {
//   return (
//     <svg
//       width={size}
//       height={size}
//       viewBox="0 0 100 100"
//       role="img"
//       aria-label="Career Vidya assistant"
//       style={{ flexShrink: 0, borderRadius: "50%", display: "block" }}
//     >
//       <defs>
//         <clipPath id="cvClip">
//           <circle cx="50" cy="50" r="50" />
//         </clipPath>
//       </defs>
//       <g clipPath="url(#cvClip)">
//         <rect width="100" height="100" fill="#DBEAFE" />
//         <path d="M22 52c0-22 12-34 28-34s28 12 28 34v26H22z" fill="#2B1B17" />
//         <path d="M14 100c2-20 16-30 36-30s34 10 36 30z" fill="#1E3A8A" />
//         <path d="M42 70l8 10 8-10z" fill="#F3C9A8" />
//         <rect x="43" y="58" width="14" height="16" rx="6" fill="#F3C9A8" />
//         <ellipse cx="50" cy="45" rx="19" ry="21" fill="#F8D5B8" />
//         <path d="M30 44c0-14 9-22 21-22 11 0 19 7 19 20-8-2-15-8-18-14-3 7-12 13-22 16z" fill="#2B1B17" />
//         <ellipse cx="42" cy="47" rx="2.2" ry="2.8" fill="#2B1B17" />
//         <ellipse cx="58" cy="47" rx="2.2" ry="2.8" fill="#2B1B17" />
//         <circle cx="42.7" cy="46" r=".7" fill="#fff" />
//         <circle cx="58.7" cy="46" r=".7" fill="#fff" />
//         <circle cx="38" cy="54" r="3.2" fill="#F9A8A8" opacity=".5" />
//         <circle cx="62" cy="54" r="3.2" fill="#F9A8A8" opacity=".5" />
//         <path d="M44 56c3 3.5 9 3.5 12 0" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round" />
//         <circle cx="50" cy="36" r="1.4" fill="#DC2626" />
//         <path d="M29 48c-2-20 8-30 21-30s23 10 21 30" stroke="#F97316" strokeWidth="3.2" fill="none" strokeLinecap="round" />
//         <rect x="25" y="46" width="7" height="13" rx="3.5" fill="#F97316" />
//         <rect x="68" y="46" width="7" height="13" rx="3.5" fill="#F97316" />
//         <path d="M71 59c0 8-8 10-15 10" stroke="#F97316" strokeWidth="2.4" fill="none" strokeLinecap="round" />
//         <circle cx="55" cy="69" r="3" fill="#F97316" />
//       </g>
//     </svg>
//   );
// }

// /* ---------- Fields (defined OUTSIDE the main component so inputs keep focus) ---------- */
// function Field({ label, children }) {
//   return (
//     <label style={fieldLabel}>
//       <span style={fieldCaption}>{label}</span>
//       {children}
//     </label>
//   );
// }

// function TextInput({ label, name, value, onChange, type = "text", required = true, ...rest }) {
//   return (
//     <Field label={label}>
//       <input
//         name={name}
//         type={type}
//         value={value}
//         onChange={onChange}
//         required={required}
//         placeholder={label}
//         style={inputStyle}
//         {...rest}
//       />
//     </Field>
//   );
// }

// const mobileProps = (title) => ({
//   type: "tel",
//   inputMode: "numeric",
//   pattern: "[0-9]{10}",
//   title,
//   minLength: 10,
//   maxLength: 10,
// });

// function TypingDots() {
//   return (
//     <div style={{ display: "flex", alignItems: "flex-end", gap: 7, marginBottom: 12 }}>
//       <Avatar size={27} />
//       <div style={{ ...botBubble, display: "flex", alignItems: "center", gap: 5, padding: "13px 14px" }}>
//         {[0, 1, 2].map((dot) => (
//           <span
//             key={dot}
//             style={{
//               width: 7,
//               height: 7,
//               borderRadius: "50%",
//               background: "#64748b",
//               animation: `cvDot 1.2s ${dot * 0.16}s infinite`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// const emptyData = {
//   name: "",
//   email: "",
//   mobile: "",
//   course: "",
//   branch: "",
//   state: "",
//   city: "",
//   message: "",
//   role: "",
//   experience: "",
// };

// export default function CareervidyaChatBot() {
//   const [open, setOpen] = useState(false);
//   const [seen, setSeen] = useState(false);
//   const [lang, setLang] = useState(null); // null until the person picks one
//   const [messages, setMessages] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [step, setStep] = useState("init");
//   const [flow, setFlow] = useState("");
//   const [botTyping, setBotTyping] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState("");
//   const [data, setData] = useState(emptyData);
//   const [teaserIdx, setTeaserIdx] = useState(0);

//   const bodyRef = useRef(null);
//   const started = useRef(false);
//   const busyRef = useRef(false);
//   const mountedRef = useRef(false);

//   const L = T[lang || "en"];

//   useEffect(() => {
//     mountedRef.current = true;

//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");
//         const result = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data || res.data?.courses || [];
//         if (mountedRef.current) setCourses(result);
//       } catch (err) {
//         console.error("Course fetch error:", err);
//       }
//     };

//     fetchCourses();
//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   useEffect(() => {
//     if (bodyRef.current) {
//       bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
//     }
//   }, [messages, step, botTyping, open]);

//   const addMsg = (from, text) => {
//     setMessages((previous) => [...previous, { from, text, time: timeNow() }]);
//   };

//   // Shows typing dots (also in the header) before every bot message
//   const botSay = async (texts) => {
//     for (const text of texts) {
//       setBotTyping(true);
//       await sleep(Math.min(700 + text.length * 18, 1600));
//       if (!mountedRef.current) return;
//       setBotTyping(false);
//       addMsg("bot", text);
//       await sleep(250);
//     }
//   };

//   const startChat = async () => {
//     if (busyRef.current) return;
//     busyRef.current = true;
//     try {
//       await botSay(GREETING);
//       setStep("lang");
//     } finally {
//       busyRef.current = false;
//     }
//   };

//   const openChat = () => {
//     setOpen(true);
//     setSeen(true);
//     if (!started.current) {
//       started.current = true;
//       startChat();
//     }
//   };

//   // Teaser text changes after 1s, chat opens by itself after 2s (once per session)
//   useEffect(() => {
//     try {
//       if (sessionStorage.getItem("cvAutoOpened")) return;
//     } catch (e) {}

//     const t1 = setTimeout(() => setTeaserIdx(1), 1000);
//     const t2 = setTimeout(() => {
//       try {
//         sessionStorage.setItem("cvAutoOpened", "1");
//       } catch (e) {}
//       if (!started.current) openChat();
//     }, 2000);

//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleLang = async (code) => {
//     if (busyRef.current) return;
//     busyRef.current = true;

//     const next = T[code];
//     addMsg("user", next.langName);
//     setLang(code);
//     setStep("busy");

//     try {
//       await botSay([next.welcome1, next.welcome2]);
//       setStep("menu");
//     } finally {
//       busyRef.current = false;
//     }
//   };

//   // Header switch: changes labels/forms right away, later bot messages use the new language
//   const switchLang = (code) => {
//     if (code !== lang) setLang(code);
//   };

//   const handleOption = async (key, title) => {
//     if (busyRef.current || sending) return;

//     busyRef.current = true;
//     addMsg("user", title);
//     setFlow(key);
//     setError("");
//     setStep("busy");

//     try {
//       if (key === "admission") {
//         await botSay([L.admIntro1, L.admIntro2]);
//         setStep("admission1");
//       } else if (key === "counselling") {
//         await botSay([L.counIntro1, L.counIntro2]);
//         setStep("counselling");
//       } else if (key === "job") {
//         await botSay([L.jobIntro1, L.jobIntro2]);
//         setStep("job");
//       } else {
//         await botSay([L.existIntro1, L.existIntro2]);
//         setStep("existing");
//       }
//     } finally {
//       busyRef.current = false;
//     }
//   };

//   const onChange = (event) => {
//     const { name, value } = event.target;

//     if (name === "mobile") {
//       setData((p) => ({ ...p, mobile: value.replace(/\D/g, "").slice(0, 10) }));
//       return;
//     }

//     if (name === "course" && flow === "admission") {
//       const selected = courses.find((c) => c.name === value);
//       setSpecializations(
//         Array.isArray(selected?.specializations) ? selected.specializations : []
//       );
//       setData((p) => ({ ...p, course: value, branch: "" }));
//       return;
//     }

//     setData((p) => ({ ...p, [name]: value }));
//   };

//   const handleNext = async (event) => {
//     event.preventDefault();
//     if (busyRef.current) return;

//     addMsg("user", `${data.name}\n${data.email}\n${data.mobile}`);

//     busyRef.current = true;
//     setStep("busy");

//     try {
//       await botSay([L.thanks(data.name.trim().split(" ")[0]), L.admNext]);
//       setStep("admission2");
//     } finally {
//       busyRef.current = false;
//     }
//   };

//   const submitLead = async ({ payload, successMessages, returnStep }) => {
//     if (busyRef.current || sending) return;

//     busyRef.current = true;
//     setSending(true);
//     setError("");
//     setStep("busy");

//     try {
//       await api.post("/api/v1/getintouch", payload);
//       await botSay(successMessages);
//       setStep("done");
//     } catch (err) {
//       console.error("Chatbot lead submission failed:", err);
//       setError(err?.response?.data?.message || L.errDefault);
//       await botSay([L.err1, L.err2]);
//       setStep(returnStep);
//     } finally {
//       busyRef.current = false;
//       setSending(false);
//     }
//   };

//   // NOTE: payloads below are always English so your team gets one consistent format.

//   const handleAdmissionSubmit = (event) => {
//     event.preventDefault();
//     addMsg(
//       "user",
//       `${data.course}${data.branch ? ` - ${data.branch}` : ""}\n${data.city}, ${data.state}`
//     );
//     return submitLead({
//       payload: {
//         name: data.name,
//         email: data.email,
//         mobile: data.mobile,
//         course: data.course,
//         branch: data.branch || "NA",
//         state: data.state,
//         city: data.city,
//         message: `Chatbot Admission Enquiry | State: ${data.state} | Language: ${L.code}`,
//       },
//       successMessages: [L.admDone1, L.admDone2],
//       returnStep: "admission2",
//     });
//   };

//   const handleCounsellingSubmit = (event) => {
//     event.preventDefault();
//     addMsg(
//       "user",
//       `${data.name} | ${data.mobile}\n${data.course || L.notSpecified}\n${data.message || L.callbackReq}`
//     );
//     return submitLead({
//       payload: {
//         name: data.name,
//         email: data.email || "Not provided",
//         mobile: data.mobile,
//         course: data.course || "Counselling",
//         branch: "NA",
//         city: data.city || "NA",
//         message: `Chatbot Counselling Enquiry: ${data.message || "Callback requested"} | Language: ${L.code}`,
//       },
//       successMessages: [L.counDone1, L.counDone2],
//       returnStep: "counselling",
//     });
//   };

//   const handleJobSubmit = (event) => {
//     event.preventDefault();
//     const expLabel = L.expLabels[EXPERIENCE_VALUES.indexOf(data.experience)] || data.experience;
//     addMsg(
//       "user",
//       `${data.name} | ${data.mobile}\n${data.role}\n${expLabel}${data.city ? `, ${data.city}` : ""}`
//     );
//     return submitLead({
//       payload: {
//         name: data.name,
//         email: data.email || "Not provided",
//         mobile: data.mobile,
//         course: "Job Enquiry",
//         branch: data.role || "NA",
//         city: data.city || "NA",
//         message: `Chatbot Job Enquiry | Role: ${data.role} | Experience: ${data.experience} | Language: ${L.code}`,
//       },
//       successMessages: [L.jobDone1, L.jobDone2],
//       returnStep: "job",
//     });
//   };

//   const handleExistingSubmit = (event) => {
//     event.preventDefault();
//     addMsg("user", `${data.name} | ${data.mobile}\n${data.message}`);
//     return submitLead({
//       payload: {
//         name: data.name,
//         email: data.email || "Not provided",
//         mobile: data.mobile,
//         course: "Existing Student Support",
//         branch: "NA",
//         city: data.city || "NA",
//         message: `Chatbot Existing Student Support: ${data.message} | Language: ${L.code}`,
//       },
//       successMessages: [L.existDone1, L.existDone2],
//       returnStep: "existing",
//     });
//   };

//   const resetChat = async () => {
//     if (busyRef.current) return;
//     busyRef.current = true;

//     setMessages([]);
//     setFlow("");
//     setError("");
//     setSpecializations([]);
//     setData(emptyData);
//     setStep("busy");

//     try {
//       await botSay([L.welcomeBack1, L.welcomeBack2]);
//       setStep("menu");
//     } finally {
//       busyRef.current = false;
//     }
//   };

//   const goBack = () => {
//     if (sending) return;
//     setError("");
//     if (step === "admission2") {
//       setStep("admission1");
//       return;
//     }
//     setFlow("");
//     setStep("menu");
//   };

//   const renderForm = ({ heading, helper, fields, submitLabel, icon, onSubmit, extra }) => (
//     <form onSubmit={onSubmit} style={formBox}>
//       <div style={formHeading}>{heading}</div>
//       {helper && <p style={helperText}>{helper}</p>}

//       {fields}

//       {error && (
//         <div role="alert" style={errorStyle}>
//           {error}
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={sending}
//         style={{ ...primaryBtn, opacity: sending ? 0.65 : 1 }}
//       >
//         {sending ? L.submitting : submitLabel}
//         {!sending && (icon || <Send size={15} />)}
//       </button>

//       {extra}

//       <button type="button" onClick={goBack} disabled={sending} style={backBtn}>
//         <ArrowLeft size={14} /> {L.back}
//       </button>
//     </form>
//   );

//   const OPTIONS = [
//     { key: "admission", title: L.optAdmission, subtitle: L.optAdmissionSub, icon: GraduationCap, color: "#1E3A8A", bg: "#EFF6FF" },
//     { key: "counselling", title: L.optCounselling, subtitle: L.optCounsellingSub, icon: Headset, color: "#C2410C", bg: "#FFF7ED" },
//     { key: "job", title: L.optJob, subtitle: L.optJobSub, icon: BriefcaseBusiness, color: "#047857", bg: "#ECFDF5" },
//     { key: "existing", title: L.optExisting, subtitle: L.optExistingSub, icon: MessageCircle, color: "#6D28D9", bg: "#F5F3FF" },
//   ];

//   const showForms = !botTyping;
//   const mp = mobileProps(L.mobileTitle);

//   return (
//     <>
//       <style>{`
//         @keyframes cvPop {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes cvExpand {
//           from { opacity: 0; transform: scale(.6) translateY(20px); }
//           to { opacity: 1; transform: scale(1) translateY(0); }
//         }
//         @keyframes cvPulse {
//           0%,100% { box-shadow: 0 8px 25px rgba(30,58,138,.22); }
//           50% { box-shadow: 0 8px 30px rgba(249,115,22,.35); }
//         }
//         @keyframes cvDot {
//           0%,60%,100% { transform: translateY(0); opacity: .4; }
//           30% { transform: translateY(-5px); opacity: 1; }
//         }
//         .cv-chat-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
//         .cv-chat-scroll input:focus,
//         .cv-chat-scroll select:focus,
//         .cv-chat-scroll textarea:focus {
//           border-color: #2563eb !important;
//           box-shadow: 0 0 0 3px rgba(37,99,235,.12);
//         }
//         .cv-chat-scroll input::placeholder,
//         .cv-chat-scroll textarea::placeholder { color: #94a3b8; }
//         .cv-pill { transition: transform .15s, background .15s, border-color .15s; }
//         .cv-pill:hover { transform: translateX(3px); }
//         .cv-pill:not(:first-child):hover { background: #F8FAFC !important; border-color: var(--pill) !important; }
//         .cv-pill:first-child:hover { filter: brightness(1.08); }
//         .cv-choice:hover { border-color: #2563eb !important; transform: translateY(-1px); }
//         .cv-chat-link:hover { filter: brightness(.96); }
//         .cv-chat-window button:focus-visible,
//         .cv-chat-window a:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
//         @media (max-width: 480px) {
//           .cv-chat-window {
//             right: 8px !important;
//             bottom: 8px !important;
//             width: calc(100vw - 16px) !important;
//             height: min(620px, calc(100dvh - 16px)) !important;
//             border-radius: 18px !important;
//           }
//           .cv-chat-fab { right: 14px !important; bottom: 22px !important; }
//           .cv-chat-teaser { right: 88px !important; bottom: 38px !important; }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .cv-chat-fab, .cv-choice, .cv-pill, .cv-chat-window { animation: none !important; transition: none !important; }
//         }
//       `}</style>

//       {!open && (
//         <>
//           <button
//             type="button"
//             className="cv-chat-teaser"
//             onClick={openChat}
//             style={teaserStyle}
//             aria-label="Chat with Career Vidya"
//           >
//             <span key={teaserIdx} style={{ animation: "cvPop .3s ease", display: "block" }}>
//               {teaserIdx === 0 ? (
//                 <span style={teaserMain}>Welcome to Career Vidya 👋</span>
//               ) : (
//                 <span style={teaserMain}>
//                   Need help? <span style={{ fontWeight: 600, color: "#475569" }}>/ मदद चाहिए?</span>
//                 </span>
//               )}
//             </span>
//           </button>

//           <button
//             type="button"
//             className="cv-chat-fab"
//             onClick={openChat}
//             style={fabStyle}
//             aria-label="Open Career Vidya chatbot"
//           >
//             <Avatar size={62} />
//             <span style={onlineDot} />
//             {!seen && <span style={badgeStyle}>1</span>}
//           </button>
//         </>
//       )}

//       {open && (
//         <section
//           className="cv-chat-window"
//           style={windowStyle}
//           aria-label="Career Vidya Assistant"
//         >
//           <header style={headerStyle}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
//               <div style={{ position: "relative" }}>
//                 <Avatar size={42} />
//                 <span style={onlineDot} />
//               </div>

//               <div style={{ minWidth: 0 }}>
//                 <div style={{ fontSize: 15, fontWeight: 800 }}>Career Vidya Assistant</div>
//                 <div style={{ fontSize: 11.5, opacity: 0.95 }}>
//                   {botTyping ? L.typing : L.online}
//                 </div>
//               </div>
//             </div>

//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               {lang && (
//                 <div style={langSwitch} role="group" aria-label="Language">
//                   <Languages size={13} style={{ marginLeft: 6, opacity: 0.85 }} />
//                   {["en", "hi"].map((code) => (
//                     <button
//                       key={code}
//                       type="button"
//                       onClick={() => switchLang(code)}
//                       aria-pressed={lang === code}
//                       style={{
//                         ...langBtn,
//                         background: lang === code ? "#fff" : "transparent",
//                         color: lang === code ? "#1E3A8A" : "#fff",
//                       }}
//                     >
//                       {code === "en" ? "EN" : "हिं"}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 style={headerCloseStyle}
//                 aria-label={L.close}
//               >
//                 <X size={19} />
//               </button>
//             </div>
//           </header>

//           <div ref={bodyRef} className="cv-chat-scroll" style={bodyStyle}>
//             {messages.map((message, index) => (
//               <div
//                 key={`${index}-${message.time}`}
//                 style={{
//                   display: "flex",
//                   justifyContent: message.from === "user" ? "flex-end" : "flex-start",
//                   alignItems: "flex-end",
//                   gap: 7,
//                   marginBottom: 12,
//                   animation: "cvPop .2s ease",
//                 }}
//               >
//                 {message.from === "bot" && <Avatar size={27} />}

//                 <div style={{ maxWidth: "82%", minWidth: 0 }}>
//                   <div style={message.from === "user" ? userBubble : botBubble}>
//                     {message.text}
//                   </div>
//                   <div
//                     style={{
//                       ...timeStyle,
//                       textAlign: message.from === "user" ? "right" : "left",
//                     }}
//                   >
//                     {message.time}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {botTyping && <TypingDots />}

//             {step === "lang" && showForms && (
//               <div style={{ marginLeft: 34, display: "grid", gap: 8 }}>
//                 {["en", "hi"].map((code) => (
//                   <button
//                     key={code}
//                     type="button"
//                     className="cv-choice"
//                     onClick={() => handleLang(code)}
//                     style={{ ...choiceStyle, justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#1E3A8A" }}
//                   >
//                     {T[code].langName}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {step === "menu" && showForms && (
//               <div style={menuList}>
//                 {OPTIONS.map((option, index) => {
//                   const Icon = option.icon;
//                   const primary = index === 0;
//                   return (
//                     <button
//                       key={option.key}
//                       type="button"
//                       className="cv-pill"
//                       onClick={() => handleOption(option.key, option.title)}
//                       style={{
//                         ...pillStyle,
//                         ...(primary
//                           ? { background: "linear-gradient(120deg,#1E3A8A,#2563EB)", color: "#fff", border: "1.5px solid transparent", boxShadow: "0 8px 20px rgba(37,99,235,.30)" }
//                           : { background: "#fff", color: "#0F172A", border: `1.5px solid ${option.color}33` }),
//                         "--pill": option.color,
//                       }}
//                     >
//                       <span
//                         style={{
//                           ...pillIcon,
//                           background: primary ? "rgba(255,255,255,.2)" : option.bg,
//                           color: primary ? "#fff" : option.color,
//                         }}
//                       >
//                         <Icon size={18} />
//                       </span>
//                       <span style={{ flex: 1, textAlign: "left" }}>{option.title}</span>
//                       <ChevronRight size={17} style={{ opacity: primary ? 0.9 : 0.5 }} />
//                     </button>
//                   );
//                 })}
//               </div>
//             )}

//             {step === "admission1" &&
//               showForms &&
//               renderForm({
//                 heading: L.hBasic,
//                 submitLabel: L.btnContinue,
//                 onSubmit: handleNext,
//                 fields: (
//                   <>
//                     <TextInput label={L.fullName} name="name" value={data.name} onChange={onChange} />
//                     <TextInput label={L.email} name="email" type="email" value={data.email} onChange={onChange} />
//                     <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mp} />
//                   </>
//                 ),
//               })}

//             {step === "admission2" &&
//               showForms &&
//               renderForm({
//                 heading: L.hCourse,
//                 submitLabel: L.btnAdm,
//                 onSubmit: handleAdmissionSubmit,
//                 fields: (
//                   <>
//                     <Field label={L.course}>
//                       <select name="course" value={data.course} onChange={onChange} required style={inputStyle}>
//                         <option value="">{L.selectCourse}</option>
//                         {courses.map((course) => (
//                           <option key={course._id || course.name} value={course.name}>
//                             {course.name}
//                           </option>
//                         ))}
//                       </select>
//                     </Field>

//                     <Field label={L.specialization}>
//                       <select
//                         name="branch"
//                         value={data.branch}
//                         onChange={onChange}
//                         disabled={!specializations.length}
//                         required={specializations.length > 0}
//                         style={{ ...inputStyle, opacity: specializations.length ? 1 : 0.7 }}
//                       >
//                         <option value="">
//                           {specializations.length ? L.selectSpec : L.noSpec}
//                         </option>
//                         {specializations.map((s, i) => (
//                           <option key={i} value={s}>{s}</option>
//                         ))}
//                       </select>
//                     </Field>

//                     <Field label={L.state}>
//                       <select name="state" value={data.state} onChange={onChange} required style={inputStyle}>
//                         <option value="">{L.selectState}</option>
//                         {STATES.map((s) => (
//                           <option key={s} value={s}>{s}</option>
//                         ))}
//                       </select>
//                     </Field>

//                     <TextInput label={L.city} name="city" value={data.city} onChange={onChange} />
//                   </>
//                 ),
//               })}

//             {step === "counselling" &&
//               showForms &&
//               renderForm({
//                 heading: L.hCoun,
//                 helper: L.hCounHelp,
//                 submitLabel: L.btnCallback,
//                 icon: <PhoneCall size={15} />,
//                 onSubmit: handleCounsellingSubmit,
//                 fields: (
//                   <>
//                     <TextInput label={L.fullName} name="name" value={data.name} onChange={onChange} />
//                     <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mp} />
//                     <TextInput label={L.interestedCourse} name="course" value={data.course} onChange={onChange} required={false} />
//                     <Field label={L.queryOpt}>
//                       <textarea
//                         name="message"
//                         value={data.message}
//                         onChange={onChange}
//                         placeholder={L.counQueryPh}
//                         rows={2}
//                         style={{ ...inputStyle, height: 66, padding: 10, resize: "none" }}
//                       />
//                     </Field>
//                   </>
//                 ),
//                 extra: (
//                   <a
//                     href={TEAM_URL}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="cv-chat-link"
//                     style={secondaryLink}
//                   >
//                     {L.meetTeam} <ExternalLink size={14} />
//                   </a>
//                 ),
//               })}

//             {step === "job" &&
//               showForms &&
//               renderForm({
//                 heading: L.hJob,
//                 helper: L.hJobHelp,
//                 submitLabel: L.btnJob,
//                 icon: <BriefcaseBusiness size={15} />,
//                 onSubmit: handleJobSubmit,
//                 fields: (
//                   <>
//                     <TextInput label={L.fullName} name="name" value={data.name} onChange={onChange} />
//                     <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mp} />
//                     <TextInput label={L.emailOpt} name="email" type="email" value={data.email} onChange={onChange} required={false} />
//                     <TextInput label={L.jobRole} name="role" value={data.role} onChange={onChange} />
//                     <Field label={L.experience}>
//                       <select name="experience" value={data.experience} onChange={onChange} required style={inputStyle}>
//                         <option value="">{L.selectExp}</option>
//                         {EXPERIENCE_VALUES.map((value, i) => (
//                           <option key={value} value={value}>{L.expLabels[i]}</option>
//                         ))}
//                       </select>
//                     </Field>
//                     <TextInput label={L.cityOpt} name="city" value={data.city} onChange={onChange} required={false} />
//                   </>
//                 ),
//                 extra: (
//                   <a
//                     href={JOB_URL}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="cv-chat-link"
//                     style={secondaryLink}
//                   >
//                     {L.viewJobs} <ExternalLink size={14} />
//                   </a>
//                 ),
//               })}

//             {step === "existing" &&
//               showForms &&
//               renderForm({
//                 heading: L.hSupport,
//                 helper: L.hSupportHelp,
//                 submitLabel: L.btnQuery,
//                 onSubmit: handleExistingSubmit,
//                 fields: (
//                   <>
//                     <TextInput label={L.fullName} name="name" value={data.name} onChange={onChange} />
//                     <TextInput label={L.mobile} name="mobile" value={data.mobile} onChange={onChange} {...mp} />
//                     <TextInput label={L.emailOpt} name="email" type="email" value={data.email} onChange={onChange} required={false} />
//                     <Field label={L.query}>
//                       <textarea
//                         name="message"
//                         value={data.message}
//                         onChange={onChange}
//                         placeholder={L.existQueryPh}
//                         rows={3}
//                         required
//                         style={{ ...inputStyle, height: 78, padding: 10, resize: "none" }}
//                       />
//                     </Field>
//                   </>
//                 ),
//                 extra: (
//                   <a href={`tel:+91${SUPPORT_PHONE}`} className="cv-chat-link" style={secondaryLink}>
//                     <PhoneCall size={14} /> {L.call} +91 {SUPPORT_PHONE}
//                   </a>
//                 ),
//               })}

//             {step === "done" && showForms && (
//               <div style={{ ...formBox, alignItems: "center" }}>
//                 <CheckCircle2 size={38} color="#16a34a" />
//                 <div style={formHeading}>{L.thankYou}</div>
//                 <p style={{ ...helperText, textAlign: "center" }}>{L.doneText}</p>

//                 {flow === "job" && (
//                   <a href={JOB_URL} target="_blank" rel="noopener noreferrer" style={primaryLink}>
//                     {L.openJobs} <ExternalLink size={15} />
//                   </a>
//                 )}

//                 <button type="button" onClick={resetChat} style={flow === "job" ? secondaryBtn : primaryBtn}>
//                   <RotateCcw size={15} /> {L.startNew}
//                 </button>
//               </div>
//             )}
//           </div>

//           <footer style={footerStyle}>
//             <span>{L.poweredBy}</span>
//             <strong>Career Vidya</strong>
//             <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
//               <PhoneCall size={12} />
//               <a href={`tel:+91${SUPPORT_PHONE}`} style={{ color: "#1E3A8A", textDecoration: "none" }}>
//                 {SUPPORT_PHONE}
//               </a>
//             </span>
//           </footer>
//         </section>
//       )}
//     </>
//   );
// }

// /* ---------------- STYLES ---------------- */

// const fabStyle = {
//   position: "fixed",
//   right: 20,
//   bottom: BOTTOM_OFFSET,
//   width: 68,
//   height: 68,
//   padding: 2,
//   display: "grid",
//   placeItems: "center",
//   borderRadius: "50%",
//   border: "3px solid #fff",
//   background: "#fff",
//   cursor: "pointer",
//   zIndex: 9998,
//   boxShadow: "0 8px 25px rgba(30,58,138,.25)",
//   animation: "cvPulse 3s infinite",
// };

// const onlineDot = {
//   position: "absolute",
//   right: 2,
//   bottom: 2,
//   width: 12,
//   height: 12,
//   borderRadius: "50%",
//   background: "#22c55e",
//   border: "2px solid #fff",
//   boxSizing: "border-box",
// };

// const badgeStyle = {
//   position: "absolute",
//   top: -3,
//   right: -3,
//   width: 20,
//   height: 20,
//   borderRadius: "50%",
//   background: "#F97316",
//   color: "#fff",
//   fontSize: 11,
//   fontWeight: 800,
//   display: "grid",
//   placeItems: "center",
// };

// const teaserMain = {
//   fontSize: 12.5,
//   fontWeight: 800,
//   color: "#1E3A8A",
//   whiteSpace: "nowrap",
// };

// const teaserStyle = {
//   position: "fixed",
//   right: 96,
//   bottom: BOTTOM_OFFSET + 18,
//   display: "block",
//   padding: "8px 13px",
//   border: "1px solid #e2e8f0",
//   borderRadius: 999,
//   background: "#fff",
//   boxShadow: "0 6px 18px rgba(15,23,42,.12)",
//   cursor: "pointer",
//   textAlign: "left",
//   zIndex: 9998,
//   fontFamily: "inherit",
// };

// const windowStyle = {
//   position: "fixed",
//   right: 20,
//   bottom: BOTTOM_OFFSET,
//   width: "min(390px, calc(100vw - 24px))",
//   height: `min(610px, calc(100dvh - ${BOTTOM_OFFSET + 15}px))`,
//   background: "#fff",
//   borderRadius: 19,
//   border: "1px solid #e2e8f0",
//   boxShadow: "0 20px 65px rgba(15,23,42,.25)",
//   display: "flex",
//   flexDirection: "column",
//   overflow: "hidden",
//   zIndex: 10001,
//   fontFamily: "inherit",
//   boxSizing: "border-box",
//   transformOrigin: "bottom right",
//   animation: "cvExpand .35s cubic-bezier(.2,.8,.2,1)",
// };

// const headerStyle = {
//   background: "linear-gradient(120deg,#1E3A8A,#1D4ED8)",
//   color: "#fff",
//   padding: "12px 12px 12px 15px",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   gap: 8,
//   flexShrink: 0,
// };

// const langSwitch = {
//   display: "flex",
//   alignItems: "center",
//   gap: 2,
//   padding: 2,
//   borderRadius: 999,
//   background: "rgba(255,255,255,.15)",
//   border: "1px solid rgba(255,255,255,.2)",
// };

// const langBtn = {
//   border: "none",
//   borderRadius: 999,
//   padding: "4px 8px",
//   fontSize: 11,
//   fontWeight: 800,
//   cursor: "pointer",
// };

// const headerCloseStyle = {
//   background: "rgba(255,255,255,.15)",
//   border: "1px solid rgba(255,255,255,.2)",
//   color: "#fff",
//   width: 32,
//   height: 32,
//   borderRadius: "50%",
//   display: "grid",
//   placeItems: "center",
//   cursor: "pointer",
//   flexShrink: 0,
// };

// const bodyStyle = {
//   flex: 1,
//   minHeight: 0,
//   overflowY: "auto",
//   padding: 13,
//   background: "#F8FAFC",
// };

// const botBubble = {
//   background: "#fff",
//   color: "#0F172A",
//   padding: "10px 12px",
//   borderRadius: "14px 14px 14px 3px",
//   fontSize: 13,
//   border: "1px solid #E2E8F0",
//   lineHeight: 1.55,
//   whiteSpace: "pre-line",
//   overflowWrap: "anywhere",
// };

// const userBubble = {
//   background: "linear-gradient(135deg,#1E3A8A,#2563EB)",
//   color: "#fff",
//   padding: "10px 12px",
//   borderRadius: "14px 14px 3px 14px",
//   fontSize: 13,
//   lineHeight: 1.55,
//   whiteSpace: "pre-line",
//   overflowWrap: "anywhere",
// };

// const timeStyle = {
//   fontSize: 10,
//   color: "#94A3B8",
//   marginTop: 4,
// };

// const menuList = {
//   display: "flex",
//   flexDirection: "column",
//   gap: 9,
//   alignItems: "stretch",
// };

// const pillStyle = {
//   display: "flex",
//   alignItems: "center",
//   gap: 11,
//   width: "100%",
//   minHeight: 48,
//   padding: "6px 14px 6px 7px",
//   borderRadius: 999,
//   cursor: "pointer",
//   fontSize: 13.5,
//   fontWeight: 800,
//   lineHeight: 1.3,
//   boxSizing: "border-box",
//   fontFamily: "inherit",
// };

// const pillIcon = {
//   width: 34,
//   height: 34,
//   borderRadius: "50%",
//   display: "grid",
//   placeItems: "center",
//   flexShrink: 0,
// };

// const choiceStyle = {
//   width: "100%",
//   display: "flex",
//   alignItems: "center",
//   gap: 10,
//   padding: "11px 10px",
//   background: "#fff",
//   border: "1px solid #E2E8F0",
//   borderRadius: 12,
//   cursor: "pointer",
//   textAlign: "left",
//   transition: "transform .15s,border-color .15s",
//   boxSizing: "border-box",
//   fontFamily: "inherit",
// };

// const choiceIcon = {
//   width: 40,
//   height: 40,
//   borderRadius: 11,
//   display: "grid",
//   placeItems: "center",
//   flexShrink: 0,
// };

// const choiceTitle = {
//   display: "block",
//   color: "#0F172A",
//   fontSize: 13,
//   fontWeight: 800,
//   lineHeight: 1.4,
// };

// const choiceSubtitle = {
//   display: "block",
//   color: "#64748B",
//   fontSize: 11,
//   lineHeight: 1.5,
//   marginTop: 2,
// };

// const formBox = {
//   display: "flex",
//   flexDirection: "column",
//   gap: 11,
//   marginLeft: 34,
//   marginBottom: 8,
//   background: "#fff",
//   border: "1px solid #E2E8F0",
//   borderRadius: 14,
//   padding: 14,
//   minWidth: 0,
//   animation: "cvPop .25s ease",
// };

// const formHeading = {
//   fontSize: 14.5,
//   fontWeight: 800,
//   color: "#1E3A8A",
// };

// const helperText = {
//   margin: 0,
//   fontSize: 12,
//   color: "#64748B",
//   lineHeight: 1.6,
// };

// const fieldLabel = {
//   display: "flex",
//   flexDirection: "column",
//   gap: 5,
//   width: "100%",
//   minWidth: 0,
// };

// const fieldCaption = {
//   fontSize: 11.5,
//   fontWeight: 600,
//   color: "#475569",
// };

// const inputStyle = {
//   width: "100%",
//   minWidth: 0,
//   height: 40,
//   padding: "0 10px",
//   borderRadius: 9,
//   border: "1px solid #CBD5E1",
//   background: "#fff",
//   color: "#0F172A",
//   fontSize: 13,
//   outline: "none",
//   boxSizing: "border-box",
//   fontFamily: "inherit",
// };

// const primaryBtn = {
//   width: "100%",
//   minHeight: 42,
//   padding: "9px 12px",
//   background: "linear-gradient(120deg,#1E3A8A,#2563EB)",
//   color: "#fff",
//   border: "none",
//   borderRadius: 9,
//   fontWeight: 700,
//   fontSize: 13,
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: 7,
//   textDecoration: "none",
//   boxSizing: "border-box",
//   fontFamily: "inherit",
// };

// const primaryLink = {
//   ...primaryBtn,
//   background: "linear-gradient(120deg,#047857,#059669)",
// };

// const secondaryBtn = {
//   ...primaryBtn,
//   background: "#EFF6FF",
//   color: "#1E3A8A",
//   border: "1px solid #DBEAFE",
// };

// const secondaryLink = {
//   width: "100%",
//   minHeight: 40,
//   padding: "9px 10px",
//   border: "1px solid #DBEAFE",
//   borderRadius: 9,
//   color: "#1E3A8A",
//   background: "#EFF6FF",
//   textDecoration: "none",
//   fontWeight: 700,
//   fontSize: 12.5,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: 7,
//   boxSizing: "border-box",
// };

// const backBtn = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   gap: 6,
//   padding: 6,
//   border: "none",
//   background: "transparent",
//   color: "#64748B",
//   fontSize: 12,
//   cursor: "pointer",
//   fontFamily: "inherit",
// };

// const errorStyle = {
//   background: "#FEF2F2",
//   color: "#B91C1C",
//   padding: 9,
//   borderRadius: 8,
//   fontSize: 11.5,
//   lineHeight: 1.5,
// };

// const footerStyle = {
//   minHeight: 31,
//   padding: "5px 13px",
//   borderTop: "1px solid #E2E8F0",
//   background: "#fff",
//   color: "#94A3B8",
//   fontSize: 10.5,
//   display: "flex",
//   alignItems: "center",
//   gap: 4,
//   flexShrink: 0,
// };


"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  MessageCircle,
  GraduationCap,
  Headset,
  BriefcaseBusiness,
  PhoneCall,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Check,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import api from "@/utlis/api";

const BOTTOM_OFFSET = 90;

const TEAM_URL = "https://careervidya.in/our-Team";
const JOB_URL = "https://jobportal.careervidya.in/";
const SUPPORT_PHONE = "9289716667";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
  "Chandigarh", "Puducherry",
];

const EXPERIENCE_VALUES = [
  "Fresher",
  "Less than 1 year",
  "1-3 years",
  "3-5 years",
  "5+ years",
];

/* ---------------- TEXT (English only) ---------------- */

const L = {
  online: "Online",
  typing: "typing...",
  close: "Close chat",

  greeting1: "Hello! 👋 Welcome to Career Vidya.",
  greeting2: "I'll guide you step by step. What would you like to do today?",
  welcomeBack1: "Welcome back to Career Vidya! 👋",
  welcomeBack2: "How else can we help you?",

  optAdmission: "Looking for Admission",
  optAdmissionSub: "Find the right course for your future",
  optCounselling: "Looking for Counselling",
  optCounsellingSub: "Get guidance from our experts",
  optJob: "Looking for a Job",
  optJobSub: "Share your details and we'll help",
  optExisting: "Existing Student Support",
  optExistingSub: "Get help with your student query",

  admIntro1: "Let's find the right course for you! 🎓",
  admIntro2:
    "It takes just 2 easy steps:\n① Share your name, email and phone\n② Choose your course and city\n\nThen our counsellor will call you with the best options.",
  counIntro1: "Great! Our counsellors will help you choose the right course. 🎧",
  counIntro2:
    "Here's how it works:\n① Fill in your name and phone number\n② Our expert calls you back\n③ You get guidance on courses and universities",
  jobIntro1: "We'd love to help you find a job. 💼",
  jobIntro2:
    "Here's how it works:\n① Fill in the short form\n② Our team checks your profile\n③ We contact you about suitable openings",
  existIntro1: "We're happy to help you! 💬",
  existIntro2:
    "Here's how it works:\n① Tell us your name, phone and issue\n② Our support team looks into it\n③ We get back to you",
  thanks: (n) => `Thank you, ${n}! 😊`,
  admNext: "Step 1 done ✅ Now choose your course and location.",
  admDone1: "Thank you! Your admission enquiry has been submitted. ✅",
  admDone2: "Our counsellor will contact you shortly.",
  counDone1: "Your counselling request has been received! ✅",
  counDone2: "Our team will contact you soon.",
  jobDone1: "Your job enquiry has been submitted. ✅",
  jobDone2: "Our team will contact you soon. You can also browse the Job Portal.",
  existDone1: "Your support query has been received! ✅",
  existDone2: "Our team will get back to you soon.",
  err1: "Sorry, your enquiry could not be submitted.",
  err2: "Please check your connection and try again.",
  errDefault: "Unable to submit your details. Please try again.",

  fullName: "Full name",
  email: "Email address",
  emailOpt: "Email (optional)",
  mobile: "10-digit mobile number",
  mobileTitle: "Enter a valid 10-digit mobile number",
  mobileHint: "We will call you on this number",
  emailHint: "We'll send course details here",
  course: "Course",
  specialization: "Specialization",
  state: "State",
  city: "City",
  cityOpt: "Preferred city (optional)",
  interestedCourse: "Interested course (optional)",
  queryOpt: "Your query (optional)",
  query: "Your query",
  jobRole: "Job role / field (e.g. Sales, IT, HR)",
  experience: "Experience",
  selectCourse: "Select course",
  selectSpec: "Select specialization",
  noSpec: "Select a course first",
  selectState: "Select state",
  selectExp: "Select experience",
  counQueryPh: "What would you like guidance on?",
  existQueryPh: "Course, LMS, exams, assignments, etc.",
  courseHint: "Pick the course you want to study",
  specHint: "Your subject area inside the course",

  hBasic: "Your basic details",
  hCourse: "Course and location",
  hCoun: "Talk to a counsellor",
  hCounHelp: "Get guidance on courses, eligibility and university selection.",
  hJob: "Job enquiry form",
  hJobHelp: "Fill in your details and our team will find the right opportunity for you.",
  hSupport: "Student support",
  hSupportHelp: "Describe your issue and our team will get back to you.",

  btnContinue: "Continue to step 2",
  btnAdm: "Submit Admission Enquiry",
  btnCallback: "Request a Callback",
  btnJob: "Submit Job Enquiry",
  btnQuery: "Submit Query",
  submitting: "Submitting...",
  back: "Back",
  meetTeam: "Meet Our Counsellors",
  viewJobs: "Browse Job Portal",
  openJobs: "Open Job Portal",
  call: "Call",
  startNew: "Start a new chat",
  thankYou: "All done!",
  doneText: "Your request has been submitted. Here's what happens next:",
  poweredBy: "Powered by",

  notSpecified: "Course not specified",
  callbackReq: "Counselling callback requested",
};

/* Step-by-step guide shown on top of every form */
const FLOWS = {
  admission: {
    doneAt: 2,
    steps: [
      { title: "Your details", text: "Name, email and phone" },
      { title: "Course & city", text: "Pick what you want to study" },
      { title: "Counsellor calls", text: "You get the best course options" },
    ],
  },
  counselling: {
    doneAt: 1,
    steps: [
      { title: "Fill the form", text: "Name and phone number" },
      { title: "We call you", text: "An expert counsellor calls you back" },
      { title: "Get guidance", text: "Courses, eligibility and universities" },
    ],
  },
  job: {
    doneAt: 1,
    steps: [
      { title: "Fill the form", text: "Tell us your role and experience" },
      { title: "Profile check", text: "Our team reviews your details" },
      { title: "We contact you", text: "About suitable job openings" },
    ],
  },
  existing: {
    doneAt: 1,
    steps: [
      { title: "Share your issue", text: "Name, phone and your query" },
      { title: "We look into it", text: "Our support team checks it" },
      { title: "We reply", text: "You get an answer on your phone" },
    ],
  },
};

const GREETING = [L.greeting1, L.greeting2];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ---------- Girl avatar (inline SVG, no image needed) ---------- */
function Avatar({ size = 34, animate = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Career Vidya assistant"
      style={{
        flexShrink: 0,
        borderRadius: "50%",
        display: "block",
        animation: animate ? "cvFloat 3s ease-in-out infinite" : undefined,
      }}
    >
      <defs>
        <clipPath id="cvClip">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath="url(#cvClip)">
        <rect width="100" height="100" fill="#DBEAFE" />
        <path d="M22 52c0-22 12-34 28-34s28 12 28 34v26H22z" fill="#2B1B17" />
        <path d="M14 100c2-20 16-30 36-30s34 10 36 30z" fill="#1E3A8A" />
        <path d="M42 70l8 10 8-10z" fill="#F3C9A8" />
        <rect x="43" y="58" width="14" height="16" rx="6" fill="#F3C9A8" />
        <ellipse cx="50" cy="45" rx="19" ry="21" fill="#F8D5B8" />
        <path d="M30 44c0-14 9-22 21-22 11 0 19 7 19 20-8-2-15-8-18-14-3 7-12 13-22 16z" fill="#2B1B17" />
        <ellipse cx="42" cy="47" rx="2.2" ry="2.8" fill="#2B1B17" />
        <ellipse cx="58" cy="47" rx="2.2" ry="2.8" fill="#2B1B17" />
        <circle cx="42.7" cy="46" r=".7" fill="#fff" />
        <circle cx="58.7" cy="46" r=".7" fill="#fff" />
        <circle cx="38" cy="54" r="3.2" fill="#F9A8A8" opacity=".5" />
        <circle cx="62" cy="54" r="3.2" fill="#F9A8A8" opacity=".5" />
        <path d="M44 56c3 3.5 9 3.5 12 0" stroke="#C0392B" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="36" r="1.4" fill="#DC2626" />
        <path d="M29 48c-2-20 8-30 21-30s23 10 21 30" stroke="#F97316" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <rect x="25" y="46" width="7" height="13" rx="3.5" fill="#F97316" />
        <rect x="68" y="46" width="7" height="13" rx="3.5" fill="#F97316" />
        <path d="M71 59c0 8-8 10-15 10" stroke="#F97316" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="55" cy="69" r="3" fill="#F97316" />
      </g>
    </svg>
  );
}

/* ---------- Fields (defined OUTSIDE the main component so inputs keep focus) ---------- */
function Field({ label, hint, children }) {
  return (
    <label style={fieldLabel}>
      <span style={fieldCaption}>{label}</span>
      {children}
      {hint && <span style={hintText}>{hint}</span>}
    </label>
  );
}

function TextInput({ label, hint, name, value, onChange, type = "text", required = true, ...rest }) {
  return (
    <Field label={label} hint={hint}>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={label}
        style={inputStyle}
        {...rest}
      />
    </Field>
  );
}

const mobileProps = {
  type: "tel",
  inputMode: "numeric",
  autoComplete: "tel",
  pattern: "[6-9][0-9]{9}",
  title: L.mobileTitle,
  minLength: 10,
  maxLength: 10,
};

/* ---------- Step-by-step progress bar ---------- */
function Stepper({ steps, current }) {
  return (
    <ol style={stepperStyle} aria-label="Progress">
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        const last = i === steps.length - 1;
        const leftOn = i <= current;
        const rightOn = i < current;
        return (
          <li
            key={s.title}
            style={stepItem}
            aria-current={state === "current" ? "step" : undefined}
          >
            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
              <span style={{ ...stepLine, background: i === 0 ? "transparent" : leftOn ? (state === "current" ? "#2563EB" : "#22c55e") : "#E2E8F0" }} />
              <span
                style={{
                  ...stepCircle,
                  ...(state === "done" && { background: "#22c55e", color: "#fff", border: "2px solid #22c55e" }),
                  ...(state === "current" && { background: "#2563EB", color: "#fff", border: "2px solid #2563EB", animation: "cvRing 1.8s infinite" }),
                  ...(state === "todo" && { background: "#fff", color: "#94A3B8", border: "2px solid #CBD5E1" }),
                }}
              >
                {state === "done" ? <Check size={16} strokeWidth={3} /> : i + 1}
              </span>
              <span style={{ ...stepLine, background: last ? "transparent" : rightOn ? "#22c55e" : "#E2E8F0" }} />
            </div>
            <span
              style={{
                ...stepLabel,
                color: state === "todo" ? "#94A3B8" : "#1E3A8A",
                fontWeight: state === "current" ? 800 : 600,
              }}
            >
              {s.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 7, marginBottom: 12 }}>
      <Avatar size={30} />
      <div style={{ ...botBubble, display: "flex", alignItems: "center", gap: 5, padding: "13px 14px" }}>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#64748b",
              animation: `cvDot 1.2s ${dot * 0.16}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const emptyData = {
  name: "",
  email: "",
  mobile: "",
  course: "",
  branch: "",
  state: "",
  city: "",
  message: "",
  role: "",
  experience: "",
};

export default function CareervidyaChatBot() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [step, setStep] = useState("init");
  const [flow, setFlow] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(emptyData);
  const [teaserIdx, setTeaserIdx] = useState(0);

  const bodyRef = useRef(null);
  const started = useRef(false);
  const busyRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/course");
        const result = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.courses || [];
        if (mountedRef.current) setCourses(result);
      } catch (err) {
        console.error("Course fetch error:", err);
      }
    };

    fetchCourses();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, step, botTyping, open]);

  const addMsg = (from, text) => {
    setMessages((previous) => [...previous, { from, text, time: timeNow() }]);
  };

  // Shows typing dots (also in the header) before every bot message
  const botSay = async (texts) => {
    for (const text of texts) {
      setBotTyping(true);
      await sleep(Math.min(600 + text.length * 14, 1500));
      if (!mountedRef.current) return;
      setBotTyping(false);
      addMsg("bot", text);
      await sleep(250);
    }
  };

  const startChat = async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setStep("busy");
    try {
      await botSay(GREETING);
      setStep("menu");
    } finally {
      busyRef.current = false;
    }
  };

  const openChat = () => {
    setOpen(true);
    setSeen(true);
    if (!started.current) {
      started.current = true;
      startChat();
    }
  };

  // Teaser text changes after 1s, chat opens by itself after 2s (once per session)
  useEffect(() => {
    try {
      if (sessionStorage.getItem("cvAutoOpened")) return;
    } catch (e) {}

    const t1 = setTimeout(() => setTeaserIdx(1), 1000);
    const t2 = setTimeout(() => {
      try {
        sessionStorage.setItem("cvAutoOpened", "1");
      } catch (e) {}
      if (!started.current) openChat();
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOption = async (key, title) => {
    if (busyRef.current || sending) return;

    busyRef.current = true;
    addMsg("user", title);
    setFlow(key);
    setError("");
    setStep("busy");

    try {
      if (key === "admission") {
        await botSay([L.admIntro1, L.admIntro2]);
        setStep("admission1");
      } else if (key === "counselling") {
        await botSay([L.counIntro1, L.counIntro2]);
        setStep("counselling");
      } else if (key === "job") {
        await botSay([L.jobIntro1, L.jobIntro2]);
        setStep("job");
      } else {
        await botSay([L.existIntro1, L.existIntro2]);
        setStep("existing");
      }
    } finally {
      busyRef.current = false;
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;

    if (name === "mobile") {
      setData((p) => ({ ...p, mobile: value.replace(/\D/g, "").slice(0, 10) }));
      return;
    }

    if (name === "course" && flow === "admission") {
      const selected = courses.find((c) => c.name === value);
      setSpecializations(
        Array.isArray(selected?.specializations) ? selected.specializations : []
      );
      setData((p) => ({ ...p, course: value, branch: "" }));
      return;
    }

    setData((p) => ({ ...p, [name]: value }));
  };

  const handleNext = async (event) => {
    event.preventDefault();
    if (busyRef.current) return;

    addMsg("user", `${data.name}\n${data.email}\n${data.mobile}`);

    busyRef.current = true;
    setStep("busy");

    try {
      await botSay([L.thanks(data.name.trim().split(" ")[0]), L.admNext]);
      setStep("admission2");
    } finally {
      busyRef.current = false;
    }
  };

  const submitLead = async ({ payload, successMessages, returnStep }) => {
    if (busyRef.current || sending) return;

    busyRef.current = true;
    setSending(true);
    setError("");
    setStep("busy");

    try {
      await api.post("/api/v1/getintouch", payload);
      await botSay(successMessages);
      setStep("done");
    } catch (err) {
      console.error("Chatbot lead submission failed:", err);
      setError(err?.response?.data?.message || L.errDefault);
      await botSay([L.err1, L.err2]);
      setStep(returnStep);
    } finally {
      busyRef.current = false;
      setSending(false);
    }
  };

  const handleAdmissionSubmit = (event) => {
    event.preventDefault();
    addMsg(
      "user",
      `${data.course}${data.branch ? ` - ${data.branch}` : ""}\n${data.city}, ${data.state}`
    );
    return submitLead({
      payload: {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        course: data.course,
        branch: data.branch || "NA",
        state: data.state,
        city: data.city,
        message: `Chatbot Admission Enquiry | State: ${data.state}`,
      },
      successMessages: [L.admDone1, L.admDone2],
      returnStep: "admission2",
    });
  };

  const handleCounsellingSubmit = (event) => {
    event.preventDefault();
    addMsg(
      "user",
      `${data.name} | ${data.mobile}\n${data.course || L.notSpecified}\n${data.message || L.callbackReq}`
    );
    return submitLead({
      payload: {
        name: data.name,
        email: data.email || "Not provided",
        mobile: data.mobile,
        course: data.course || "Counselling",
        branch: "NA",
        city: data.city || "NA",
        message: `Chatbot Counselling Enquiry: ${data.message || "Callback requested"}`,
      },
      successMessages: [L.counDone1, L.counDone2],
      returnStep: "counselling",
    });
  };

  const handleJobSubmit = (event) => {
    event.preventDefault();
    addMsg(
      "user",
      `${data.name} | ${data.mobile}\n${data.role}\n${data.experience}${data.city ? `, ${data.city}` : ""}`
    );
    return submitLead({
      payload: {
        name: data.name,
        email: data.email || "Not provided",
        mobile: data.mobile,
        course: "Job Enquiry",
        branch: data.role || "NA",
        city: data.city || "NA",
        message: `Chatbot Job Enquiry | Role: ${data.role} | Experience: ${data.experience}`,
      },
      successMessages: [L.jobDone1, L.jobDone2],
      returnStep: "job",
    });
  };

  const handleExistingSubmit = (event) => {
    event.preventDefault();
    addMsg("user", `${data.name} | ${data.mobile}\n${data.message}`);
    return submitLead({
      payload: {
        name: data.name,
        email: data.email || "Not provided",
        mobile: data.mobile,
        course: "Existing Student Support",
        branch: "NA",
        city: data.city || "NA",
        message: `Chatbot Existing Student Support: ${data.message}`,
      },
      successMessages: [L.existDone1, L.existDone2],
      returnStep: "existing",
    });
  };

  const resetChat = async () => {
    if (busyRef.current) return;
    busyRef.current = true;

    setMessages([]);
    setFlow("");
    setError("");
    setSpecializations([]);
    setData(emptyData);
    setStep("busy");

    try {
      await botSay([L.welcomeBack1, L.welcomeBack2]);
      setStep("menu");
    } finally {
      busyRef.current = false;
    }
  };

  const goBack = () => {
    if (sending) return;
    setError("");
    if (step === "admission2") {
      setStep("admission1");
      return;
    }
    setFlow("");
    setStep("menu");
  };

  const renderForm = ({ heading, helper, fields, submitLabel, icon, onSubmit, extra, stepIndex = 0 }) => {
    const guide = FLOWS[flow];
    return (
      <form key={step} onSubmit={onSubmit} style={formBox}>
        {guide && (
          <div style={guideBox}>
            <div style={stepCaption}>
              Step {stepIndex + 1} of {guide.steps.length}
            </div>
            <Stepper steps={guide.steps} current={stepIndex} />
          </div>
        )}

        <div style={formHeading}>{heading}</div>
        {helper && <p style={helperText}>{helper}</p>}

        {fields}

        {error && (
          <div role="alert" style={errorStyle}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="cv-primary"
          style={{ ...primaryBtn, opacity: sending ? 0.65 : 1 }}
        >
          {sending ? L.submitting : submitLabel}
          {!sending && (icon || <Send size={18} />)}
        </button>

        {extra}

        <button type="button" onClick={goBack} disabled={sending} style={backBtn}>
          <ArrowLeft size={16} /> {L.back}
        </button>
      </form>
    );
  };

  const OPTIONS = [
    { key: "admission", title: L.optAdmission, subtitle: L.optAdmissionSub, icon: GraduationCap, color: "#1E3A8A", bg: "#EFF6FF" },
    { key: "counselling", title: L.optCounselling, subtitle: L.optCounsellingSub, icon: Headset, color: "#C2410C", bg: "#FFF7ED" },
    { key: "job", title: L.optJob, subtitle: L.optJobSub, icon: BriefcaseBusiness, color: "#047857", bg: "#ECFDF5" },
    { key: "existing", title: L.optExisting, subtitle: L.optExistingSub, icon: MessageCircle, color: "#6D28D9", bg: "#F5F3FF" },
  ];

  const showForms = !botTyping;
  const doneGuide = FLOWS[flow];

  return (
    <>
      <style>{`
        @keyframes cvPop {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cvSlideIn {
          from { opacity: 0; transform: translateX(-18px) scale(.97); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes cvExpand {
          from { opacity: 0; transform: scale(.6) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes cvPulse {
          0%,100% { box-shadow: 0 8px 25px rgba(30,58,138,.22); }
          50% { box-shadow: 0 8px 30px rgba(249,115,22,.35); }
        }
        @keyframes cvDot {
          0%,60%,100% { transform: translateY(0); opacity: .4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes cvFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes cvRipple {
          0% { transform: scale(1); opacity: .45; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes cvRing {
          0% { box-shadow: 0 0 0 0 rgba(37,99,235,.45); }
          70% { box-shadow: 0 0 0 8px rgba(37,99,235,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
        }
        @keyframes cvWiggle {
          0%,100% { transform: rotate(0) scale(1); }
          25% { transform: rotate(-10deg) scale(1.12); }
          75% { transform: rotate(10deg) scale(1.12); }
        }
        @keyframes cvBreath {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes cvCheck {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          60% { transform: scale(1.25) rotate(8deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes cvShine {
          from { transform: translateX(-120%); }
          to { transform: translateX(220%); }
        }
        .cv-chat-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
        .cv-chat-scroll input:focus,
        .cv-chat-scroll select:focus,
        .cv-chat-scroll textarea:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,.14);
        }
        .cv-chat-scroll input::placeholder,
        .cv-chat-scroll textarea::placeholder { color: #94a3b8; }
        .cv-pill { transition: transform .18s, background .18s, border-color .18s, box-shadow .18s; position: relative; overflow: hidden; }
        .cv-pill:hover { transform: translateX(4px); box-shadow: 0 8px 22px rgba(15,23,42,.10); }
        .cv-pill:active { transform: scale(.98); }
        .cv-pill:not(:first-child):hover { background: #F8FAFC !important; border-color: var(--pill) !important; }
        .cv-pill:hover .cv-pill-icon { animation: cvWiggle .5s ease; }
        .cv-pill-primary .cv-pill-icon { animation: cvBreath 2.4s ease-in-out infinite; }
        .cv-pill-primary::after {
          content: ""; position: absolute; top: 0; bottom: 0; width: 40px;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.35), transparent);
          animation: cvShine 3.2s ease-in-out infinite;
        }
        .cv-primary { transition: transform .15s, filter .15s; }
        .cv-primary:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
        .cv-primary:active:not(:disabled) { transform: scale(.98); }
        .cv-chat-link { transition: filter .15s, transform .15s; }
        .cv-chat-link:hover { filter: brightness(.96); transform: translateY(-1px); }
        .cv-fab:hover { transform: scale(1.06); }
        .cv-chat-window button:focus-visible,
        .cv-chat-window a:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
        @media (max-width: 480px) {
          .cv-chat-window {
            right: 8px !important;
            bottom: 8px !important;
            width: calc(100vw - 16px) !important;
            height: min(640px, calc(100dvh - 16px)) !important;
            border-radius: 18px !important;
          }
          .cv-chat-fab { right: 14px !important; bottom: 22px !important; }
          .cv-chat-teaser { right: 96px !important; bottom: 40px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cv-chat-fab, .cv-chat-fab *, .cv-pill, .cv-pill *, .cv-pill::after, .cv-chat-window, .cv-chat-window * {
            animation: none !important; transition: none !important;
          }
        }
      `}</style>

      {!open && (
        <>
          <button
            type="button"
            className="cv-chat-teaser"
            onClick={openChat}
            style={teaserStyle}
            aria-label="Chat with Career Vidya"
          >
            <span key={teaserIdx} style={{ animation: "cvPop .3s ease", display: "block" }}>
              {teaserIdx === 0 ? (
                <span style={teaserMain}>Welcome to Career Vidya 👋</span>
              ) : (
                <span style={teaserMain}>Need help? Chat with us 💬</span>
              )}
            </span>
          </button>

          <button
            type="button"
            className="cv-chat-fab cv-fab"
            onClick={openChat}
            style={fabStyle}
            aria-label="Open Career Vidya chatbot"
          >
            <span style={{ ...rippleStyle }} />
            <span style={{ ...rippleStyle, animationDelay: "1s" }} />
            <Avatar size={68} animate />
            <span style={onlineDot} />
            {!seen && <span style={badgeStyle}>1</span>}
          </button>
        </>
      )}

      {open && (
        <section
          className="cv-chat-window"
          style={windowStyle}
          aria-label="Career Vidya Assistant"
        >
          <header style={headerStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
              <div style={{ position: "relative" }}>
                <Avatar size={46} animate />
                <span style={{ ...onlineDot, width: 13, height: 13 }} />
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 800 }}>Career Vidya Assistant</div>
                <div style={{ fontSize: 12, opacity: 0.95 }}>
                  {botTyping ? L.typing : L.online}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              style={headerCloseStyle}
              aria-label={L.close}
            >
              <X size={22} />
            </button>
          </header>

          <div
            ref={bodyRef}
            className="cv-chat-scroll"
            style={bodyStyle}
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.time}`}
                style={{
                  display: "flex",
                  justifyContent: message.from === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: 7,
                  marginBottom: 12,
                  animation: "cvPop .25s ease",
                }}
              >
                {message.from === "bot" && <Avatar size={30} />}

                <div style={{ maxWidth: "82%", minWidth: 0 }}>
                  <div style={message.from === "user" ? userBubble : botBubble}>
                    {message.text}
                  </div>
                  <div
                    style={{
                      ...timeStyle,
                      textAlign: message.from === "user" ? "right" : "left",
                    }}
                  >
                    {message.time}
                  </div>
                </div>
              </div>
            ))}

            {botTyping && <TypingDots />}

            {step === "menu" && showForms && (
              <div style={menuList}>
                {OPTIONS.map((option, index) => {
                  const Icon = option.icon;
                  const primary = index === 0;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      className={`cv-pill${primary ? " cv-pill-primary" : ""}`}
                      onClick={() => handleOption(option.key, option.title)}
                      style={{
                        ...pillStyle,
                        animation: `cvSlideIn .45s ${index * 0.1}s cubic-bezier(.2,.8,.2,1) backwards`,
                        ...(primary
                          ? { background: "linear-gradient(120deg,#1E3A8A,#2563EB)", color: "#fff", border: "1.5px solid transparent", boxShadow: "0 8px 20px rgba(37,99,235,.30)" }
                          : { background: "#fff", color: "#0F172A", border: `1.5px solid ${option.color}33` }),
                        "--pill": option.color,
                      }}
                    >
                      <span
                        className="cv-pill-icon"
                        style={{
                          ...pillIcon,
                          background: primary ? "rgba(255,255,255,.2)" : option.bg,
                          color: primary ? "#fff" : option.color,
                        }}
                      >
                        <Icon size={26} strokeWidth={2.2} />
                      </span>
                      <span style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: 14, fontWeight: 800 }}>{option.title}</span>
                        <span
                          style={{
                            display: "block",
                            fontSize: 11.5,
                            fontWeight: 500,
                            marginTop: 2,
                            color: primary ? "rgba(255,255,255,.85)" : "#64748B",
                          }}
                        >
                          {option.subtitle}
                        </span>
                      </span>
                      <ChevronRight size={22} style={{ opacity: primary ? 0.9 : 0.5, flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
            )}

            {step === "admission1" &&
              showForms &&
              renderForm({
                heading: L.hBasic,
                submitLabel: L.btnContinue,
                icon: <ChevronRight size={18} />,
                onSubmit: handleNext,
                stepIndex: 0,
                fields: (
                  <>
                    <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />
                    <TextInput label={L.email} hint={L.emailHint} name="email" type="email" autoComplete="email" value={data.email} onChange={onChange} />
                    <TextInput label={L.mobile} hint={L.mobileHint} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />
                  </>
                ),
              })}

            {step === "admission2" &&
              showForms &&
              renderForm({
                heading: L.hCourse,
                submitLabel: L.btnAdm,
                onSubmit: handleAdmissionSubmit,
                stepIndex: 1,
                fields: (
                  <>
                    <Field label={L.course} hint={L.courseHint}>
                      <select name="course" value={data.course} onChange={onChange} required style={inputStyle}>
                        <option value="">{L.selectCourse}</option>
                        {courses.map((course) => (
                          <option key={course._id || course.name} value={course.name}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label={L.specialization} hint={L.specHint}>
                      <select
                        name="branch"
                        value={data.branch}
                        onChange={onChange}
                        disabled={!specializations.length}
                        required={specializations.length > 0}
                        style={{ ...inputStyle, opacity: specializations.length ? 1 : 0.7 }}
                      >
                        <option value="">
                          {specializations.length ? L.selectSpec : L.noSpec}
                        </option>
                        {specializations.map((s, i) => (
                          <option key={i} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label={L.state}>
                      <select name="state" value={data.state} onChange={onChange} required style={inputStyle}>
                        <option value="">{L.selectState}</option>
                        {STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>

                    <TextInput label={L.city} name="city" value={data.city} onChange={onChange} />
                  </>
                ),
              })}

            {step === "counselling" &&
              showForms &&
              renderForm({
                heading: L.hCoun,
                helper: L.hCounHelp,
                submitLabel: L.btnCallback,
                icon: <PhoneCall size={18} />,
                onSubmit: handleCounsellingSubmit,
                stepIndex: 0,
                fields: (
                  <>
                    <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />
                    <TextInput label={L.mobile} hint={L.mobileHint} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />
                    <TextInput label={L.interestedCourse} name="course" value={data.course} onChange={onChange} required={false} />
                    <Field label={L.queryOpt}>
                      <textarea
                        name="message"
                        value={data.message}
                        onChange={onChange}
                        placeholder={L.counQueryPh}
                        rows={2}
                        style={{ ...inputStyle, height: 66, padding: 10, resize: "none" }}
                      />
                    </Field>
                  </>
                ),
                extra: (
                  <a
                    href={TEAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cv-chat-link"
                    style={secondaryLink}
                  >
                    {L.meetTeam} <ExternalLink size={16} />
                  </a>
                ),
              })}

            {step === "job" &&
              showForms &&
              renderForm({
                heading: L.hJob,
                helper: L.hJobHelp,
                submitLabel: L.btnJob,
                icon: <BriefcaseBusiness size={18} />,
                onSubmit: handleJobSubmit,
                stepIndex: 0,
                fields: (
                  <>
                    <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />
                    <TextInput label={L.mobile} hint={L.mobileHint} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />
                    <TextInput label={L.emailOpt} name="email" type="email" autoComplete="email" value={data.email} onChange={onChange} required={false} />
                    <TextInput label={L.jobRole} name="role" value={data.role} onChange={onChange} />
                    <Field label={L.experience}>
                      <select name="experience" value={data.experience} onChange={onChange} required style={inputStyle}>
                        <option value="">{L.selectExp}</option>
                        {EXPERIENCE_VALUES.map((value) => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    </Field>
                    <TextInput label={L.cityOpt} name="city" value={data.city} onChange={onChange} required={false} />
                  </>
                ),
                extra: (
                  <a
                    href={JOB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cv-chat-link"
                    style={secondaryLink}
                  >
                    {L.viewJobs} <ExternalLink size={16} />
                  </a>
                ),
              })}

            {step === "existing" &&
              showForms &&
              renderForm({
                heading: L.hSupport,
                helper: L.hSupportHelp,
                submitLabel: L.btnQuery,
                onSubmit: handleExistingSubmit,
                stepIndex: 0,
                fields: (
                  <>
                    <TextInput label={L.fullName} name="name" autoComplete="name" value={data.name} onChange={onChange} />
                    <TextInput label={L.mobile} hint={L.mobileHint} name="mobile" value={data.mobile} onChange={onChange} {...mobileProps} />
                    <TextInput label={L.emailOpt} name="email" type="email" autoComplete="email" value={data.email} onChange={onChange} required={false} />
                    <Field label={L.query}>
                      <textarea
                        name="message"
                        value={data.message}
                        onChange={onChange}
                        placeholder={L.existQueryPh}
                        rows={3}
                        required
                        style={{ ...inputStyle, height: 78, padding: 10, resize: "none" }}
                      />
                    </Field>
                  </>
                ),
                extra: (
                  <a href={`tel:+91${SUPPORT_PHONE}`} className="cv-chat-link" style={secondaryLink}>
                    <PhoneCall size={16} /> {L.call} +91 {SUPPORT_PHONE}
                  </a>
                ),
              })}

            {step === "done" && showForms && (
              <div style={{ ...formBox, alignItems: "stretch" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "block", animation: "cvCheck .6s cubic-bezier(.2,.8,.2,1) both" }}>
                    <CheckCircle2 size={52} color="#16a34a" />
                  </span>
                  <div style={formHeading}>{L.thankYou}</div>
                  <p style={{ ...helperText, textAlign: "center" }}>{L.doneText}</p>
                </div>

                {doneGuide && (
                  <>
                    <Stepper steps={doneGuide.steps} current={doneGuide.doneAt} />
                    <ul style={nextList}>
                      {doneGuide.steps.slice(doneGuide.doneAt).map((s, i) => (
                        <li
                          key={s.title}
                          style={{ ...nextItem, animation: `cvSlideIn .4s ${0.2 + i * 0.12}s ease backwards` }}
                        >
                          <span style={nextDot}>{doneGuide.doneAt + i + 1}</span>
                          <span>
                            <strong style={{ display: "block", fontSize: 12.5, color: "#1E3A8A" }}>{s.title}</strong>
                            <span style={{ fontSize: 11.5, color: "#64748B" }}>{s.text}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {flow === "job" && (
                  <a href={JOB_URL} target="_blank" rel="noopener noreferrer" className="cv-chat-link" style={primaryLink}>
                    {L.openJobs} <ExternalLink size={17} />
                  </a>
                )}

                <button type="button" onClick={resetChat} className="cv-primary" style={flow === "job" ? secondaryBtn : primaryBtn}>
                  <RotateCcw size={17} /> {L.startNew}
                </button>
              </div>
            )}
          </div>

          <footer style={footerStyle}>
            <span>{L.poweredBy}</span>
            <strong>Career Vidya</strong>
            <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
              <PhoneCall size={14} />
              <a href={`tel:+91${SUPPORT_PHONE}`} style={{ color: "#1E3A8A", textDecoration: "none" }}>
                {SUPPORT_PHONE}
              </a>
            </span>
          </footer>
        </section>
      )}
    </>
  );
}

/* ---------------- STYLES ---------------- */

const fabStyle = {
  position: "fixed",
  right: 20,
  bottom: BOTTOM_OFFSET,
  width: 78,
  height: 78,
  padding: 2,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  border: "3px solid #fff",
  background: "#fff",
  cursor: "pointer",
  zIndex: 9998,
  boxShadow: "0 8px 25px rgba(30,58,138,.25)",
  animation: "cvPulse 3s infinite",
  transition: "transform .2s",
};

const rippleStyle = {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  border: "2px solid #2563EB",
  pointerEvents: "none",
  animation: "cvRipple 2s ease-out infinite",
};

const onlineDot = {
  position: "absolute",
  right: 2,
  bottom: 2,
  width: 14,
  height: 14,
  borderRadius: "50%",
  background: "#22c55e",
  border: "2px solid #fff",
  boxSizing: "border-box",
};

const badgeStyle = {
  position: "absolute",
  top: -4,
  right: -4,
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: "#F97316",
  color: "#fff",
  fontSize: 12,
  fontWeight: 800,
  display: "grid",
  placeItems: "center",
  animation: "cvBreath 1.6s ease-in-out infinite",
};

const teaserMain = {
  fontSize: 13,
  fontWeight: 800,
  color: "#1E3A8A",
  whiteSpace: "nowrap",
};

const teaserStyle = {
  position: "fixed",
  right: 106,
  bottom: BOTTOM_OFFSET + 22,
  display: "block",
  padding: "9px 14px",
  border: "1px solid #e2e8f0",
  borderRadius: 999,
  background: "#fff",
  boxShadow: "0 6px 18px rgba(15,23,42,.12)",
  cursor: "pointer",
  textAlign: "left",
  zIndex: 9998,
  fontFamily: "inherit",
};

const windowStyle = {
  position: "fixed",
  right: 20,
  bottom: BOTTOM_OFFSET,
  width: "min(400px, calc(100vw - 24px))",
  height: `min(640px, calc(100dvh - ${BOTTOM_OFFSET + 15}px))`,
  background: "#fff",
  borderRadius: 19,
  border: "1px solid #e2e8f0",
  boxShadow: "0 20px 65px rgba(15,23,42,.25)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  zIndex: 10001,
  fontFamily: "inherit",
  boxSizing: "border-box",
  transformOrigin: "bottom right",
  animation: "cvExpand .35s cubic-bezier(.2,.8,.2,1)",
};

const headerStyle = {
  background: "linear-gradient(120deg,#1E3A8A,#1D4ED8)",
  color: "#fff",
  padding: "12px 12px 12px 15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  flexShrink: 0,
};

const headerCloseStyle = {
  background: "rgba(255,255,255,.15)",
  border: "1px solid rgba(255,255,255,.2)",
  color: "#fff",
  width: 38,
  height: 38,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  flexShrink: 0,
};

const bodyStyle = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  padding: 13,
  background: "#F8FAFC",
};

const botBubble = {
  background: "#fff",
  color: "#0F172A",
  padding: "10px 12px",
  borderRadius: "14px 14px 14px 3px",
  fontSize: 13.5,
  border: "1px solid #E2E8F0",
  lineHeight: 1.6,
  whiteSpace: "pre-line",
  overflowWrap: "anywhere",
};

const userBubble = {
  background: "linear-gradient(135deg,#1E3A8A,#2563EB)",
  color: "#fff",
  padding: "10px 12px",
  borderRadius: "14px 14px 3px 14px",
  fontSize: 13.5,
  lineHeight: 1.55,
  whiteSpace: "pre-line",
  overflowWrap: "anywhere",
};

const timeStyle = {
  fontSize: 10,
  color: "#94A3B8",
  marginTop: 4,
};

const menuList = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  alignItems: "stretch",
  marginLeft: 37,
};

const pillStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  minHeight: 62,
  padding: "8px 12px 8px 8px",
  borderRadius: 18,
  cursor: "pointer",
  lineHeight: 1.3,
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const pillIcon = {
  width: 46,
  height: 46,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
};

const formBox = {
  display: "flex",
  flexDirection: "column",
  gap: 11,
  marginLeft: 37,
  marginBottom: 8,
  background: "#fff",
  border: "1px solid #E2E8F0",
  borderRadius: 14,
  padding: 14,
  minWidth: 0,
  animation: "cvPop .3s ease",
};

const guideBox = {
  background: "#F1F5F9",
  borderRadius: 12,
  padding: "10px 6px 8px",
};

const stepCaption = {
  fontSize: 11.5,
  fontWeight: 700,
  color: "#475569",
  textAlign: "center",
  marginBottom: 8,
};

const stepperStyle = {
  display: "flex",
  alignItems: "flex-start",
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const stepItem = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 5,
};

const stepLine = {
  flex: 1,
  height: 3,
  borderRadius: 2,
  transition: "background .4s",
};

const stepCircle = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontSize: 13,
  fontWeight: 800,
  flexShrink: 0,
  boxSizing: "border-box",
  transition: "background .3s, border-color .3s",
};

const stepLabel = {
  fontSize: 10.5,
  textAlign: "center",
  lineHeight: 1.3,
  padding: "0 2px",
};

const nextList = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const nextItem = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#EFF6FF",
  borderRadius: 10,
  padding: "8px 10px",
};

const nextDot = {
  width: 26,
  height: 26,
  borderRadius: "50%",
  background: "#2563EB",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  fontSize: 12,
  fontWeight: 800,
  flexShrink: 0,
};

const formHeading = {
  fontSize: 15,
  fontWeight: 800,
  color: "#1E3A8A",
};

const helperText = {
  margin: 0,
  fontSize: 12.5,
  color: "#64748B",
  lineHeight: 1.6,
};

const fieldLabel = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  width: "100%",
  minWidth: 0,
};

const fieldCaption = {
  fontSize: 12,
  fontWeight: 600,
  color: "#475569",
};

const hintText = {
  fontSize: 11,
  color: "#94A3B8",
};

const inputStyle = {
  width: "100%",
  minWidth: 0,
  height: 42,
  padding: "0 10px",
  borderRadius: 9,
  border: "1px solid #CBD5E1",
  background: "#fff",
  color: "#0F172A",
  fontSize: 13.5,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color .15s, box-shadow .15s",
};

const primaryBtn = {
  width: "100%",
  minHeight: 46,
  padding: "9px 12px",
  background: "linear-gradient(120deg,#1E3A8A,#2563EB)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 13.5,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textDecoration: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const primaryLink = {
  ...primaryBtn,
  background: "linear-gradient(120deg,#047857,#059669)",
};

const secondaryBtn = {
  ...primaryBtn,
  background: "#EFF6FF",
  color: "#1E3A8A",
  border: "1px solid #DBEAFE",
};

const secondaryLink = {
  width: "100%",
  minHeight: 44,
  padding: "9px 10px",
  border: "1px solid #DBEAFE",
  borderRadius: 10,
  color: "#1E3A8A",
  background: "#EFF6FF",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 13,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  boxSizing: "border-box",
};

const backBtn = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 6,
  padding: 6,
  border: "none",
  background: "transparent",
  color: "#64748B",
  fontSize: 12.5,
  cursor: "pointer",
  fontFamily: "inherit",
};

const errorStyle = {
  background: "#FEF2F2",
  color: "#B91C1C",
  padding: 9,
  borderRadius: 8,
  fontSize: 12,
  lineHeight: 1.5,
};

const footerStyle = {
  minHeight: 34,
  padding: "5px 13px",
  borderTop: "1px solid #E2E8F0",
  background: "#fff",
  color: "#94A3B8",
  fontSize: 11,
  display: "flex",
  alignItems: "center",
  gap: 4,
  flexShrink: 0,
};