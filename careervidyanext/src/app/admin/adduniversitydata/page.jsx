// "use client";

// import { useState } from "react";
// import api from "@/utlis/api.js";
// import CourseApiSelector from "@/app/admin/adduniversitydata/CourseApiSelector.jsx";

// export default function AddUniversityPage() {
//     // --- State Variables (UI same as before) ---
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [universityImage, setUniversityImage] = useState(null);
//     const [youtubeLink, setYoutubeLink] = useState("");
//     const [shareDescription, setShareDescription] = useState("");
//     const [cardDescription, setCardDescription] = useState("");
//     const [heading, setHeading] = useState(""); 
//     const [points, setPoints] = useState([""]); 
//     const [factsHeading, setFactsHeading] = useState(""); 
//     const [factsSubHeading, setFactsSubHeading] = useState(""); 
//     const [factsPoints, setFactsPoints] = useState([""]); 
//     const [approvals, setApprovals] = useState([{ name: "", logo: null }]);
//     const [recognitionHeading, setRecognitionHeading] = useState("");
//     const [recognitionDescription, setRecognitionDescription] = useState("");
//     const [recognitionPoints, setRecognitionPoints] = useState([""]);
//     const [certificateImage, setCertificateImage] = useState(null);
//     const [admissionHeading, setAdmissionHeading] = useState("");
//     const [admissionSubHeading, setAdmissionSubHeading] = useState("");
//     const [admissionDescription, setAdmissionDescription] = useState("");
//     const [admissionPoints, setAdmissionPoints] = useState([""]);
//     const [backgroundImage, setBackgroundImage] = useState(null);
//     const [backgroundDescription, setBackgroundDescription] = useState("");

//     // Course State
//     const [courses, setCourses] = useState([]); 
//     const [courseApiData, setCourseApiData] = useState([]); 
//     const [selectedCoursesFromApi, setSelectedCoursesFromApi] = useState({}); 

//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");

//     // --- Dynamic List Management ---
//     const addAdmissionPoint = () => setAdmissionPoints([...admissionPoints, ""]);
//     const removeAdmissionPoint = (index) => setAdmissionPoints(admissionPoints.filter((_, i) => i !== index));
//     const handleAdmissionPointChange = (index, value) => {
//         const updated = [...admissionPoints];
//         updated[index] = value;
//         setAdmissionPoints(updated);
//     };
//     const addPoint = () => setPoints([...points, ""]);
//     const removePoint = (index) => setPoints(points.filter((_, i) => i !== index));
//     const handlePointChange = (index, value) => {
//         const updated = [...points];
//         updated[index] = value;
//         setPoints(updated);
//     };
//     const addFactsPoint = () => setFactsPoints([...factsPoints, ""]);
//     const removeFactsPoint = (index) => setFactsPoints(factsPoints.filter((_, i) => i !== index));
//     const handleFactsPointChange = (index, value) => {
//         const updated = [...factsPoints];
//         updated[index] = value;
//         setFactsPoints(updated);
//     };
//     const addRecognitionPoint = () => setRecognitionPoints([...recognitionPoints, ""]);
//     const removeRecognitionPoint = (index) => setRecognitionPoints(recognitionPoints.filter((_, i) => i !== index));
//     const handleRecognitionPointChange = (index, value) => {
//         const updated = [...recognitionPoints];
//         updated[index] = value;
//         setRecognitionPoints(updated);
//     };
//     const handleApprovalChange = (index, field, value) => {
//         const updated = [...approvals];
//         updated[index][field] = value;
//         setApprovals(updated);
//     };
//     const addApproval = () => setApprovals([...approvals, { name: "", logo: null }]);
//     const removeApproval = (index) => setApprovals(approvals.filter((_, i) => i !== index));
    
//     // YAHAN BADLAV: Manual entry mein courseSlug add kiya
//     const addCourse = () => setCourses([...courses, { courseId: null, courseSlug: "", name: "", logo: null, duration: "", fees: "", details: "" }]);
//     const removeCourse = (index) => setCourses(courses.filter((_, i) => i !== index));
//     const handleCourseChange = (index, field, value) => {
//         const updated = [...courses];
//         updated[index][field] = value;
//         setCourses(updated);
//     };

//     // --- SUBMIT HANDLER ---
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage("");
//         setLoading(true);

//         try {
//             const formData = new FormData();
            
//             const filterEmptyObjects = (arr) => arr.filter(item => {
//                 if (typeof item === 'string') return item.trim() !== "";
//                 if (typeof item === 'object' && item !== null) {
//                     return Object.values(item).some(val => val !== null && val !== "" && (typeof val === 'string' ? val.trim() !== "" : true));
//                 }
//                 return false;
//             });

