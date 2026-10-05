
"use client";

import { useState } from "react";
import api from "@/utlis/api";

// ─────────────────────────────────────────────
// Reusable Input
// ─────────────────────────────────────────────

const InputBox = ({ className = "", ...props }) => (
    <input
        {...props}
        className={`
            w-full
            px-3.5 py-2.5
            border border-neutral-border
            bg-white
            rounded-xl
            text-sm
            text-neutral-dark
            placeholder:text-neutral-mid
            outline-none
            transition-all duration-200
            shadow-sm
            focus:border-primary
            focus:ring-2 focus:ring-primary/10
            hover:border-slate-300
            ${className}
        `}
    />
);

// ─────────────────────────────────────────────
// Gender Select
// ─────────────────────────────────────────────

const SelectBox = ({
    className = "",
    options,
    placeholder,
    ...props
}) => (
    <div className={`relative ${className}`}>
        <select
            {...props}
            className="
                w-full
                px-3.5 py-2.5
                pr-9
                border border-neutral-border
                bg-white
                rounded-xl
                text-sm
                text-neutral-dark
                outline-none
                appearance-none
                cursor-pointer
                transition-all duration-200
                shadow-sm
                focus:border-primary
                focus:ring-2 focus:ring-primary/10
                hover:border-slate-300
            "
        >
            <option value="" disabled hidden>
                {placeholder}
            </option>

            {options.map((option) => (
                <option
                    key={option}
                    value={option.toLowerCase()}
                >
                    {option}
                </option>
            ))}
        </select>

        <div
            className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                flex
                items-center
                px-2.5
                text-primary
            "
        >
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </div>
    </div>
);

// ─────────────────────────────────────────────
// Textarea
// ─────────────────────────────────────────────

