// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import api from "@/utlis/api";

// const Signup = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     mobileNumber: "",
//     email: "",
//     otp: "",
//     city: "",
//     state: "",
//     course: "",
//     gender: "",
//     addresses: "",
//   });

//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Validate required fields before sending OTP
//   const validateAllFields = () => {
//     const requiredFields = [
//       "name",
//       "mobileNumber",
//       "email",
//       "city",
//       "state",
//       "course",
//       "gender",
//       "addresses",
//     ];

//     for (let field of requiredFields) {
//       if (!formData[field]) {
//         alert(`Please fill the "${field}" field before sending OTP.`);
//         return false;
//       }
//     }
//     return true;
//   };

//   // Send OTP
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     if (!validateAllFields()) return;

//     try {
//       setLoading(true);
//       const payload = {
//         emailOrPhone: formData.email || formData.mobileNumber,
//         purpose: "register",
//       };
//       await api.post("/api/v1/send-otp", payload);
//       alert("OTP sent successfully! Check your email or phone.");
//       setOtpSent(true);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to send OTP. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!formData.otp) {
//       alert("Please enter OTP to continue.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const payload = {
//         ...formData,
//         emailOrPhone: formData.email || formData.mobileNumber,
//         purpose: "register",
//       };
//       await api.post("/api/v1/verify-otp", payload);
//       alert("Registration successful! Now you can login.");
//       onClose?.();
//     } catch (error) {
//       console.error(error);
//       alert("Invalid OTP. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Form submit
//   const handleSubmit = (e) => {
//     if (!otpSent) handleSendOtp(e);
//     else handleVerifyOtp(e);
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white text-gray-900 rounded-2xl shadow-xl w-[95%] md:w-[900px] overflow-hidden flex flex-col md:flex-row relative animate-fadeIn"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Left Section */}
//         <div className="w-full md:w-1/2 p-8 bg-gradient-to-r from-[#F0F8FF] to-[#E6F0FF] flex flex-col justify-center">
//           <h1 className="text-4xl font-bold text-[#1E90FF] mb-4">Career Vidya</h1>
//           <h2 className="text-2xl font-semibold mb-6">
//             Unlock Your Future with Career Vidya
//           </h2>
//           <ul className="list-disc list-inside mb-6 space-y-2">
//             <li>Exam Alerts – Timely updates</li>
//             <li>Mock Tests – Practice. Perform. Perfect.</li>
//             <li>AI Predictions – Smart College Match</li>
//             <li>Counselling – Personal Guidance</li>
//           </ul>
//         </div>

//         {/* Right Section */}
//         <div className="w-full md:w-1/2 p-8 relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
//           >
//             ✕
//           </button>

//           <div className="w-full max-w-md mx-auto">
//             <form onSubmit={handleSubmit} noValidate className="space-y-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="inputBox"
//               />

//               <div className="flex space-x-4">
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="inputBox w-1/2"
//                 />
//                 <input
//                   type="tel"
//                   name="mobileNumber"
//                   placeholder="Mobile Number"
//                   value={formData.mobileNumber}
//                   onChange={handleChange}
//                   className="inputBox w-1/2"
//                 />
//               </div>

//               <div className="flex space-x-4">
//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="inputBox w-1/2"
//                 />
//                 <input
//                   type="text"
//                   name="state"
//                   placeholder="State"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className="inputBox w-1/2"
//                 />
//               </div>

//               <div className="flex space-x-4">
//                 <input
//                   type="text"
//                   name="course"
//                   placeholder="Course"
//                   value={formData.course}
//                   onChange={handleChange}
//                   className="inputBox w-1/2"
//                 />
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="inputBox w-1/2"
//                 >
//                   <option value="">Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               <input
//                 type="text"
//                 name="addresses"
//                 placeholder="Address"
//                 value={formData.addresses}
//                 onChange={handleChange}
//                 className="inputBox"
//               />

