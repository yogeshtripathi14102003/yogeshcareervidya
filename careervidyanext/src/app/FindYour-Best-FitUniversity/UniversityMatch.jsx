"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Check,
  Clock3,
  IndianRupee,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const THEME = {
  blue: "#1E40AF",
};

const CATEGORIES = [
  { label: "PG Courses", value: "Postgraduate (PG)" },
  { label: "Executive Education", value: "Postgraduate (PG)" },
  { label: "Doctorate/Ph.D.", value: "Doctorate" },
  { label: "Gen AI/Agentic AI", value: "Other" },
  { label: "UG Courses", value: "Undergraduate (UG)" },
  { label: "Engineering", value: "Undergraduate (UG)" },
  { label: "Study Abroad", value: "Other" },
  { label: "Skilling & Certificate", value: "Diploma" },
];

const COURSES_BY_TYPE = {
  "Undergraduate (UG)": ["B.Tech", "BBA", "BCA", "BA", "B.Com", "B.Sc", "B.Des"],
  "Postgraduate (PG)": ["MBA", "MCA", "M.Tech", "MA", "M.Com", "M.Sc", "M.Des"],
  Diploma: ["Diploma in Engineering", "PG Diploma", "Diploma in Management", "Other Diploma"],
  Doctorate: ["Ph.D. Management", "Ph.D. Engineering", "Ph.D. Computer Science", "Other Doctorate"],
  Other: ["Professional Course", "Certificate Course", "Other"],
};

const SPECIALIZATIONS = {
  MBA: ["Marketing", "Finance", "Human Resources", "Business Analytics", "International Business", "Operations Management", "IT Management"],
  "B.Tech": ["Computer Science", "Information Technology", "Mechanical", "Civil", "Electronics", "Electrical"],
  MCA: ["Software Development", "Data Science", "AI & Machine Learning", "Cyber Security", "Cloud Computing"],
  BBA: ["Marketing", "Finance", "Human Resources", "International Business", "Entrepreneurship"],
  BCA: ["Software Development", "Data Science", "AI & Machine Learning", "Cyber Security"],
  "M.Tech": ["Computer Science", "AI & Machine Learning", "VLSI", "Structural Engineering", "Data Engineering"],
  "M.Com": ["Accounting", "Finance", "Taxation", "Banking"],
  BA: ["Psychology", "Economics", "English", "Political Science"],
};

const BUDGETS = [
  "Below ₹1,00,000",
  "₹1,00,000–₹2,00,000",
  "₹2,00,001–₹4,00,000",
  "₹4,00,001–₹5,99,999",
  "₹6,00,000 and above",
];

const SALARIES = [
  "Below ₹20,000",
  "₹20,000–₹30,000",
  "₹30,001–₹50,000",
  "₹50,001–₹75,000",
  "₹75,001–₹1,00,000",
  "Above ₹1,00,000",
];

const EXPERIENCE = [
  "No experience",
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "5–10 years",
  "More than 10 years",
];

// Demo-only data. Replace this array with the real university API response.
const DEMO_UNIVERSITIES = [
  {
    id: 1,
    name: "Amity University Online",
    mode: "Online",
    fee: "₹1,95,000",
    duration: "2 years",
    eligibility: "Bachelor's degree",
    scholarship: "Check current offers",
    placement: "Career support available",
    accent: "#1D4ED8",
    initials: "AU",
  },
  {
    id: 2,
    name: "Manipal University Jaipur",
    mode: "Online",
    fee: "₹1,75,000",
    duration: "2 years",
    eligibility: "Bachelor's degree",
    scholarship: "Check current offers",
    placement: "Career services available",
    accent: "#0F766E",
    initials: "MU",
  },
  {
    id: 3,
    name: "Chandigarh University",
    mode: "Online",
    fee: "₹2,00,000",
    duration: "2 years",
    eligibility: "Bachelor's degree",
    scholarship: "Check current offers",
    placement: "Placement support varies by course",
    accent: "#7C3AED",
    initials: "CU",
  },
];

const initialForm = {
  category: "",
  graduationType: "",
  course: "",
  specialization: "",
  working: "",
  currentSalary: "",
  expectedSalary: "",
  experience: "",
  budget: "",
  customBudget: "",
  scoreType: "Percentage",
  ugScore: "",
  placement: "",
  scholarship: "",
  refundFeature: "",
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SectionTitle({ title, description }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-lg text-slate-500 sm:text-[22px]">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>}
    </div>
  );
}

function FieldLabel({ children, optional = false }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {children}
      {optional && <span className="ml-1 font-normal text-slate-400">(Optional)</span>}
    </label>
  );
}

