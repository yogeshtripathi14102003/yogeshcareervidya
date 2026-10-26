"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import API from "@/utlis/api.js";

const initialForm = {
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
  dob: "",
  subsidyCoupon: "",
};

/* ================= FLOATING INPUT ================= */
const FloatingInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  readOnly = false,
  insideText,
}) => (
  <div className="relative mb-3 w-full">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full rounded-md border border-[#05347f] px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-blue-100 ${
        readOnly ? "bg-gray-100" : "bg-white"
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
  <div className="relative mb-3 w-full">
    <label className="absolute -top-2 left-3 z-10 bg-white px-1 text-[11px] font-semibold text-[#05347f]">
      {label}
    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-[#05347f] bg-white px-3 py-2.5 text-[13px] outline-none focus:ring-2 focus:ring-blue-100"
    >
      <option value="">Select</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>
);

/* ================= MAIN COMPONENT ================= */
const CelebrationSignupPopup = () => {
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  /* ================= MOUNT ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= OPEN FROM COUPONS PAGE ================= */
  useEffect(() => {
    if (!mounted) return;

    // Apply Coupon button sends this event.
    const handleOpenCouponRegister = (event) => {
      let couponCode = event?.detail?.couponCode || "";

      // Fallback: get coupon code saved by the Coupons Page.
      if (!couponCode) {
        try {
          couponCode =
            sessionStorage.getItem("selectedSubsidyCoupon") || "";
        } catch (error) {
          console.error("Unable to retrieve coupon:", error);
        }
      }

      setFormData((previous) => ({
        ...previous,
        subsidyCoupon: couponCode,
        otp: "",
      }));

      setOtpSent(false);
      setShowPopup(true);
      setShowSuccessPopup(false);

      try {
        sessionStorage.removeItem("selectedSubsidyCoupon");
        sessionStorage.removeItem("signupPopupClosed");
      } catch (error) {
        console.error("Unable to update popup state:", error);
      }
    };

    window.addEventListener(
      "open-coupon-register",
      handleOpenCouponRegister
    );

    return () => {
      window.removeEventListener(
        "open-coupon-register",
        handleOpenCouponRegister
      );
    };
  }, [mounted]);

  /* ================= OPEN FROM URL ================= */
  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams(window.location.search);

    if (params.get("openSignup") !== "true") return;

    let selectedCoupon = "";

    try {
      selectedCoupon =
        sessionStorage.getItem("selectedSubsidyCoupon") || "";

      sessionStorage.removeItem("selectedSubsidyCoupon");
      sessionStorage.removeItem("signupPopupClosed");
    } catch (error) {
      console.error("Unable to retrieve coupon:", error);
    }

    setFormData((previous) => ({
      ...previous,
      subsidyCoupon: selectedCoupon,
    }));

    setOtpSent(false);
    setShowPopup(true);

    params.delete("openSignup");

    const query = params.toString();
    const cleanUrl =
      window.location.pathname +
      (query ? `?${query}` : "") +
      window.location.hash;

    window.history.replaceState({}, "", cleanUrl);
  }, [mounted]);

  /* ================= NORMAL AUTO-OPEN ================= */
  useEffect(() => {
    if (!mounted) return;

    // Do not auto-open if a coupon popup is already open.
    const params = new URLSearchParams(window.location.search);

    if (params.get("openSignup") === "true") return;

    let dismissed = false;

    try {
      dismissed =
        sessionStorage.getItem("signupPopupClosed") === "true";
    } catch (error) {
      console.error("Unable to read popup state:", error);
    }

    if (dismissed) return;

    const timer = window.setTimeout(() => {
      setShowPopup((currentlyOpen) => {
        // Do not reopen an already-open form.
        return currentlyOpen ? currentlyOpen : true;
      });
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [mounted]);

  /* ================= SUCCESS POPUP TIMER ================= */
  useEffect(() => {
    if (!showSuccessPopup) return;

    const timer = window.setTimeout(() => {
      setShowSuccessPopup(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [showSuccessPopup]);

  /* ================= CLOSE ================= */
  const closePopup = () => {
    setShowPopup(false);

    try {
      sessionStorage.setItem("signupPopupClosed", "true");
    } catch (error) {
      console.error("Unable to save popup state:", error);
    }
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ================= SEND OTP / VERIFY OTP ================= */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailOrPhone =
      formData.email.trim() || formData.mobileNumber.trim();

    if (!emailOrPhone) {
      alert("Please enter your email or mobile number.");
      return;
    }

    if (otpSent) {
      if (!formData.otp.trim()) {
        alert("Please enter the OTP.");
        return;
      }

      try {
        setLoading(true);

        await API.post("/api/v1/verify-otp", {
          ...formData,
          emailOrPhone,
          purpose: "register",
        });

        setShowPopup(false);
        setOtpSent(false);
        setShowSuccessPopup(true);
        setFormData(initialForm);

        try {
          sessionStorage.setItem("signupPopupClosed", "true");
        } catch {
          // Ignore storage errors.
        }
      } catch (error) {
        console.error("OTP verification failed:", error);

        alert(
          error?.response?.data?.message ||
            error?.response?.data?.msg ||
            "OTP verification failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);

        await API.post("/api/v1/send-otp", {
          emailOrPhone,
          purpose: "register",
        });

        setOtpSent(true);
        alert("OTP sent successfully.");
      } catch (error) {
        console.error("Unable to send OTP:", error);

        alert(
          error?.response?.data?.message ||
            error?.response?.data?.msg ||
            "Unable to send OTP. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* ================= SIGNUP FORM ================= */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 sm:p-5">
          <button
            type="button"
            aria-label="Close signup form"
            onClick={closePopup}
            className="absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-sm"
          />

          <div className="relative my-auto max-h-[94vh] w-full max-w-lg overflow-hidden rounded-2xl border-t-4 border-blue-700 bg-white shadow-2xl">
            <button
              type="button"
              onClick={closePopup}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <X size={21} />
            </button>

            <div className="max-h-[94vh] overflow-y-auto p-4 sm:p-6">
              {/* Header */}
              <div className="mb-5 flex items-center gap-3 border-b border-gray-200 pb-4 pr-8">
                <Image
                  src="/images/n12.png"
                  alt="Career Vidya logo"
                  width={80}
                  height={40}
                  className="h-auto w-[70px] object-contain sm:w-[80px]"
                />

                <div>
                  <p className="text-sm font-bold text-[#000080]">
                    #VidyaHaiTohSuccessHai
                  </p>

                  <p className="mt-1 text-[10px] font-medium text-gray-500 sm:text-xs">
                    Student's Trusted Education Guidance Platform
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-[#000080] sm:text-2xl">
                  Student Registration
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                  Share your details and our admission advisor will help
                  you with the next steps.
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-blue-50 p-3 text-[10px] font-semibold text-green-800 sm:text-xs">
                <span>✅ No-Cost EMI Available</span>
                <span>🎓 Recognized Universities</span>
                <span>💼 Placement Assistance</span>
                <span>📞 Free Expert Counselling</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-1">
                <FloatingInput
                  label="Full Name*"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                  <FloatingInput
                    label="Email*"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Mobile*"
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                  <FloatingInput
                    label="State*"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="City*"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                  <FloatingInput
                    label="Course*"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    label="Branch*"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                  <FloatingSelect
                    label="Gender*"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  />

                  <FloatingInput
                    type="date"
                    label="DOB*"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                {/* Selected coupon automatically appears here */}
                <FloatingInput
                  label="Subsidy Coupon"
                  name="subsidyCoupon"
                  value={formData.subsidyCoupon}
                  onChange={handleChange}
                  insideText={
                    formData.subsidyCoupon ? "APPLIED" : undefined
                  }
                />

                <FloatingInput
                  label="Full Address"
                  name="addresses"
                  value={formData.addresses}
                  onChange={handleChange}
                />

                {otpSent && (
                  <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                    <p className="mb-2 text-xs text-blue-900">
                      Enter the OTP sent to your email or mobile number.
                    </p>

                    <FloatingInput
                      label="Enter OTP*"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 w-full rounded-xl bg-[#000080] py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
                >
                  {loading
                    ? "Please wait..."
                    : otpSent
                    ? "Verify & Register"
                    : "Send OTP To Apply"}
                </button>
              </form>

              <p className="mt-4 text-center text-[10px] leading-5 text-gray-500 sm:text-xs">
                By submitting your details, you agree to be contacted by
                our admission counselling team.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUCCESS POPUP ================= */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close success message"
            onClick={() => setShowSuccessPopup(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-sm rounded-2xl border-t-8 border-[#000080] bg-white p-8 text-center shadow-2xl sm:p-10">
            <div className="mb-4 text-5xl">🎓</div>

            <h3 className="mb-2 text-2xl font-bold text-[#000080]">
              Thank You!
            </h3>

            <p className="text-sm leading-6 text-gray-600">
              Your details have been submitted successfully. Our advisor
              will contact you within 24 hours.
            </p>

            <button
              type="button"
              onClick={() => setShowSuccessPopup(false)}
              className="mt-6 rounded-lg bg-[#000080] px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CelebrationSignupPopup;