//               {otpSent && (
//                 <input
//                   type="text"
//                   name="otp"
//                   placeholder="Enter OTP"
//                   value={formData.otp}
//                   onChange={handleChange}
//                   className="inputBox"
//                 />
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full p-2 rounded-md text-white transition ${
//                   !otpSent ? "bg-[#FFA500]" : "bg-[#1E90FF]"
//                 } hover:opacity-90`}
//               >
//                 {loading
//                   ? "Please wait..."
//                   : !otpSent
//                   ? "Send OTP"
//                   : "Verify OTP"}
//               </button>
//             </form>

//             <p className="mt-4 text-center text-[#1E90FF]">
//               Already have a Career Vidya account?{" "}
//               <Link href="/login">Login to continue</Link>
//             </p>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .inputBox {
//           width: 100%;
//           padding: 10px;
//           border: 1px solid #ccc;
//           border-radius: 8px;
//           outline: none;
//         }
//         .inputBox:focus {
//           border-color: #1e90ff;
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Signup;



"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/utlis/api"; // Assuming this path is correct

// --- Helper Components (Unchanged) ---
const InputBox = ({ className = "", ...props }) => (
    <input
        {...props}
        className={`glass-input ${className}`}
    />
);

const SelectBox = ({ className = "", options, placeholder, ...props }) => (
    <select
        {...props}
        className={`glass-input custom-select-arrow ${className}`}
    >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map(option => (
            <option key={option} value={option.toLowerCase()}>{option}</option>
        ))}
    </select>
);


