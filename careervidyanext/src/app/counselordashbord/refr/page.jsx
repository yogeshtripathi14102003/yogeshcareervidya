"use client";

import React, { useState, useEffect } from "react";
import api from "@/utlis/api.js";

import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  School,
  Layers,
  CreditCard,
  Calendar,
  Save,
  Headphones,
  Percent,
  Users,
} from "lucide-react";

/* ================= INITIAL STATE ================= */

const initialState = {
  studentName: "",
  fatherName: "",
  email: "",
  city: "",
  phone: "",

  refrelname: "",

  universityName: "",
  course: "",
  branch: "",

  semester: "",
  semesterFees: "",
  semesterCount: "",

  registrationFee: "",
  examFees: "",
  totalFees: "",

  admissionDate: new Date().toISOString().split("T")[0],
  counselorName: "",

  /* Closing */
  c_semesterFees: "",
  c_semesterCount: "",
  c_registrationFee: "",
  c_examFees: "",
  c_discount: "",
  c_totalFees: "",
};

export default function StudentAdmission({ lead, onClose }) {
  /* ================= STATE ================= */

  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [feesData, setFeesData] = useState([]);

  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);

  /* ================= AUTO COUNSELOR ================= */

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.name) {
      setFormData((prev) => ({
        ...prev,
        counselorName: user.name,
      }));
    }
  }, []);

  /* ================= FETCH FEES ================= */

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.get("/api/v1/admissionfess/all");

        if (res?.data?.success) {
          const data = res.data.data;

          setFeesData(data);

          setUniversities([
            ...new Set(data.map((i) => i.universityName)),
          ]);
        }
      } catch (err) {
        console.log("Fees API Error:", err);
      }
    };

    fetchFees();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newData = { ...formData, [name]: value ?? "" };

    /* ---------- UNIVERSITY ---------- */
    if (name === "universityName") {
      const filtered = feesData.filter(
        (i) => i.universityName === value
      );

      setCourses([...new Set(filtered.map((i) => i.course))]);
      setBranches([]);

      newData.course = "";
      newData.branch = "";
    }

    /* ---------- COURSE ---------- */
    if (name === "course") {
      const filtered = feesData.filter(
        (i) =>
          i.universityName === formData.universityName &&
          i.course === value
      );

      setBranches([...new Set(filtered.map((i) => i.branch))]);

      newData.branch = "";
    }

    /* ---------- BRANCH ---------- */
    if (name === "branch") {
      const selected = feesData.find(
        (i) =>
          i.universityName === formData.universityName &&
          i.course === formData.course &&
          i.branch === value
      );

      if (selected) {
        newData.semesterFees =
          selected?.semesterFees?.[0]?.fee || 0;

        newData.registrationFee =
          selected?.registrationFee || 0;

        newData.examFees = selected?.examFee || 0;

        /* Closing Auto */
        newData.c_semesterFees = newData.semesterFees;
        newData.c_registrationFee = newData.registrationFee;
        newData.c_examFees = newData.examFees;
      }
    }

    /* ---------- TOTAL (NORMAL) ---------- */

    const sem = Number(newData.semesterFees || 0);
    const count = Number(newData.semesterCount || 0);
    const reg = Number(newData.registrationFee || 0);
    const exam = Number(newData.examFees || 0);

    newData.totalFees = (
      sem * count +
      reg +
      exam * count
    ).toString();

    /* ---------- TOTAL (CLOSING) ---------- */

    const cSem = Number(newData.c_semesterFees || 0);
    const cCount = Number(newData.c_semesterCount || 0);
    const cReg = Number(newData.c_registrationFee || 0);
    const cExam = Number(newData.c_examFees || 0);
    const cDis = Number(newData.c_discount || 0);

    newData.c_totalFees = (
      cSem * cCount +
      cReg +
      cExam * cCount -
      cDis
    ).toString();

    setFormData(newData);
  };

  /* ================= RESET ================= */

  const resetForm = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    setFormData({
      ...initialState,
      counselorName: user?.name || "",
    });

    setCourses([]);
    setBranches([]);

    setMessage("");
    setError("");
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/api/v1/ad", formData);

      if (res?.data?.success) {
        setMessage("✅ Admission Submitted Successfully!");

        resetForm();

        if (onClose) onClose();
      } else {
        setError(res?.data?.message || "❌ Failed");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white font-sans p-6">
      <form onSubmit={handleSubmit} className="space-y-10">

        {/* MESSAGE */}
        {message && (
          <div className="p-3 bg-green-100 border-2 border-green-500 font-bold">
            {message}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 border-2 border-red-500 font-bold">
            {error}
          </div>
        )}

        {/* PERSONAL */}

        <Section title="Personal & Academic">

          <Input icon={User} label="Student" name="studentName" value={formData.studentName} onChange={handleChange} />

          <Input icon={Users} label="Father" name="fatherName" value={formData.fatherName} onChange={handleChange} />

          <Input icon={Mail} label="Email" name="email" value={formData.email} onChange={handleChange} />

          <Input icon={Phone} label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

          <Input icon={Users} label="Referral" name="refrelname" value={formData.refrelname} onChange={handleChange} />

          <SelectInput icon={School} label="University" name="universityName" value={formData.universityName} onChange={handleChange} options={universities} />

          <SelectInput icon={BookOpen} label="Course" name="course" value={formData.course} onChange={handleChange} options={courses} />

          <SelectInput icon={Layers} label="Branch" name="branch" value={formData.branch} onChange={handleChange} options={branches} />

          <SelectInput
            icon={Layers}
            label="Semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            options={["1","2","3","4","5","6","7","8"]}
          />

          <Input icon={Headphones} label="Counselor" name="counselorName" value={formData.counselorName} readOnly />

          <Input icon={Calendar} type="date" label="Date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} />

        </Section>

        {/* FEES */}

        <Section title="Fees">

          <Input icon={CreditCard} label="Sem Fee" name="semesterFees" value={formData.semesterFees} readOnly />

          <Input icon={Layers} label="Count" name="semesterCount" value={formData.semesterCount} onChange={handleChange} />

          <Input icon={CreditCard} label="Reg Fee" name="registrationFee" value={formData.registrationFee} readOnly />

          <Input icon={CreditCard} label="Exam Fee" name="examFees" value={formData.examFees} readOnly />

          <Input icon={CreditCard} label="Total" name="totalFees" value={formData.totalFees} readOnly />

        </Section>

        {/* CLOSING */}

        <Section title="Closing">

          <Input icon={CreditCard} label="C Sem" name="c_semesterFees" value={formData.c_semesterFees} onChange={handleChange} />

          <Input icon={Layers} label="C Count" name="c_semesterCount" value={formData.c_semesterCount} onChange={handleChange} />

          <Input icon={CreditCard} label="C Reg" name="c_registrationFee" value={formData.c_registrationFee} onChange={handleChange} />

          <Input icon={CreditCard} label="C Exam" name="c_examFees" value={formData.c_examFees} onChange={handleChange} />

          <Input icon={Percent} label="Discount" name="c_discount" value={formData.c_discount} onChange={handleChange} />

          <Input icon={CreditCard} label="C Total" name="c_totalFees" value={formData.c_totalFees} readOnly />

        </Section>

        {/* BUTTON */}

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-orange-500 text-white font-black flex items-center gap-2"
          >
            <Save size={16} />
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>

      </form>
    </div>
  );
}

/* ================= HELPERS ================= */

const Section = ({ title, children }) => (
  <div>
    <h3 className="font-black mb-4 border-l-4 border-orange-500 pl-3">
      {title}
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

const Input = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  readOnly = false,
}) => (
  <div>
    <label className="text-[11px] font-black uppercase mb-1 block">
      {label}
    </label>

    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 border-r pr-2">
        <Icon className="w-4 h-4 text-orange-600" />
      </div>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        readOnly={readOnly}
        className="pl-12 w-full border-2 p-2"
      />
    </div>
  </div>
);

const SelectInput = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  options = [],
}) => (
  <div>
    <label className="text-[11px] font-black uppercase mb-1 block">
      {label}
    </label>

    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 border-r pr-2">
        <Icon className="w-4 h-4 text-orange-600" />
      </div>

      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="pl-12 w-full border-2 p-2"
      >
        <option value="">Select</option>

        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);
