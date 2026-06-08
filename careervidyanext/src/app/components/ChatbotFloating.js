
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
    email: "not-provided@cv.com",
    city: "Website Query",
    message: "Interested in course details",
  });

  // Mobile detect
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
    return () => window.removeEventListener("scroll", handleScroll);
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
      const selected = courses.find((c) => c.name === value);
      setSpecializations(selected?.specializations || []);
      setFormData((prev) => ({ ...prev, course: value, branch: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/v1/getintouch", formData);
      alert("✅ Enquiry submitted successfully!");
      setFormData({
        name: "",
        mobile: "",
        course: "",
        branch: "",
        email: "not-provided@cv.com",
        city: "Website Query",
        message: "Interested",
      });
      closeModal();
    } catch (err) {
      console.error(err);
      alert("❌ Submission failed!");
    }
  };

  const closeModal = () => {
    setAnimate(false);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Enquire Now Button - Vertical */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: "fixed",
          right: "0",
          top: "40%",
          transform: "translateY(-50%)",
          zIndex: 9999,
          backgroundColor: "#c15304",
          color: "white",
          border: "none",
          padding: "8px 5px",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          textTransform: "none",
          letterSpacing: "0.8px",
          fontWeight: "500",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "4px 0 0 4px",
          boxShadow: "-2px 2px 10px rgba(0,0,0,0.15)",
          transition: "background-color 0.2s ease",
          height: "auto",
          width: "auto",
        }}
      >
        Enquire Now
      </button>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: animate ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            transition: "background-color 0.3s ease",
            backdropFilter: animate ? "blur(4px)" : "blur(0px)",
            padding: isMobile ? "10px" : "0",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "750px",
              background: "#fff",
              borderRadius: "5px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
              transform: animate
                ? "scale(1) translateY(0)"
                : "scale(0.9) translateY(20px)",
              opacity: animate ? 1 : 0,
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              maxHeight: isMobile ? "90vh" : "auto",
              overflowY: isMobile ? "auto" : "visible",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "#f0f0f0",
                border: "none",
                borderRadius: "50%",
                padding: "5px",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <X size={18} color="#333" />
            </button>

            {/* Left Image - mobile pe hidden */}
            {!isMobile && (
              <div
                style={{
                  width: "40%",
                  padding: "15px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    overflow: "hidden",
                    position: "relative",
                    minHeight: "300px",
                  }}
                >
                  <Image
                    src="/images/book1.jpg"
                    alt="Books"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}

            {/* Right Form */}
            <div
              style={{
                width: isMobile ? "100%" : "60%",
                padding: isMobile ? "20px 16px" : "30px 40px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                <Image
                  src="/images/n12.png"
                  alt="Logo"
                  width={isMobile ? 100 : 130}
                  height={40}
                />
              </div>

              {/* Badges */}
              <div className="mb-4">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    color: "green",
                    justifyContent: "center",
                  }}
                >
                  <span>✅ No-Cost EMI</span>
                  <span>|</span>
                  <span>🎓 Govt-Approved</span>
                  <span>|</span>
                  <span>💼 100% Placement</span>
                  <span>|</span>
                  <span>📞 Free Counselling</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  style={inputStyle}
                />

                <label style={labelStyle}>Phone Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  required
                  style={inputStyle}
                />

                <label style={labelStyle}>Course *</label>
                <div style={{ position: "relative" }}>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={selectArrowStyle} />
                </div>

                <label style={labelStyle}>Branch *</label>
                <div style={{ position: "relative" }}>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    disabled={!specializations.length}
                    style={inputStyle}
                  >
                    <option value="">Select Branch</option>
                    {specializations.map((sp, i) => (
                      <option key={i} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={selectArrowStyle} />
                </div>

                <button
                  type="submit"
                  style={{
                    ...submitButtonStyle,
                    width: isMobile ? "100%" : "50%",
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
    </>
  );
}

// Styles
const selectArrowStyle = {
  position: "absolute",
  right: 12,
  top: 12,
  color: "#666",
  pointerEvents: "none",
};

const submitButtonStyle = {
  marginTop: "20px",
  padding: "12px",
  background: "#05347f",
  color: "#fff",
  border: "none",
  borderRadius: "2px",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  boxShadow: "0 4px 12px rgba(5,52,127,0.3)",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "600",
  marginBottom: "4px",
  marginTop: "10px",
  color: "#121111",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #eee",
  background: "#f9f9f9",
  fontSize: "13px",
  outline: "none",
  appearance: "none",
};