const Signup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        mobileNumber: "",
        email: "",
        otp: "",
        city: "",
        state: "",
        course: "",
        gender: "",
        addresses: "",
    });

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    // Placeholder data for the select menus
    const courses = ["B.Tech", "MBBS", "B.Com", "B.Sc", "Other"];
    const states = ["Delhi", "Maharashtra", "Karnataka", "Gujarat", "Other"];

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // --- Validation, OTP Send/Verify Logic (Omitted for brevity) ---
    const validateAllFields = () => {
        const requiredFields = [
            "name", "mobileNumber", "email", "city", "state", "course", "gender", "addresses",
        ];
        for (let field of requiredFields) {
            if (!formData[field]) {
                const displayField = field.charAt(0).toUpperCase() + field.slice(1).replace('addresses', 'Address').replace('mobileNumber', 'Mobile Number');
                alert(`Please fill the "${displayField}" field before sending OTP.`);
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
            const payload = { emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" };
            await api.post("/api/v1/send-otp", payload);
            alert("OTP sent successfully! Check your email or phone.");
            setOtpSent(true);
        } catch (error) {
            console.error(error);
            alert("Failed to send OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!formData.otp) { alert("Please enter OTP to continue."); return; }
        try {
            setLoading(true);
            const payload = { ...formData, emailOrPhone: formData.email || formData.mobileNumber, purpose: "register" };
            await api.post("/api/v1/verify-otp", payload);
            alert("Registration successful! Now you can login.");
            onClose?.();
        } catch (error) {
            console.error(error);
            alert("Invalid OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        if (!otpSent) handleSendOtp(e);
        else handleVerifyOtp(e);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="modal-container text-white rounded-xl shadow-2xl w-[95%] md:w-[960px] max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ------------------------------------- */}
                {/* CLOSE BUTTON (Unchanged) */}
                {/* ------------------------------------- */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 m-4 text-white hover:text-gray-300 text-3xl font-light opacity-90 z-50 transition-colors"
                    aria-label="Close"
                    style={{ textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }}
                >
                    ✕
                </button>


                {/* Left Section (Dark/Content) */}
                <div className="w-full md:w-1/2 p-10 relative z-10 bg-dark-overlay border-r border-r-gray-700">
                    
                    {/* Golden Corner Accents (Unchanged) */}
                    <div className="golden-accent top-left"></div>
                    <div className="golden-accent bottom-left"></div>
                    <div className="golden-accent bottom-right-left-panel"></div>

                    <h1 className="text-5xl font-extrabold text-white mb-2 [text-shadow:0_0_8px_rgba(255,215,0,0.5)]">
                        Career Vidya
                    </h1>
                    <h2 className="text-2xl font-semibold mb-8 text-yellow-300">
                        Unlock Your Future
                    </h2>
                    
                    {/* Key Features: FIXED ALIGNMENT HERE */}
                    <ul className="space-y-4 text-lg">
                        <li className="flex items-center gap-3"> {/* CHANGED items-start to items-center */}
                            <span className="text-gold-gradient text-xl">
                                &#9733;
                            </span>
                            <div>
                                <strong className="text-white">Exam Alerts:</strong> Timely updates & notifications.
                            </div>
                        </li>
                        <li className="flex items-center gap-3"> {/* CHANGED items-start to items-center */}
                            <span className="text-gold-gradient text-xl">
                                &#9999;
                            </span>
                            <div>
                                <strong className="text-white">Mock Tests:</strong> Practice. Perform. Perfect.
                            </div>
                        </li>
                        <li className="flex items-center gap-3"> {/* CHANGED items-start to items-center */}
                            <span className="text-gold-gradient text-xl">
                                &#9889;
                            </span>
                            <div>
                                <strong className="text-white">AI Predictions:</strong> Smart College Match & Roadmap.
                            </div>
                        </li>
                        <li className="flex items-center gap-3"> {/* CHANGED items-start to items-center */}
                            <span className="text-gold-gradient text-xl">
                                &#9734;
                            </span>
                            <div>
                                <strong className="text-white">Counselling:</strong> Personal Guidance from experts.
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Right Section (Glassmorphism Form) - Unchanged */}
                <div className="w-full md:w-1/2 p-10 relative z-20 backdrop-blur-md bg-white/10 flex flex-col justify-center">
                    
                    <div className="w-full max-w-md mx-auto py-4"> 
                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            
                            {/* Form Fields */}
                            <InputBox type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />

                            <div className="flex space-x-4">
                                <InputBox type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-1/2" />
                                <InputBox type="tel" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="w-1/2" />
                            </div>

                            <div className="flex space-x-4">
                                <InputBox type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-1/2" />
                                <SelectBox name="state" value={formData.state} onChange={handleChange} options={states} placeholder="State" className="w-1/2" />
                            </div>

                            <div className="flex space-x-4">
                                <SelectBox name="course" value={formData.course} onChange={handleChange} options={courses} placeholder="Course" className="w-1/2" />
                                <SelectBox name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} placeholder="Gender" className="w-1/2" />
                            </div>

                            <InputBox type="text" name="addresses" placeholder="Address" value={formData.addresses} onChange={handleChange} />
                            
                            {/* OTP Field */}
                            {otpSent && (
                                <InputBox type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} />
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full p-3 rounded-xl text-lg font-semibold transition-all shadow-lg mt-6 
                                    ${!otpSent ? "bg-orange-gradient" : "bg-blue-600/80 hover:bg-blue-700"} 
                                    ${loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl hover:scale-[1.01]"}
                                `}
                            >
                                {loading
                                    ? "Please wait..."
                                    : !otpSent
                                    ? "SEND OTP"
                                    : "VERIFY & REGISTER"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-white/80">
                            Already have a Career Vidya account?{" "}
                            <Link href="/login" className="text-yellow-400 font-semibold hover:underline">
                                Login to continue
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                /* --- Custom Styles (Unchanged) --- */
                
                .modal-container {
                    background-image: url('/images/career-vidya-bg.jpg'); 
                    background-size: cover;
                    background-position: center;
                    border: 1px solid rgba(255, 255, 255, 0.2); 
                    position: relative; 
                }

                .bg-dark-overlay {
                    background-color: hsla(225, 66%, 26%, 0.95); 
                }

                .text-gold-gradient {
                    background: linear-gradient(135deg, #FFD700, #F0E68C, #B8860B);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .bg-orange-gradient {
                    background: linear-gradient(to right, #FF8C00, #FF4500);
                    box-shadow: 0 4px 15px rgba(255, 140, 0, 0.7);
                    color: white;
                }

                .golden-accent {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border: 2px solid;
                    border-image: linear-gradient(to bottom right, #FFD700, #B8860B) 1;
                    pointer-events: none;
                    z-index: 5;
                }
                .top-left { top: 0; left: 0; border-width: 2px 0 0 2px; }
                .bottom-right-left-panel { bottom: 0; right: 0; border-width: 0 2px 2px 0; }
                .bottom-left { bottom: 0; left: 0; border-width: 0 0 2px 2px; }


                .glass-input {
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    transition: all 0.2s;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    outline: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }
                .glass-input::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }
                .glass-input:focus {
                    background-color: rgba(255, 255, 255, 0.25);
                    border-color: #FFD700;
                    box-shadow: 0 0 0 2px #FFD700;
                }
                .glass-input option {
                    background-color: #1a237e;
                    color: white;
                }

                .custom-select-arrow {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23FFFFFF' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 10px center;
                    background-size: 0.8em;
                    padding-right: 30px; 
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Signup;