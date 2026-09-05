
// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { X, ChevronDown, Send } from "lucide-react";
// import api from "@/utlis/api";

// export default function CareervidyaFormModal() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [animate, setAnimate] = useState(false);
//   const [isVisible, setIsVisible] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const [courses, setCourses] = useState([]);
//   const [specializations, setSpecializations] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     mobile: "",
//     course: "",
//     branch: "",
//     email: "This is  EQ leads ",
//     city: "NA",
//     message: "NA",
//   });

//   // Mobile detect
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 640);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Scroll Logic
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setIsVisible(true);
//       } else {
//         setIsVisible(false);
//       }
//     };
//     handleScroll();
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Smooth animation trigger
//   useEffect(() => {
//     if (isModalOpen) {
//       setTimeout(() => setAnimate(true), 10);
//     } else {
//       setAnimate(false);
//     }
//   }, [isModalOpen]);

//   // Fetch Courses from API
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await api.get("/api/v1/course");
//         const courseArray = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data || res.data?.courses || [];
//         setCourses(courseArray);
//       } catch (err) {
//         console.error("Course fetch error", err);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "course") {
//       const selected = courses.find((c) => c.name === value);
//       setSpecializations(selected?.specializations || []);
//       setFormData((prev) => ({ ...prev, course: value, branch: "" }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/api/v1/getintouch", formData);
//       alert("✅ Enquiry submitted successfully!");
//       setFormData({
//         name: "",
//         mobile: "",
//         course: "",
//         branch: "",
//         email: "This is  EQ leads ",
//         city: "NA",
//         message: "NA",
//       });
//       closeModal();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Submission failed!");
//     }
//   };

//   const closeModal = () => {
//     setAnimate(false);
//     setTimeout(() => setIsModalOpen(false), 300);
//   };

//   if (!isVisible) return null;

//   return (
//     <>
//       {/* Floating Enquire Now Button - Vertical */}
//       <button
//         onClick={() => setIsModalOpen(true)}
//         style={{
//           position: "fixed",
//           right: "0",
//           top: "40%",
//           transform: "translateY(-50%)",
//           zIndex: 9999,
//           backgroundColor: "#c15304",
//           color: "white",
//           border: "none",
//           padding: "8px 5px",
//           writingMode: "vertical-rl",
//           textOrientation: "mixed",
//           textTransform: "none",
//           letterSpacing: "0.8px",
//           fontWeight: "500",
//           fontSize: "16px",
//           cursor: "pointer",
//           borderRadius: "4px 0 0 4px",
//           boxShadow: "-2px 2px 10px rgba(0,0,0,0.15)",
//           transition: "background-color 0.2s ease",
//           height: "auto",
//           width: "auto",
//         }}
//       >
//         Enquire Now
//       </button>

//       {/* MODAL OVERLAY */}
//       {isModalOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: animate ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 10000,
//             transition: "background-color 0.3s ease",
//             backdropFilter: animate ? "blur(4px)" : "blur(0px)",
//             padding: isMobile ? "10px" : "0",
//             boxSizing: "border-box",
//           }}
//         >
//           <div
//             style={{
//               width: "100%",
//               maxWidth: "750px",
//               background: "#fff",
//               borderRadius: "5px",
//               display: "flex",
//               flexDirection: isMobile ? "column" : "row",
//               overflow: "hidden",
//               position: "relative",
//               boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
//               transform: animate
//                 ? "scale(1) translateY(0)"
//                 : "scale(0.9) translateY(20px)",
//               opacity: animate ? 1 : 0,
//               transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
//               maxHeight: isMobile ? "90vh" : "auto",
//               overflowY: isMobile ? "auto" : "visible",
//             }}
//           >
//             {/* Close Button */}
//             <button
//               onClick={closeModal}
//               style={{
//                 position: "absolute",
//                 top: 10,
//                 right: 10,
//                 background: "#f0f0f0",
//                 border: "none",
//                 borderRadius: "50%",
//                 padding: "5px",
//                 cursor: "pointer",
//                 zIndex: 10,
//               }}
//             >
//               <X size={18} color="#333" />
//             </button>

//             {/* Left Image - mobile pe hidden */}
//             {!isMobile && (
//               <div
//                 style={{
//                   width: "40%",
//                   padding: "15px",
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     borderRadius: "10px",
//                     overflow: "hidden",
//                     position: "relative",
//                     minHeight: "300px",
//                   }}
//                 >
//                   <Image
//                     src="/images/book1.jpg"
//                     alt="Books"
//                     fill
//                     style={{ objectFit: "cover" }}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Right Form */}
//             <div
//               style={{
//                 width: isMobile ? "100%" : "60%",
//                 padding: isMobile ? "20px 16px" : "30px 40px",
//                 textAlign: "center",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <Image
//                   src="/images/n12.png"
//                   alt="Logo"
//                   width={isMobile ? 100 : 130}
//                   height={40}
//                 />
//               </div>

