"use client";

import { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditUniversityPage({ params }) {
  const router = useRouter();
  const universityId = params?.id;

  // --- State Variables ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [universityImage, setUniversityImage] = useState(null);
  const [universityImage_old, setUniversityImage_old] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");

  const [shareDescription, setShareDescription] = useState("");
  const [cardDescription, setCardDescription] = useState("");

  // New Background Fields
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundImage_old, setBackgroundImage_old] = useState("");
  const [backgroundDescription, setBackgroundDescription] = useState("");

  const [heading, setHeading] = useState("");
  const [points, setPoints] = useState([""]);
  const [factsHeading, setFactsHeading] = useState("");
  const [factsSubHeading, setFactsSubHeading] = useState("");
  const [factsPoints, setFactsPoints] = useState([""]);

  const [approvals, setApprovals] = useState([{ name: "", logo: null, logo_old: null }]);

  const [recognitionHeading, setRecognitionHeading] = useState("");
  const [recognitionDescription, setRecognitionDescription] = useState("");
  const [recognitionPoints, setRecognitionPoints] = useState([""]);
  const [certificateImage, setCertificateImage] = useState(null);
  const [certificateImage_old, setCertificateImage_old] = useState("");

  const [admissionHeading, setAdmissionHeading] = useState("");
  const [admissionSubHeading, setAdmissionSubHeading] = useState("");
  const [admissionDescription, setAdmissionDescription] = useState("");
  const [admissionPoints, setAdmissionPoints] = useState([""]);

  // Updated Courses State to include fees and details
  const [courses, setCourses] = useState([{ name: "", logo: null, logo_old: null, duration: "", fees: "", details: "" }]);
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [dataLoadingError, setDataLoadingError] = useState(false);

  // --- Utility ---
  const isValidUrl = (url) =>
    typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"));

  const filterEmptyObjects = (arr) =>
    arr.filter((item) => {
      if (typeof item === "string") return item.trim() !== "";
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(
          (val) => val !== null && val !== "" && (typeof val === "string" ? val.trim() !== "" : true)
        );
      }
      return false;
    });

  // --- Fetch existing university data ---
  useEffect(() => {
    if (!universityId) {
      setDataLoadingError(true);
      setMessage("Error: University ID is missing.");
      setLoading(false);
      return;
    }

    const fetchUniversityData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/v1/university/${universityId}`);
        const data = response.data?.data || {};

        // Basic
        setName(data.name || "");
        setDescription(data.description || "");
        setUniversityImage_old(data.universityImage || "");
        setYoutubeLink(data.youtubeLink || "");

        // SEO
        setShareDescription(data.shareDescription || "");
        setCardDescription(data.cardDescription || "");

        // Background (New)
        setBackgroundImage_old(data.background?.backgroundImage || "");
        setBackgroundDescription(data.background?.backgroundDescription || "");

        // Highlights
        setHeading(data.highlights?.heading || "");
        setPoints(
          data.highlights?.points && data.highlights.points.length > 0 ? data.highlights.points : [""]
        );

        // Facts
        setFactsHeading(data.facts?.factsHeading || "");
        setFactsSubHeading(data.facts?.factsSubHeading || "");
        setFactsPoints(
          data.facts?.factsPoints && data.facts.factsPoints.length > 0 ? data.facts.factsPoints : [""]
        );

        // Approvals
        const mappedApprovals = (data.approvals || []).map((app) => ({
          name: app.name || "",
          logo_old: app.logo || null,
          logo: null,
        }));
        setApprovals(mappedApprovals.length > 0 ? mappedApprovals : [{ name: "", logo: null, logo_old: null }]);

        // Recognition
        setRecognitionHeading(data.recognition?.recognitionHeading || "");
        setRecognitionDescription(data.recognition?.recognitionDescription || "");
        setCertificateImage_old(data.recognition?.certificateImage || "");
        setRecognitionPoints(
          data.recognition?.recognitionPoints && data.recognition.recognitionPoints.length > 0
            ? data.recognition.recognitionPoints
            : [""]
        );

        // Admission
        setAdmissionHeading(data.admission?.admissionHeading || "");
        setAdmissionSubHeading(data.admission?.admissionSubHeading || "");
        setAdmissionDescription(data.admission?.admissionDescription || "");
        setAdmissionPoints(
          data.admission?.admissionPoints && data.admission.admissionPoints.length > 0 ? data.admission.admissionPoints : [""]
        );

        // Courses (Updated with fees/details)
        const mappedCourses = (data.courses || []).map((c) => ({
          name: c.name || "",
          duration: c.duration || "",
          fees: c.fees || "",
          details: c.details || "",
          logo_old: c.logo || null,
          logo: null,
        }));
        setCourses(mappedCourses.length > 0 ? mappedCourses : [{ name: "", logo: null, logo_old: null, duration: "", fees: "", details: "" }]);

        setMessage("Data loaded successfully.");
      } catch (error) {
        console.error("Error fetching university data:", error);
        setDataLoadingError(true);
        setMessage("❌ Error loading university data: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [universityId]);

  // --- Dynamic list handlers ---
  const addAdmissionPoint = () => setAdmissionPoints([...admissionPoints, ""]);
  const removeAdmissionPoint = (index) => setAdmissionPoints(admissionPoints.filter((_, i) => i !== index));
  const handleAdmissionPointChange = (index, value) => {
    const updated = [...admissionPoints];
    updated[index] = value;
    setAdmissionPoints(updated);
  };

  const addPoint = () => setPoints([...points, ""]);
  const removePoint = (index) => setPoints(points.filter((_, i) => i !== index));
  const handlePointChange = (index, value) => {
    const updated = [...points];
    updated[index] = value;
    setPoints(updated);
  };

  const addFactsPoint = () => setFactsPoints([...factsPoints, ""]);
  const removeFactsPoint = (index) => setFactsPoints(factsPoints.filter((_, i) => i !== index));
  const handleFactsPointChange = (index, value) => {
    const updated = [...factsPoints];
    updated[index] = value;
    setFactsPoints(updated);
  };

  const addRecognitionPoint = () => setRecognitionPoints([...recognitionPoints, ""]);
  const removeRecognitionPoint = (index) =>
    setRecognitionPoints(recognitionPoints.filter((_, i) => i !== index));
  const handleRecognitionPointChange = (index, value) => {
    const updated = [...recognitionPoints];
    updated[index] = value;
    setRecognitionPoints(updated);
  };

  const handleApprovalChange = (index, field, value) => {
    const updated = [...approvals];
    updated[index][field] = value;
    setApprovals(updated);
  };
  const addApproval = () => setApprovals([...approvals, { name: "", logo: null, logo_old: null }]);
  const removeApproval = (index) => setApprovals(approvals.filter((_, i) => i !== index));

  const addCourse = () => setCourses([...courses, { name: "", logo: null, logo_old: null, duration: "", fees: "", details: "" }]);
  const removeCourse = (index) => setCourses(courses.filter((_, i) => i !== index));
  const handleCourseChange = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();

      // Single fields
      formData.append("name", name);
      formData.append("description", description);
      formData.append("youtubeLink", youtubeLink || "");
      formData.append("shareDescription", shareDescription || "");
      formData.append("cardDescription", cardDescription || "");
      
      // New Background Logic
      formData.append("backgroundDescription", backgroundDescription || "");
      formData.append("backgroundImage_old", backgroundImage_old || "");
      if (backgroundImage instanceof File) formData.append("backgroundImage", backgroundImage);

      formData.append("heading", heading || "");
      formData.append("factsHeading", factsHeading || "");
      formData.append("factsSubHeading", factsSubHeading || "");
      formData.append("recognitionHeading", recognitionHeading || "");
      formData.append("recognitionDescription", recognitionDescription || "");
      formData.append("admissionHeading", admissionHeading || "");
      formData.append("admissionSubHeading", admissionSubHeading || "");
      formData.append("admissionDescription", admissionDescription || "");

      // Old image URLs
      formData.append("universityImage_old", universityImage_old || "");
      formData.append("certificateImage_old", certificateImage_old || "");

      // Array fields
      formData.append("points", JSON.stringify(filterEmptyObjects(points)));
      formData.append("factsPoints", JSON.stringify(filterEmptyObjects(factsPoints)));
      formData.append("recognitionPoints", JSON.stringify(filterEmptyObjects(recognitionPoints)));
      formData.append("admissionPoints", JSON.stringify(filterEmptyObjects(admissionPoints)));

      // Single file fields
      if (universityImage instanceof File) formData.append("universityImage", universityImage);
      if (certificateImage instanceof File) formData.append("certificateImage", certificateImage);

      // Approvals
      const approvalsDataForBody = approvals.map((a) => ({
        name: a.name || "",
        logo: a.logo ? "new_file" : a.logo_old || null,
      }));
      formData.append("approvals", JSON.stringify(filterEmptyObjects(approvalsDataForBody)));

      approvals.forEach((approval, index) => {
        if (approval.logo instanceof File) {
          formData.append(`approvals[${index}][logo]`, approval.logo);
        }
      });

      // Courses (Updated with fees/details)
      const coursesDataForBody = courses.map((c) => ({
        name: c.name || "",
        duration: c.duration || "",
        fees: c.fees || "",
        details: c.details || "",
        logo: c.logo ? "new_file" : c.logo_old || null,
      }));
      formData.append("courses", JSON.stringify(filterEmptyObjects(coursesDataForBody)));

      courses.forEach((course, index) => {
        if (course.logo instanceof File) {
          formData.append(`courses[${index}][logo]`, course.logo);
        }
      });

      const response = await api.put(`/api/v1/university/${universityId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ University updated successfully!");
    } catch (error) {
      console.error("Submission Error:", error);
      setMessage("❌ Error updating university: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  // -



  // -- Render states ---
  if (loading && !dataLoadingError) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-xl font-semibold mt-20">🔄 Loading University Data...</div>
    );
  }

  if (dataLoadingError) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-xl font-semibold mt-20 text-red-600">
        🛑 Failed to load data. {message}
        <Link href="/admin/universities" className="text-blue-500 block mt-4 hover:underline">
          Go back to Universities List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl mt-10">
      <h2 className="text-3xl font-extrabold text-[#A00000] mb-8 pb-4 border-b border-gray-200">✍️ Edit University: {name}</h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* 1. About Us */}
        <div className="p-6 border border-blue-200 rounded-xl bg-blue-50 shadow-sm">
          <h3 className="font-bold text-xl mb-4 text-[#0056B3]">1. About Us</h3>

          {isValidUrl(universityImage_old) && (
            <div className="mb-6 p-3 border border-blue-300 rounded-lg bg-white flex flex-col items-center">
              <h4 className="font-semibold text-base mb-2 text-blue-800">Current University Logo</h4>
              <div className="w-32 h-16 overflow-hidden">
                <img src={universityImage_old} alt={`${name} Logo`} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">University Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Delhi University" />
            </div>
            <div>
              <label className="block font-medium mb-1">YouTube Video Link</label>
              <input type="url" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. https://www.youtube.com/watch?v=..." />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">University Image</label>
              <input type="file" accept="image/*" onChange={(e) => { setUniversityImage(e.target.files[0]); setUniversityImage_old(null); }} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-[#0056B3] hover:file:bg-blue-200 cursor-pointer" />
              {isValidUrl(universityImage_old) && !universityImage && (
                <p className="text-sm text-gray-500 mt-1">Current Image: <span className="font-semibold text-blue-700">Present</span> (Upload new to replace)</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Main Description (Detailed)</label>
              <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Detailed information about the university" />
            </div>
          </div>
        </div>

        {/* NEW SECTION: Background Details */}
        <div className="p-6 border border-indigo-200 rounded-xl bg-indigo-50 shadow-sm">
          <h3 className="font-bold text-xl mb-4 text-[#4B0082]">1.1 Background Section</h3>
          <div className="grid md:grid-cols-1 gap-6">
             <div>
              <label className="block font-medium mb-1">Background Image</label>
              <input type="file" accept="image/*" onChange={(e) => { setBackgroundImage(e.target.files[0]); setBackgroundImage_old(null); }} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-[#4B0082] hover:file:bg-indigo-200 cursor-pointer" />
              {isValidUrl(backgroundImage_old) && !backgroundImage && (
                <p className="text-sm text-gray-500 mt-1">Current Background: <a href={backgroundImage_old} target="_blank" className="text-indigo-700 hover:underline">View Current</a></p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Background Description</label>
              <textarea rows="3" value={backgroundDescription} onChange={(e) => setBackgroundDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="History or background details of the university" />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="p-4 border border-yellow-300 rounded-xl bg-yellow-50 shadow-sm">
          <h4 className="font-bold text-lg mb-3 text-[#CC6600]">SEO & Card Details</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-sm">Share Description (SEO)</label>
              <textarea rows="2" value={shareDescription} onChange={(e) => setShareDescription(e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="A short, catchy description for sharing" />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm">Card Description (Listing Card)</label>
              <textarea rows="2" value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="Very brief summary of the university" />
            </div>
          </div>
        </div>

        {/* Facts & Highlights */}
        <div className="p-6 border border-green-300 rounded-xl bg-green-50 shadow-sm">
          <h3 className="font-bold text-xl mb-4 text-[#006400]">2 Career outcome and Placement</h3>

          <div className="mb-6 p-4 border border-green-200 rounded-lg bg-white">
            <h4 className="font-semibold text-lg mb-3 text-green-800">Highlights Section</h4>
            <label className="block font-medium mb-1 text-sm">Main Section Heading (e.g., Why Choose?)</label>
            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300 mb-4" placeholder="e.g. Why Choose This University?" />

            <label className="block font-medium mb-2 text-sm">Add Points (Key features/bullets)</label>
            {points.map((point, index) => (
              <div key={`p-${index}`} className="flex gap-2 mb-2 items-center">
                <input type="text" value={point} onChange={(e) => handlePointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Point ${index + 1}`} />
                {points.length > 1 && (<button type="button" onClick={() => removePoint(index)} className="text-red-600 hover:text-red-800 text-sm font-medium transition flex-shrink-0">Remove</button>)}
              </div>
            ))}
            <button type="button" onClick={addPoint} className="bg-[#006400] text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition mt-2 shadow-md">+ Add Highlight Point</button>
          </div>

          <div className="p-4 border border-green-200 rounded-lg bg-white">
            <h4 className="font-semibold text-lg mb-3 text-green-800">Facts & Statistics Section</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium mb-1 text-sm">Facts Section Heading</label>
                <input type="text" value={factsHeading} onChange={(e) => setFactsHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Facts About [University Name]" />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm">The Sub-Heading</label>
                <input type="text" value={factsSubHeading} onChange={(e) => setFactsSubHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Key achievements and statistics" />
              </div>
            </div>

            <label className="block font-medium mb-2 text-sm">Add Facts Points</label>
            {factsPoints.map((point, index) => (
              <div key={`fp-${index}`} className="flex gap-2 mb-2 items-center">
                <input type="text" value={point} onChange={(e) => handleFactsPointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Fact Point ${index + 1}`} />
                {factsPoints.length > 1 && (<button type="button" onClick={() => removeFactsPoint(index)} className="text-red-600 hover:text-red-800 text-sm font-medium transition flex-shrink-0">Remove</button>)}
              </div>
            ))}
            <button type="button" onClick={addFactsPoint} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-900 transition mt-2 shadow-md">+ Add Fact Point</button>
          </div>
        </div>

        {/* Approvals */}
        <div className="p-6 border border-red-300 rounded-xl bg-red-50 shadow-sm">
          <h3 className="font-bold text-xl mb-4 text-[#A00000]">3. University Approvals (Logos & Names)</h3>

          {approvals.map((approval, index) => (
            <div key={`a-${index}`} className="grid md:grid-cols-3 gap-4 items-end mb-4 p-4 border rounded-lg border-red-200 bg-white shadow-sm">
              <div>
                <label className="block text-sm font-medium mb-1">Approval Name</label>
                <input type="text" value={approval.name} onChange={(e) => handleApprovalChange(index, "name", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. UGC, AICTE, NAAC" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Approval Logo</label>
                <input type="file" accept="image/*" onChange={(e) => handleApprovalChange(index, "logo", e.target.files[0])} className="w-full text-gray-700 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-red-100 file:text-red-700 hover:file:bg-red-200 cursor-pointer" />
                {approval.logo_old && !approval.logo && (
                  <p className="text-xs text-gray-500 mt-1">Current Logo: <a href={approval.logo_old} target="_blank" className="text-red-700 hover:underline">View</a></p>
                )}
              </div>
              <div className="md:col-span-1">
                {approvals.length > 1 && (<button type="button" onClick={() => removeApproval(index)} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm transition shadow-md">Remove Approval</button>)}
              </div>
            </div>
          ))}

          <button type="button" onClick={addApproval} className="bg-[#A00000] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition mt-4 shadow-md">+ Add Another Approval</button>
        </div>

        {/* Recognition */}
        <div className="p-6 border border-teal-400 rounded-xl bg-teal-50 shadow-sm">
          <h3 className="font-bold text-xl mb-4 text-[#008080]">4. University Recognition & Certificates</h3>

          <div className="mb-4">
            <label className="block font-medium mb-1 text-sm">Recognition Section Heading</label>
            <input type="text" value={recognitionHeading} onChange={(e) => setRecognitionHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Awards and Special Recognition" />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1 text-sm">Description/Summary</label>
            <textarea rows="2" value={recognitionDescription} onChange={(e) => setRecognitionDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Briefly describe the significance of these recognitions." />
          </div>

          <div className="mt-4 mb-6 p-4 border border-teal-200 rounded-lg bg-white">
            <h4 className="font-semibold text-md mb-2 text-teal-800">Recognition Points (Bullet List)</h4>
            {recognitionPoints.map((point, index) => (
              <div key={`rp-${index}`} className="flex gap-2 mb-2 items-center">
                <input type="text" value={point} onChange={(e) => handleRecognitionPointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Recognition Detail ${index + 1}`} />
                {recognitionPoints.length > 1 && (<button type="button" onClick={() => removeRecognitionPoint(index)} className="text-red-600 hover:text-red-800 text-sm font-medium transition flex-shrink-0">Remove</button>)}
              </div>
            ))}
            <button type="button" onClick={addRecognitionPoint} className="bg-[#008080] text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition mt-2 shadow-md">+ Add Recognition Point</button>
          </div>

          <div>
            <label className="block font-medium mb-1">Main Certificate Image</label>
            <input type="file" accept="image/*" onChange={(e) => { setCertificateImage(e.target.files[0]); setCertificateImage_old(null); }} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-[#008080] hover:file:bg-teal-200 cursor-pointer" />
            {certificateImage_old && !certificateImage && (
              <p className="text-sm text-gray-500 mt-1">Current Certificate: <span className="font-semibold text-teal-700">Present</span> (Upload new to replace)</p>
            )}
          </div>
        </div>

        {/* Admission */}
        <div className="p-6 border border-orange-400 rounded-xl bg-orange-50 shadow-sm">
          <h3 className="font-bold text-xl mb-4 text-[#FF4500]">5. University Admission Process</h3>

          <div className="mb-4">
            <label className="block font-medium mb-1 text-sm">Admission Section Heading</label>
            <input type="text" value={admissionHeading} onChange={(e) => setAdmissionHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. How to Apply: Step-by-Step" />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1 text-sm">Sub-Heading</label>
            <input type="text" value={admissionSubHeading} onChange={(e) => setAdmissionSubHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Eligibility and Required Documents" />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1 text-sm">Description/Overview</label>
            <textarea rows="2" value={admissionDescription} onChange={(e) => setAdmissionDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="A general overview of the application and selection process." />
          </div>

          <div className="mt-4 p-4 border border-orange-200 rounded-lg bg-white">
            <h4 className="font-semibold text-md mb-2 text-orange-800">Admission Steps/Points</h4>
            {admissionPoints.map((point, index) => (
              <div key={`ap-${index}`} className="flex gap-2 mb-2 items-center">
                <input type="text" value={point} onChange={(e) => handleAdmissionPointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Step/Point ${index + 1}`} />
                {admissionPoints.length > 1 && (
                  <button type="button" onClick={() => removeAdmissionPoint(index)} className="text-red-600 hover:text-red-800 text-sm font-medium transition flex-shrink-0">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addAdmissionPoint} className="bg-[#FF4500] text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition mt-2 shadow-md">+ Add Admission Step/Point</button>
          </div>
        </div>

        {/* Courses */}
        <div className="p-6 border border-purple-300 rounded-xl bg-purple-50 shadow-sm">
          <h3 className="font-bold text-xl mb-4 text-[#6A0DAD]">Course Management</h3>

          <div className="p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-sm">
            <h3 className="font-bold text-xl mb-4 text-[#0056B3]">Final University Courses List</h3>
            {courses.map((course, index) => (
              <div key={`c-${index}`} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-end mb-8 p-6 border rounded-lg border-gray-200 bg-white shadow-sm">
                <div>
                  <label className="block text-sm font-medium mb-1">Course Name</label>
                  <input type="text" value={course.name} onChange={(e) => handleCourseChange(index, "name", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. B.Tech Computer Science" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <input type="text" value={course.duration} onChange={(e) => handleCourseChange(index, "duration", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. 4 Years" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course Fees</label>
                  <input type="text" value={course.fees} onChange={(e) => handleCourseChange(index, "fees", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. ₹ 50,000 / Year" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Course Details (Extra Info)</label>
                  <input type="text" value={course.details} onChange={(e) => handleCourseChange(index, "details", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. Includes lab fees and industrial visit" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course Logo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleCourseChange(index, "logo", e.target.files[0])} className="w-full text-gray-700 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer" />
                  {course.logo_old && !course.logo && (
                    <p className="text-xs text-gray-500 mt-1">Current Logo: <a href={course.logo_old} target="_blank" className="text-purple-700 hover:underline">View</a></p>
                  )}
                </div>
                <div className="lg:col-span-3 mt-2">
                  {courses.length > 1 && (
                    <button type="button" onClick={() => removeCourse(index)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm transition shadow-md">Remove This Course</button>
                  )}
                </div>
              </div>
            ))}

            <button type="button" onClick={addCourse} className="bg-[#6A0DAD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition mt-4 shadow-md">+ Add Another Course</button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-8 border-t border-gray-200">
          {message && (
            <p className={`text-center font-semibold mb-4 text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-lg font-bold text-white transition shadow-lg ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#A00000] hover:bg-red-700"}`}>
            {loading ? "Updating..." : "💾 Update University Data"}
          </button>
        </div>
      </form>
    </div>
  );
};