//             formData.append("name", name);
//             formData.append("description", description);
//             formData.append("youtubeLink", youtubeLink);
//             formData.append("shareDescription", shareDescription);
//             formData.append("cardDescription", cardDescription);
//             formData.append("heading", heading);
//             formData.append("factsHeading", factsHeading);
//             formData.append("factsSubHeading", factsSubHeading);
//             formData.append("recognitionHeading", recognitionHeading);
//             formData.append("recognitionDescription", recognitionDescription);
//             formData.append("admissionHeading", admissionHeading);
//             formData.append("admissionSubHeading", admissionSubHeading);
//             formData.append("admissionDescription", admissionDescription);
//             formData.append("backgroundDescription", backgroundDescription);
            
//             formData.append("points", JSON.stringify(filterEmptyObjects(points))); 
//             formData.append("factsPoints", JSON.stringify(filterEmptyObjects(factsPoints)));
//             formData.append("recognitionPoints", JSON.stringify(filterEmptyObjects(recognitionPoints)));
//             formData.append("admissionPoints", JSON.stringify(filterEmptyObjects(admissionPoints)));

//             if (universityImage) formData.append("universityImage", universityImage);
//             if (certificateImage) formData.append("certificateImage", certificateImage);
//             if (backgroundImage) formData.append("backgroundImage", backgroundImage);

//             const approvalsDataForBody = approvals.map(a => ({ name: a.name }));
//             formData.append("approvals", JSON.stringify(filterEmptyObjects(approvalsDataForBody)));
//             approvals.forEach((approval, index) => {
//                 if (approval.logo instanceof File) {
//                     formData.append(`approvals[${index}][logo]`, approval.logo);
//                 }
//             });

//             formData.append("courses", JSON.stringify(courses));

//             courses.forEach((course, index) => {
//                 if (course.logo instanceof File) {
//                     formData.append(`courses[${index}][logo]`, course.logo);
//                 }
//             });
            
//             await api.post("/api/v1/university", formData);
//             setMessage("✅ University added successfully!");
//         } catch (error) {
//             console.error("Submission Error:", error);
//             setMessage("❌ Error: " + (error.response?.data?.message || error.message));
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl mt-10">
//             <h2 className="text-3xl font-extrabold text-[#0056B3] mb-8 pb-4 border-b border-gray-200">🏫 Add University Details</h2>
            
//             <form onSubmit={handleSubmit} className="space-y-10">
                
//                 {/* 1. About Us */}
//                 <div className="p-6 border border-blue-200 rounded-xl bg-blue-50 shadow-sm">
//                     <h3 className="font-bold text-xl mb-4 text-[#0056B3]">1. About Us</h3>
//                     <div className="grid md:grid-cols-2 gap-6">
//                         <div>
//                             <label className="block font-medium mb-1">University Name *</label>
//                             <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Delhi University" />
//                         </div>
//                         <div>
//                             <label className="block font-medium mb-1">YouTube Video Link</label>
//                             <input type="url" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. https://www.youtube.com/watch?v=..." />
//                         </div>
//                         <div className="md:col-span-2">
//                             <label className="block font-medium mb-1">University Image</label>
//                             <input type="file" accept="image/*" onChange={(e) => setUniversityImage(e.target.files[0])} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-[#0056B3] hover:file:bg-blue-200 cursor-pointer" />
//                         </div>
//                         <div className="md:col-span-2">
//                             <label className="block font-medium mb-1">Main Description (Detailed)</label>
//                             <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Detailed information about the university" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* key and highlight */}
//                 <div className="p-4 border border-yellow-300 rounded-xl bg-yellow-50 shadow-sm">
//                     <h4 className="font-bold text-lg mb-3 text-[#CC6600]">Key And Highlight</h4>
//                     <div className="grid md:grid-cols-2 gap-4">
//                         <textarea rows="2" value={shareDescription} onChange={(e) => setShareDescription(e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="Share Description" />
//                         <textarea rows="2" value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="Card Description" />
//                     </div>
//                 </div>
                
//                 {/* Background */}
//                 <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 max-w-md">
//                     <h3 className="text-lg font-semibold mb-4 text-gray-800">Background Section</h3>
//                     <textarea placeholder="Background Description" value={backgroundDescription} onChange={(e) => setBackgroundDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md mb-4 min-h-[100px]" />
//                     <input type="file" accept="image/*" onChange={(e) => setBackgroundImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:bg-blue-50 file:text-blue-700" />
//                 </div>

