"use client";

import { useState } from "react";
import api from "@/utlis/api.js";
import CourseApiSelector from "@/app/admin/adduniversitydata/CourseApiSelector.jsx";

export default function AddUniversityPage() {
    // --- State Variables (UI same as before) ---
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [universityImage, setUniversityImage] = useState(null);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [shareDescription, setShareDescription] = useState("");
    const [cardDescription, setCardDescription] = useState("");
    const [heading, setHeading] = useState(""); 
    const [points, setPoints] = useState([""]); 
    const [factsHeading, setFactsHeading] = useState(""); 
    const [factsSubHeading, setFactsSubHeading] = useState(""); 
    const [factsPoints, setFactsPoints] = useState([""]); 
    const [approvals, setApprovals] = useState([{ name: "", logo: null }]);
    const [recognitionHeading, setRecognitionHeading] = useState("");
    const [recognitionDescription, setRecognitionDescription] = useState("");
    const [recognitionPoints, setRecognitionPoints] = useState([""]);
    const [certificateImage, setCertificateImage] = useState(null);
    const [admissionHeading, setAdmissionHeading] = useState("");
    const [admissionSubHeading, setAdmissionSubHeading] = useState("");
    const [admissionDescription, setAdmissionDescription] = useState("");
    const [admissionPoints, setAdmissionPoints] = useState([""]);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [backgroundDescription, setBackgroundDescription] = useState("");

    // Course State
    const [courses, setCourses] = useState([]); 
    const [courseApiData, setCourseApiData] = useState([]); 
    const [selectedCoursesFromApi, setSelectedCoursesFromApi] = useState({}); 

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // --- Dynamic List Management ---
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
    
    // YAHAN BADLAV: Manual entry mein courseSlug add kiya
    const addCourse = () => setCourses([...courses, { courseId: null, courseSlug: "", name: "", logo: null, duration: "", fees: "", details: "" }]);
    const removeCourse = (index) => setCourses(courses.filter((_, i) => i !== index));
    const handleCourseChange = (index, field, value) => {
        const updated = [...courses];
        updated[index][field] = value;
        setCourses(updated);
    };

    // --- SUBMIT HANDLER ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const formData = new FormData();
            
            const filterEmptyObjects = (arr) => arr.filter(item => {
                if (typeof item === 'string') return item.trim() !== "";
                if (typeof item === 'object' && item !== null) {
                    return Object.values(item).some(val => val !== null && val !== "" && (typeof val === 'string' ? val.trim() !== "" : true));
                }
                return false;
            });

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
            formData.append("backgroundDescription", backgroundDescription);
            
            formData.append("points", JSON.stringify(filterEmptyObjects(points))); 
            formData.append("factsPoints", JSON.stringify(filterEmptyObjects(factsPoints)));
            formData.append("recognitionPoints", JSON.stringify(filterEmptyObjects(recognitionPoints)));
            formData.append("admissionPoints", JSON.stringify(filterEmptyObjects(admissionPoints)));

            if (universityImage) formData.append("universityImage", universityImage);
            if (certificateImage) formData.append("certificateImage", certificateImage);
            if (backgroundImage) formData.append("backgroundImage", backgroundImage);

            const approvalsDataForBody = approvals.map(a => ({ name: a.name }));
            formData.append("approvals", JSON.stringify(filterEmptyObjects(approvalsDataForBody)));
            approvals.forEach((approval, index) => {
                if (approval.logo instanceof File) {
                    formData.append(`approvals[${index}][logo]`, approval.logo);
                }
            });

            formData.append("courses", JSON.stringify(courses));

            courses.forEach((course, index) => {
                if (course.logo instanceof File) {
                    formData.append(`courses[${index}][logo]`, course.logo);
                }
            });
            
            await api.post("/api/v1/university", formData);
            setMessage("✅ University added successfully!");
        } catch (error) {
            console.error("Submission Error:", error);
            setMessage("❌ Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl mt-10">
            <h2 className="text-3xl font-extrabold text-[#0056B3] mb-8 pb-4 border-b border-gray-200">🏫 Add University Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* 1. About Us */}
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

                {/* key and highlight */}
                <div className="p-4 border border-yellow-300 rounded-xl bg-yellow-50 shadow-sm">
                    <h4 className="font-bold text-lg mb-3 text-[#CC6600]">Key And Highlight</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <textarea rows="2" value={shareDescription} onChange={(e) => setShareDescription(e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="Share Description" />
                        <textarea rows="2" value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="Card Description" />
                    </div>
                </div>
                
                {/* Background */}
                <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 max-w-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Background Section</h3>
                    <textarea placeholder="Background Description" value={backgroundDescription} onChange={(e) => setBackgroundDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md mb-4 min-h-[100px]" />
                    <input type="file" accept="image/*" onChange={(e) => setBackgroundImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:bg-blue-50 file:text-blue-700" />
                </div>

                {/* 2. University Facts */}
                <div className="p-6 border border-green-300 rounded-xl bg-green-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#006400]">Career outcome and Placement</h3>
                    <div className="mb-6 p-4 border border-green-200 rounded-lg bg-white">
                         <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300 mb-4" placeholder="Main Section Heading" />
                         {points.map((point, index) => (
                             <div key={`p-${index}`} className="flex gap-2 mb-2 items-center">
                                 <input type="text" value={point} onChange={(e) => handlePointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Point ${index + 1}`} />
                                 {points.length > 1 && (<button type="button" onClick={() => removePoint(index)} className="text-red-600 text-sm">Remove</button>)}
                             </div>
                         ))}
                         <button type="button" onClick={addPoint} className="bg-[#006400] text-white px-4 py-2 rounded-lg text-sm mt-2">+ Add Highlight Point</button>
                    </div>

                    <div className="p-4 border border-green-200 rounded-lg bg-white">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input type="text" value={factsHeading} onChange={(e) => setFactsHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Facts Heading" />
                            <input type="text" value={factsSubHeading} onChange={(e) => setFactsSubHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Sub-Heading" />
                        </div>
                        {factsPoints.map((point, index) => (
                            <div key={`fp-${index}`} className="flex gap-2 mb-2 items-center">
                                <input type="text" value={point} onChange={(e) => handleFactsPointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" />
                                {factsPoints.length > 1 && (<button type="button" onClick={() => removeFactsPoint(index)} className="text-red-600 text-sm">Remove</button>)}
                            </div>
                        ))}
                        <button type="button" onClick={addFactsPoint} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm mt-2">+ Add Fact Point</button>
                    </div>
                </div>

                {/* 3. Approvals */}
                <div className="p-6 border border-red-300 rounded-xl bg-red-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#A00000]">3. University Approvals</h3>
                    {approvals.map((approval, index) => (
                        <div key={`a-${index}`} className="grid md:grid-cols-3 gap-4 items-end mb-4 p-4 border rounded-lg border-red-200 bg-white shadow-sm">
                            <input type="text" value={approval.name} onChange={(e) => handleApprovalChange(index, "name", e.target.value)} className="w-full border rounded-lg p-2" placeholder="Approval Name" />
                            <input type="file" onChange={(e) => handleApprovalChange(index, "logo", e.target.files[0])} className="w-full text-xs" />
                            {approvals.length > 1 && (<button type="button" onClick={() => removeApproval(index)} className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs">Remove</button>)}
                        </div>
                    ))}
                    <button type="button" onClick={addApproval} className="bg-[#A00000] text-white px-4 py-2 rounded-lg text-sm mt-4">+ Add Another Approval</button>
                </div>

                {/* 4. Recognition */}
                <div className="p-6 border border-teal-400 rounded-xl bg-teal-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#008080]">4. University Recognition</h3>
                    <input type="text" value={recognitionHeading} onChange={(e) => setRecognitionHeading(e.target.value)} className="w-full border rounded-lg p-3 mb-4" placeholder="Recognition Heading" />
                    <textarea rows="2" value={recognitionDescription} onChange={(e) => setRecognitionDescription(e.target.value)} className="w-full border rounded-lg p-3 mb-4 text-sm" placeholder="Description" />
                    {recognitionPoints.map((point, index) => (
                        <div key={`rp-${index}`} className="flex gap-2 mb-2 items-center">
                            <input type="text" value={point} onChange={(e) => handleRecognitionPointChange(index, e.target.value)} className="w-full border rounded-lg p-2" />
                            {recognitionPoints.length > 1 && (<button type="button" onClick={() => removeRecognitionPoint(index)} className="text-red-600 text-sm">Remove</button>)}
                        </div>
                    ))}
                    <button type="button" onClick={addRecognitionPoint} className="bg-[#008080] text-white px-4 py-2 rounded-lg text-sm mt-2">+ Add Recognition Point</button>
                    <input type="file" onChange={(e) => setCertificateImage(e.target.files[0])} className="mt-4 block w-full text-sm" />
                </div>

                {/* 5. Admission Process */}
                <div className="p-6 border border-orange-400 rounded-xl bg-orange-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#FF4500]">5. University Admission Process</h3>
                    <input type="text" value={admissionHeading} onChange={(e) => setAdmissionHeading(e.target.value)} className="w-full border rounded-lg p-3 mb-2" placeholder="Admission Heading" />
                    <input type="text" value={admissionSubHeading} onChange={(e) => setAdmissionSubHeading(e.target.value)} className="w-full border rounded-lg p-3 mb-2" placeholder="Sub-Heading" />
                    <textarea rows="2" value={admissionDescription} onChange={(e) => setAdmissionDescription(e.target.value)} className="w-full border rounded-lg p-3 mb-4 text-sm" placeholder="Description" />
                    {admissionPoints.map((point, index) => (
                        <div key={`ap-${index}`} className="flex gap-2 mb-2 items-center">
                            <input type="text" value={point} onChange={(e) => handleAdmissionPointChange(index, e.target.value)} className="w-full border rounded-lg p-2" placeholder={`Step ${index+1}`} />
                            {admissionPoints.length > 1 && (<button type="button" onClick={() => removeAdmissionPoint(index)} className="text-red-600 text-sm">Remove</button>)}
                        </div>
                    ))}
                    <button type="button" onClick={addAdmissionPoint} className="bg-[#FF4500] text-white px-4 py-2 rounded-lg text-sm mt-2">+ Add Step</button>
                </div>

                {/* Course Management */}
                <div className="p-6 border border-purple-300 rounded-xl bg-purple-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#6A0DAD]">Course Management</h3>
                    <CourseApiSelector
                        courseApiData={courseApiData}
                        setCourseApiData={setCourseApiData}
                        selectedCoursesFromApi={selectedCoursesFromApi}
                        setSelectedCoursesFromApi={setSelectedCoursesFromApi}
                        courses={courses}
                        setCourses={setCourses}
                        loading={loading}
                        setLoading={setLoading}
                        setMessage={setMessage}
                    />

                    {/* Review Section */}
                    <div className="p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-sm mt-6">
                        <h3 className="font-bold text-xl mb-4 text-[#0056B3]">Final University Courses List</h3>
                        {courses.map((course, index) => (
                            <div key={`c-${index}`} className="grid md:grid-cols-5 gap-4 items-end mb-6 p-4 border rounded-lg border-gray-200 bg-white shadow-sm">
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold mb-1">Name</label>
                                    <input type="text" value={course.name} onChange={(e) => handleCourseChange(index, "name", e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                                </div>
                                {/* NAYA FIELD: Slug input manual entries ke liye */}
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold mb-1 text-blue-600">Course Slug</label>
                                    <input type="text" value={course.courseSlug} onChange={(e) => handleCourseChange(index, "courseSlug", e.target.value)} className="w-full border rounded-lg p-2 text-sm border-blue-200" placeholder="mba-online" />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold mb-1">Duration</label>
                                    <input type="text" value={course.duration} onChange={(e) => handleCourseChange(index, "duration", e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold mb-1">Override Logo</label>
                                    <input type="file" onChange={(e) => handleCourseChange(index, "logo", e.target.files[0])} className="w-full text-[10px]" />
                                </div>
                                <div className="md:col-span-1">
                                    {courses.length > 0 && (<button type="button" onClick={() => removeCourse(index)} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg text-xs">Remove</button>)}
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addCourse} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 mt-4">+ Add Another Course Manually</button>
                    </div>
                </div>

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