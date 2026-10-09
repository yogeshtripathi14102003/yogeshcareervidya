// "use client";

// import { useState } from "react";
// import api from "@/utlis/api.js";
// import { Loader2, X } from "lucide-react";

// const PRIMARY = "#1889b9";

// export default function GetAdmissionWizard({ closeForm }) {
//   const [step, setStep] = useState(1);
//   const totalSteps = 4;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     gender: "",
//     dob: "",
//     city: "",
//     state: "",
//     course: "",
//     branch: "",
//     university: "",
//     aadhaarNumber: null,
//     panNumber: null,
//     photo: null,
//     signature: null,
//   });

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [submitted, setSubmitted] = useState(false); 
//   const [previews, setPreviews] = useState({}); // file previews

//   // ---------------- Handle Input Changes ----------------
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData({ ...formData, [name]: files[0] });
//       const previewUrl = URL.createObjectURL(files[0]);
//       setPreviews({ ...previews, [name]: previewUrl });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
//   const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

//   // ---------------- Submit Form ----------------
//   const handleSubmit = async () => {
//     setLoading(true);
//     setErrorMsg("");

//     try {
//       const data = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (formData[key] !== null) data.append(key, formData[key]);
//       });

//       // ✅ Correct API call
//       await api.post("/api/v1/admissions", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setSubmitted(true);
//     } catch (err) {
//       console.error(err);
//       setErrorMsg("Failed to submit admission. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Step Progress ----------------
//   const StepProgress = () => (
//     <div className="relative mb-6">
//       <div className="flex justify-between relative items-center">
//         {[...Array(totalSteps)].map((_, i) => {
//           const stepNum = i + 1;
//           const isCompleted = step > stepNum;
//           const isActive = step === stepNum;

//           return (
//             <div key={i} className="flex-1 flex items-center relative">
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold z-10
//                 ${isCompleted ? "bg-[#1889b9] text-white" : isActive ? "border-2 border-[#1889b9] text-[#1889b9]" : "border-2 border-gray-300 text-gray-500"}`}
//               >
//                 {stepNum}
//               </div>

//               {i !== totalSteps - 1 && (
//                 <div className={`flex-1 h-1 -ml-1 ${isCompleted ? "bg-[#1889b9]" : "bg-gray-300"}`}></div>
//               )}

//               <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs text-gray-600 mt-1 md:mt-3">
//                 {stepNum === 1
//                   ? "Personal"
//                   : stepNum === 2
//                   ? "Academic"
//                   : stepNum === 3
//                   ? "Documents"
//                   : "Review"}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );

//   // ---------------- Render Steps ----------------
//   const renderStep = () => {
//     if (submitted) {
//       return (
//         <div className="col-span-2 text-center p-6">
//           <h3 className="text-xl font-bold text-gray-700 mb-2">Thank You!</h3>
//           <p className="text-gray-600">
//             Thank you for applying to your course. Your documents will be verified, and we will update you shortly.
//           </p>
//         </div>
//       );
//     }

//     switch (step) {
//       case 1:
//         return (
//           <>
//             <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
//             <Input label="Email" name="email" value={formData.email} onChange={handleChange} type="email" required />
//             <Input label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} type="tel" required />
//             <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male","Female","Other"]} />
//             <Input label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} type="date" />
//             <Input label="City" name="city" value={formData.city} onChange={handleChange} />
//             <Input label="State" name="state" value={formData.state} onChange={handleChange} />
//           </>
//         );
//       case 2:
//         return (
//           <>
//             <Input label="Course" name="course" value={formData.course} onChange={handleChange} />
//             <Input label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
//             <Input label="University Name" name="university" value={formData.university} onChange={handleChange} />
//           </>
//         );
//       case 3:
//         return (
//           <>
//             <FileInput label="Aadhaar Card" name="aadhaarNumber" onChange={handleChange} preview={previews.aadhaarNumber} />
//             <FileInput label="PAN Card" name="panNumber" onChange={handleChange} preview={previews.panNumber} />
//             <FileInput label="Photo" name="photo" onChange={handleChange} preview={previews.photo} />
//             <FileInput label="Signature" name="signature" onChange={handleChange} preview={previews.signature} />
//           </>
//         );
//       case 4:
//         return (
//           <div className="col-span-2 p-4 space-y-3">
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">Review Your Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//               {Object.entries(formData).map(([key, value]) => (
//                 <div key={key} className="text-sm">
//                   <span className="font-semibold">{key.replace(/([A-Z])/g, " $1")}:</span>{" "}
//                   {value instanceof File ? value.name : value || "-"}
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-lg relative">
//         <button onClick={closeForm} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
//           <X size={20} />
//         </button>