//                 {/* 2. University Facts */}
//                 <div className="p-6 border border-green-300 rounded-xl bg-green-50 shadow-sm">
//                     <h3 className="font-bold text-xl mb-4 text-[#006400]">Career outcome and Placement</h3>
//                     <div className="mb-6 p-4 border border-green-200 rounded-lg bg-white">
//                          <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300 mb-4" placeholder="Main Section Heading" />
//                          {points.map((point, index) => (
//                              <div key={`p-${index}`} className="flex gap-2 mb-2 items-center">
//                                  <input type="text" value={point} onChange={(e) => handlePointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Point ${index + 1}`} />
//                                  {points.length > 1 && (<button type="button" onClick={() => removePoint(index)} className="text-red-600 text-sm">Remove</button>)}
//                              </div>
//                          ))}
//                          <button type="button" onClick={addPoint} className="bg-[#006400] text-white px-4 py-2 rounded-lg text-sm mt-2">+ Add Highlight Point</button>
//                     </div>

//                     <div className="p-4 border border-green-200 rounded-lg bg-white">
//                         <div className="grid md:grid-cols-2 gap-4 mb-4">
//                             <input type="text" value={factsHeading} onChange={(e) => setFactsHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Facts Heading" />
//                             <input type="text" value={factsSubHeading} onChange={(e) => setFactsSubHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Sub-Heading" />
//                         </div>
//                         {factsPoints.map((point, index) => (
//                             <div key={`fp-${index}`} className="flex gap-2 mb-2 items-center">
//                                 <input type="text" value={point} onChange={(e) => handleFactsPointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" />
//                                 {factsPoints.length > 1 && (<button type="button" onClick={() => removeFactsPoint(index)} className="text-red-600 text-sm">Remove</button>)}
//                             </div>
//                         ))}
//                         <button type="button" onClick={addFactsPoint} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm mt-2">+ Add Fact Point</button>
//                     </div>
//                 </div>

//                 {/* 3. Approvals */}
//                 <div className="p-6 border border-red-300 rounded-xl bg-red-50 shadow-sm">
//                     <h3 className="font-bold text-xl mb-4 text-[#A00000]">3. University Approvals</h3>
//                     {approvals.map((approval, index) => (
//                         <div key={`a-${index}`} className="grid md:grid-cols-3 gap-4 items-end mb-4 p-4 border rounded-lg border-red-200 bg-white shadow-sm">
//                             <input type="text" value={approval.name} onChange={(e) => handleApprovalChange(index, "name", e.target.value)} className="w-full border rounded-lg p-2" placeholder="Approval Name" />
//                             <input type="file" onChange={(e) => handleApprovalChange(index, "logo", e.target.files[0])} className="w-full text-xs" />
//                             {approvals.length > 1 && (<button type="button" onClick={() => removeApproval(index)} className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs">Remove</button>)}
//                         </div>
//                     ))}
//                     <button type="button" onClick={addApproval} className="bg-[#A00000] text-white px-4 py-2 rounded-lg text-sm mt-4">+ Add Another Approval</button>
//                 </div>

//                 {/* 4. Recognition */}
//                 <div className="p-6 border border-teal-400 rounded-xl bg-teal-50 shadow-sm">
//                     <h3 className="font-bold text-xl mb-4 text-[#008080]">4. University Recognition</h3>
//                     <input type="text" value={recognitionHeading} onChange={(e) => setRecognitionHeading(e.target.value)} className="w-full border rounded-lg p-3 mb-4" placeholder="Recognition Heading" />
//                     <textarea rows="2" value={recognitionDescription} onChange={(e) => setRecognitionDescription(e.target.value)} className="w-full border rounded-lg p-3 mb-4 text-sm" placeholder="Description" />
//                     {recognitionPoints.map((point, index) => (
//                         <div key={`rp-${index}`} className="flex gap-2 mb-2 items-center">
//                             <input type="text" value={point} onChange={(e) => handleRecognitionPointChange(index, e.target.value)} className="w-full border rounded-lg p-2" />
//                             {recognitionPoints.length > 1 && (<button type="button" onClick={() => removeRecognitionPoint(index)} className="text-red-600 text-sm">Remove</button>)}
//                         </div>
//                     ))}
//                     <button type="button" onClick={addRecognitionPoint} className="bg-[#008080] text-white px-4 py-2 rounded-lg text-sm mt-2">+ Add Recognition Point</button>
//                     <input type="file" onChange={(e) => setCertificateImage(e.target.files[0])} className="mt-4 block w-full text-sm" />
//                 </div>

