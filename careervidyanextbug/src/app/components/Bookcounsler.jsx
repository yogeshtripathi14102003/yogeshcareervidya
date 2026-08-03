"use client";

import { useState } from "react";
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
    <div className={`relative ${className}`}>
        <select
            {...props}
            className={`w-full px-3 py-1.5 border-2 border-indigo-100 bg-white rounded-md text-gray-800 placeholder-gray-600 
                         focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition duration-200 shadow-inner 
                         appearance-none cursor-pointer pr-6 text-xs w-full`}
        >
            <option value="" disabled hidden>{placeholder}</option>
            {options.map(option => (
                <option key={option} value={option.toLowerCase()}>{option}</option>
            ))}
        </select>
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

export default function BookCounselor({ onClose, mentor = { name: "Expert Counselor", designation: "Career Mentor" } }) {
    const [formData, setFormData] = useState({
        name: "",
        mobileNumber: "",
        email: "",
        otp: "",
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
        // Removed "city" from required fields
        const requiredFields = ["name", "mobileNumber", "email", "state", "course", "gender", "addresses"];
        for (let field of requiredFields) {
            if (!formData[field]) {
                const displayField = field.charAt(0).toUpperCase() + field.slice(1).replace('mobileNumber', 'Mobile Number').replace('addresses', 'Address');
                alert(`Please fill the "${displayField}" field.`);
                return false;
            }
        }
        return true;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!validateAllFields()) return;
        
        try {
            setLoading(true);
            const otpPayload = { 
                emailOrPhone: formData.email || formData.mobileNumber, 
                purpose: "register", 
                mobileNumber: formData.mobileNumber,
                email: formData.email,
            };

            await api.post("/api/v1/send-otp", otpPayload); 
            alert("OTP sent successfully!");
            setOtpSent(true);
        } catch (error) {
            const serverMessage = error.response?.data?.message || "Failed to send OTP.";
            alert(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!formData.otp) { alert("Please enter OTP."); return; } 
        if (!validateAllFields()) return; 

        try {
            setLoading(true);
            const verificationPayload = { 
                ...formData, 
                emailOrPhone: formData.email || formData.mobileNumber, 
                purpose: "register", 
                isCounselorBooking: true, 
                mentorName: mentor.name,
            };

            await api.post("/api/v1/verify-otp", verificationPayload);
            alert(`Session booked successfully with ${mentor?.name}!`);
            onClose?.(); 
        } catch (error) {
            const serverMessage = error.response?.data?.message || "Booking failed.";
            alert(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        if (!otpSent) handleSendOtp(e);
        else handleVerifyOtp(e);
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-xl w-full max-w-sm p-4 shadow-2xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                
                <div className="text-center mb-3 border-b border-indigo-500/10 pb-2 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-black text-indigo-700 tracking-tight">Book Counseling</h2>
                    <p className="text-gray-600 text-sm font-semibold">with <span className="text-indigo-600">{mentor?.name}</span></p>
                </div>

                <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-2">
                        <InputBox type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                        <InputBox type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                        <InputBox type="tel" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
                    </div>
                    
                    <div className="border-t border-indigo-100 pt-3 space-y-2">
                        <p className="text-[10px] font-medium text-indigo-600 text-uppercase tracking-wider">Academic & Location Details</p>
                        
                        <div className="grid grid-cols-3 gap-2">
                            <SelectBox name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} placeholder="Gender" />
                            <SelectBox name="course" value={formData.course} onChange={handleChange} options={courses} placeholder="Course" />
                            <SelectBox name="state" value={formData.state} onChange={handleChange} options={states} placeholder="State" />
                        </div>
                        
                        <TextAreaBox name="addresses" placeholder="Full Address" value={formData.addresses} onChange={handleChange} />
                    </div>

                    {otpSent && (
                        <div className="pt-2 bg-indigo-50 p-2 rounded-lg border border-indigo-200 text-center">
                            <InputBox
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                className="text-center tracking-widest font-mono text-base bg-white border-indigo-300"
                            />
                            <p className="text-[9px] text-indigo-700 mt-1 font-medium">Please check your mobile/email for the OTP.</p>
                        </div>
                    )}

                    <div className="sticky bottom-0 bg-white pt-2"> 
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 rounded-lg font-bold text-sm text-white transition duration-200 transform active:scale-95 shadow-lg
                                ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/50"}`}
                        >
                            {loading ? "Processing..." : !otpSent ? "🔒 SEND OTP" : "✅ VERIFY & BOOK"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <button onClick={onClose} type="button" className="text-xs text-gray-500 hover:text-gray-800 transition px-3 py-1">
                        &times; Cancel Booking
                    </button>
                </div>
            </div>
        </div>
    );
}