function TextField({ label, value, onChange, placeholder, type = "text", min, max, optional = false, hint }) {
  return (
    <div>
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// Same pill buttons as the first step. Used for every single-choice question.
function OptionCards({ value, onChange, options }) {
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 sm:gap-5">
      {items.map((option) => {
        const selected = value === option.value;
        return (
          <button
            type="button"
            key={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            className={cx(
              "min-h-[66px] rounded-xl border bg-white px-5 py-4 text-[15px] font-semibold text-blue-700 shadow-sm transition hover:border-blue-600 hover:shadow-md sm:px-6",
              selected ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"
            )}
          >
            {option.label}
            {option.description && (
              <span className="mt-0.5 block text-xs font-normal text-slate-500">{option.description}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function UniversityCard({ university, selected, onToggle }) {
  return (
    <article
      className={cx(
        "flex h-full flex-col rounded-2xl border bg-white p-5 transition",
        selected ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white"
          style={{ backgroundColor: university.accent }}
        >
          {university.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-5 text-slate-900">{university.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{university.mode} learning</p>
        </div>
        <button
          type="button"
          onClick={() => onToggle(university.id)}
          aria-label={`${selected ? "Remove" : "Add"} ${university.name} ${selected ? "from" : "to"} comparison`}
          aria-pressed={selected}
          className={cx(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition",
            selected ? "border-blue-700 bg-blue-700 text-white" : "border-slate-200 text-slate-500 hover:border-blue-400"
          )}
        >
          {selected ? <Check size={16} /> : <span className="text-lg leading-none">+</span>}
        </button>
      </div>

      <div className="my-5 rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-medium text-slate-500">Indicative course fee</p>
        <p className="mt-1 flex items-center gap-1 text-2xl font-extrabold tracking-tight text-slate-900">
          <IndianRupee size={20} />
          {university.fee.replace("₹", "")}
        </p>
        <p className="mt-1 text-xs text-slate-500">Demo value — verify with university</p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2.5">
          <Clock3 size={16} className="mt-0.5 shrink-0 text-blue-700" />
          <div><span className="text-slate-500">Duration</span><p className="font-semibold text-slate-800">{university.duration}</p></div>
        </div>
        <div className="flex items-start gap-2.5">
          <GraduationCap size={16} className="mt-0.5 shrink-0 text-blue-700" />
          <div><span className="text-slate-500">Eligibility</span><p className="font-semibold text-slate-800">{university.eligibility}</p></div>
        </div>
        <div className="flex items-start gap-2.5">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-orange-500" />
          <div><span className="text-slate-500">Scholarship</span><p className="font-semibold text-slate-800">{university.scholarship}</p></div>
        </div>
        <div className="flex items-start gap-2.5">
          <Users size={16} className="mt-0.5 shrink-0 text-blue-700" />
          <div><span className="text-slate-500">Career support</span><p className="font-semibold text-slate-800">{university.placement}</p></div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.alert("Demo page: connect this action to your university details or enquiry route.")}
        className="mt-5 w-full rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50"
      >
        View Details
      </button>
    </article>
  );
}

const yesNo = (yesLabel, yesDesc, noLabel, noDesc) => [
  { value: "Yes", label: yesLabel, description: yesDesc },
  { value: "No", label: noLabel, description: noDesc },
];

export default function CompareUniversityPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [selectedUniversities, setSelectedUniversities] = useState([1, 2]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const isWorking = form.working === "Yes";
  const courses = COURSES_BY_TYPE[form.graduationType] || [];
  const specializations = SPECIALIZATIONS[form.course] || ["General", "Other"];

  // Every question is its own step. Salary/experience steps appear only if "working" = Yes.
  const flow = useMemo(() => {
    const steps = ["category", "course", "specialization", "working"];
    if (isWorking) steps.push("currentSalary", "expectedSalary", "experience");
    steps.push("budget", "score", "placement", "scholarship", "refundFeature", "compare");
    return steps;
  }, [isWorking]);

  const stepKey = flow[Math.min(stepIndex, flow.length - 1)];
  const isLast = stepIndex === flow.length - 1;

  const update = (key, value) => {
    setForm((previous) => {
      const next = { ...previous, [key]: value };
      if (key === "graduationType") {
        next.course = "";
        next.specialization = "";
      }
      if (key === "course") next.specialization = "";
      if (key === "working" && value === "No") {
        next.currentSalary = "";
        next.expectedSalary = "";
        next.experience = "";
      }
      return next;
    });
    setErrors({});
  };

  const selectCategory = (item) => {
    setForm((previous) => ({
      ...previous,
      category: item.label,
      graduationType: item.value,
      course: previous.graduationType === item.value ? previous.course : "",
      specialization: previous.graduationType === item.value ? previous.specialization : "",
    }));
    setErrors({});
  };

  const validate = () => {
    let message = "";
    const score = Number(form.ugScore);
    switch (stepKey) {
      case "category": if (!form.category) message = "Please select a category."; break;
      case "course": if (!form.course) message = "Please select a course."; break;
      case "specialization": if (!form.specialization) message = "Please select a specialization."; break;
      case "working": if (!form.working) message = "Please select an option."; break;
      case "currentSalary": if (!form.currentSalary) message = "Please select your current salary."; break;
      case "expectedSalary": if (!form.expectedSalary) message = "Please select your expected salary."; break;
      case "experience": if (!form.experience) message = "Please select your work experience."; break;
      case "budget": if (!form.budget) message = "Please select or enter your budget."; break;
      case "score":
        if (!form.ugScore.trim()) message = "Please enter your graduation score.";
        else if (score < 0 || (form.scoreType === "Percentage" && score > 100) || (form.scoreType === "CGPA" && score > 10))
          message = form.scoreType === "Percentage" ? "Enter a percentage between 0 and 100." : "Enter a valid CGPA (0–10).";
        break;
      case "placement": if (!form.placement) message = "Please select an option."; break;
      case "scholarship": if (!form.scholarship) message = "Please select an option."; break;
      case "refundFeature": if (!form.refundFeature) message = "Please select an option."; break;
      default: break;
    }
    setErrors(message ? { [stepKey]: message } : {});
    return !message;
  };

  const goNext = () => {
    if (!validate()) return;
    setShowSummary(false);
    setStepIndex((previous) => Math.min(previous + 1, flow.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setShowSummary(false);
    setStepIndex((previous) => Math.max(previous - 1, 0));
  };

  const resetForm = () => {
    setForm(initialForm);
    setStepIndex(0);
    setErrors({});
    setSelectedUniversities([1, 2]);
    setSearchTerm("");
    setShowSummary(false);
  };

  const visibleUniversities = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return DEMO_UNIVERSITIES.filter((university) => university.name.toLowerCase().includes(term));
  }, [searchTerm]);

  const toggleUniversity = (id) => {
    setSelectedUniversities((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : previous.length < 3
          ? [...previous, id]
          : previous
    );
  };

  const errorText = errors[stepKey] ? (
    <p className="mt-3 text-xs font-medium text-red-600" role="alert">{errors[stepKey]}</p>
  ) : null;

  const renderStep = () => {
    switch (stepKey) {
      case "course":
        return (
          <>
            <SectionTitle title="Which course do you want to pursue?" description={`Courses available under ${form.category || "your category"}.`} />
            <OptionCards value={form.course} onChange={(v) => update("course", v)} options={courses} />
          </>
        );
      case "specialization":
        return (
          <>
            <SectionTitle title="Choose your specialization" description={`Specializations for ${form.course}.`} />
            <OptionCards value={form.specialization} onChange={(v) => update("specialization", v)} options={specializations} />
          </>
        );
      case "working":
        return (
          <>
            <SectionTitle title="Are you currently working?" />
            <OptionCards
              columns={2}
              value={form.working}
              onChange={(v) => update("working", v)}
              options={yesNo("Yes, I'm working", "We'll ask a few work details next", "No, I'm not working", "Skip work details")}
            />
          </>
        );
      case "currentSalary":
        return (
          <>
            <SectionTitle title="What is your current monthly salary?" />
            <OptionCards value={form.currentSalary} onChange={(v) => update("currentSalary", v)} options={SALARIES} />
          </>
        );
      case "expectedSalary":
        return (
          <>
            <SectionTitle title="What monthly salary do you expect after the course?" />
            <OptionCards value={form.expectedSalary} onChange={(v) => update("expectedSalary", v)} options={SALARIES} />
          </>
        );
      case "experience":
        return (
          <>
            <SectionTitle title="How much work experience do you have?" />
            <OptionCards value={form.experience} onChange={(v) => update("experience", v)} options={EXPERIENCE} />
          </>
        );
      case "budget":
        return (
          <>
            <SectionTitle title="What is your education budget?" description="Pick a range or enter your own amount." />
            <OptionCards
              value={form.budget}
              onChange={(v) => { setForm((p) => ({ ...p, budget: v, customBudget: "" })); setErrors({}); }}
              options={BUDGETS}
            />
            <div className="mx-auto mt-6 max-w-md text-left">
              <TextField
                label="Or enter your own budget (₹)"
                type="number"
                min="0"
                value={form.customBudget}
                onChange={(amount) => {
                  setForm((p) => ({ ...p, customBudget: amount, budget: amount ? `Custom: ₹${amount}` : "" }));
                  setErrors({});
                }}
                placeholder="Enter amount in rupees"
                optional
              />
            </div>
          </>
        );
      case "score":
        return (
          <>
            <SectionTitle title="What was your graduation score?" />
            <div className="mb-5 flex justify-center"><div className="inline-flex rounded-lg bg-slate-100 p-1">
              {["Percentage", "CGPA"].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setForm((p) => ({ ...p, scoreType: type, ugScore: "" }))}
                  className={cx("rounded-md px-4 py-2 text-xs font-bold transition", form.scoreType === type ? "bg-white text-blue-800 shadow-sm" : "text-slate-500")}
                >
                  {type}
                </button>
              ))}
            </div></div>
            <div className="mx-auto max-w-md text-left"><TextField
              label={form.scoreType === "Percentage" ? "Graduation percentage" : "Graduation CGPA"}
              value={form.ugScore}
              onChange={(v) => update("ugScore", v)}
              type="number"
              min="0"
              max={form.scoreType === "Percentage" ? "100" : "10"}
              placeholder={form.scoreType === "Percentage" ? "e.g. 72" : "e.g. 7.2"}
              hint={form.scoreType === "Percentage" ? "Enter a value between 0 and 100." : "Enter your CGPA out of 10."}
            /></div>
          </>
        );
      case "placement":
        return (
          <>
            <SectionTitle title="Do you want placement assistance?" />
            <OptionCards
              value={form.placement}
              onChange={(v) => update("placement", v)}
              options={yesNo("Yes, placement support", "Explore career and placement services", "No, not required", "Focus on other course factors")}
            />
          </>
        );
      case "scholarship":
        return (
          <>
            <SectionTitle title="Would you like to explore scholarships?" />
            <OptionCards
              value={form.scholarship}
              onChange={(v) => update("scholarship", v)}
              options={yesNo("Yes, show scholarships", "Check available and verified offers", "No, not necessary", "Show other relevant options")}
            />
          </>
        );
      case "refundFeature":
        return (
          <>
            <SectionTitle title="Want to know about CareerVidya's refund feature?" />
            <OptionCards
              value={form.refundFeature}
              onChange={(v) => update("refundFeature", v)}
              options={yesNo("Yes, tell me more", "Show applicable terms and eligibility", "No, thank you", "Continue without this information")}
            />
            <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-5 text-slate-500">
              Refund availability, eligibility and terms must be confirmed from CareerVidya's actual policy. This selection does not guarantee a refund.
            </p>
          </>
        );
      case "compare":
        return (
          <>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <SectionTitle
                title="Compare university options"
                description={`Options for ${form.course}${form.specialization ? ` · ${form.specialization}` : ""}. Select up to three to compare.`}
              />
              <div className="mb-6 inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-900">
                <Check size={15} /> {selectedUniversities.length} selected
              </div>
            </div>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search universities"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <button type="button" onClick={() => setShowSummary((v) => !v)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                {showSummary ? "Hide profile" : "View my profile"}
              </button>
            </div>

            {showSummary && (
              <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <h3 className="text-sm font-bold text-blue-950">Your comparison preferences</h3>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-xs text-slate-500">Category</dt><dd className="mt-1 font-semibold">{form.category}</dd></div>
                  <div><dt className="text-xs text-slate-500">Course</dt><dd className="mt-1 font-semibold">{form.course} · {form.specialization}</dd></div>
                  <div><dt className="text-xs text-slate-500">Employment</dt><dd className="mt-1 font-semibold">{isWorking ? "Currently working" : "Not working"}</dd></div>
                  <div><dt className="text-xs text-slate-500">Education budget</dt><dd className="mt-1 font-semibold">{form.budget}</dd></div>
                  {isWorking && <div><dt className="text-xs text-slate-500">Current monthly salary</dt><dd className="mt-1 font-semibold">{form.currentSalary}</dd></div>}
                  {isWorking && <div><dt className="text-xs text-slate-500">Expected monthly salary</dt><dd className="mt-1 font-semibold">{form.expectedSalary}</dd></div>}
                  {isWorking && <div><dt className="text-xs text-slate-500">Experience</dt><dd className="mt-1 font-semibold">{form.experience}</dd></div>}
                  <div><dt className="text-xs text-slate-500">Graduation score</dt><dd className="mt-1 font-semibold">{form.ugScore} {form.scoreType === "Percentage" ? "%" : "CGPA"}</dd></div>
                  <div><dt className="text-xs text-slate-500">Placement assistance</dt><dd className="mt-1 font-semibold">{form.placement}</dd></div>
                  <div><dt className="text-xs text-slate-500">Scholarship</dt><dd className="mt-1 font-semibold">{form.scholarship}</dd></div>
                </dl>
              </div>
            )}

            <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-amber-700" />
              <p className="text-xs leading-5 text-amber-900">These are demonstration cards and indicative values for UI preview only. Verify fees, eligibility, scholarships and placement details with official university sources before publishing.</p>
            </div>

            {visibleUniversities.length ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {visibleUniversities.map((university) => (
                  <UniversityCard
                    key={university.id}
                    university={university}
                    selected={selectedUniversities.includes(university.id)}
                    onToggle={toggleUniversity}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center">
                <Search size={26} className="mx-auto text-slate-400" />
                <h3 className="mt-3 font-bold text-slate-800">No universities found</h3>
                <p className="mt-1 text-sm text-slate-500">Try another search term.</p>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative h-[104px] border-b-[8px] border-slate-200 bg-white px-6 sm:px-10">
        <a href="/" className="inline-flex h-full items-center" aria-label="CareerVidya home">
          <img src="/images/n12.png" alt="CareerVidya" className="max-h-[58px] max-w-[190px] object-contain" />
        </a>
      </header>

      {stepKey !== "category" && (
        <div className="h-1.5 w-full bg-slate-200" role="progressbar" aria-valuemin={0} aria-valuemax={flow.length} aria-valuenow={stepIndex + 1}>
          <div className="h-full bg-blue-700 transition-all duration-300" style={{ width: `${((stepIndex + 1) / flow.length) * 100}%` }} />
        </div>
      )}

      <div className="min-h-[calc(100vh-104px)] bg-white pb-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="pt-0 text-center">
            <div className="mx-auto -mt-[64px] flex h-[104px] w-[104px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-50 shadow-sm">
              <img
                src="/images/sir.png"
                alt="CareerVidya counsellor"
                className="h-full w-full object-cover"
                onError={(event) => { event.currentTarget.style.display = "none"; }}
              />
              <GraduationCap size={42} className="text-blue-700" />
            </div>

            {stepKey === "category" ? (
              <>
                <h1 className="mt-5 text-xl font-normal text-slate-950 sm:text-[27px]">
                  Hi! Welcome to <strong className="font-bold text-blue-700">CareerVidya</strong>
                </h1>
                <p className="mt-3 text-lg text-slate-500 sm:text-[22px]">Which degree are you interested in?</p>
                <div className="mx-auto mt-9 flex max-w-5xl flex-wrap justify-center gap-4 sm:gap-5">
                  {CATEGORIES.map((item) => {
                    const selected = form.category === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => selectCategory(item)}
                        aria-pressed={selected}
                        className={cx(
                          "min-h-[66px] rounded-xl border bg-white px-5 py-4 text-[15px] font-semibold text-blue-700 shadow-sm transition hover:border-blue-600 hover:shadow-md sm:px-6",
                          selected ? "border-blue-600 ring-1 ring-blue-600" : "border-slate-200"
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                {errorText}
              </>
            ) : (
              <>
                <div className="mx-auto mt-5 flex max-w-xl items-center justify-between gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Step {stepIndex + 1} of {flow.length}</span>
                  <button type="button" onClick={resetForm} className="hover:text-blue-700">Start over</button>
                </div>
                <div className="mt-8">
                  {renderStep()}
                  {stepKey !== "compare" && errorText}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center gap-4 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(15,23,42,0.04)] backdrop-blur sm:px-8">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className={cx(
            "inline-flex w-full max-w-[420px] items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition",
            stepIndex === 0 ? "cursor-not-allowed border-slate-200 text-slate-400" : "border-slate-200 text-slate-700 hover:bg-slate-50"
          )}
        >
          <ArrowLeft size={16} /> Back
        </button>
        {!isLast ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex w-full max-w-[420px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-blue-200"
            style={{ background: THEME.blue }}
          >
            Next <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => window.alert("Demo flow complete. Connect your real university comparison or enquiry API here.")}
            className="inline-flex w-full max-w-[420px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            Enquire Now <ArrowRight size={16} />
          </button>
        )}
      </div>
    </main>
  );
}