//                 {/* 5. Admission Process */}
//                 <div className="p-6 border border-orange-400 rounded-xl bg-orange-50 shadow-sm">
//                     <h3 className="font-bold text-xl mb-4 text-[#FF4500]">5. University Admission Process</h3>
//                     <input type="text" value={admissionHeading} onChange={(e) => setAdmissionHeading(e.target.value)} className="w-full border rounded-lg p-3 mb-2" placeholder="Admission Heading" />
//                     <input type="text" value={admissionSubHeading} onChange={(e) => setAdmissionSubHeading(e.target.value)} className="w-full border rounded-lg p-3 mb-2" placeholder="Sub-Heading" />
//                     <textarea rows="2" value={admissionDescription} onChange={(e) => setAdmissionDescription(e.target.value)} className="w-full border rounded-lg p-3 mb-4 text-sm" placeholder="Description" />
//                     {admissionPoints.map((point, index) => (
//                         <div key={`ap-${index}`} className="flex gap-2 mb-2 items-center">
//                             <input type="text" value={point} onChange={(e) => handleAdmissionPointChange(index, e.target.value)} className="w-full border rounded-lg p-2" placeholder={`Step ${index+1}`} />
//                             {admissionPoints.length > 1 && (<button type="button" onClick={() => removeAdmissionPoint(index)} className="text-red-600 text-sm">Remove</button>)}
//                         </div>
//                     ))}
//                     <button type="button" onClick={addAdmissionPoint} className="bg-[#FF4500] text-white px-4 py-2 rounded-lg text-sm mt-2">+ Add Step</button>
//                 </div>

//                 {/* Course Management */}
//                 <div className="p-6 border border-purple-300 rounded-xl bg-purple-50 shadow-sm">
//                     <h3 className="font-bold text-xl mb-4 text-[#6A0DAD]">Course Management</h3>
//                     <CourseApiSelector
//                         courseApiData={courseApiData}
//                         setCourseApiData={setCourseApiData}
//                         selectedCoursesFromApi={selectedCoursesFromApi}
//                         setSelectedCoursesFromApi={setSelectedCoursesFromApi}
//                         courses={courses}
//                         setCourses={setCourses}
//                         loading={loading}
//                         setLoading={setLoading}
//                         setMessage={setMessage}
//                     />

//                     {/* Review Section */}
//                     <div className="p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-sm mt-6">
//                         <h3 className="font-bold text-xl mb-4 text-[#0056B3]">Final University Courses List</h3>
//                         {courses.map((course, index) => (
//                             <div key={`c-${index}`} className="grid md:grid-cols-5 gap-4 items-end mb-6 p-4 border rounded-lg border-gray-200 bg-white shadow-sm">
//                                 <div className="md:col-span-1">
//                                     <label className="block text-xs font-bold mb-1">Name</label>
//                                     <input type="text" value={course.name} onChange={(e) => handleCourseChange(index, "name", e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
//                                 </div>
//                                 {/* NAYA FIELD: Slug input manual entries ke liye */}
//                                 <div className="md:col-span-1">
//                                     <label className="block text-xs font-bold mb-1 text-blue-600">Course Slug</label>
//                                     <input type="text" value={course.courseSlug} onChange={(e) => handleCourseChange(index, "courseSlug", e.target.value)} className="w-full border rounded-lg p-2 text-sm border-blue-200" placeholder="mba-online" />
//                                 </div>
//                                 <div className="md:col-span-1">
//                                     <label className="block text-xs font-bold mb-1">Duration</label>
//                                     <input type="text" value={course.duration} onChange={(e) => handleCourseChange(index, "duration", e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
//                                 </div>
//                                 <div className="md:col-span-1">
//                                     <label className="block text-xs font-bold mb-1">Override Logo</label>
//                                     <input type="file" onChange={(e) => handleCourseChange(index, "logo", e.target.files[0])} className="w-full text-[10px]" />
//                                 </div>
//                                 <div className="md:col-span-1">
//                                     {courses.length > 0 && (<button type="button" onClick={() => removeCourse(index)} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg text-xs">Remove</button>)}
//                                 </div>
//                             </div>
//                         ))}
//                         <button type="button" onClick={addCourse} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 mt-4">+ Add Another Course Manually</button>
//                     </div>
//                 </div>

//                 <button type="submit" disabled={loading} className="bg-[#0056B3] text-white w-full py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-150 disabled:bg-gray-400 shadow-xl">
//                     {loading ? "Submitting Data..." : "Add University"}
//                 </button>

//                 {message && (
//                     <p className={`text-center mt-4 text-md font-medium ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
//                         {message}
//                     </p>
//                 )}
//             </form>
//         </div>
//     );
// }

"use client";