//         <h2 className="text-2xl font-bold mb-4" style={{ color: PRIMARY }}>Get Admission</h2>

//         <StepProgress />

//         {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

//         <form className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderStep()}</form>

//         {!submitted && (
//           <div className="flex justify-between mt-6">
//             {step > 1 ? (
//               <button onClick={prevStep} type="button" className="px-4 py-2 rounded border hover:bg-gray-100">Previous</button>
//             ) : <div></div>}

//             {step < totalSteps ? (
//               <button onClick={nextStep} type="button" className="px-4 py-2 rounded bg-[#1889b9] text-white hover:bg-blue-700">Next</button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 type="button"
//                 className="px-4 py-2 rounded bg-[#1889b9] text-white flex items-center gap-2 hover:bg-blue-700"
//                 disabled={loading}
//               >
//                 {loading && <Loader2 className="animate-spin" size={18} />} Submit
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ================= INPUT COMPONENTS ================= */
// const Input = ({ label, name, value, onChange, type = "text", required = false }) => (
//   <div className="flex flex-col">
//     <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
//     <input type={type} name={name} value={value} onChange={onChange} required={required}
//       className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1889b9]" />
//   </div>
// );

// const Select = ({ label, name, value, onChange, options = [] }) => (
//   <div className="flex flex-col">
//     <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
//     <select name={name} value={value} onChange={onChange}
//       className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1889b9]" >
//       <option value="">Select</option>
//       {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//     </select>
//   </div>
// );

// const FileInput = ({ label, name, onChange, preview }) => (
//   <div className="flex flex-col">
//     <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
//     <input type="file" name={name} onChange={onChange} className="text-sm mb-2" />
//     {preview && <img src={preview} alt={label} className="w-24 h-24 object-cover border rounded" />}
//   </div>
// );


"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/utlis/api.js";
import {
  Loader2,
  X,
  UserRound,
  GraduationCap,
  FileText,
  ClipboardCheck,
  Check,
  ArrowLeft,
  ArrowRight,
  Upload,
} from "lucide-react";

const STEP_NAMES = ["Personal", "Academic", "Documents", "Review"];
const STEP_ICONS = [UserRound, GraduationCap, FileText, ClipboardCheck];

const INITIAL_FORM = {
  name: "",
  email: "",
  mobileNumber: "",
  gender: "",
  dob: "",
  city: "",
  state: "",
  course: "",
  branch: "",
  university: "",
  aadhaarNumber: null,
  panNumber: null,
  photo: null,
  signature: null,
};

