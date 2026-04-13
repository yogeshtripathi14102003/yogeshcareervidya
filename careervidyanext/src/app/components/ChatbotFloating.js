"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Phone, ChevronDown, Send } from "lucide-react";
import api from "@/utlis/api"; // Aapka api utility

export default function CareervidyaFormModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showCallTooltip, setShowCallTooltip] = useState(false);
  const [animate, setAnimate] = useState(false);

  // API State
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    course: "",
    branch: "",
    email: "not-provided@cv.com", // Default value as per your previous logic
    city: "Website Query",
    message: "Interested in course details",
  });

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
      setFormData({ name: "", mobile: "", course: "", branch: "", email: "not-provided@cv.com", city: "Website Query", message: "Interested" });
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

  return (
    <div style={{ position: "fixed", bottom: 50, right: 25, zIndex: 9999 }}>
      
      {/* --- SIDE ICONS --- */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            width: 60, height: 60, borderRadius: "50%", border: "none", cursor: "pointer",
            background: "#c4c3c3de", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 16px rgba(0,0,0,0.3)", overflow: "hidden"
          }}
        >
          <Image src="/images/sss.webp" alt="Support" width={35} height={35} style={{ objectFit: "contain" }} />
        </button>

        {/* Call Icon */}
        <div style={{ position: "relative" }}>
          {showCallTooltip && <div style={tooltipStyle}>Unlock Scholarships & Fee Details - Call Now!  📞<div style={arrowStyle}></div></div>}
          <a href="tel:++919319998717" onMouseEnter={() => setShowCallTooltip(true)} onMouseLeave={() => setShowCallTooltip(false)} style={sideButtonStyle("#2196F3")}>
            <Phone size={22} fill="white" />
          </a>
        </div>

        {/* WhatsApp Icon */}
        <div style={{ position: "relative" }}>
          {showTooltip && <div style={tooltipStyle}>Job ke sath MBA karna chahte ho? 🤔 Upgrade your career with flexible online MBA <div style={arrowStyle}></div></div>}
          <a href="https://wa.me/+919319998717" target="_blank" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} style={sideButtonStyle("#25D366")}>
            <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" width={28} height={28} />
          </a>
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: animate ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)", 
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000,
          transition: "background-color 0.3s ease", backdropFilter: animate ? "blur(4px)" : "blur(0px)"
        }}>
          <div style={{
            width: "90%", maxWidth: "750px", background: "#fff", borderRadius: "5px",
            display: "flex", overflow: "hidden", position: "relative",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
            transform: animate ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)",
            opacity: animate ? 1 : 0, transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}>
            
            <button onClick={closeModal} style={{ position: "absolute", top: 15, right: 15, background: "#f0f0f0", border: "none", borderRadius: "50%", padding: "5px", cursor: "pointer", zIndex: 10 }}>
              <X size={18} color="#333" />
            </button>
            
            {/* LEFT SIDE: Image */}
<div style={{ width: "40%", padding: "15px", display: "flex", alignItems: "center" }}>
  <div style={{ width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
    <Image 
      src="/images/book1.jpg" 
      alt="Books" 
      fill 
      style={{ objectFit: "cover" }} 
    />
  </div>
</div>

            {/* RIGHT SIDE: Integrated Form */}
            <div style={{ width: "60%", padding: "30px 40px", textAlign: 'center' }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <Image src="/images/n12.png" alt="Logo" width={130} height={40} />
              </div>
               <div className="mb-4 overflow-x-auto">
          <div className="flex min-w-max gap-2 text-[11px] font-bold text-green-700">
            <span>✅ No-Cost EMI Available</span>|
            <span>🎓 Govt-Approved Universities</span>|
            <span>💼 100% Placement Assistance</span>|
            <span>📞 Free Expert Counselling</span>
          </div>
        </div>
              
              <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required style={inputStyle} />
                
                <label style={labelStyle}>Phone Number *</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" required style={inputStyle} />
                
                <label style={labelStyle}>Course *</label>
                <div style={{ position: 'relative' }}>
                  <select name="course" value={formData.course} onChange={handleChange} required style={inputStyle}>
                    <option value="">Select Course</option>
                    {courses.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={14} style={selectArrowStyle} />
                </div>

                <label style={labelStyle}>Branch *</label>
                <div style={{ position: 'relative' }}>
                  <select name="branch" value={formData.branch} onChange={handleChange} required disabled={!specializations.length} style={inputStyle}>
                    <option value="">Select Branch</option>
                    {specializations.map((sp, i) => <option key={i} value={sp}>{sp}</option>)}
                  </select>
                  <ChevronDown size={14} style={selectArrowStyle} />
                </div>
                
                <button type="submit" style={submitButtonStyle}>
                  <span>SUBMIT</span>
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Styles (UI Unchanged)
const sideButtonStyle = (bg) => ({
  width: 50, height: 50, borderRadius: "50%", background: bg, color: "#fff",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 6px 12px rgba(0,0,0,0.2)", transition: "transform 0.2s ease"
});

const selectArrowStyle = { position: 'absolute', right: 12, top: 12, color: '#666', pointerEvents: 'none' };

const submitButtonStyle = {
  width: "50%",  marginTop: "20px", padding: "12px", background: "#05347f", color: "#fff",
  border: "none", borderRadius: "2px", fontWeight: "bold", cursor: "pointer", 
  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
  boxShadow: "0 4px 12px rgba(5,52,127,0.3)"
};

const tooltipStyle = {
  position: "absolute", right: "65px", top: "50%", transform: "translateY(-50%)",
  background: "#333", color: "#fff", padding: "6px 12px", borderRadius: "6px",
  fontSize: "11px", width: "200px", textAlign: "center", zIndex: 10001
};

const arrowStyle = {
  position: "absolute", right: "-5px", top: "50%", transform: "translateY(-50%)",
  borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "5px solid #333"
};

const labelStyle = { display: "block", fontSize: "11px", fontWeight: "600", marginBottom: "4px", marginTop: "10px", color: "#121111" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #eee", background: "#f9f9f9", fontSize: "13px", outline: "none", appearance: "none" };