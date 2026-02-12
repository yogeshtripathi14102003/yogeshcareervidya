"use client";

import { useState } from "react";
import api from "@/utlis/api.js";
import { Loader2, X } from "lucide-react";

const PRIMARY = "#1889b9";

export default function GetAdmissionWizard({ closeForm }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false); 
  const [previews, setPreviews] = useState({}); // file previews

  // ---------------- Handle Input Changes ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      const previewUrl = URL.createObjectURL(files[0]);
      setPreviews({ ...previews, [name]: previewUrl });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // ---------------- Submit Form ----------------
  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      // ✅ Correct API call
      await api.post("/api/v1/admissions", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to submit admission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Step Progress ----------------
  const StepProgress = () => (
    <div className="relative mb-6">
      <div className="flex justify-between relative items-center">
        {[...Array(totalSteps)].map((_, i) => {
          const stepNum = i + 1;
          const isCompleted = step > stepNum;
          const isActive = step === stepNum;

          return (
            <div key={i} className="flex-1 flex items-center relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold z-10
                ${isCompleted ? "bg-[#1889b9] text-white" : isActive ? "border-2 border-[#1889b9] text-[#1889b9]" : "border-2 border-gray-300 text-gray-500"}`}
              >
                {stepNum}
              </div>

              {i !== totalSteps - 1 && (
                <div className={`flex-1 h-1 -ml-1 ${isCompleted ? "bg-[#1889b9]" : "bg-gray-300"}`}></div>
              )}

              <span className="absolute top-10 left-1/2 -translate-x-1/2 text-xs text-gray-600 mt-1 md:mt-3">
                {stepNum === 1
                  ? "Personal"
                  : stepNum === 2
                  ? "Academic"
                  : stepNum === 3
                  ? "Documents"
                  : "Review"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ---------------- Render Steps ----------------
  const renderStep = () => {
    if (submitted) {
      return (
        <div className="col-span-2 text-center p-6">
          <h3 className="text-xl font-bold text-gray-700 mb-2">Thank You!</h3>
          <p className="text-gray-600">
            Thank you for applying to your course. Your documents will be verified, and we will update you shortly.
          </p>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <>
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} type="email" required />
            <Input label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} type="tel" required />
            <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male","Female","Other"]} />
            <Input label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} type="date" />
            <Input label="City" name="city" value={formData.city} onChange={handleChange} />
            <Input label="State" name="state" value={formData.state} onChange={handleChange} />
          </>
        );
      case 2:
        return (
          <>
            <Input label="Course" name="course" value={formData.course} onChange={handleChange} />
            <Input label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
            <Input label="University Name" name="university" value={formData.university} onChange={handleChange} />
          </>
        );
      case 3:
        return (
          <>
            <FileInput label="Aadhaar Card" name="aadhaarNumber" onChange={handleChange} preview={previews.aadhaarNumber} />
            <FileInput label="PAN Card" name="panNumber" onChange={handleChange} preview={previews.panNumber} />
            <FileInput label="Photo" name="photo" onChange={handleChange} preview={previews.photo} />
            <FileInput label="Signature" name="signature" onChange={handleChange} preview={previews.signature} />
          </>
        );
      case 4:
        return (
          <div className="col-span-2 p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Review Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="font-semibold">{key.replace(/([A-Z])/g, " $1")}:</span>{" "}
                  {value instanceof File ? value.name : value || "-"}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-lg relative">
        <button onClick={closeForm} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4" style={{ color: PRIMARY }}>Get Admission</h2>

        <StepProgress />

        {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderStep()}</form>

        {!submitted && (
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button onClick={prevStep} type="button" className="px-4 py-2 rounded border hover:bg-gray-100">Previous</button>
            ) : <div></div>}

            {step < totalSteps ? (
              <button onClick={nextStep} type="button" className="px-4 py-2 rounded bg-[#1889b9] text-white hover:bg-blue-700">Next</button>
            ) : (
              <button
                onClick={handleSubmit}
                type="button"
                className="px-4 py-2 rounded bg-[#1889b9] text-white flex items-center gap-2 hover:bg-blue-700"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin" size={18} />} Submit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENTS ================= */
const Input = ({ label, name, value, onChange, type = "text", required = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} required={required}
      className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1889b9]" />
  </div>
);

const Select = ({ label, name, value, onChange, options = [] }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    <select name={name} value={value} onChange={onChange}
      className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1889b9]" >
      <option value="">Select</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const FileInput = ({ label, name, onChange, preview }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input type="file" name={name} onChange={onChange} className="text-sm mb-2" />
    {preview && <img src={preview} alt={label} className="w-24 h-24 object-cover border rounded" />}
  </div>
);