const TextAreaBox = ({
    className = "",
    ...props
}) => (
    <textarea
        {...props}
        rows={3}
        className={`
            w-full
            px-3.5 py-2.5
            border border-neutral-border
            bg-white
            rounded-xl
            text-sm
            text-neutral-dark
            placeholder:text-neutral-mid
            outline-none
            resize-none
            transition-all duration-200
            shadow-sm
            focus:border-primary
            focus:ring-2 focus:ring-primary/10
            hover:border-slate-300
            ${className}
        `}
    />
);

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function BookCounselor({
    onClose,
    mentor = {
        name: "Expert Counselor",
        designation: "Career Mentor",
    },
}) {
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

    // ─────────────────────────────────────────
    // Handle Change
    // ─────────────────────────────────────────

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ─────────────────────────────────────────
    // Validation
    // ─────────────────────────────────────────

    const validateAllFields = () => {
        const requiredFields = [
            "name",
            "mobileNumber",
            "email",
            "state",
            "course",
            "gender",
            "addresses",
        ];

        for (const field of requiredFields) {
            if (!formData[field]?.trim()) {
                let displayField =
                    field.charAt(0).toUpperCase() +
                    field.slice(1);

                displayField = displayField
                    .replace(
                        "mobileNumber",
                        "Mobile Number"
                    )
                    .replace(
                        "addresses",
                        "Address"
                    );

                alert(
                    `Please fill the "${displayField}" field.`
                );

                return false;
            }
        }

        return true;
    };

    // ─────────────────────────────────────────
    // Send OTP
    // ─────────────────────────────────────────

    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!validateAllFields()) return;

        try {
            setLoading(true);

            const otpPayload = {
                emailOrPhone:
                    formData.email ||
                    formData.mobileNumber,

                purpose: "register",

                mobileNumber:
                    formData.mobileNumber,

                email: formData.email,
            };

            await api.post(
                "/api/v1/send-otp",
                otpPayload
            );

            alert("OTP sent successfully!");

            setOtpSent(true);
        } catch (error) {
            const serverMessage =
                error.response?.data?.message ||
                "Failed to send OTP.";

            alert(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────
    // Verify OTP
    // ─────────────────────────────────────────

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (!formData.otp?.trim()) {
            alert("Please enter OTP.");
            return;
        }

        if (!validateAllFields()) return;

        try {
            setLoading(true);

            const verificationPayload = {
                ...formData,

                emailOrPhone:
                    formData.email ||
                    formData.mobileNumber,

                purpose: "register",

                isCounselorBooking: true,

                mentorName: mentor.name,
            };

            await api.post(
                "/api/v1/verify-otp",
                verificationPayload
            );

            alert(
                `Session booked successfully with ${mentor?.name}!`
            );

            onClose?.();
        } catch (error) {
            const serverMessage =
                error.response?.data?.message ||
                "Booking failed.";

            alert(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────
    // Submit
    // ─────────────────────────────────────────

    const handleSubmit = (e) => {
        if (!otpSent) {
            handleSendOtp(e);
        } else {
            handleVerifyOtp(e);
        }
    };

    return (
        <div
            className="
                fixed inset-0
                z-50
                flex items-center justify-center
                bg-slate-950/75
                backdrop-blur-sm
                p-3 sm:p-5
                overflow-y-auto
            "
            onClick={onClose}
        >
            <div
                className="
                    relative
                    w-full
                    max-w-md
                    max-h-[94vh]
                    overflow-y-auto
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border border-white/20
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* ═══════════════════════════════
                    HEADER
                ═══════════════════════════════ */}

                <div
                    className="
                        sticky top-0
                        z-20
                        bg-white
                        border-b border-neutral-border
                        px-5 py-4
                    "
                >
                    <div className="flex items-start gap-3">

                        {/* Counselor Icon */}

                        <div
                            className="
                                cv-icon-gradient
                                w-11 h-11
                                shrink-0
                                rounded-xl
                                shadow-md
                            "
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>

                        {/* Title */}

                        <div className="flex-1 min-w-0">
                            <h2
                                className="
                                    text-lg sm:text-xl
                                    font-extrabold
                                    text-neutral-dark
                                    leading-tight
                                "
                            >
                                Book Counseling
                            </h2>

                            <p className="text-xs sm:text-sm text-neutral-mid mt-1">
                                Get guidance from{" "}
                                <span className="font-bold text-primary">
                                    {mentor?.name}
                                </span>
                            </p>
                        </div>

                        {/* Close */}

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="
                                w-8 h-8
                                rounded-full
                                flex items-center justify-center
                                text-neutral-mid
                                hover:text-neutral-dark
                                hover:bg-neutral-light
                                transition
                            "
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* CareerVidya Gradient */}

                    <div className="mt-4 cv-divider-gradient" />
                </div>

                {/* ═══════════════════════════════
                    FORM
                ═══════════════════════════════ */}

                <form
                    className="px-5 py-4 space-y-5"
                    onSubmit={handleSubmit}
                >
                    {/* ═════════════════════════════
                        PERSONAL DETAILS
                    ═════════════════════════════ */}

                    <div>
                        <div className="flex items-center gap-2 mb-3">

                            <span
                                className="
                                    w-7 h-7
                                    rounded-lg
                                    bg-primary-light
                                    text-primary
                                    flex items-center justify-center
                                    text-xs font-bold
                                "
                            >
                                01
                            </span>

                            <div>
                                <p className="text-sm font-bold text-neutral-dark">
                                    Personal Details
                                </p>

                                <p className="text-[11px] text-neutral-mid">
                                    Tell us how we can reach you
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2.5">

                            <InputBox
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <InputBox
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <InputBox
                                type="tel"
                                name="mobileNumber"
                                placeholder="Mobile Number"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                            />

                        </div>
                    </div>

                    {/* ═════════════════════════════
                        ACADEMIC & LOCATION
                    ═════════════════════════════ */}

                    <div>
                        <div className="flex items-center gap-2 mb-3">

                            <span
                                className="
                                    w-7 h-7
                                    rounded-lg
                                    bg-accent-light
                                    text-accent-dark
                                    flex items-center justify-center
                                    text-xs font-bold
                                "
                            >
                                02
                            </span>

                            <div>
                                <p className="text-sm font-bold text-neutral-dark">
                                    Academic & Location
                                </p>

                                <p className="text-[11px] text-neutral-mid">
                                    Tell us what you're looking for
                                </p>
                            </div>
                        </div>

                        {/* Gender / Course / State */}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">

                            {/* Gender */}

                            <SelectBox
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                options={[
                                    "Male",
                                    "Female",
                                    "Other",
                                ]}
                                placeholder="Gender"
                            />

                            {/* Course */}

                            <InputBox
                                type="text"
                                name="course"
                                placeholder="Course (e.g. MBA)"
                                value={formData.course}
                                onChange={handleChange}
                            />

                            {/* State */}

                            <InputBox
                                type="text"
                                name="state"
                                placeholder="State (e.g. Delhi)"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Helpful Examples */}

                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[9px] text-neutral-mid">
                                Try:
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        course: "MBA",
                                    }))
                                }
                                className="
                                    text-[9px]
                                    px-2 py-0.5
                                    rounded-full
                                    bg-primary-light
                                    text-primary
                                    hover:bg-primary
                                    hover:text-white
                                    transition
                                "
                            >
                                MBA
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        course: "B.Tech",
                                    }))
                                }
                                className="
                                    text-[9px]
                                    px-2 py-0.5
                                    rounded-full
                                    bg-primary-light
                                    text-primary
                                    hover:bg-primary
                                    hover:text-white
                                    transition
                                "
                            >
                                B.Tech
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        state: "Delhi",
                                    }))
                                }
                                className="
                                    text-[9px]
                                    px-2 py-0.5
                                    rounded-full
                                    bg-accent-light
                                    text-accent-dark
                                    hover:bg-accent
                                    hover:text-white
                                    transition
                                "
                            >
                                Delhi
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        state: "Uttar Pradesh",
                                    }))
                                }
                                className="
                                    text-[9px]
                                    px-2 py-0.5
                                    rounded-full
                                    bg-accent-light
                                    text-accent-dark
                                    hover:bg-accent
                                    hover:text-white
                                    transition
                                "
                            >
                                UP
                            </button>
                        </div>

                        {/* Address */}

                        <div className="mt-3">
                            <TextAreaBox
                                name="addresses"
                                placeholder="Full Address"
                                value={formData.addresses}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ═════════════════════════════
                        OTP
                    ═════════════════════════════ */}

                    {otpSent && (
                        <div
                            className="
                                rounded-xl
                                border border-orange-200
                                bg-accent-light
                                p-3
                            "
                        >
                            <div className="flex items-center gap-2 mb-2">

                                <div
                                    className="
                                        w-8 h-8
                                        rounded-lg
                                        bg-white
                                        text-accent
                                        flex items-center justify-center
                                        shadow-sm
                                    "
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-neutral-dark">
                                        Verify OTP
                                    </p>

                                    <p className="text-[10px] text-neutral-mid">
                                        Enter the OTP sent to you
                                    </p>
                                </div>
                            </div>

                            <InputBox
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                className="
                                    text-center
                                    tracking-[0.4em]
                                    font-bold
                                    text-base
                                    border-orange-200
                                    focus:border-accent
                                    focus:ring-accent/10
                                "
                            />
                        </div>
                    )}

                    {/* ═════════════════════════════
                        CTA BUTTON
                    ═════════════════════════════ */}

                    <div className="pt-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                cv-btn-cta
                                w-full
                                py-3
                                rounded-xl
                                text-sm
                                font-bold
                                flex
                                items-center
                                justify-center
                                gap-2
                                transition-all
                                duration-200
                                ${
                                    loading
                                        ? "opacity-70 cursor-not-allowed"
                                        : ""
                                }
                            `}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="w-4 h-4 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />

                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                    </svg>

                                    Processing...
                                </>
                            ) : !otpSent ? (
                                <>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                                        />
                                    </svg>

                                    SEND OTP
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>

                                    VERIFY & BOOK
                                </>
                            )}
                        </button>
                    </div>

                    {/* Security */}

                    <div className="flex items-center justify-center gap-1.5">

                        <svg
                            className="w-3 h-3 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                            />
                        </svg>

                        <p className="text-[10px] text-neutral-mid">
                            Your details are safe & secure
                        </p>
                    </div>
                </form>

                {/* ═══════════════════════════════
                    CANCEL
                ═══════════════════════════════ */}

                <div className="px-5 pb-5 text-center">
                    <button
                        onClick={onClose}
                        type="button"
                        className="
                            text-xs
                            font-medium
                            text-neutral-mid
                            hover:text-neutral-dark
                            transition
                        "
                    >
                        Cancel Booking
                    </button>
                </div>
            </div>
        </div>
    );
}
