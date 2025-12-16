"use client";

import { useState } from "react";
// Assuming api is correctly imported from "@/utlis/api"
import api from "@/utlis/api"; 

// --- Reusable Input Components ---

const InputBox = ({ className = "", ...props }) => (
    <input
        {...props}
        className={`w-full px-3 py-1.5 border-2 border-indigo-100 bg-white rounded-md text-gray-800 placeholder-gray-600 
                    focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition duration-200 shadow-inner text-xs
                    ${className}`}
    />
);

const SelectBox = ({ className = "", options, placeholder, ...props }) => (
    <div className="relative">
        <select
            {...props}
            className={`w-full px-3 py-1.5 border-2 border-indigo-100 bg-white rounded-md text-gray-800 placeholder-gray-600 
                         focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition duration-200 shadow-inner 
                         appearance-none cursor-pointer pr-6 text-xs ${className}`}
        >
            <option value="" disabled hidden>{placeholder}</option>
            {options.map(option => (
                <option key={option} value={option.toLowerCase()}>{option}</option>
            ))}
        </select>
        {/* Custom Chevron Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-indigo-600">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
    </div>
);

const TextAreaBox = ({ className = "", ...props }) => (
    <textarea
        {...props}
        rows={2}
        className={`w-full px-3 py-1.5 border-2 border-indigo-100 bg-white rounded-md text-gray-800 placeholder-gray-600 
                    focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition duration-200 shadow-inner text-xs
                    ${className}`}
    />
);

// --- Main BookCounselor Component ---

export default function BookCounselor({ onClose, mentor = { name: "Expert Counselor", designation: "Career Mentor" } }) {
    const [formData, setFormData] = useState({
        name: "",
        mobileNumber: "",
        email: "",
        otp: "",
        // city: "",
        state: "",
        course: "",
        gender: "",
        addresses: "",
    });

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const courses = ["B.Tech", "MBBS", "B.Com", "B.Sc", "Other"];
    const states = ["Delhi", "Maharashtra", "Karnataka", "Gujarat", "Other"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateAllFields = () => {
        const requiredFields = ["name", "mobileNumber", "email", "state", "course", "gender", "addresses", "city"];
        for (let field of requiredFields) {
            if (!formData[field]) {
                const displayField = field.charAt(0).toUpperCase() + field.slice(1).replace('mobileNumber', 'Mobile Number').replace('addresses', 'Address');
                alert(`Please fill the "${displayField}" field.`);
                return false;
            }
        }
        return true;
    };

    /**
     * Step 1: Send OTP using the registration endpoint: /api/v1/send-otp
     */
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!validateAllFields()) return;
        
        try {
            setLoading(true);
            
            // Payload for sending OTP (Uses 'register' purpose as confirmed)
            const otpPayload = { 
                emailOrPhone: formData.email || formData.mobileNumber, 
                purpose: "register", 
                mobileNumber: formData.mobileNumber,
                email: formData.email,
            };

            // 🛑 DEBUG: Request Payload को कंसोल में प्रिंट करें
            console.log("OTP Request Payload:", otpPayload); 

            // API CALL
            await api.post("/api/v1/send-otp", otpPayload); 
            
            alert("OTP sent successfully! Check your email or mobile.");
            setOtpSent(true);
        } catch (error) {
            
            // ✅ IMPROVED ERROR LOGGING: error.response को प्राथमिकता दें
            console.error("Send OTP Error (Axios response):", error.response); 
            console.error("Send OTP Error (Full object):", error); 

            // Handle common 4xx or 5xx errors from server response body
            const serverMessage = error.response?.data?.message || error.response?.statusText;
            
            const errorMessage = serverMessage 
                ? `Server Error (${error.response.status}): ${serverMessage}` 
                : "Failed to send OTP. Please check your network connection and form data.";
                
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Step 2: Verify OTP and submit data using the verification endpoint: /api/v1/verify-otp
     */
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!formData.otp) { alert("Please enter OTP."); return; } 
        
        // Validate all fields again to ensure no data was removed
        if (!validateAllFields()) return; 

        try {
            setLoading(true);
            
            // Full payload for verification and data submission
            const verificationPayload = { 
                ...formData, 
                emailOrPhone: formData.email || formData.mobileNumber, 
                purpose: "register", // Uses 'register' purpose
                // Add booking context for the backend
                isCounselorBooking: true, 
                mentorName: mentor.name,
            };

            // API CALL
            await api.post("/api/v1/verify-otp", verificationPayload);
            
            // Success message
            alert(`Session booked successfully with ${mentor?.name}! A confirmation has been processed.`);
            
            onClose?.(); // Close modal on success
        } catch (error) {
            console.error("Booking/Verification Error:", error.response || error);
            // Enhanced error handling
            const serverMessage = error.response?.data?.message || error.response?.statusText;
            
            const errorMessage = serverMessage 
                ? `Server Error (${error.response.status}): ${serverMessage}` 
                : "Invalid OTP or booking failed. Please check console for details.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        if (!otpSent) handleSendOtp(e);
        else handleVerifyOtp(e);
    };

    return (
        // OUTER CONTAINER: Modal Overlay
        <div 
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 overflow-y-auto" 
            onClick={onClose}
        >
            {/* Inner Modal Container */}
            <div
                className="bg-white rounded-xl w-full max-w-sm p-4 shadow-2xl shadow-indigo-500/30 
                            max-h-[95vh] overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* --- Header Section --- */}
                <div className="text-center mb-3 border-b border-indigo-500/10 pb-2 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-black text-indigo-700 tracking-tight">
                        Book Counseling
                    </h2>
                    <p className="text-gray-600 text-sm font-semibold">
                        with <span className="text-indigo-600">{mentor?.name}</span>
                    </p>
                </div>

                {/* Form: Minimal spacing (space-y-3) */}
                <form className="space-y-3" onSubmit={handleSubmit}>
                    
                    {/* 1. Contact & Personal Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <InputBox type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                        <InputBox type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                        <InputBox type="tel" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="md:col-span-2" />
                    </div>
                    
                    <div className="border-t border-indigo-100 pt-3 space-y-2">
                        <p className="text-[10px] font-medium text-indigo-600">Academic & Location Details</p>
                        
                        {/* 2. Compact Academic & Location Group */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <SelectBox name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} placeholder="Gender" className="col-span-1" />
                            <SelectBox name="course" value={formData.course} onChange={handleChange} options={courses} placeholder="Course" className="col-span-1" />
                            {/* <InputBox type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="col-span-1" /> */}
                            <SelectBox name="state" value={formData.state} onChange={handleChange} options={states} placeholder="State" className="col-span-1" />
                        </div>
                        
                        {/* 3. Address (2-row Textarea) */}
                        <TextAreaBox name="addresses" placeholder="Full Address" value={formData.addresses} onChange={handleChange} />
                    </div>

                    {/* 4. OTP Field (Conditional) */}
                    {otpSent && (
                        <div className="pt-2 bg-indigo-50 p-2 rounded-lg border border-indigo-200">
                            <InputBox
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                className="text-center tracking-widest font-mono text-base bg-white border-indigo-300"
                            />
                            <p className="text-[9px] text-indigo-700 mt-1 text-center font-medium">Please check your mobile/email for the OTP.</p>
                        </div>
                    )}

                    {/* 5. Submission Button */}
                    <div className="sticky bottom-0 bg-white pt-2 pb-0 -mx-2"> 
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 rounded-lg font-bold text-sm text-white transition duration-200 ease-in-out shadow-lg 
                                transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer
                                ${loading 
                                    ? "bg-indigo-400 cursor-not-allowed" 
                                    : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-500/50"
                                }`}
                        >
                            {loading 
                                ? "Processing..." 
                                : !otpSent 
                                    ? "🔒 SEND OTP" 
                                    : "✅ VERIFY & BOOK"}
                        </button>
                    </div>
                </form>

                {/* --- Close Button --- */}
                <div className="text-center mt-3">
                    <button 
                        onClick={onClose} 
                        type="button"
                        className="text-xs text-gray-700 font-medium bg-gray-50 border border-gray-300 rounded-lg 
                                    px-3 py-1 mt-2 inline-block transition duration-200 cursor-pointer
                                    transform hover:scale-105 active:scale-95 hover:bg-gray-100" 
                    >
                        &times; Cancel Booking
                    </button>
                </div>
            </div>
        </div>
    );
}