//               {/* Badges */}
//               <div className="mb-4">
//                 <div
//                   style={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: "4px",
//                     fontSize: "10px",
//                     fontWeight: "bold",
//                     color: "green",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <span>✅ No-Cost EMI</span>
//                   <span>|</span>
//                   <span>🎓 Govt-Approved</span>
//                   <span>|</span>
//                   <span>💼 100% Placement</span>
//                   <span>|</span>
//                   <span>📞 Free Counselling</span>
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
//                 <label style={labelStyle}>Full Name *</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Name"
//                   required
//                   style={inputStyle}
//                 />

//                 <label style={labelStyle}>Phone Number *</label>
//                 <input
//                   type="tel"
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   placeholder="Mobile Number"
//                   required
//                   style={inputStyle}
//                 />

//                 <label style={labelStyle}>Course *</label>
//                 <div style={{ position: "relative" }}>
//                   <select
//                     name="course"
//                     value={formData.course}
//                     onChange={handleChange}
//                     required
//                     style={inputStyle}
//                   >
//                     <option value="">Select Course</option>
//                     {courses.map((c) => (
//                       <option key={c._id} value={c.name}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown size={14} style={selectArrowStyle} />
//                 </div>

//                 <label style={labelStyle}>Branch *</label>
//                 <div style={{ position: "relative" }}>
//                   <select
//                     name="branch"
//                     value={formData.branch}
//                     onChange={handleChange}
//                     required
//                     disabled={!specializations.length}
//                     style={inputStyle}
//                   >
//                     <option value="">Select Branch</option>
//                     {specializations.map((sp, i) => (
//                       <option key={i} value={sp}>
//                         {sp}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown size={14} style={selectArrowStyle} />
//                 </div>

//                 <button
//                   type="submit"
//                   style={{
//                     ...submitButtonStyle,
//                     width: isMobile ? "100%" : "50%",
//                   }}
//                 >
//                   <span>SUBMIT</span>
//                   <Send size={14} />
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // Styles
// const selectArrowStyle = {
//   position: "absolute",
//   right: 12,
//   top: 12,
//   color: "#666",
//   pointerEvents: "none",
// };

// const submitButtonStyle = {
//   marginTop: "20px",
//   padding: "12px",
//   background: "#05347f",
//   color: "#fff",
//   border: "none",
//   borderRadius: "2px",
//   fontWeight: "bold",
//   cursor: "pointer",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: "8px",
//   boxShadow: "0 4px 12px rgba(5,52,127,0.3)",
// };

// const labelStyle = {
//   display: "block",
//   fontSize: "11px",
//   fontWeight: "600",
//   marginBottom: "4px",
//   marginTop: "10px",
//   color: "#121111",
// };

// const inputStyle = {
//   width: "100%",
//   padding: "10px",
//   borderRadius: "6px",
//   border: "1px solid #eee",
//   background: "#f9f9f9",
//   fontSize: "13px",
//   outline: "none",
//   appearance: "none",
// };



"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronDown, Send } from "lucide-react";
import api from "@/utlis/api";