import { useState } from "react";
import api from "@/utlis/api.js";
import CourseApiSelector from "@/app/admin/adduniversitydata/CourseApiSelector.jsx";
import RichTextField from "@/app/admin/components/RichTextField.jsx";

const filterEmptyObjects = (arr) =>
    arr.filter((item) => {
        if (typeof item === "string") return item.trim() !== "";
        if (typeof item === "object" && item !== null) {
            return Object.values(item).some(
                (val) =>
                    val !== null &&
                    val !== "" &&
                    (typeof val === "string" ? val.trim() !== "" : true)
            );
        }
        return false;
    });

const initialApproval = { name: "", logo: null };
const initialFaq = { question: "", answer: "" };
const initialCourse = {
    courseId: null,
    courseSlug: "",
    name: "",
    logo: null,
    duration: "",
    fees: "",
    details: "",
};

export default function AddUniversityPage() {
    // --- State Variables ---
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
    const [approvals, setApprovals] = useState([{ ...initialApproval }]);
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
    const [faqs, setFaqs] = useState([{ ...initialFaq }]);

    const [courses, setCourses] = useState([]);
    const [courseApiData, setCourseApiData] = useState([]);
    const [selectedCoursesFromApi, setSelectedCoursesFromApi] = useState({});

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formKey, setFormKey] = useState(0);

    // --- Handlers ---
    const addAdmissionPoint = () => setAdmissionPoints((p) => [...p, ""]);
    const removeAdmissionPoint = (i) => setAdmissionPoints((p) => p.filter((_, x) => x !== i));
    const handleAdmissionPointChange = (i, v) =>
        setAdmissionPoints((p) => p.map((x, idx) => (idx === i ? v : x)));

    const addPoint = () => setPoints((p) => [...p, ""]);
    const removePoint = (i) => setPoints((p) => p.filter((_, x) => x !== i));
    const handlePointChange = (i, v) =>
        setPoints((p) => p.map((x, idx) => (idx === i ? v : x)));

    const addFactsPoint = () => setFactsPoints((p) => [...p, ""]);
    const removeFactsPoint = (i) => setFactsPoints((p) => p.filter((_, x) => x !== i));
    const handleFactsPointChange = (i, v) =>
        setFactsPoints((p) => p.map((x, idx) => (idx === i ? v : x)));

    const addRecognitionPoint = () => setRecognitionPoints((p) => [...p, ""]);
    const removeRecognitionPoint = (i) => setRecognitionPoints((p) => p.filter((_, x) => x !== i));
    const handleRecognitionPointChange = (i, v) =>
        setRecognitionPoints((p) => p.map((x, idx) => (idx === i ? v : x)));

    const handleApprovalChange = (i, f, v) =>
        setApprovals((p) => p.map((item, idx) => (idx === i ? { ...item, [f]: v } : item)));
    const addApproval = () => setApprovals((p) => [...p, { ...initialApproval }]);
    const removeApproval = (i) => setApprovals((p) => p.filter((_, x) => x !== i));

    const handleFaqChange = (i, f, v) =>
        setFaqs((p) => p.map((item, idx) => (idx === i ? { ...item, [f]: v } : item)));
    const addFaq = () => setFaqs((p) => [...p, { ...initialFaq }]);
    const removeFaq = (i) => setFaqs((p) => p.filter((_, x) => x !== i));

    const addCourse = () => setCourses((p) => [...p, { ...initialCourse }]);
    const removeCourse = (i) => setCourses((p) => p.filter((_, x) => x !== i));
    const handleCourseChange = (i, f, v) =>
        setCourses((p) => p.map((item, idx) => (idx === i ? { ...item, [f]: v } : item)));

    const resetForm = () => {
        setName(""); setDescription(""); setUniversityImage(null);
        setYoutubeLink(""); setShareDescription(""); setCardDescription("");
        setHeading(""); setPoints([""]);
        setFactsHeading(""); setFactsSubHeading(""); setFactsPoints([""]);
        setApprovals([{ ...initialApproval }]);
        setRecognitionHeading(""); setRecognitionDescription(""); setRecognitionPoints([""]);
        setCertificateImage(null);
        setAdmissionHeading(""); setAdmissionSubHeading(""); setAdmissionDescription(""); setAdmissionPoints([""]);
        setBackgroundImage(null); setBackgroundDescription("");
        setFaqs([{ ...initialFaq }]);
        setCourses([]); setCourseApiData([]); setSelectedCoursesFromApi({});
        setFormKey((k) => k + 1);
    };

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!name.trim()) {
            setMessage("❌ University name is required.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

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

            const cleanedFaqs = faqs.filter(
                (f) => f.question.trim() !== "" || f.answer.trim() !== ""
            );
            formData.append("faqs", JSON.stringify(cleanedFaqs));

            if (universityImage) formData.append("universityImage", universityImage);
            if (certificateImage) formData.append("certificateImage", certificateImage);
            if (backgroundImage) formData.append("backgroundImage", backgroundImage);

            const approvalsForBody = approvals.map((a) => ({
                name: a.name,
                hasLogo: a.logo instanceof File,
            }));
            formData.append("approvals", JSON.stringify(approvalsForBody));

            approvals.forEach((approval, index) => {
                if (approval.logo instanceof File) {
                    formData.append(`approvals[${index}][logo]`, approval.logo);
                }
            });

            const coursesForBody = courses.map(({ logo, ...rest }) => ({
                ...rest,
                hasLogo: logo instanceof File,
            }));
            formData.append("courses", JSON.stringify(coursesForBody));

            courses.forEach((course, index) => {
                if (course.logo instanceof File) {
                    formData.append(`courses[${index}][logo]`, course.logo);
                }
            });

            await api.post("/api/v1/university", formData);

            setMessage("✅ University added successfully!");
            resetForm();
        } catch (error) {
            console.error("Submission Error:", error);
            setMessage("❌ Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Shared classnames
    const labelCls = "block text-xs font-semibold mb-1 text-gray-700";
    const inputCls = "w-full border rounded-lg p-2 border-gray-300 text-sm focus:ring-2 focus:ring-blue-300 focus:outline-none";

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold text-[#0056B3] mb-6 pb-3 border-b-2 border-blue-200">
                🏫 Add University Details
            </h2>

            <form key={formKey} onSubmit={handleSubmit} className="space-y-6">

                {/* =========================
                    ROW 1: ABOUT + HIGHLIGHT
                ========================== */}
                <div className="grid lg:grid-cols-2 gap-6">

                    {/* ABOUT US */}
                    <div className="p-5 border border-blue-200 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#0056B3] border-b pb-2">
                            1. About Us
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className={labelCls}>University Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={inputCls}
                                    placeholder="e.g. Delhi University"
                                />
                            </div>

                            <div>
                                <label className={labelCls}>YouTube Video Link</label>
                                <input
                                    type="url"
                                    value={youtubeLink}
                                    onChange={(e) => setYoutubeLink(e.target.value)}
                                    className={inputCls}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>

                            <div>
                                <label className={labelCls}>University Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setUniversityImage(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-gray-700 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-[#0056B3] hover:file:bg-blue-200 cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className={labelCls}>Main Description</label>
                                <RichTextField
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Detailed information about the university"
                                />
                            </div>
                        </div>
                    </div>

                    {/* KEY & HIGHLIGHT */}
                    <div className="p-5 border border-yellow-300 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#CC6600] border-b pb-2">
                            2. Key & Highlight
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className={labelCls}>Share Description</label>
                                <RichTextField
                                    value={shareDescription}
                                    onChange={setShareDescription}
                                    placeholder="Share Description"
                                />
                            </div>

                            <div>
                                <label className={labelCls}>Card Description</label>
                                <RichTextField
                                    value={cardDescription}
                                    onChange={setCardDescription}
                                    placeholder="Card Description"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================
                    ROW 2: BACKGROUND + FACTS
                ========================== */}
                <div className="grid lg:grid-cols-2 gap-6">

                    {/* BACKGROUND */}
                    <div className="p-5 border border-gray-300 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
                            3. Background Section
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className={labelCls}>Background Description</label>
                                <RichTextField
                                    value={backgroundDescription}
                                    onChange={setBackgroundDescription}
                                    placeholder="Background Description"
                                />
                            </div>

                            <div>
                                <label className={labelCls}>Background Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setBackgroundImage(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-gray-600 file:bg-blue-50 file:text-blue-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* FACTS & PLACEMENT */}
                    <div className="p-5 border border-green-300 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#006400] border-b pb-2">
                            4. Career Outcome & Placement
                        </h3>

                        <div className="space-y-4">
                            {/* Highlights */}
                            <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                                <label className={labelCls}>Highlights Heading</label>
                                <input
                                    type="text"
                                    value={heading}
                                    onChange={(e) => setHeading(e.target.value)}
                                    className={`${inputCls} mb-3`}
                                    placeholder="Main Section Heading"
                                />

                                {points.map((point, index) => (
                                    <div key={`p-${index}`} className="flex gap-2 mb-2 items-center">
                                        <input
                                            type="text"
                                            value={point}
                                            onChange={(e) => handlePointChange(index, e.target.value)}
                                            className={inputCls}
                                            placeholder={`Point ${index + 1}`}
                                        />
                                        {points.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePoint(index)}
                                                className="text-red-600 text-xs px-2"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addPoint}
                                    className="bg-[#006400] text-white px-3 py-1.5 rounded-lg text-xs mt-2"
                                >
                                    + Add Highlight Point
                                </button>
                            </div>

                            {/* Facts */}
                            <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={factsHeading}
                                        onChange={(e) => setFactsHeading(e.target.value)}
                                        className={inputCls}
                                        placeholder="Facts Heading"
                                    />
                                    <input
                                        type="text"
                                        value={factsSubHeading}
                                        onChange={(e) => setFactsSubHeading(e.target.value)}
                                        className={inputCls}
                                        placeholder="Sub-Heading"
                                    />
                                </div>

                                {factsPoints.map((point, index) => (
                                    <div key={`fp-${index}`} className="flex gap-2 mb-2 items-center">
                                        <input
                                            type="text"
                                            value={point}
                                            onChange={(e) => handleFactsPointChange(index, e.target.value)}
                                            className={inputCls}
                                        />
                                        {factsPoints.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeFactsPoint(index)}
                                                className="text-red-600 text-xs px-2"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addFactsPoint}
                                    className="bg-green-800 text-white px-3 py-1.5 rounded-lg text-xs mt-2"
                                >
                                    + Add Fact Point
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================
                    ROW 3: APPROVALS + RECOGNITION
                ========================== */}
                <div className="grid lg:grid-cols-2 gap-6">

                    {/* APPROVALS */}
                    <div className="p-5 border border-red-300 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#A00000] border-b pb-2">
                            5. University Approvals
                        </h3>

                        {approvals.map((approval, index) => (
                            <div
                                key={`a-${index}`}
                                className="grid grid-cols-12 gap-2 items-center mb-3 p-2 border rounded-lg border-red-200 bg-red-50"
                            >
                                <input
                                    type="text"
                                    value={approval.name}
                                    onChange={(e) => handleApprovalChange(index, "name", e.target.value)}
                                    className={`${inputCls} col-span-5`}
                                    placeholder="Approval Name"
                                />
                                <input
                                    type="file"
                                    onChange={(e) => handleApprovalChange(index, "logo", e.target.files?.[0] || null)}
                                    className="col-span-5 text-[10px]"
                                />
                                {approvals.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeApproval(index)}
                                        className="col-span-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addApproval}
                            className="bg-[#A00000] text-white px-3 py-1.5 rounded-lg text-xs mt-2"
                        >
                            + Add Another Approval
                        </button>
                    </div>

                    {/* RECOGNITION */}
                    <div className="p-5 border border-teal-400 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#008080] border-b pb-2">
                            6. University Recognition
                        </h3>

                        <div className="space-y-3">
                            <div>
                                <label className={labelCls}>Recognition Heading</label>
                                <input
                                    type="text"
                                    value={recognitionHeading}
                                    onChange={(e) => setRecognitionHeading(e.target.value)}
                                    className={inputCls}
                                    placeholder="Recognition Heading"
                                />
                            </div>

                            <div>
                                <label className={labelCls}>Recognition Description</label>
                                <RichTextField
                                    value={recognitionDescription}
                                    onChange={setRecognitionDescription}
                                    placeholder="Recognition Description"
                                />
                            </div>

                            {recognitionPoints.map((point, index) => (
                                <div key={`rp-${index}`} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={point}
                                        onChange={(e) => handleRecognitionPointChange(index, e.target.value)}
                                        className={inputCls}
                                    />
                                    {recognitionPoints.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRecognitionPoint(index)}
                                            className="text-red-600 text-xs px-2"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addRecognitionPoint}
                                className="bg-[#008080] text-white px-3 py-1.5 rounded-lg text-xs"
                            >
                                + Add Recognition Point
                            </button>

                            <div>
                                <label className={labelCls}>Certificate Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCertificateImage(e.target.files?.[0] || null)}
                                    className="block w-full text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================
                    ROW 4: ADMISSION + FAQ
                ========================== */}
                <div className="grid lg:grid-cols-2 gap-6">

                    {/* ADMISSION */}
                    <div className="p-5 border border-orange-400 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#FF4500] border-b pb-2">
                            7. Admission Process
                        </h3>

                        <div className="space-y-3">
                            <input
                                type="text"
                                value={admissionHeading}
                                onChange={(e) => setAdmissionHeading(e.target.value)}
                                className={inputCls}
                                placeholder="Admission Heading"
                            />
                            <input
                                type="text"
                                value={admissionSubHeading}
                                onChange={(e) => setAdmissionSubHeading(e.target.value)}
                                className={inputCls}
                                placeholder="Sub-Heading"
                            />

                            <div>
                                <label className={labelCls}>Admission Description</label>
                                <RichTextField
                                    value={admissionDescription}
                                    onChange={setAdmissionDescription}
                                    placeholder="Admission Description"
                                />
                            </div>

                            {admissionPoints.map((point, index) => (
                                <div key={`ap-${index}`} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={point}
                                        onChange={(e) => handleAdmissionPointChange(index, e.target.value)}
                                        className={inputCls}
                                        placeholder={`Step ${index + 1}`}
                                    />
                                    {admissionPoints.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAdmissionPoint(index)}
                                            className="text-red-600 text-xs px-2"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addAdmissionPoint}
                                className="bg-[#FF4500] text-white px-3 py-1.5 rounded-lg text-xs"
                            >
                                + Add Step
                            </button>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="p-5 border border-indigo-400 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#4B0082] border-b pb-2">
                            8. Frequently Asked Questions (FAQ)
                        </h3>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                            {faqs.map((faq, index) => (
                                <div
                                    key={`faq-${index}`}
                                    className="p-3 border rounded-lg border-indigo-200 bg-indigo-50"
                                >
                                    <label className="block text-xs font-bold mb-1 text-indigo-700">
                                        Question {index + 1}
                                    </label>
                                    <input
                                        type="text"
                                        value={faq.question}
                                        onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                                        className={`${inputCls} mb-3`}
                                        placeholder="Enter question..."
                                    />

                                    <label className="block text-xs font-bold mb-1 text-indigo-700">
                                        Answer
                                    </label>
                                    <RichTextField
                                        value={faq.answer}
                                        onChange={(val) => handleFaqChange(index, "answer", val)}
                                        placeholder="Enter answer..."
                                    />

                                    {faqs.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFaq(index)}
                                            className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
                                        >
                                            ✕ Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addFaq}
                            className="bg-[#4B0082] text-white px-3 py-1.5 rounded-lg text-xs mt-3"
                        >
                            + Add FAQ
                        </button>
                    </div>
                </div>

                {/* =========================
                    COURSE MANAGEMENT
                ========================== */}
                <div className="p-5 border border-purple-300 rounded-xl bg-white shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-[#6A0DAD] border-b pb-2">
                        9. Course Management
                    </h3>

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

                    <div className="p-4 border border-gray-300 rounded-xl bg-gray-50 mt-5">
                        <h4 className="font-bold text-md mb-3 text-[#0056B3]">
                            Final Courses List ({courses.length})
                        </h4>

                        {courses.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">
                                No courses added yet.
                            </p>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {courses.map((course, index) => (
                                    <div
                                        key={`c-${index}`}
                                        className="p-3 border rounded-lg border-gray-200 bg-white shadow-sm"
                                    >
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <div>
                                                <label className="block text-[10px] font-bold mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    value={course.name}
                                                    onChange={(e) => handleCourseChange(index, "name", e.target.value)}
                                                    className={inputCls}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold mb-1 text-blue-600">
                                                    Course Slug
                                                </label>
                                                <input
                                                    type="text"
                                                    value={course.courseSlug}
                                                    onChange={(e) => handleCourseChange(index, "courseSlug", e.target.value)}
                                                    className={`${inputCls} border-blue-200`}
                                                    placeholder="mba-online"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <div>
                                                <label className="block text-[10px] font-bold mb-1">Duration</label>
                                                <input
                                                    type="text"
                                                    value={course.duration}
                                                    onChange={(e) => handleCourseChange(index, "duration", e.target.value)}
                                                    className={inputCls}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold mb-1">Override Logo</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleCourseChange(index, "logo", e.target.files?.[0] || null)}
                                                    className="w-full text-[10px]"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeCourse(index)}
                                            className="w-full bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs"
                                        >
                                            ✕ Remove Course
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={addCourse}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 mt-4"
                        >
                            + Add Another Course Manually
                        </button>
                    </div>
                </div>

                {/* =========================
                    SUBMIT BAR (Sticky)
                ========================== */}
                <div className="sticky bottom-4 bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#0056B3] text-white py-3 rounded-lg text-base font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 shadow-lg"
                        >
                            {loading ? "Submitting Data..." : "🚀 Add University"}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={loading}
                            className="px-6 py-3 rounded-lg text-base font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Reset
                        </button>
                    </div>

                    {message && (
                        <p
                            className={`text-center mt-3 text-sm font-medium ${
                                message.includes("✅") ? "text-green-600" : "text-red-500"
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}