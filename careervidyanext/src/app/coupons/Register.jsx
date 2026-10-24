
"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

function FloatingInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  readOnly = false,
  placeholder = "",
}) {
  return (
    <div className="relative w-full">
      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder || " "}
        className={`peer w-full rounded-lg border border-gray-300 bg-white px-3 pb-2 pt-5 text-sm text-gray-800 outline-none transition focus:border-blue-700 focus:ring-1 focus:ring-blue-700 ${
          readOnly ? "cursor-not-allowed bg-gray-100" : ""
        }`}
      />

      <label
        htmlFor={name}
        className="pointer-events-none absolute left-3 top-1.5 text-xs text-gray-500"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    </div>
  );
}

function FloatingSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
}) {
  return (
    <div className="relative w-full">
      <label
        htmlFor={name}
        className="absolute left-3 top-1.5 z-10 text-xs text-gray-500"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        id={name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 pb-2 pt-5 text-sm text-gray-800 outline-none transition focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
      >
        <option value="">Select {label}</option>

        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { label: option, value: option }
              : option;

          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default function RegisterForm({
  formData = {},
  handleChange,
  handleSubmit,
  otpSent = false,
  loading = false,
  offer,
}) {
  const field = (name) => formData?.[name] ?? "";

  const inputProps = (label, name, type = "text", required = false) => ({
    label,
    name,
    type,
    value: field(name),
    onChange: handleChange,
    required,
  });

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0">
            <Image
              src="/images/n12.png"
              alt="CareerVidya"
              fill
              sizes="44px"
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-blue-900 sm:text-xl">
              CareerVidya
            </h2>
            <p className="text-xs text-gray-500">
              Start your admission journey
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" />
          <p className="text-xs leading-5 text-blue-900 sm:text-sm">
            Share your details to get assistance with admission and courses.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 px-5 py-5 sm:px-7"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FloatingInput {...inputProps("Full Name", "name", "text", true)} />

          <FloatingInput
            {...inputProps("Email Address", "email", "email", true)}
          />

          <FloatingInput
            {...inputProps("Mobile Number", "mobileNumber", "tel", true)}
          />

          <FloatingSelect
            label="State"
            name="state"
            value={field("state")}
            onChange={handleChange}
            required
            options={formData.stateOptions ?? []}
          />

          <FloatingInput
            {...inputProps("City", "city", "text", true)}
          />

          <FloatingInput
            {...inputProps("Course", "course", "text", true)}
          />

          <FloatingInput
            {...inputProps("Branch / Specialization", "branch")}
          />

          <FloatingSelect
            label="Gender"
            name="gender"
            value={field("gender")}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />

          <FloatingInput
            {...inputProps("Date of Birth", "dob", "date")}
          />

          {/* Coupon */}
          <div className="relative w-full">
            <label
              htmlFor="subsidyCoupon"
              className="absolute left-3 top-1.5 text-xs text-gray-500"
            >
              Subsidy Coupon
            </label>

            <input
              id="subsidyCoupon"
              name="subsidyCoupon"
              value={field("subsidyCoupon")}
              readOnly
              placeholder=" "
              className="w-full rounded-lg border border-green-200 bg-green-50 px-3 pb-2 pt-5 text-sm font-semibold text-green-700 outline-none"
            />

            <span className="absolute right-3 top-4 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
              ACTIVE
            </span>
          </div>
        </div>

        <FloatingInput
          {...inputProps("Current Address", "address")}
        />

        <FloatingInput
          {...inputProps("Permanent Address", "permanentAddress")}
        />

        {/* OTP */}
        {otpSent && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="mb-1 text-sm font-semibold text-blue-900">
              Verify your mobile number
            </h3>

            <p className="mb-3 text-xs text-gray-600">
              Enter the OTP sent to your registered mobile number.
            </p>

            <FloatingInput
              {...inputProps("Enter OTP", "otp", "text", true)}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : otpSent
              ? "Verify & Register"
              : "Send OTP To Apply"}
        </button>

        <p className="text-center text-xs leading-5 text-gray-500">
          By submitting this form, you agree to be contacted regarding your
          admission enquiry.
        </p>
      </form>
    </div>
  );
}