export default function CareervidyaFormModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    course: "",
    branch: "",
    email: "This is  EQ leads ",
    city: "NA",
    message: "NA",
  });

  // Mobile detect
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () =>
      window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth animation trigger
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
    }
  }, [isModalOpen]);

  // Fetch Courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/course");

        const courseArray = Array.isArray(res.data)
          ? res.data
          : res.data?.data || res.data?.courses || [];

        setCourses(courseArray);
      } catch (err) {
        console.error("Course fetch error", err);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "course") {
      const selected = courses.find(
        (c) => c.name === value
      );

      setSpecializations(
        selected?.specializations || []
      );

      setFormData((prev) => ({
        ...prev,
        course: value,
        branch: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/api/v1/getintouch",
        formData
      );

      alert(
        "✅ Enquiry submitted successfully!"
      );

      setFormData({
        name: "",
        mobile: "",
        course: "",
        branch: "",
        email: "This is  EQ leads ",
        city: "NA",
        message: "NA",
      });

      closeModal();
    } catch (err) {
      console.error(err);

      alert("❌ Submission failed!");
    }
  };

  const closeModal = () => {
    setAnimate(false);

    setTimeout(
      () => setIsModalOpen(false),
      300
    );
  };

  if (!isVisible) return null;

  return (
    <>
      {/* =====================================================
          FLOATING ENQUIRE BUTTON
      ===================================================== */}

      <button
        onClick={() => setIsModalOpen(true)}
        style={floatingButtonStyle}
      >
        Enquire Now
      </button>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {isModalOpen && (
        <div
          style={{
            ...modalOverlayStyle,
            backgroundColor: animate
              ? "rgba(7,12,20,0.72)"
              : "rgba(0,0,0,0)",
            backdropFilter: animate
              ? "blur(5px)"
              : "blur(0px)",
            padding: isMobile
              ? "12px"
              : "20px",
          }}
        >
          <div
            className="career-modal"
            style={{
              ...modalCardStyle,

              maxWidth: isMobile
                ? "100%"
                : "780px",

              flexDirection: isMobile
                ? "column"
                : "row",

              maxHeight: isMobile
                ? "94vh"
                : "none",

              overflowY: isMobile
                ? "auto"
                : "visible",

              transform: animate
                ? "scale(1) translateY(0)"
                : "scale(0.94) translateY(20px)",

              opacity: animate ? 1 : 0,
            }}
          >
            {/* =================================================
                CLOSE BUTTON
            ================================================= */}

            <button
              onClick={closeModal}
              style={closeButtonStyle}
              aria-label="Close"
            >
              <X
                size={18}
                strokeWidth={2.5}
              />
            </button>

            {/* =================================================
                LEFT IMAGE
            ================================================= */}

            {!isMobile && (
              <div
                style={imageColumnStyle}
              >
                <div
                  style={imageCardStyle}
                >
                  <Image
                    src="/images/112.png"
                    alt="Career Counselling"
                    fill
                    priority
                    style={{
                      objectFit: "cover",
                    }}
                  />

                  {/* Image Overlay */}

                  <div
                    style={imageOverlayStyle}
                  >
                    {/* <div>
                      <h3
                        style={imageHeadingStyle}
                      >
                        Plan Your Career
                      </h3>

                      <p
                        style={
                          imageTextStyle
                        }
                      >
                        Get expert guidance
                        and make the right
                        career choice.
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                RIGHT FORM
            ================================================= */}

            <div
              className="career-form-content"
              style={{
                ...formColumnStyle,

                width: isMobile
                  ? "100%"
                  : "60%",

                padding: isMobile
                  ? "28px 20px 25px"
                  : "30px 38px 32px",
              }}
            >
              {/* =================================================
                  BRAND HEADER
              ================================================= */}

              <div
                style={brandHeaderStyle}
              >
                <div
                  style={brandRowStyle}
                >
                  <div
                    style={logoWrapperStyle}
                  >
                   <Image
  src="/images/n12.png"
  alt="CareerVidya"
  width={isMobile ? 155 : 175}
  height={55}
  priority
  style={{
    width: isMobile ? "155px" : "175px",
    height: isMobile ? "52px" : "55px",
    objectFit: "contain",
    transform: "scale(1.8)",
    transformOrigin: "center",
  }}
/>
                  </div>

                  <div
                    style={brandSeparatorStyle}
                  />

                  <div
                    style={
                      brandTextWrapperStyle
                    }
                  >
                    <span
                      style={
                        brandSmallTextStyle
                      }
                    >
                      EXPERT GUIDANCE
                    </span>

                    <span
                      style={
                        brandMainTextStyle
                      }
                    >
                      For Your Career
                    </span>
                  </div>
                </div>

                {/* Heading */}

                <h2
                  style={{
                    ...formHeadingStyle,
                    fontSize: isMobile
                      ? "21px"
                      : "23px",
                  }}
                >
                  Book Free Counselling
                </h2>

                <p
                  style={formSubHeadingStyle}
                >
                  Speak with our career expert
                  and get personalized guidance
                  for your future.
                </p>
              </div>

              {/* =================================================
                  BADGES
              ================================================= */}

              <div
                style={badgesContainerStyle}
              >
                <span style={badgeStyle}>
                  ✓ No-Cost EMI
                </span>

                <span
                  style={badgeSeparatorStyle}
                >
                  |
                </span>

                <span style={badgeStyle}>
                  🎓 Govt-Approved
                </span>

                <span
                  style={badgeSeparatorStyle}
                >
                  |
                </span>

                <span style={badgeStyle}>
                  💼 100% Placement
                </span>

                <span
                  style={badgeSeparatorStyle}
                >
                  |
                </span>

                <span style={badgeStyle}>
                  📞 Free Counselling
                </span>
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                style={formStyle}
              >
                {/* NAME */}

                <label style={labelStyle}>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={inputStyle}
                />

                {/* MOBILE */}

                <label style={labelStyle}>
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                  style={inputStyle}
                />

                {/* COURSE */}

                <label style={labelStyle}>
                  Course *
                </label>

                <div
                  style={selectWrapperStyle}
                >
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    style={selectStyle}
                  >
                    <option value="">
                      Select Course
                    </option>

                    {courses.map((c) => (
                      <option
                        key={c._id}
                        value={c.name}
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    style={
                      selectArrowStyle
                    }
                  />
                </div>

                {/* BRANCH */}

                <label style={labelStyle}>
                  Branch *
                </label>

                <div
                  style={selectWrapperStyle}
                >
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    disabled={
                      !specializations.length
                    }
                    style={{
                      ...selectStyle,

                      color:
                        !specializations.length
                          ? "#999"
                          : "#222",
                    }}
                  >
                    <option value="">
                      Select Branch
                    </option>

                    {specializations.map(
                      (sp, i) => (
                        <option
                          key={i}
                          value={sp}
                        >
                          {sp}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={16}
                    style={
                      selectArrowStyle
                    }
                  />
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  style={{
                    ...submitButtonStyle,

                    width: isMobile
                      ? "100%"
                      : "50%",
                  }}
                >
                  <span>SUBMIT</span>

                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          RESPONSIVE CSS
      ===================================================== */}

      <style jsx>{`
        @media (max-width: 639px) {
          .career-modal {
            border-radius: 16px !important;
          }

          .career-form-content {
            width: 100% !important;
            box-sizing: border-box !important;
          }
        }

        @media (max-width: 400px) {
          .career-form-content {
            padding: 25px 16px 22px !important;
          }
        }
      `}</style>
    </>
  );
}

/* =========================================================
   FLOATING BUTTON
========================================================= */

const floatingButtonStyle = {
  position: "fixed",
  right: "0",
  top: "40%",
  transform: "translateY(-50%)",
  zIndex: 9999,

  background:
    "linear-gradient(180deg, #ec7425, #c15304)",

  color: "#fff",

  border: "none",

  padding: "10px 6px",

  writingMode: "vertical-rl",

  textOrientation: "mixed",

  letterSpacing: "0.8px",

  fontWeight: "600",

  fontSize: "15px",

  cursor: "pointer",

  borderRadius:
    "7px 0 0 7px",

  boxShadow:
    "-3px 4px 15px rgba(0,0,0,0.18)",

  transition:
    "all 0.2s ease",
};

/* =========================================================
   MODAL OVERLAY
========================================================= */

const modalOverlayStyle = {
  position: "fixed",

  inset: "0",

  width: "100vw",
  height: "100vh",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  zIndex: 10000,

  transition:
    "background-color 0.3s ease",

  boxSizing: "border-box",
};

/* =========================================================
   MAIN MODAL CARD
========================================================= */

const modalCardStyle = {
  position: "relative",

  width: "100%",

  background: "#fff",

  borderRadius: "14px",

  display: "flex",

  overflow: "hidden",

  boxShadow:
    "0 30px 80px rgba(0,0,0,0.38)",

  border:
    "2px solid #ec7425",

  transition:
    "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",

  boxSizing: "border-box",
};

/* =========================================================
   CLOSE BUTTON
========================================================= */

const closeButtonStyle = {
  position: "absolute",

  top: "12px",
  right: "12px",

  width: "34px",
  height: "34px",

  borderRadius: "50%",

  background: "#fff",

  border:
    "1px solid #e5e7eb",

  color: "#1f2937",

  display: "flex",

  alignItems: "center",
  justifyContent: "center",

  cursor: "pointer",

  zIndex: 50,

  boxShadow:
    "0 3px 12px rgba(0,0,0,0.14)",

  transition:
    "all 0.2s ease",
};

/* =========================================================
   IMAGE COLUMN
========================================================= */

const imageColumnStyle = {
  width: "40%",

  padding: "15px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  boxSizing: "border-box",

  background: "#fff",
};

/* =========================================================
   IMAGE CARD
========================================================= */

const imageCardStyle = {
  position: "relative",

  width: "100%",

  height: "405px",

  borderRadius: "11px",

  overflow: "hidden",

  background: "#111",

  boxShadow:
    "0 6px 20px rgba(0,0,0,0.12)",
};

/* =========================================================
   IMAGE OVERLAY
========================================================= */

const imageOverlayStyle = {
  position: "absolute",

  inset: "0",

  display: "flex",

  alignItems: "flex-end",

  justifyContent: "center",

  textAlign: "center",

  padding: "28px 15px 22px",

  background:
    "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.05) 70%)",

  boxSizing: "border-box",

  color: "#fff",
};

const imageHeadingStyle = {
  margin: "0 0 7px",

  fontSize: "23px",

  lineHeight: "1.2",

  fontWeight: "700",

  color: "#fff",
};

const imageTextStyle = {
  margin: "0",

  fontSize: "12px",

  lineHeight: "1.5",

  color: "rgba(255,255,255,0.95)",
};

/* =========================================================
   FORM COLUMN
========================================================= */

const formColumnStyle = {
  boxSizing: "border-box",

  textAlign: "center",

  background: "#fff",
};

/* =========================================================
   BRAND HEADER
========================================================= */

const brandHeaderStyle = {
  width: "100%",

  marginBottom: "8px",
};

const brandRowStyle = {
  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: "11px",

  marginBottom: "8px",
};

const logoWrapperStyle = {
  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  flexShrink: 0,
};

const brandSeparatorStyle = {
  width: "1px",

  height: "34px",

  background:
    "#dfe4eb",

  flexShrink: 0,
};

const brandTextWrapperStyle = {
  display: "flex",

  flexDirection: "column",

  alignItems: "flex-start",

  textAlign: "left",

  lineHeight: "1.15",
};

const brandSmallTextStyle = {
  fontSize: "9px",

  fontWeight: "700",

  letterSpacing: "0.8px",

  color: "#ec7425",

  marginBottom: "3px",
};

const brandMainTextStyle = {
  fontSize: "11px",

  fontWeight: "600",

  color: "#475569",
};

/* =========================================================
   FORM HEADING
========================================================= */

const formHeadingStyle = {
  margin: "0 0 5px",

  lineHeight: "1.25",

  fontWeight: "700",

  color: "#14213d",
};

const formSubHeadingStyle = {
  margin: "0 auto",

  maxWidth: "370px",

  fontSize: "11.5px",

  lineHeight: "1.45",

  color: "#64748b",
};

/* =========================================================
   BADGES
========================================================= */

const badgesContainerStyle = {
  display: "flex",

  flexWrap: "wrap",

  justifyContent: "center",

  alignItems: "center",

  gap: "4px",

  margin:
    "8px 0 7px",

  fontSize: "9px",

  fontWeight: "700",

  color: "#15803d",

  lineHeight: "1.4",
};

const badgeStyle = {
  whiteSpace: "nowrap",
};

const badgeSeparatorStyle = {
  color: "#b8b8b8",

  fontWeight: "400",
};

/* =========================================================
   FORM
========================================================= */

const formStyle = {
  width: "100%",

  textAlign: "left",
};

const labelStyle = {
  display: "block",

  fontSize: "11px",

  fontWeight: "650",

  marginTop: "9px",

  marginBottom: "4px",

  color: "#171717",
};

const inputStyle = {
  width: "100%",

  height: "42px",

  padding:
    "0 12px",

  borderRadius: "7px",

  border:
    "1px solid #dce3eb",

  background: "#fff",

  fontSize: "13px",

  color: "#222",

  outline: "none",

  boxSizing: "border-box",

  transition:
    "border-color 0.2s ease, box-shadow 0.2s ease",

  appearance: "none",

  WebkitAppearance: "none",
};

const selectWrapperStyle = {
  position: "relative",

  width: "100%",
};

const selectStyle = {
  ...inputStyle,

  paddingRight: "35px",

  cursor: "pointer",
};

const selectArrowStyle = {
  position: "absolute",

  right: "12px",

  top: "50%",

  transform:
    "translateY(-50%)",

  color: "#6b7280",

  pointerEvents: "none",
};

/* =========================================================
   SUBMIT BUTTON
========================================================= */

const submitButtonStyle = {
  marginTop: "18px",

  minHeight: "43px",

  padding:
    "10px 16px",

  background:
    "linear-gradient(135deg, #073d91, #05347f)",

  color: "#fff",

  border: "none",

  borderRadius: "6px",

  fontWeight: "700",

  cursor: "pointer",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  gap: "8px",

  fontSize: "12px",

  boxShadow:
    "0 6px 16px rgba(5,52,127,0.22)",

  transition:
    "transform 0.2s ease, box-shadow 0.2s ease",
};