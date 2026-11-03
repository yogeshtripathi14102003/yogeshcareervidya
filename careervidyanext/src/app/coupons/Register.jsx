"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, ShieldCheck, BadgeCheck, TicketPercent } from "lucide-react";
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
  <div className="sp-field">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`sp-input ${readOnly ? "sp-input-readonly" : ""}`}
    />

    {insideText && (
      <span className="sp-inside-badge">
        <BadgeCheck className="w-2.5 h-2.5" aria-hidden="true" />
        {insideText}
      </span>
    )}

    <label className="sp-label">{label}</label>
  </div>
);

/* ================= FLOATING SELECT ================= */
const FloatingSelect = ({ label, name, value, onChange }) => (
  <div className="sp-field">
    <label className="sp-label">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="sp-input sp-select"
    >
      <option value="">Select</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>
);

/* ================= BENEFIT CHIP ================= */
const BenefitChip = ({ icon, text }) => (
  <div className="sp-benefit-chip">
    <span className="sp-benefit-icon">{icon}</span>
    <span className="sp-benefit-text">{text}</span>
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

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ================= OPEN FROM COUPONS PAGE ================= */
  useEffect(() => {
    if (!mounted) return;

    const handleOpenCouponRegister = (event) => {
      let couponCode = event?.detail?.couponCode || "";

      if (!couponCode) {
        try {
          couponCode = sessionStorage.getItem("selectedSubsidyCoupon") || "";
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

    window.addEventListener("open-coupon-register", handleOpenCouponRegister);

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
      selectedCoupon = sessionStorage.getItem("selectedSubsidyCoupon") || "";
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

    const params = new URLSearchParams(window.location.search);
    if (params.get("openSignup") === "true") return;

    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem("signupPopupClosed") === "true";
    } catch (error) {
      console.error("Unable to read popup state:", error);
    }
    if (dismissed) return;

    const timer = window.setTimeout(() => {
      setShowPopup((currentlyOpen) => (currentlyOpen ? currentlyOpen : true));
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [mounted]);

  /* ================= SUCCESS POPUP TIMER ================= */
  useEffect(() => {
    if (!showSuccessPopup) return;
    const timer = window.setTimeout(() => setShowSuccessPopup(false), 5000);
    return () => window.clearTimeout(timer);
  }, [showSuccessPopup]);

  const closePopup = () => {
    setShowPopup(false);
    try {
      sessionStorage.setItem("signupPopupClosed", "true");
    } catch (error) {
      console.error("Unable to save popup state:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

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
          // ignore
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
        <div className="sp-overlay">
          <button
            type="button"
            aria-label="Close signup form"
            onClick={closePopup}
            className="sp-overlay-bg"
          />

          <div className="sp-card">
            <div className="sp-card-grid">
              {/* ═══════════ LEFT BRAND BAND (desktop) ═══════════ */}
              <aside className="sp-brand-panel">
                <div className="sp-brand-pattern" aria-hidden="true" />

                <div className="sp-brand-inner">
                  <div className="sp-logo-circle">
                    <Image
                      src="/images/n12.png"
                      alt="Career Vidya logo"
                      width={90}
                      height={90}
                      className="sp-logo-img"
                    />
                  </div>

                  <p className="sp-brand-tag">
                    #VidyaHaiTohSuccessHai
                  </p>
                  <p className="sp-brand-sub">
                    Student&apos;s Trusted Education Guidance Platform
                  </p>

                  <div className="sp-brand-heading">
                    <h2>Student Registration</h2>
                    <p>
                      Share your details and our admission advisor will help
                      you with the next steps.
                    </p>
                  </div>
                </div>

                <div className="sp-brand-benefits">
                  <BenefitChip icon="✅" text="No-Cost EMI Available" />
                  <BenefitChip icon="🎓" text="Recognized Universities" />
                  <BenefitChip icon="💼" text="Placement Assistance" />
                  <BenefitChip icon="📞" text="Free Expert Counselling" />
                </div>
              </aside>

              {/* ═══════════ RIGHT FORM ═══════════ */}
              <div className="sp-form-col">
                {/* Mobile header */}
                <div className="sp-mobile-header">
                  <div className="sp-logo-circle sp-logo-circle-sm">
                    <Image
                      src="/images/n12.png"
                      alt="Career Vidya logo"
                      width={56}
                      height={56}
                      className="sp-logo-img"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="sp-mobile-tag">#VidyaHaiTohSuccessHai</p>
                    <p className="sp-mobile-sub">
                      Student&apos;s Trusted Education Guidance
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closePopup}
                  aria-label="Close"
                  className="sp-close"
                >
                  <X size={17} />
                </button>

                <div className="sp-form-scroll">
                  {/* Desktop heading (mobile already shown in header) */}
                  <div className="sp-heading md-only-flex">
                    <Sparkles
                      className="w-3.5 h-3.5 sp-heading-icon"
                      aria-hidden="true"
                    />
                    <h2>Student Registration</h2>
                  </div>
                  <p className="sp-subheading md-only-block">
                    Share your details and our admission advisor will help you
                    with the next steps.
                  </p>

                  {/* Mobile benefits */}
                  <div className="sp-mobile-benefits md-only-hide">
                    <BenefitChip icon="✅" text="No-Cost EMI" />
                    <BenefitChip icon="🎓" text="Recognized Universities" />
                    <BenefitChip icon="💼" text="Placement Assistance" />
                    <BenefitChip icon="📞" text="Free Counselling" />
                  </div>

                  {/* Applied coupon chip (above form) */}
                  {formData.subsidyCoupon && (
                    <div className="sp-applied-chip">
                      <span className="sp-applied-icon">
                        <TicketPercent size={14} />
                      </span>
                      <div className="min-w-0">
                        <p className="sp-applied-label">Applied Coupon</p>
                        <p className="sp-applied-code">
                          {formData.subsidyCoupon}
                        </p>
                      </div>
                      <BadgeCheck className="sp-applied-check" size={16} />
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="sp-form">
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

                    {/* Full Address — hidden per request */}
                    {/* <FloatingInput
                      label="Full Address"
                      name="addresses"
                      value={formData.addresses}
                      onChange={handleChange}
                    /> */}

                    {otpSent && (
                      <div className="sp-otp-box">
                        <p className="sp-otp-hint">
                          <ShieldCheck
                            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                            aria-hidden="true"
                          />
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
                      className="sp-submit"
                    >
                      <span className="relative z-10">
                        {loading
                          ? "Please wait..."
                          : otpSent
                          ? "Verify & Register"
                          : "Send OTP To Apply"}
                      </span>
                      <span className="sp-submit-sheen" />
                    </button>
                  </form>

                  <p className="sp-terms">
                    By submitting your details, you agree to be contacted by our
                    admission counselling team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUCCESS POPUP ================= */}
      {showSuccessPopup && (
        <div className="sp-overlay-success">
          <button
            type="button"
            aria-label="Close success message"
            onClick={() => setShowSuccessPopup(false)}
            className="sp-overlay-bg sp-overlay-bg-light"
          />

          <div className="sp-success-card">
            <div className="sp-success-head">
              <div className="sp-success-icon">🎓</div>
              <h3>Thank You!</h3>
            </div>

            <div className="sp-success-body">
              <p>
                Your details have been submitted successfully. Our advisor will
                contact you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setShowSuccessPopup(false)}
                className="sp-success-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= GLOBAL CSS ================= */}
      <style jsx global>{`
        /* -------- Overlay -------- */
        .sp-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 12px;
        }
        @media (min-width: 640px) {
          .sp-overlay {
            padding: 20px;
          }
        }
        .sp-overlay-bg {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          cursor: pointer;
          border: 0;
        }
        .sp-overlay-bg-light {
          background: rgba(0, 0, 0, 0.4);
        }

        /* -------- Card -------- */
        .sp-card {
          position: relative;
          margin: auto 0;
          max-height: 94vh;
          width: 100%;
          max-width: 900px;
          overflow: hidden;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          ring: 1px solid rgba(0, 0, 0, 0.05);
        }
        .sp-card-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .sp-card-grid {
            grid-template-columns: 300px 1fr;
          }
        }

        /* -------- Left brand panel -------- */
        .sp-brand-panel {
          display: none;
        }
        @media (min-width: 768px) {
          .sp-brand-panel {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            padding: 20px;
            background: radial-gradient(
                circle at 90% 0%,
                rgba(240, 138, 60, 0.35) 0%,
                transparent 55%
              ),
              linear-gradient(135deg, #05347f 0%, #032457 100%);
          }
        }
        .sp-brand-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.08;
          pointer-events: none;
          background-image: radial-gradient(#fff 1px, transparent 1px);
          background-size: 18px 18px;
        }
        .sp-brand-inner {
          position: relative;
          z-index: 10;
        }
        .sp-brand-tag {
          margin-top: 16px;
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.35;
        }
        .sp-brand-sub {
          margin-top: 4px;
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.55;
        }
        .sp-brand-heading {
          margin-top: 20px;
        }
        .sp-brand-heading h2 {
          font-size: 15px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.35;
        }
        .sp-brand-heading p {
          margin-top: 4px;
          font-size: 11px;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.8);
        }
        .sp-brand-benefits {
          position: relative;
          z-index: 10;
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* -------- Circular logo -------- */
        .sp-logo-circle {
          width: 76px;
          height: 76px;
          border-radius: 9999px;
          background: #ffffff;
          padding: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
          border: 2px solid rgba(255, 255, 255, 0.35);
        }
        .sp-logo-circle-sm {
          width: 48px;
          height: 48px;
          padding: 5px;
        }
        .sp-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* -------- Benefit chip -------- */
        .sp-benefit-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.14);
          padding: 6px 8px;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .sp-benefit-icon {
          font-size: 12px;
          line-height: 1;
        }
        .sp-benefit-text {
          font-size: 10px;
          font-weight: 600;
          line-height: 1.25;
          color: #ffffff;
        }
        /* On mobile benefits use a lighter visual */
        .sp-mobile-benefits .sp-benefit-chip {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid #dbeafe;
        }
        .sp-mobile-benefits .sp-benefit-text {
          color: #0b3b8c;
        }

        /* -------- Right form column -------- */
        .sp-form-col {
          position: relative;
          display: flex;
          flex-direction: column;
          max-height: 94vh;
        }
        .sp-mobile-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 48px 12px 16px;
          background: radial-gradient(
              circle at 90% 0%,
              rgba(240, 138, 60, 0.35) 0%,
              transparent 55%
            ),
            linear-gradient(135deg, #05347f 0%, #032457 100%);
        }
        @media (min-width: 768px) {
          .sp-mobile-header {
            display: none;
          }
        }
        .sp-mobile-tag {
          font-size: 12px;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sp-mobile-sub {
          font-size: 9px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.75);
        }

        .sp-close {
          position: absolute;
          right: 12px;
          top: 12px;
          z-index: 20;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.1);
          color: #05347f;
          backdrop-filter: blur(4px);
          transition: background 0.2s ease;
          border: 0;
          cursor: pointer;
        }
        .sp-close:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        @media (min-width: 768px) {
          .sp-close {
            background: #f3f4f6;
            color: #374151;
          }
          .sp-close:hover {
            background: #e5e7eb;
          }
        }

        .sp-form-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }
        @media (min-width: 640px) {
          .sp-form-scroll {
            padding: 20px;
          }
        }

        /* Heading (desktop) */
        .sp-heading {
          display: none;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        @media (min-width: 768px) {
          .sp-heading {
            display: flex;
          }
        }
        .sp-heading h2 {
          font-size: 15px;
          font-weight: 800;
          color: #05347f;
        }
        .sp-heading-icon {
          color: #c15304;
        }
        .sp-subheading {
          display: none;
          font-size: 11px;
          line-height: 1.55;
          color: #6b7280;
          margin-bottom: 12px;
        }
        @media (min-width: 768px) {
          .sp-subheading {
            display: block;
          }
        }

        /* Mobile-only helpers */
        @media (min-width: 768px) {
          .md-only-hide {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .md-only-flex,
          .md-only-block {
            display: none !important;
          }
        }

        /* -------- Applied coupon chip -------- */
        .sp-applied-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding: 8px 10px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
          border: 1px solid #a7f3d0;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
        }
        .sp-applied-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 9999px;
          background: #10b981;
          color: #ffffff;
          flex-shrink: 0;
        }
        .sp-applied-label {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #047857;
        }
        .sp-applied-code {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #064e3b;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sp-applied-check {
          color: #10b981;
          margin-left: auto;
          flex-shrink: 0;
        }

        /* -------- Form fields -------- */
        .sp-form {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sp-field {
          position: relative;
          width: 100%;
          margin-bottom: 12px;
        }
        .sp-input {
          width: 100%;
          padding: 10px 12px;
          font-size: 13px;
          color: #0b1e3a;
          background: #ffffff;
          border: 1px solid rgba(5, 52, 127, 0.25);
          border-radius: 10px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .sp-input:focus {
          border-color: #05347f;
          box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
        }
        .sp-input-readonly {
          background: #f9fafb;
        }
        .sp-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2305347f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
          cursor: pointer;
        }
        .sp-label {
          position: absolute;
          top: -8px;
          left: 10px;
          padding: 0 6px;
          background: #ffffff;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #05347f;
          z-index: 10;
        }
        .sp-inside-badge {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 9999px;
          background: #ecfdf5;
          color: #047857;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border: 1px solid #a7f3d0;
        }

        /* -------- OTP box -------- */
        .sp-otp-box {
          margin-bottom: 12px;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #dbeafe;
          background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff33 100%);
        }
        .sp-otp-hint {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          margin-bottom: 8px;
          font-size: 11px;
          line-height: 1.5;
          color: #1e3a8a;
        }

        /* -------- Submit button -------- */
        .sp-submit {
          position: relative;
          margin-top: 8px;
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 12px;
          background: #05347f;
          padding: 12px;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          box-shadow: 0 6px 16px rgba(5, 52, 127, 0.25);
          transition: background 0.2s ease, transform 0.1s ease;
          border: 0;
          cursor: pointer;
        }
        .sp-submit:hover {
          background: #032457;
        }
        .sp-submit:active {
          transform: scale(0.98);
        }
        .sp-submit:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .sp-submit-sheen {
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          transition: transform 0.7s ease;
        }
        .sp-submit:hover .sp-submit-sheen {
          transform: translateX(100%);
        }
        @media (min-width: 640px) {
          .sp-submit {
            padding: 14px;
            font-size: 14px;
          }
        }

        /* -------- Terms -------- */
        .sp-terms {
          margin-top: 12px;
          text-align: center;
          font-size: 10px;
          line-height: 1.5;
          color: #6b7280;
        }
        @media (min-width: 640px) {
          .sp-terms {
            font-size: 11px;
          }
        }

        /* -------- Success popup -------- */
        .sp-overlay-success {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .sp-success-card {
          position: relative;
          width: 100%;
          max-width: 384px;
          overflow: hidden;
          border-radius: 16px;
          background: #ffffff;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .sp-success-head {
          padding: 28px 24px 20px;
          background: radial-gradient(
              circle at 90% 0%,
              rgba(240, 138, 60, 0.35) 0%,
              transparent 55%
            ),
            linear-gradient(135deg, #05347f 0%, #032457 100%);
        }
        .sp-success-icon {
          margin: 0 auto 8px;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.15);
          font-size: 28px;
          backdrop-filter: blur(4px);
        }
        .sp-success-head h3 {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
        }
        .sp-success-body {
          padding: 16px 24px 24px;
        }
        .sp-success-body p {
          font-size: 12px;
          line-height: 1.6;
          color: #4b5563;
        }
        @media (min-width: 640px) {
          .sp-success-body p {
            font-size: 14px;
          }
        }
        .sp-success-btn {
          margin-top: 20px;
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          background: #05347f;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          border: 0;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .sp-success-btn:hover {
          background: #032457;
        }
      `}</style>
    </>
  );
};

export default CelebrationSignupPopup;