export default function GetAdmissionWizard({ closeForm }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [previews, setPreviews] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const previewsRef = useRef({});
  const topRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  // Object URLs sirf unmount par revoke honge
  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, []);

  // Step change par form ke top par scroll (pehle render par nahi)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, submitted]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (!file) return;

      const previewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;

      setPreviews((prev) => {
        if (prev[name]) URL.revokeObjectURL(prev[name]);
        const next = { ...prev };
        if (previewUrl) next[name] = previewUrl;
        else delete next[name];
        return next;
      });

      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setErrorMsg("");
  };

  const validateStep = () => {
    const errors = {};

    if (step === 1) {
      if (!formData.name.trim()) errors.name = "Name is required.";

      if (!formData.email.trim()) {
        errors.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Enter a valid email address.";
      }

      if (!formData.mobileNumber.trim()) {
        errors.mobileNumber = "Mobile number is required.";
      } else if (!/^[0-9+\s()-]{10,16}$/.test(formData.mobileNumber)) {
        errors.mobileNumber = "Enter a valid mobile number.";
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      setErrorMsg("Please correct the highlighted fields.");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    Object.values(previewsRef.current).forEach((url) =>
      URL.revokeObjectURL(url)
    );
    setPreviews({});
    setFormData(INITIAL_FORM);
    setFieldErrors({});
    setErrorMsg("");
    setSubmitted(false);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !validateStep()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(key, value);
        }
      });

      await api.post("/api/v1/admissions", data);
      setSubmitted(true);
    } catch (err) {
      console.error("Admission submission failed:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          "Failed to submit admission. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (submitted) {
      return (
        <div className="py-8 text-center sm:py-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Check size={28} />
          </div>

          <h3 className="text-xl font-semibold text-neutral-dark">
            Thank You!
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-mid">
            Your admission application has been submitted successfully. Your
            documents will be verified, and our team will update you shortly.
          </p>

          <button
            type="button"
            onClick={closeForm || resetForm}
            className="cv-btn-cta mt-6 w-full px-6 py-2.5 text-sm sm:w-auto"
          >
            {closeForm ? "Close" : "Submit Another Application"}
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={fieldErrors.name}
              required
            />

            <Input
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              error={fieldErrors.email}
              required
            />

            <Input
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              type="tel"
              error={fieldErrors.mobileNumber}
              required
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
            />

            <Input
              label="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              type="date"
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
        );

      case 2:
        return (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
            <Input
              label="Course"
              name="course"
              value={formData.course}
              onChange={handleChange}
            />

            <Input
              label="Branch / Specialization"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
            />

            <div className="sm:col-span-2">
              <Input
                label="University Name"
                name="university"
                value={formData.university}
                onChange={handleChange}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
            <FileInput
              label="Aadhaar Card"
              name="aadhaarNumber"
              onChange={handleChange}
              file={formData.aadhaarNumber}
              preview={previews.aadhaarNumber}
            />

            <FileInput
              label="PAN Card"
              name="panNumber"
              onChange={handleChange}
              file={formData.panNumber}
              preview={previews.panNumber}
            />

            <FileInput
              label="Passport-size Photo"
              name="photo"
              onChange={handleChange}
              file={formData.photo}
              preview={previews.photo}
            />

            <FileInput
              label="Signature"
              name="signature"
              onChange={handleChange}
              file={formData.signature}
              preview={previews.signature}
            />
          </div>
        );

      case 4: {
        const reviewItems = [
          ["Full Name", formData.name],
          ["Email", formData.email],
          ["Mobile Number", formData.mobileNumber],
          ["Gender", formData.gender],
          ["Date of Birth", formData.dob],
          ["City", formData.city],
          ["State", formData.state],
          ["Course", formData.course],
          ["Branch", formData.branch],
          ["University", formData.university],
          ["Aadhaar Card", formData.aadhaarNumber?.name],
          ["PAN Card", formData.panNumber?.name],
          ["Photo", formData.photo?.name],
          ["Signature", formData.signature?.name],
        ];

        return (
          <div className="w-full min-w-0">
            <div className="mb-4 rounded-md border border-primary/10 bg-primary-light px-3 py-3 sm:px-4">
              <h3 className="text-sm font-semibold text-neutral-dark">
                Review Your Application
              </h3>
              <p className="mt-1 text-xs text-neutral-mid">
                Check your details before submitting.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {reviewItems.map(([label, value]) => (
                <div
                  key={label}
                  className="min-w-0 border-b border-neutral-border py-2.5 sm:py-3"
                >
                  <p className="text-xs text-neutral-mid">{label}</p>
                  <p className="mt-1 break-all text-sm font-medium text-neutral-dark sm:break-words">
                    {value || "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const ActiveIcon = STEP_ICONS[step - 1];

  return (
    <section
      ref={topRef}
      aria-labelledby="admission-title"
      className="box-border mx-auto w-full min-w-0 max-w-3xl scroll-mt-24 overflow-hidden rounded-xl border border-neutral-border bg-white p-0 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.2)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-neutral-border px-3 py-3 sm:px-6 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="cv-icon-gradient h-9 w-9 shrink-0 sm:h-10 sm:w-10">
            <GraduationCap size={19} />
          </div>

          <div className="min-w-0">
            <h2
              id="admission-title"
              className="m-0 truncate text-base font-semibold leading-tight sm:text-lg"
            >
              Get Admission
            </h2>
            <p className="m-0 mt-0.5 truncate text-xs text-neutral-mid">
              Complete your application
            </p>
          </div>
        </div>

        {closeForm && (
          <button
            type="button"
            onClick={closeForm}
            disabled={loading}
            aria-label="Close admission form"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-transparent p-0 text-neutral-mid transition hover:bg-neutral-light hover:text-neutral-dark disabled:opacity-50"
          >
            <X size={19} />
          </button>
        )}
      </div>

      {/* Progress */}
      {!submitted && (
        <div className="border-b border-neutral-border px-3 pb-3 pt-3 sm:px-6 sm:pb-4 sm:pt-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <ActiveIcon size={17} className="shrink-0 text-primary" />
              <span className="truncate text-sm font-semibold text-neutral-dark">
                {STEP_NAMES[step - 1]} Details
              </span>
            </div>

            <span className="shrink-0 whitespace-nowrap text-xs font-medium text-neutral-mid">
              Step {step} of {totalSteps}
            </span>
          </div>

          <div className="flex gap-1.5">
            {STEP_NAMES.map((name, index) => {
              const isComplete = index + 1 <= step;

              return (
                <div key={name} className="min-w-0 flex-1">
                  <div
                    className="h-1.5 rounded-full transition-all duration-200"
                    style={{
                      background: isComplete
                        ? "var(--cv-grad-horizontal)"
                        : "var(--cv-neutral-border)",
                    }}
                  />
                  <p
                    className={`m-0 mt-2 truncate text-[10px] sm:text-xs ${
                      index + 1 === step
                        ? "font-semibold text-primary"
                        : "text-neutral-mid"
                    }`}
                  >
                    {name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="min-w-0 px-3 py-4 sm:px-6 sm:py-5">
        {errorMsg && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {errorMsg}
          </div>
        )}

        <form
          id="admission-form"
          noValidate
          className="m-0 w-full min-w-0 p-0"
          onSubmit={(e) => {
            e.preventDefault();
            if (step < totalSteps) nextStep();
            else handleSubmit(e);
          }}
        >
          {renderStep()}
        </form>
      </div>

      {/* Footer actions */}
      {!submitted && (
        <div className="flex flex-col-reverse gap-2 border-t border-neutral-border bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-neutral-border bg-white px-4 text-sm font-medium text-neutral-mid transition hover:bg-neutral-light hover:text-neutral-dark disabled:opacity-50 sm:min-h-10 sm:w-auto"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
          ) : closeForm ? (
            <button
              type="button"
              onClick={closeForm}
              className="min-h-11 w-full rounded-md bg-transparent px-4 text-sm font-medium text-neutral-mid hover:bg-neutral-light sm:min-h-10 sm:w-auto"
            >
              Cancel
            </button>
          ) : (
            <span className="hidden sm:block" />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="cv-btn-cta inline-flex min-h-11 w-full items-center justify-center gap-2 px-6 text-sm sm:min-h-10 sm:w-auto"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              form="admission-form"
              disabled={loading}
              className="cv-btn-cta inline-flex min-h-11 w-full items-center justify-center gap-2 px-6 text-sm sm:min-h-10 sm:w-auto"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  error,
}) {
  const inputId = `admission-${name}`;
  const isDate = type === "date";

  return (
    <div className="min-w-0">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-medium text-neutral-dark sm:text-sm"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        className={`box-border block h-11 w-full min-w-0 max-w-full rounded-md border bg-white px-3 text-base text-neutral-dark outline-none transition placeholder:text-neutral-mid focus:border-accent focus:ring-2 focus:ring-accent/20 sm:h-10 sm:text-sm ${
          isDate ? "" : "appearance-none"
        } ${error ? "border-red-400" : "border-neutral-border"}`}
      />

      {error && <p className="m-0 mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

/* ================= SELECT ================= */

function Select({ label, name, value, onChange, options = [] }) {
  const inputId = `admission-${name}`;

  return (
    <div className="min-w-0">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-medium text-neutral-dark sm:text-sm"
      >
        {label}
      </label>

      <select
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        className="box-border block h-11 w-full min-w-0 max-w-full rounded-md border border-neutral-border bg-white px-3 text-base text-neutral-dark outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 sm:h-10 sm:text-sm"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ================= FILE INPUT ================= */

function FileInput({ label, name, onChange, preview, file }) {
  const inputId = `admission-${name}`;

  return (
    <div className="box-border min-w-0 rounded-lg border border-neutral-border bg-white p-3">
      <span className="mb-2 block text-sm font-medium text-neutral-dark">
        {label}
      </span>

      <label
        htmlFor={inputId}
        className="flex min-h-24 w-full min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border border-dashed border-neutral-border bg-neutral-light px-3 py-4 text-center transition hover:border-accent hover:bg-accent-light"
      >
        {preview ? (
          <img
            src={preview}
            alt={`${label} preview`}
            className="mb-2 h-16 w-16 rounded-md border border-neutral-border bg-white object-contain"
          />
        ) : (
          <Upload size={21} className="mb-2 text-accent" />
        )}

        <span className="max-w-full break-all text-xs font-medium text-neutral-dark">
          {file?.name || "Choose a file"}
        </span>

        <span className="mt-1 text-[11px] text-neutral-mid">
          Tap to upload
        </span>
      </label>

      <input
        id={inputId}
        type="file"
        name={name}
        accept="image/*,.pdf"
        onChange={onChange}
        className="sr-only"
      />
    </div>
  );
}