"use client";

import { useState } from "react";
import api from "@/utlis/api.js";
import Link from "next/link";
export default function AddUniversityPage() {
    // --- State Variables ---
    
    // General State (Section 1)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [universityImage, setUniversityImage] = useState(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    
    // SEO & Card Details
    const [shareDescription, setShareDescription] = useState("");
    const [cardDescription, setCardDescription] = useState("");
    
    // Section 2: University Facts
    const [heading, setHeading] = useState(""); // Highlights Heading
    const [points, setPoints] = useState([""]); // Highlights Points
    const [factsHeading, setFactsHeading] = useState(""); // Facts & Statistics Heading
    const [factsSubHeading, setFactsSubHeading] = useState(""); 
    const [factsPoints, setFactsPoints] = useState([""]); 
    
    // Section 3: Approvals
    const [approvals, setApprovals] = useState([{ name: "", logo: null }]);

    // Section 4: Recognition & Certificates
    const [recognitionHeading, setRecognitionHeading] = useState("");
    const [recognitionDescription, setRecognitionDescription] = useState("");
    const [recognitionPoints, setRecognitionPoints] = useState([""]);
    const [certificateImage, setCertificateImage] = useState(null);

    // Section 5: Admission Process
    const [admissionHeading, setAdmissionHeading] = useState("");
    const [admissionSubHeading, setAdmissionSubHeading] = useState("");
    const [admissionDescription, setAdmissionDescription] = useState("");
    const [admissionPoints, setAdmissionPoints] = useState([""]);


    // Background Section (ADD ONLY)
const [backgroundImage, setBackgroundImage] = useState(null);
const [backgroundDescription, setBackgroundDescription] = useState("");

    // Course State
    const [courses, setCourses] = useState([{ name: "", logo: null, duration: "" }]);
    const [courseApiData, setCourseApiData] = useState([]); 
    const [selectedCoursesFromApi, setSelectedCoursesFromApi] = useState({}); 

    // Status State
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});

    // --- Dynamic List Management Functions (Admission Process) ---
    const addAdmissionPoint = () => setAdmissionPoints([...admissionPoints, ""]);
    const removeAdmissionPoint = (index) => setAdmissionPoints(admissionPoints.filter((_, i) => i !== index));
    const handleAdmissionPointChange = (index, value) => {
        const updated = [...admissionPoints];
        updated[index] = value;
        setAdmissionPoints(updated);
    };

    // --- Other Dynamic List Management Functions (Partial, for context) ---
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
    const removeRecognitionPoint = (index) => setRecognitionPoints(recognitionPoints.filter((_, i) => i !== index));
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
    const addApproval = () => setApprovals([...approvals, { name: "", logo: null }]);
    const removeApproval = (index) => setApprovals(approvals.filter((_, i) => i !== index));
    const addCourse = () => setCourses([...courses, { name: "", logo: null, duration: "" }]);
    const removeCourse = (index) => setCourses(courses.filter((_, i) => i !== index));
    const handleCourseChange = (index, field, value) => {
        const updated = [...courses];
        updated[index][field] = value;
        setCourses(updated);
    };
    
    // --- Course API Fetching & Selection (Existing) ---
    const fetchCoursesFromApi = async () => {
        setLoading(true);
        setMessage("");
        try {
            const response = await api.get("/api/v1/course"); 
            const fetchedData = Array.isArray(response.data) ? response.data : (response.data.courses || []);
            setCourseApiData(fetchedData); 
            setSelectedCoursesFromApi({}); 
            setMessage(`✅ ${fetchedData.length} courses fetched successfully.`);
        } catch (error) {
            setMessage("❌ Error fetching courses from API: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };
    
    const handleCourseSelection = (course, index, isChecked) => {
        setSelectedCoursesFromApi(prev => ({ ...prev, [index]: isChecked }));
        const newCourse = { name: course.name || "Fetched Course", logo: null, duration: course.duration || "" };
        if (isChecked) {
            if (!courses.some(c => c.name === newCourse.name)) {
                setCourses(prev => [...prev, newCourse]);
            }
        } else {
            setCourses(prev => prev.filter(c => c.name !== newCourse.name));
        }
    };

    // --- Submit Handler (FIXED) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setErrors({});

        setLoading(true);
        try {
            const formData = new FormData();
            
            // Utility function to filter out objects/points that are not completely empty
            const filterEmptyObjects = (arr) => arr.filter(item => {
                if (typeof item === 'string') return item.trim() !== "";
                if (typeof item === 'object' && item !== null) {
                    return Object.values(item).some(val => val !== null && val !== "" && (typeof val === 'string' ? val.trim() !== "" : true));
                }
                return false;
            });

            // 1. Single Value Fields
            formData.append("name", name);
            formData.append("description", description);
            formData.append("youtubeLink", youtubeLink);
            formData.append("shareDescription", shareDescription);
            formData.append("cardDescription", cardDescription);
            formData.append("heading", heading);
            formData.append("factsHeading", factsHeading);
            formData.append("factsSubHeading", factsSubHeading);
            formData.append("recognitionHeading", recognitionHeading);
            formData.append("recognitionDescription", recognitionDescription);
            formData.append("admissionHeading", admissionHeading);
            formData.append("admissionSubHeading", admissionSubHeading);
            formData.append("admissionDescription", admissionDescription);
            
            // 2. Simple Array Fields (Sent as JSON String)
            formData.append("points", JSON.stringify(filterEmptyObjects(points))); 
            formData.append("factsPoints", JSON.stringify(filterEmptyObjects(factsPoints)));
            formData.append("recognitionPoints", JSON.stringify(filterEmptyObjects(recognitionPoints)));
            formData.append("admissionPoints", JSON.stringify(filterEmptyObjects(admissionPoints)));

            // 3. File Fields (Single)
            if (universityImage) formData.append("universityImage", universityImage);
            if (certificateImage) formData.append("certificateImage", certificateImage);
// Background fields (ADD ONLY)
formData.append("backgroundDescription", backgroundDescription);
if (backgroundImage) {
    formData.append("backgroundImage", backgroundImage);
}

            // 4. COMPLEX ARRAY FIELDS (Approvals and Courses)
            
            // Prepare Approvals data for JSON string: Strip out the file object for the body data
            const approvalsDataForBody = approvals.map(a => ({ name: a.name, logo: a.logo ? true : null }));
            // Send the JSON string for approvals array
            formData.append("approvals", JSON.stringify(filterEmptyObjects(approvalsDataForBody)));

            // Append Approval Logos (Files) using the indexed format expected by Multer
            approvals.forEach((approval, index) => {
                if (approval.logo) {
                    // key must match the expected format in universityController: approvals[0][logo]
                    formData.append(`approvals[${index}][logo]`, approval.logo);
                }
            });

            // Prepare Courses data for JSON string: Strip out the file object for the body data
            const coursesDataForBody = courses.map(c => ({ 
                name: c.name, 
                duration: c.duration, 
                logo: c.logo ? true : null 
            }));
            // Send the JSON string for courses array
            formData.append("courses", JSON.stringify(filterEmptyObjects(coursesDataForBody)));

            // Append Course Logos (Files)
            courses.forEach((course, index) => {
                if (course.logo) {
                    // key must match the expected format in universityController: courses[0][logo]
                    formData.append(`courses[${index}][logo]`, course.logo);
                }
            });
            
            // --- API Call ---
            const response = await api.post("/api/v1/university", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("✅ University added successfully!");
            // Reset state (partial reset)
            setAdmissionHeading("");
            setAdmissionSubHeading("");
            setAdmissionDescription("");
            setAdmissionPoints([""]);
            // You might want to reset all states after a successful submission for a clean form
            
        } catch (error) {
            console.error("Submission Error:", error);
            setMessage("❌ Error: " + (error.response?.data?.error || error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };
    
    // --- Rest of the component (JSX) remains the same ---

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl mt-10">
            <h2 className="text-3xl font-extrabold text-[#0056B3] mb-8 pb-4 border-b border-gray-200">🏫 Add University Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* 1. About Us (Section 1) */}
                <div className="p-6 border border-blue-200 rounded-xl bg-blue-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#0056B3]">1. About Us</h3>
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
                            <input type="file" accept="image/*" onChange={(e) => setUniversityImage(e.target.files[0])} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-[#0056B3] hover:file:bg-blue-200 cursor-pointer" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-medium mb-1">Main Description (Detailed)</label>
                            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Detailed information about the university" />
                        </div>
                    </div>
                </div>

                {/* --- SEO & Card Details --- */}
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
                
                {/* ===== Background Section (ADD ONLY) ===== */}
<div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 max-w-md">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Background Section</h3>

    <textarea
        placeholder="Background Description"
        value={backgroundDescription}
        onChange={(e) => setBackgroundDescription(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 min-h-[100px]"
    />

    <input
        type="file"
        accept="image/*"
        onChange={(e) => setBackgroundImage(e.target.files[0])}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor:pointer"
    />
</div>
                {/* 2. University Facts (Section 2) */}
                <div className="p-6 border border-green-300 rounded-xl bg-green-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#006400]">2. University Facts (Highlights & Statistics)</h3>
                    

                    {/* Highlights Section */}
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

                    {/* Facts Section */}
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

                {/* 3. University Approvals (Section 3) */}
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
                            </div>
                            <div className="md:col-span-1">
                                {approvals.length > 1 && (<button type="button" onClick={() => removeApproval(index)} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm transition shadow-md">Remove Approval</button>)}
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addApproval} className="bg-[#A00000] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition mt-4 shadow-md">+ Add Another Approval</button>
                </div>

                {/* 4. University Recognition & Certificates (Section 4) */}
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
                        <input type="file" accept="image/*" onChange={(e) => setCertificateImage(e.target.files[0])} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-[#008080] hover:file:bg-teal-200 cursor-pointer" />
                    </div>
                </div>

                {/* 5. University Admission Process (Section 5) */}
                <div className="p-6 border border-orange-400 rounded-xl bg-orange-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#FF4500]">5. University Admission Process</h3>
                    
                    {/* Admission Heading */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1 text-sm">Admission Section Heading</label>
                        <input
                            type="text"
                            value={admissionHeading}
                            onChange={(e) => setAdmissionHeading(e.target.value)}
                            className="w-full border rounded-lg p-3 border-gray-300"
                            placeholder="e.g. How to Apply: Step-by-Step"
                        />
                    </div>
                    
                    {/* Admission Sub-Heading */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1 text-sm">Sub-Heading</label>
                        <input
                            type="text"
                            value={admissionSubHeading}
                            onChange={(e) => setAdmissionSubHeading(e.target.value)}
                            className="w-full border rounded-lg p-3 border-gray-300"
                            placeholder="e.g. Eligibility and Required Documents"
                        />
                    </div>

                    {/* Admission Description */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1 text-sm">Description/Overview</label>
                        <textarea
                            rows="2"
                            value={admissionDescription}
                            onChange={(e) => setAdmissionDescription(e.target.value)}
                            className="w-full border rounded-lg p-3 border-gray-300"
                            placeholder="A general overview of the application and selection process."
                        />
                    </div>

                    {/* Admission Points List */}
                    <div className="mt-4 p-4 border border-orange-200 rounded-lg bg-white">
                        <h4 className="font-semibold text-md mb-2 text-orange-800">Admission Steps/Points</h4>
                        {admissionPoints.map((point, index) => (
                            <div key={`ap-${index}`} className="flex gap-2 mb-2 items-center">
                                <input
                                    type="text"
                                    value={point}
                                    onChange={(e) => handleAdmissionPointChange(index, e.target.value)}
                                    className="w-full border rounded-lg p-2 border-gray-300"
                                    placeholder={`Step/Point ${index + 1}`}
                                />
                                {admissionPoints.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeAdmissionPoint(index)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium transition flex-shrink-0"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addAdmissionPoint}
                            className="bg-[#FF4500] text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition mt-2 shadow-md"
                        >
                            + Add Admission Step/Point
                        </button>
                    </div>
                </div>

                {/* --- Course Management Block (Unnumbered, before submit) --- */}
                <div className="p-6 border border-purple-300 rounded-xl bg-purple-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#6A0DAD]">Course Management</h3>
                    
                    {/* Fetch Courses from API */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-lg mb-3 text-purple-800">Fetch Courses from API</h4>
                        <button type="button" onClick={fetchCoursesFromApi} disabled={loading} className="bg-[#6A0DAD] text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition h-fit shadow-md">
                            {loading ? "Fetching..." : "Fetch Courses (GET /api/v1/course)"}
                        </button>
                        
                        {/* Display fetched courses for selection */}
                        {courseApiData.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-purple-200">
                                <h4 className="font-semibold mb-3 text-lg text-purple-800">Select Courses to Add:</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-3 bg-white rounded-lg border border-purple-100">
                                    {courseApiData.map((course, index) => (
                                        <label key={`api-${index}`} className="flex items-center space-x-2 border p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition duration-100">
                                            <input type="checkbox" checked={!!selectedCoursesFromApi[index]} onChange={(e) => handleCourseSelection(course, index, e.target.checked)} className="form-checkbox text-[#6A0DAD] h-5 w-5 rounded" />
                                            <div className="text-sm font-medium leading-tight"><p className="font-bold">{course.name || `Course ${index + 1}`}</p><p className="text-xs text-gray-500">{course.duration || 'N/A'}</p></div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* University Courses (Final List) Section */}
                    <div className="p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-sm">
                        <h3 className="font-bold text-xl mb-4 text-[#0056B3]">Final University Courses List</h3>
                        {courses.map((course, index) => (
                            <div key={`c-${index}`} className="grid md:grid-cols-4 gap-4 items-end mb-6 p-4 border rounded-lg border-gray-200 bg-white shadow-sm">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium mb-1">Course Name *</label>
                                    <input type="text" value={course.name} onChange={(e) => handleCourseChange(index, "name", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. B.Tech" />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium mb-1">Duration</label>
                                    <input type="text" value={course.duration} onChange={(e) => handleCourseChange(index, "duration", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. 4 Years" />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium mb-1">Course Logo</label>
                                    <input type="file" accept="image/*" onChange={(e) => handleCourseChange(index, "logo", e.target.files[0])} className="w-full text-gray-700 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer" />
                                </div>
                                <div className="md:col-span-1">
                                    {courses.length > 1 && (<button type="button" onClick={() => removeCourse(index)} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm transition shadow-md">Remove Course</button>)}
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addCourse} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition mt-4 shadow-md">+ Add Another Course Manually</button>
                    </div>
                </div>

                {/* --- Submit Button and Message --- */}
                <button type="submit" disabled={loading} className="bg-[#0056B3] text-white w-full py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-150 disabled:bg-gray-400 shadow-xl">
                    {loading ? "Submitting Data..." : "Add University"}
                </button>

                {message && (
                    <p className={`text-center mt-4 text-md font-medium ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}