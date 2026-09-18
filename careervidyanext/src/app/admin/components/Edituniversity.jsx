// "use client";

// import { useState, useEffect } from "react";
// import api from "@/utlis/api.js";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function EditUniversityPage({ params }) {
//   const router = useRouter();
//   const universityId = params?.id;

//   // --- State Variables ---
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [universityImage, setUniversityImage] = useState(null);
//   const [universityImage_old, setUniversityImage_old] = useState("");
//   const [youtubeLink, setYoutubeLink] = useState("");

//   const [shareDescription, setShareDescription] = useState("");
//   const [cardDescription, setCardDescription] = useState("");

//   // New Background Fields
//   const [backgroundImage, setBackgroundImage] = useState(null);
//   const [backgroundImage_old, setBackgroundImage_old] = useState("");
//   const [backgroundDescription, setBackgroundDescription] = useState("");

//   const [heading, setHeading] = useState("");
//   const [points, setPoints] = useState([""]);
//   const [factsHeading, setFactsHeading] = useState("");
//   const [factsSubHeading, setFactsSubHeading] = useState("");
//   const [factsPoints, setFactsPoints] = useState([""]);

//   const [approvals, setApprovals] = useState([{ name: "", logo: null, logo_old: null }]);

//   const [recognitionHeading, setRecognitionHeading] = useState("");
//   const [recognitionDescription, setRecognitionDescription] = useState("");
//   const [recognitionPoints, setRecognitionPoints] = useState([""]);
//   const [certificateImage, setCertificateImage] = useState(null);
//   const [certificateImage_old, setCertificateImage_old] = useState("");

//   const [admissionHeading, setAdmissionHeading] = useState("");
//   const [admissionSubHeading, setAdmissionSubHeading] = useState("");
//   const [admissionDescription, setAdmissionDescription] = useState("");
//   const [admissionPoints, setAdmissionPoints] = useState([""]);

//   // Updated Courses State to include fees and details
//   const [courses, setCourses] = useState([{ name: "", logo: null, logo_old: null, duration: "", fees: "", details: "" }]);
  
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [dataLoadingError, setDataLoadingError] = useState(false);

//   // --- Utility ---
//   const isValidUrl = (url) =>
//     typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"));

//   const filterEmptyObjects = (arr) =>
//     arr.filter((item) => {
//       if (typeof item === "string") return item.trim() !== "";
//       if (typeof item === "object" && item !== null) {
//         return Object.values(item).some(
//           (val) => val !== null && val !== "" && (typeof val === "string" ? val.trim() !== "" : true)
//         );
//       }
//       return false;
//     });

//   // --- Fetch existing university data ---
//   useEffect(() => {
//     if (!universityId) {
//       setDataLoadingError(true);
//       setMessage("Error: University ID is missing.");
//       setLoading(false);
//       return;
//     }

//     const fetchUniversityData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/api/v1/university/${universityId}`);
//         const data = response.data?.data || {};

//         // Basic
//         setName(data.name || "");
//         setDescription(data.description || "");
//         setUniversityImage_old(data.universityImage || "");
//         setYoutubeLink(data.youtubeLink || "");

//         // SEO
//         setShareDescription(data.shareDescription || "");
//         setCardDescription(data.cardDescription || "");

//         // Background (New)
//         setBackgroundImage_old(data.background?.backgroundImage || "");
//         setBackgroundDescription(data.background?.backgroundDescription || "");

//         // Highlights
//         setHeading(data.highlights?.heading || "");
//         setPoints(
//           data.highlights?.points && data.highlights.points.length > 0 ? data.highlights.points : [""]
//         );

//         // Facts
//         setFactsHeading(data.facts?.factsHeading || "");
//         setFactsSubHeading(data.facts?.factsSubHeading || "");
//         setFactsPoints(
//           data.facts?.factsPoints && data.facts.factsPoints.length > 0 ? data.facts.factsPoints : [""]
//         );

//         // Approvals
//         const mappedApprovals = (data.approvals || []).map((app) => ({
//           name: app.name || "",
//           logo_old: app.logo || null,
//           logo: null,
//         }));
//         setApprovals(mappedApprovals.length > 0 ? mappedApprovals : [{ name: "", logo: null, logo_old: null }]);

//         // Recognition
//         setRecognitionHeading(data.recognition?.recognitionHeading || "");
//         setRecognitionDescription(data.recognition?.recognitionDescription || "");
//         setCertificateImage_old(data.recognition?.certificateImage || "");
//         setRecognitionPoints(
//           data.recognition?.recognitionPoints && data.recognition.recognitionPoints.length > 0
//             ? data.recognition.recognitionPoints
//             : [""]
//         );

//         // Admission
//         setAdmissionHeading(data.admission?.admissionHeading || "");
//         setAdmissionSubHeading(data.admission?.admissionSubHeading || "");
//         setAdmissionDescription(data.admission?.admissionDescription || "");
//         setAdmissionPoints(
//           data.admission?.admissionPoints && data.admission.admissionPoints.length > 0 ? data.admission.admissionPoints : [""]
//         );

//         // Courses (Updated with fees/details)
//         const mappedCourses = (data.courses || []).map((c) => ({
//           name: c.name || "",
//           duration: c.duration || "",
//           fees: c.fees || "",
//           details: c.details || "",
//           logo_old: c.logo || null,
//           logo: null,
//         }));
//         setCourses(mappedCourses.length > 0 ? mappedCourses : [{ name: "", logo: null, logo_old: null, duration: "", fees: "", details: "" }]);

//         setMessage("Data loaded successfully.");
//       } catch (error) {
//         console.error("Error fetching university data:", error);
//         setDataLoadingError(true);
//         setMessage("❌ Error loading university data: " + (error.response?.data?.message || error.message));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUniversityData();
//   }, [universityId]);

//   // --- Dynamic list handlers ---
//   const addAdmissionPoint = () => setAdmissionPoints([...admissionPoints, ""]);
//   const removeAdmissionPoint = (index) => setAdmissionPoints(admissionPoints.filter((_, i) => i !== index));
//   const handleAdmissionPointChange = (index, value) => {
//     const updated = [...admissionPoints];
//     updated[index] = value;
//     setAdmissionPoints(updated);
//   };

//   const addPoint = () => setPoints([...points, ""]);
//   const removePoint = (index) => setPoints(points.filter((_, i) => i !== index));
//   const handlePointChange = (index, value) => {
//     const updated = [...points];
//     updated[index] = value;
//     setPoints(updated);
//   };

//   const addFactsPoint = () => setFactsPoints([...factsPoints, ""]);
//   const removeFactsPoint = (index) => setFactsPoints(factsPoints.filter((_, i) => i !== index));
//   const handleFactsPointChange = (index, value) => {
//     const updated = [...factsPoints];
//     updated[index] = value;
//     setFactsPoints(updated);
//   };

//   const addRecognitionPoint = () => setRecognitionPoints([...recognitionPoints, ""]);
//   const removeRecognitionPoint = (index) =>
//     setRecognitionPoints(recognitionPoints.filter((_, i) => i !== index));
//   const handleRecognitionPointChange = (index, value) => {
//     const updated = [...recognitionPoints];
//     updated[index] = value;
//     setRecognitionPoints(updated);
//   };

//   const handleApprovalChange = (index, field, value) => {
//     const updated = [...approvals];
//     updated[index][field] = value;
//     setApprovals(updated);
//   };
//   const addApproval = () => setApprovals([...approvals, { name: "", logo: null, logo_old: null }]);
//   const removeApproval = (index) => setApprovals(approvals.filter((_, i) => i !== index));

//   const addCourse = () => setCourses([...courses, { name: "", logo: null, logo_old: null, duration: "", fees: "", details: "" }]);
//   const removeCourse = (index) => setCourses(courses.filter((_, i) => i !== index));
//   const handleCourseChange = (index, field, value) => {
//     const updated = [...courses];
//     updated[index][field] = value;
//     setCourses(updated);
//   };

//   // --- Submit Handler ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const formData = new FormData();

//       // Single fields
//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("youtubeLink", youtubeLink || "");
//       formData.append("shareDescription", shareDescription || "");
//       formData.append("cardDescription", cardDescription || "");
      
//       // New Background Logic
//       formData.append("backgroundDescription", backgroundDescription || "");
//       formData.append("backgroundImage_old", backgroundImage_old || "");
//       if (backgroundImage instanceof File) formData.append("backgroundImage", backgroundImage);

//       formData.append("heading", heading || "");
//       formData.append("factsHeading", factsHeading || "");
//       formData.append("factsSubHeading", factsSubHeading || "");
//       formData.append("recognitionHeading", recognitionHeading || "");
//       formData.append("recognitionDescription", recognitionDescription || "");
//       formData.append("admissionHeading", admissionHeading || "");
//       formData.append("admissionSubHeading", admissionSubHeading || "");
//       formData.append("admissionDescription", admissionDescription || "");

//       // Old image URLs
//       formData.append("universityImage_old", universityImage_old || "");
//       formData.append("certificateImage_old", certificateImage_old || "");

//       // Array fields
//       formData.append("points", JSON.stringify(filterEmptyObjects(points)));
//       formData.append("factsPoints", JSON.stringify(filterEmptyObjects(factsPoints)));
//       formData.append("recognitionPoints", JSON.stringify(filterEmptyObjects(recognitionPoints)));
//       formData.append("admissionPoints", JSON.stringify(filterEmptyObjects(admissionPoints)));

//       // Single file fields
//       if (universityImage instanceof File) formData.append("universityImage", universityImage);
//       if (certificateImage instanceof File) formData.append("certificateImage", certificateImage);

//       // Approvals
//       const approvalsDataForBody = approvals.map((a) => ({
//         name: a.name || "",
//         logo: a.logo ? "new_file" : a.logo_old || null,
//       }));
//       formData.append("approvals", JSON.stringify(filterEmptyObjects(approvalsDataForBody)));

//       approvals.forEach((approval, index) => {
//         if (approval.logo instanceof File) {
//           formData.append(`approvals[${index}][logo]`, approval.logo);
//         }
//       });

//       // Courses (Updated with fees/details)
//       const coursesDataForBody = courses.map((c) => ({
//         name: c.name || "",
//         duration: c.duration || "",
//         fees: c.fees || "",
//         details: c.details || "",
//         logo: c.logo ? "new_file" : c.logo_old || null,
//       }));
//       formData.append("courses", JSON.stringify(filterEmptyObjects(coursesDataForBody)));

//       courses.forEach((course, index) => {
//         if (course.logo instanceof File) {
//           formData.append(`courses[${index}][logo]`, course.logo);
//         }
//       });

//       const response = await api.put(`/api/v1/university/${universityId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessage("✅ University updated successfully!");
//     } catch (error) {
//       console.error("Submission Error:", error);
//       setMessage("❌ Error updating university: " + (error.response?.data?.message || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };
//   // -



//   // -- Render states ---
//   if (loading && !dataLoadingError) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 text-center text-xl font-semibold mt-20">🔄 Loading University Data...</div>
//     );
//   }

//   if (dataLoadingError) {
//     return (
//       <div className="max-w-4xl mx-auto p-6 text-center text-xl font-semibold mt-20 text-red-600">
//         🛑 Failed to load data. {message}
//         <Link href="/admin/universities" className="text-blue-500 block mt-4 hover:underline">
//           Go back to Universities List
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl mt-10">
//       <h2 className="text-3xl font-extrabold text-[#A00000] mb-8 pb-4 border-b border-gray-200">✍️ Edit University: {name}</h2>

//       <form onSubmit={handleSubmit} className="space-y-10">
//         {/* 1. About Us */}
//         <div className="p-6 border border-blue-200 rounded-xl bg-blue-50 shadow-sm">
//           <h3 className="font-bold text-xl mb-4 text-[#0056B3]">1. About Us</h3>

//           {isValidUrl(universityImage_old) && (
//             <div className="mb-6 p-3 border border-blue-300 rounded-lg bg-white flex flex-col items-center">
//               <h4 className="font-semibold text-base mb-2 text-blue-800">Current University Logo</h4>
//               <div className="w-32 h-16 overflow-hidden">
//                 <img src={universityImage_old} alt={`${name} Logo`} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
//               </div>
//             </div>
//           )}

//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <label className="block font-medium mb-1">University Name *</label>
//               <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Delhi University" />
//             </div>
//             <div>
//               <label className="block font-medium mb-1">YouTube Video Link</label>
//               <input type="url" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. https://www.youtube.com/watch?v=..." />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block font-medium mb-1">University Image</label>
//               <input type="file" accept="image/*" onChange={(e) => { setUniversityImage(e.target.files[0]); setUniversityImage_old(null); }} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-[#0056B3] hover:file:bg-blue-200 cursor-pointer" />
//               {isValidUrl(universityImage_old) && !universityImage && (
//                 <p className="text-sm text-gray-500 mt-1">Current Image: <span className="font-semibold text-blue-700">Present</span> (Upload new to replace)</p>
//               )}
//             </div>
//             <div className="md:col-span-2">
//               <label className="block font-medium mb-1">Main Description (Detailed)</label>
//               <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Detailed information about the university" />
//             </div>
//           </div>
//         </div>

//         {/* NEW SECTION: Background Details */}
//         <div className="p-6 border border-indigo-200 rounded-xl bg-indigo-50 shadow-sm">
//           <h3 className="font-bold text-xl mb-4 text-[#4B0082]">1.1 Background Section</h3>
//           <div className="grid md:grid-cols-1 gap-6">
//              <div>
//               <label className="block font-medium mb-1">Background Image</label>
//               <input type="file" accept="image/*" onChange={(e) => { setBackgroundImage(e.target.files[0]); setBackgroundImage_old(null); }} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-[#4B0082] hover:file:bg-indigo-200 cursor-pointer" />
//               {isValidUrl(backgroundImage_old) && !backgroundImage && (
//                 <p className="text-sm text-gray-500 mt-1">Current Background: <a href={backgroundImage_old} target="_blank" className="text-indigo-700 hover:underline">View Current</a></p>
//               )}
//             </div>
//             <div>
//               <label className="block font-medium mb-1">Background Description</label>
//               <textarea rows="3" value={backgroundDescription} onChange={(e) => setBackgroundDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="History or background details of the university" />
//             </div>
//           </div>
//         </div>

//         {/* SEO */}
//         <div className="p-4 border border-yellow-300 rounded-xl bg-yellow-50 shadow-sm">
//           <h4 className="font-bold text-lg mb-3 text-[#CC6600]">SEO & Card Details</h4>
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-medium mb-1 text-sm">Share Description (SEO)</label>
//               <textarea rows="2" value={shareDescription} onChange={(e) => setShareDescription(e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="A short, catchy description for sharing" />
//             </div>
//             <div>
//               <label className="block font-medium mb-1 text-sm">Card Description (Listing Card)</label>
//               <textarea rows="2" value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="Very brief summary of the university" />
//             </div>
//           </div>
//         </div>

//         {/* Facts & Highlights */}
//         <div className="p-6 border border-green-300 rounded-xl bg-green-50 shadow-sm">
//           <h3 className="font-bold text-xl mb-4 text-[#006400]">2 Career outcome and Placement</h3>

//           <div className="mb-6 p-4 border border-green-200 rounded-lg bg-white">
//             <h4 className="font-semibold text-lg mb-3 text-green-800">Highlights Section</h4>
//             <label className="block font-medium mb-1 text-sm">Main Section Heading (e.g., Why Choose?)</label>
//             <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300 mb-4" placeholder="e.g. Why Choose This University?" />

//             <label className="block font-medium mb-2 text-sm">Add Points (Key features/bullets)</label>
//             {points.map((point, index) => (
//               <div key={`p-${index}`} className="flex gap-2 mb-2 items-center">
//                 <input type="text" value={point} onChange={(e) => handlePointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Point ${index + 1}`} />
//                 {points.length > 1 && (<button type="button" onClick={() => removePoint(index)} className="text-red-600 hover:text-red-800 text-sm font-medium transition flex-shrink-0">Remove</button>)}
//               </div>
//             ))}
//             <button type="button" onClick={addPoint} className="bg-[#006400] text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition mt-2 shadow-md">+ Add Highlight Point</button>
//           </div>

//           <div className="p-4 border border-green-200 rounded-lg bg-white">
//             <h4 className="font-semibold text-lg mb-3 text-green-800">Facts & Statistics Section</h4>
//             <div className="grid md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block font-medium mb-1 text-sm">Facts Section Heading</label>
//                 <input type="text" value={factsHeading} onChange={(e) => setFactsHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Facts About [University Name]" />
//               </div>
//               <div>
//                 <label className="block font-medium mb-1 text-sm">The Sub-Heading</label>
//                 <input type="text" value={factsSubHeading} onChange={(e) => setFactsSubHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Key achievements and statistics" />
//               </div>
//             </div>

//             <label className="block font-medium mb-2 text-sm">Add Facts Points</label>
//             {factsPoints.map((point, index) => (
//               <div key={`fp-${index}`} className="flex gap-2 mb-2 items-center">
//                 <input type="text" value={point} onChange={(e) => handleFactsPointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Fact Point ${index + 1}`} />
//                 {factsPoints.length > 1 && (<button type="button" onClick={() => removeFactsPoint(index)} className="text-red-600 hover:text-red-800 text-sm font-medium transition flex-shrink-0">Remove</button>)}
//               </div>
//             ))}
//             <button type="button" onClick={addFactsPoint} className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-900 transition mt-2 shadow-md">+ Add Fact Point</button>
//           </div>
//         </div>

//         {/* Approvals */}
//         <div className="p-6 border border-red-300 rounded-xl bg-red-50 shadow-sm">
//           <h3 className="font-bold text-xl mb-4 text-[#A00000]">3. University Approvals (Logos & Names)</h3>

//           {approvals.map((approval, index) => (
//             <div key={`a-${index}`} className="grid md:grid-cols-3 gap-4 items-end mb-4 p-4 border rounded-lg border-red-200 bg-white shadow-sm">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Approval Name</label>
//                 <input type="text" value={approval.name} onChange={(e) => handleApprovalChange(index, "name", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. UGC, AICTE, NAAC" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Approval Logo</label>
//                 <input type="file" accept="image/*" onChange={(e) => handleApprovalChange(index, "logo", e.target.files[0])} className="w-full text-gray-700 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-red-100 file:text-red-700 hover:file:bg-red-200 cursor-pointer" />
//                 {approval.logo_old && !approval.logo && (
//                   <p className="text-xs text-gray-500 mt-1">Current Logo: <a href={approval.logo_old} target="_blank" className="text-red-700 hover:underline">View</a></p>
//                 )}
//               </div>
//               <div className="md:col-span-1">
//                 {approvals.length > 1 && (<button type="button" onClick={() => removeApproval(index)} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm transition shadow-md">Remove Approval</button>)}
//               </div>
//             </div>
//           ))}

//           <button type="button" onClick={addApproval} className="bg-[#A00000] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition mt-4 shadow-md">+ Add Another Approval</button>
//         </div>

//         {/* Recognition */}
//         <div className="p-6 border border-teal-400 rounded-xl bg-teal-50 shadow-sm">
//           <h3 className="font-bold text-xl mb-4 text-[#008080]">4. University Recognition & Certificates</h3>

//           <div className="mb-4">
//             <label className="block font-medium mb-1 text-sm">Recognition Section Heading</label>
//             <input type="text" value={recognitionHeading} onChange={(e) => setRecognitionHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Awards and Special Recognition" />
//           </div>

//           <div className="mb-4">
//             <label className="block font-medium mb-1 text-sm">Description/Summary</label>
//             <textarea rows="2" value={recognitionDescription} onChange={(e) => setRecognitionDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Briefly describe the significance of these recognitions." />
//           </div>

//           <div className="mt-4 mb-6 p-4 border border-teal-200 rounded-lg bg-white">
//             <h4 className="font-semibold text-md mb-2 text-teal-800">Recognition Points (Bullet List)</h4>
//             {recognitionPoints.map((point, index) => (
//               <div key={`rp-${index}`} className="flex gap-2 mb-2 items-center">
//                 <input type="text" value={point} onChange={(e) => handleRecognitionPointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Recognition Detail ${index + 1}`} />
//                 {recognitionPoints.length > 1 && (<button type="button" onClick={() => removeRecognitionPoint(index)} className="text-red-600 hover:text-red-800 text-sm font-medium transition flex-shrink-0">Remove</button>)}
//               </div>
//             ))}
//             <button type="button" onClick={addRecognitionPoint} className="bg-[#008080] text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition mt-2 shadow-md">+ Add Recognition Point</button>
//           </div>

//           <div>
//             <label className="block font-medium mb-1">Main Certificate Image</label>
//             <input type="file" accept="image/*" onChange={(e) => { setCertificateImage(e.target.files[0]); setCertificateImage_old(null); }} className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-[#008080] hover:file:bg-teal-200 cursor-pointer" />
//             {certificateImage_old && !certificateImage && (
//               <p className="text-sm text-gray-500 mt-1">Current Certificate: <span className="font-semibold text-teal-700">Present</span> (Upload new to replace)</p>
//             )}
//           </div>
//         </div>

//         {/* Admission */}
//         <div className="p-6 border border-orange-400 rounded-xl bg-orange-50 shadow-sm">
//           <h3 className="font-bold text-xl mb-4 text-[#FF4500]">5. University Admission Process</h3>

//           <div className="mb-4">
//             <label className="block font-medium mb-1 text-sm">Admission Section Heading</label>
//             <input type="text" value={admissionHeading} onChange={(e) => setAdmissionHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. How to Apply: Step-by-Step" />
//           </div>

//           <div className="mb-4">
//             <label className="block font-medium mb-1 text-sm">Sub-Heading</label>
//             <input type="text" value={admissionSubHeading} onChange={(e) => setAdmissionSubHeading(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="e.g. Eligibility and Required Documents" />
//           </div>

//           <div className="mb-4">
//             <label className="block font-medium mb-1 text-sm">Description/Overview</label>
//             <textarea rows="2" value={admissionDescription} onChange={(e) => setAdmissionDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="A general overview of the application and selection process." />
//           </div>

//           <div className="mt-4 p-4 border border-orange-200 rounded-lg bg-white">
//             <h4 className="font-semibold text-md mb-2 text-orange-800">Admission Steps/Points</h4>
//             {admissionPoints.map((point, index) => (
//               <div key={`ap-${index}`} className="flex gap-2 mb-2 items-center">
//                 <input type="text" value={point} onChange={(e) => handleAdmissionPointChange(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Step/Point ${index + 1}`} />
//                 {admissionPoints.length > 1 && (
//                   <button type="button" onClick={() => removeAdmissionPoint(index)} className="text-red-600 hover:text-red-800 text-sm font-medium transition flex-shrink-0">Remove</button>
//                 )}
//               </div>
//             ))}
//             <button type="button" onClick={addAdmissionPoint} className="bg-[#FF4500] text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition mt-2 shadow-md">+ Add Admission Step/Point</button>
//           </div>
//         </div>

//         {/* Courses */}
//         <div className="p-6 border border-purple-300 rounded-xl bg-purple-50 shadow-sm">
//           <h3 className="font-bold text-xl mb-4 text-[#6A0DAD]">Course Management</h3>

//           <div className="p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-sm">
//             <h3 className="font-bold text-xl mb-4 text-[#0056B3]">Final University Courses List</h3>
//             {courses.map((course, index) => (
//               <div key={`c-${index}`} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-end mb-8 p-6 border rounded-lg border-gray-200 bg-white shadow-sm">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Course Name</label>
//                   <input type="text" value={course.name} onChange={(e) => handleCourseChange(index, "name", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. B.Tech Computer Science" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Duration</label>
//                   <input type="text" value={course.duration} onChange={(e) => handleCourseChange(index, "duration", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. 4 Years" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Course Fees</label>
//                   <input type="text" value={course.fees} onChange={(e) => handleCourseChange(index, "fees", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. ₹ 50,000 / Year" />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium mb-1">Course Details (Extra Info)</label>
//                   <input type="text" value={course.details} onChange={(e) => handleCourseChange(index, "details", e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder="e.g. Includes lab fees and industrial visit" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Course Logo</label>
//                   <input type="file" accept="image/*" onChange={(e) => handleCourseChange(index, "logo", e.target.files[0])} className="w-full text-gray-700 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer" />
//                   {course.logo_old && !course.logo && (
//                     <p className="text-xs text-gray-500 mt-1">Current Logo: <a href={course.logo_old} target="_blank" className="text-purple-700 hover:underline">View</a></p>
//                   )}
//                 </div>
//                 <div className="lg:col-span-3 mt-2">
//                   {courses.length > 1 && (
//                     <button type="button" onClick={() => removeCourse(index)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm transition shadow-md">Remove This Course</button>
//                   )}
//                 </div>
//               </div>
//             ))}

//             <button type="button" onClick={addCourse} className="bg-[#6A0DAD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition mt-4 shadow-md">+ Add Another Course</button>
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="pt-8 border-t border-gray-200">
//           {message && (
//             <p className={`text-center font-semibold mb-4 text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
//               {message}
//             </p>
//           )}
//           <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-lg font-bold text-white transition shadow-lg ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#A00000] hover:bg-red-700"}`}>
//             {loading ? "Updating..." : "💾 Update University Data"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };


"use client";

import { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextField from "@/app/admin/components/RichTextField.jsx";

// =====================================================
// HELPERS
// =====================================================
const isValidUrl = (url) =>
    typeof url === "string" &&
    (url.startsWith("http://") || url.startsWith("https://"));

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

// =====================================================
// INITIAL STATES
// =====================================================
const initialApproval = { name: "", logo: null, logo_old: null };
const initialFaq = { question: "", answer: "" };
const initialCourse = {
    courseId: null,
    courseSlug: "",
    name: "",
    logo: null,
    logo_old: null,
    duration: "",
    fees: "",
    details: "",
};

const initialCareerBenefit = {
    title: "",
    description: "",
    icon: null,
    icon_old: null,
};

const initialEligibilityCriterion = {
    courseName: "",
    requirement: "",
};

const initialExamPattern = {
    heading: "Examination Pattern",
    subHeading: "",
    description: "",
    mode: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
    questionTypes: [""],
    points: [""],
};

const initialLms = {
    heading: "Learning Management System (LMS)",
    subHeading: "",
    description: "",
    features: [""],
    image: null,
    image_old: null,
};

const initialEmiOptions = {
    heading: "EMI & Education Loan Support",
    subHeading: "",
    description: "",
    lendersCount: "",
    approvalTime: "",
    noBankVisit: true,
    emiStartingFrom: "",
    points: [""],
    partners: [""],
};

export default function EditUniversityPage({ params }) {
    const router = useRouter();
    const universityId = params?.id;

    // =====================================================
    // EXISTING FIELDS
    // =====================================================
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [universityImage, setUniversityImage] = useState(null);
    const [universityImage_old, setUniversityImage_old] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");

    const [shareDescription, setShareDescription] = useState("");
    const [cardDescription, setCardDescription] = useState("");

    const [backgroundImage, setBackgroundImage] = useState(null);
    const [backgroundImage_old, setBackgroundImage_old] = useState("");
    const [backgroundDescription, setBackgroundDescription] = useState("");

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
    const [certificateImage_old, setCertificateImage_old] = useState("");

    const [admissionHeading, setAdmissionHeading] = useState("");
    const [admissionSubHeading, setAdmissionSubHeading] = useState("");
    const [admissionDescription, setAdmissionDescription] = useState("");
    const [admissionPoints, setAdmissionPoints] = useState([""]);

    const [faqs, setFaqs] = useState([{ ...initialFaq }]);

    const [courses, setCourses] = useState([{ ...initialCourse }]);

    // =====================================================
    // ✅ NEW SECTIONS STATE
    // =====================================================

    // 1. Career Vidya Benefits
    const [careerVidyaHeading, setCareerVidyaHeading] = useState("Career Vidya Benefits");
    const [careerVidyaSubHeading, setCareerVidyaSubHeading] = useState("");
    const [careerVidyaDescription, setCareerVidyaDescription] = useState("");
    const [careerBenefits, setCareerBenefits] = useState([{ ...initialCareerBenefit }]);

    // 2. Eligibility
    const [eligibilityHeading, setEligibilityHeading] = useState("Eligibility Criteria");
    const [eligibilitySubHeading, setEligibilitySubHeading] = useState("");
    const [eligibilityDescription, setEligibilityDescription] = useState("");
    const [eligibilityCriteria, setEligibilityCriteria] = useState([{ ...initialEligibilityCriterion }]);
    const [eligibilityPoints, setEligibilityPoints] = useState([""]);

    // 3. Exam Pattern
    const [examPattern, setExamPattern] = useState({ ...initialExamPattern });

    // 4. LMS
    const [lms, setLms] = useState({ ...initialLms });

    // 5. EMI Options
    const [emiOptions, setEmiOptions] = useState({ ...initialEmiOptions });

    // =====================================================
    // COMMON STATE
    // =====================================================
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [dataLoadingError, setDataLoadingError] = useState(false);

    // =====================================================
    // EXISTING HANDLERS
    // =====================================================
    const addAdmissionPoint = () => setAdmissionPoints((p) => [...p, ""]);
    const removeAdmissionPoint = (i) => setAdmissionPoints((p) => p.filter((_, x) => x !== i));
    const handleAdmissionPointChange = (i, v) => setAdmissionPoints((p) => p.map((x, idx) => (idx === i ? v : x)));

    const addPoint = () => setPoints((p) => [...p, ""]);
    const removePoint = (i) => setPoints((p) => p.filter((_, x) => x !== i));
    const handlePointChange = (i, v) => setPoints((p) => p.map((x, idx) => (idx === i ? v : x)));

    const addFactsPoint = () => setFactsPoints((p) => [...p, ""]);
    const removeFactsPoint = (i) => setFactsPoints((p) => p.filter((_, x) => x !== i));
    const handleFactsPointChange = (i, v) => setFactsPoints((p) => p.map((x, idx) => (idx === i ? v : x)));

    const addRecognitionPoint = () => setRecognitionPoints((p) => [...p, ""]);
    const removeRecognitionPoint = (i) => setRecognitionPoints((p) => p.filter((_, x) => x !== i));
    const handleRecognitionPointChange = (i, v) => setRecognitionPoints((p) => p.map((x, idx) => (idx === i ? v : x)));

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

    // =====================================================
    // ✅ NEW HANDLERS
    // =====================================================

    // ---------- Career Vidya Benefits ----------
    const addCareerBenefit = () => setCareerBenefits((p) => [...p, { ...initialCareerBenefit }]);
    const removeCareerBenefit = (i) => setCareerBenefits((p) => p.filter((_, x) => x !== i));
    const handleCareerBenefitChange = (i, f, v) =>
        setCareerBenefits((p) => p.map((item, idx) => (idx === i ? { ...item, [f]: v } : item)));

    // ---------- Eligibility ----------
    const addEligibilityCriterion = () =>
        setEligibilityCriteria((p) => [...p, { ...initialEligibilityCriterion }]);
    const removeEligibilityCriterion = (i) =>
        setEligibilityCriteria((p) => p.filter((_, x) => x !== i));
    const handleEligibilityCriterionChange = (i, f, v) =>
        setEligibilityCriteria((p) => p.map((item, idx) => (idx === i ? { ...item, [f]: v } : item)));

    const addEligibilityPoint = () => setEligibilityPoints((p) => [...p, ""]);
    const removeEligibilityPoint = (i) => setEligibilityPoints((p) => p.filter((_, x) => x !== i));
    const handleEligibilityPointChange = (i, v) =>
        setEligibilityPoints((p) => p.map((x, idx) => (idx === i ? v : x)));

    // ---------- Exam Pattern ----------
    const handleExamPatternChange = (f, v) => setExamPattern((p) => ({ ...p, [f]: v }));

    const addExamQuestionType = () =>
        setExamPattern((p) => ({ ...p, questionTypes: [...p.questionTypes, ""] }));
    const removeExamQuestionType = (i) =>
        setExamPattern((p) => ({ ...p, questionTypes: p.questionTypes.filter((_, x) => x !== i) }));
    const handleExamQuestionTypeChange = (i, v) =>
        setExamPattern((p) => ({ ...p, questionTypes: p.questionTypes.map((x, idx) => (idx === i ? v : x)) }));

    const addExamPoint = () => setExamPattern((p) => ({ ...p, points: [...p.points, ""] }));
    const removeExamPoint = (i) =>
        setExamPattern((p) => ({ ...p, points: p.points.filter((_, x) => x !== i) }));
    const handleExamPointChange = (i, v) =>
        setExamPattern((p) => ({ ...p, points: p.points.map((x, idx) => (idx === i ? v : x)) }));

    // ---------- LMS ----------
    const handleLmsChange = (f, v) => setLms((p) => ({ ...p, [f]: v }));
    const addLmsFeature = () => setLms((p) => ({ ...p, features: [...p.features, ""] }));
    const removeLmsFeature = (i) =>
        setLms((p) => ({ ...p, features: p.features.filter((_, x) => x !== i) }));
    const handleLmsFeatureChange = (i, v) =>
        setLms((p) => ({ ...p, features: p.features.map((x, idx) => (idx === i ? v : x)) }));

    // ---------- EMI Options ----------
    const handleEmiChange = (f, v) => setEmiOptions((p) => ({ ...p, [f]: v }));
    const addEmiPoint = () => setEmiOptions((p) => ({ ...p, points: [...p.points, ""] }));
    const removeEmiPoint = (i) =>
        setEmiOptions((p) => ({ ...p, points: p.points.filter((_, x) => x !== i) }));
    const handleEmiPointChange = (i, v) =>
        setEmiOptions((p) => ({ ...p, points: p.points.map((x, idx) => (idx === i ? v : x)) }));

    const addEmiPartner = () => setEmiOptions((p) => ({ ...p, partners: [...p.partners, ""] }));
    const removeEmiPartner = (i) =>
        setEmiOptions((p) => ({ ...p, partners: p.partners.filter((_, x) => x !== i) }));
    const handleEmiPartnerChange = (i, v) =>
        setEmiOptions((p) => ({ ...p, partners: p.partners.map((x, idx) => (idx === i ? v : x)) }));

    // =====================================================
    // FETCH EXISTING DATA
    // =====================================================
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
                setShareDescription(data.shareDescription || "");
                setCardDescription(data.cardDescription || "");

                // Background
                setBackgroundImage_old(data.background?.backgroundImage || "");
                setBackgroundDescription(data.background?.backgroundDescription || "");

                // Highlights
                setHeading(data.highlights?.heading || "");
                setPoints(data.highlights?.points?.length > 0 ? data.highlights.points : [""]);

                // Facts
                setFactsHeading(data.facts?.factsHeading || "");
                setFactsSubHeading(data.facts?.factsSubHeading || "");
                setFactsPoints(data.facts?.factsPoints?.length > 0 ? data.facts.factsPoints : [""]);

                // Approvals
                const mappedApprovals = (data.approvals || []).map((app) => ({
                    name: app.name || "",
                    logo_old: app.logo || null,
                    logo: null,
                }));
                setApprovals(mappedApprovals.length > 0 ? mappedApprovals : [{ ...initialApproval }]);

                // Recognition
                setRecognitionHeading(data.recognition?.recognitionHeading || "");
                setRecognitionDescription(data.recognition?.recognitionDescription || "");
                setCertificateImage_old(data.recognition?.certificateImage || "");
                setRecognitionPoints(
                    data.recognition?.recognitionPoints?.length > 0 ? data.recognition.recognitionPoints : [""]
                );

                // Admission
                setAdmissionHeading(data.admission?.admissionHeading || "");
                setAdmissionSubHeading(data.admission?.admissionSubHeading || "");
                setAdmissionDescription(data.admission?.admissionDescription || "");
                setAdmissionPoints(
                    data.admission?.admissionPoints?.length > 0 ? data.admission.admissionPoints : [""]
                );

                // FAQs
                const mappedFaqs = (data.faqs || []).map((f) => ({
                    question: f.question || "",
                    answer: f.answer || "",
                }));
                setFaqs(mappedFaqs.length > 0 ? mappedFaqs : [{ ...initialFaq }]);

                // Courses
                const mappedCourses = (data.courses || []).map((c) => ({
                    courseId: c.courseId || null,
                    courseSlug: c.courseSlug || "",
                    name: c.name || "",
                    duration: c.duration || "",
                    fees: c.fees || "",
                    details: c.details || "",
                    logo_old: c.logo || null,
                    logo: null,
                }));
                setCourses(mappedCourses.length > 0 ? mappedCourses : [{ ...initialCourse }]);

                // =====================================================
                // ✅ NEW SECTIONS PREFILL
                // =====================================================

                // 1. Career Vidya Benefits
                const cb = data.careerVidyaBenefits || {};
                setCareerVidyaHeading(cb.heading || "Career Vidya Benefits");
                setCareerVidyaSubHeading(cb.subHeading || "");
                setCareerVidyaDescription(cb.description || "");
                const mappedBenefits = (cb.benefits || []).map((b) => ({
                    title: b.title || "",
                    description: b.description || "",
                    icon_old: b.icon || null,
                    icon: null,
                }));
                setCareerBenefits(mappedBenefits.length > 0 ? mappedBenefits : [{ ...initialCareerBenefit }]);

                // 2. Eligibility
                const el = data.eligibility || {};
                setEligibilityHeading(el.heading || "Eligibility Criteria");
                setEligibilitySubHeading(el.subHeading || "");
                setEligibilityDescription(el.description || "");
                const mappedCriteria = (el.criteria || []).map((c) => ({
                    courseName: c.courseName || "",
                    requirement: c.requirement || "",
                }));
                setEligibilityCriteria(mappedCriteria.length > 0 ? mappedCriteria : [{ ...initialEligibilityCriterion }]);
                setEligibilityPoints(el.points?.length > 0 ? el.points : [""]);

                // 3. Exam Pattern
                const ep = data.examPattern || {};
                setExamPattern({
                    heading: ep.heading || "Examination Pattern",
                    subHeading: ep.subHeading || "",
                    description: ep.description || "",
                    mode: ep.mode || "",
                    duration: ep.duration || "",
                    totalMarks: ep.totalMarks || "",
                    passingMarks: ep.passingMarks || "",
                    questionTypes: ep.questionTypes?.length > 0 ? ep.questionTypes : [""],
                    points: ep.points?.length > 0 ? ep.points : [""],
                });

                // 4. LMS
                const lm = data.lms || {};
                setLms({
                    heading: lm.heading || "Learning Management System (LMS)",
                    subHeading: lm.subHeading || "",
                    description: lm.description || "",
                    features: lm.features?.length > 0 ? lm.features : [""],
                    image: null,
                    image_old: lm.image || null,
                });

                // 5. EMI Options
                const em = data.emiOptions || {};
                setEmiOptions({
                    heading: em.heading || "EMI & Education Loan Support",
                    subHeading: em.subHeading || "",
                    description: em.description || "",
                    lendersCount: em.lendersCount || "",
                    approvalTime: em.approvalTime || "",
                    noBankVisit: em.noBankVisit !== false,
                    emiStartingFrom: em.emiStartingFrom || "",
                    points: em.points?.length > 0 ? em.points : [""],
                    partners: em.partners?.length > 0 ? em.partners : [""],
                });

                setMessage("Data loaded successfully.");
            } catch (error) {
                console.error("Error fetching university data:", error);
                setDataLoadingError(true);
                setMessage(
                    "❌ Error loading university data: " +
                        (error.response?.data?.message || error.message)
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUniversityData();
    }, [universityId]);

    // =====================================================
    // SUBMIT
    // =====================================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!name.trim()) {
            setMessage("❌ University name is required.");
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();

            // Basic fields
            formData.append("name", name);
            formData.append("description", description);
            formData.append("youtubeLink", youtubeLink || "");
            formData.append("shareDescription", shareDescription || "");
            formData.append("cardDescription", cardDescription || "");

            // Background
            formData.append("backgroundDescription", backgroundDescription || "");
            formData.append("backgroundImage_old", backgroundImage_old || "");
            if (backgroundImage instanceof File)
                formData.append("backgroundImage", backgroundImage);

            // Headings
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

            // Arrays
            formData.append("points", JSON.stringify(filterEmptyObjects(points)));
            formData.append("factsPoints", JSON.stringify(filterEmptyObjects(factsPoints)));
            formData.append("recognitionPoints", JSON.stringify(filterEmptyObjects(recognitionPoints)));
            formData.append("admissionPoints", JSON.stringify(filterEmptyObjects(admissionPoints)));

            // FAQs
            const cleanedFaqs = faqs.filter((f) => f.question.trim() !== "" || f.answer.trim() !== "");
            formData.append("faqs", JSON.stringify(cleanedFaqs));

            // Single files
            if (universityImage instanceof File) formData.append("universityImage", universityImage);
            if (certificateImage instanceof File) formData.append("certificateImage", certificateImage);

            // Approvals
            const approvalsDataForBody = approvals.map((a) => ({
                name: a.name || "",
                hasLogo: a.logo instanceof File,
                logo_old: a.logo_old || null,
            }));
            formData.append("approvals", JSON.stringify(approvalsDataForBody));

            approvals.forEach((approval, index) => {
                if (approval.logo instanceof File) {
                    formData.append(`approvals[${index}][logo]`, approval.logo);
                }
            });

            // Courses
            const coursesDataForBody = courses.map(({ logo, ...rest }) => ({
                ...rest,
                hasLogo: logo instanceof File,
            }));
            formData.append("courses", JSON.stringify(coursesDataForBody));

            courses.forEach((course, index) => {
                if (course.logo instanceof File) {
                    formData.append(`courses[${index}][logo]`, course.logo);
                }
            });

            // =====================================================
            // ✅ NEW SECTIONS
            // =====================================================

            // 1. Career Vidya Benefits
            formData.append("careerVidyaHeading", careerVidyaHeading);
            formData.append("careerVidyaSubHeading", careerVidyaSubHeading);
            formData.append("careerVidyaDescription", careerVidyaDescription);

            const careerBenefitsForBody = careerBenefits.map(({ icon, ...rest }) => ({
                ...rest,
                hasIcon: icon instanceof File,
            }));
            formData.append("careerVidyaBenefits", JSON.stringify(filterEmptyObjects(careerBenefitsForBody)));

            careerBenefits.forEach((benefit, index) => {
                if (benefit.icon instanceof File) {
                    formData.append(`careerVidyaBenefits[${index}][icon]`, benefit.icon);
                }
            });

            // 2. Eligibility
            formData.append(
                "eligibility",
                JSON.stringify({
                    heading: eligibilityHeading,
                    subHeading: eligibilitySubHeading,
                    description: eligibilityDescription,
                    criteria: eligibilityCriteria.filter(
                        (c) => c.courseName.trim() !== "" || c.requirement.trim() !== ""
                    ),
                    points: filterEmptyObjects(eligibilityPoints),
                })
            );

            // 3. Exam Pattern
            formData.append(
                "examPattern",
                JSON.stringify({
                    ...examPattern,
                    questionTypes: filterEmptyObjects(examPattern.questionTypes),
                    points: filterEmptyObjects(examPattern.points),
                })
            );

            // 4. LMS
            formData.append(
                "lms",
                JSON.stringify({
                    heading: lms.heading,
                    subHeading: lms.subHeading,
                    description: lms.description,
                    features: filterEmptyObjects(lms.features),
                    image_old: lms.image_old || null,
                })
            );

            if (lms.image instanceof File) {
                formData.append("lmsImage", lms.image);
            }

            // 5. EMI Options
            formData.append(
                "emiOptions",
                JSON.stringify({
                    ...emiOptions,
                    points: filterEmptyObjects(emiOptions.points),
                    partners: filterEmptyObjects(emiOptions.partners),
                })
            );

            // API Call
            await api.put(`/api/v1/university/${universityId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("✅ University updated successfully!");
        } catch (error) {
            console.error("Submission Error:", error);
            setMessage(
                "❌ Error updating university: " +
                    (error.response?.data?.message || error.message)
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // RENDER STATES
    // =====================================================
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6 text-center text-xl font-semibold mt-20">
                🔄 Loading University Data...
            </div>
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

    // Shared classnames
    const labelCls = "block text-xs font-semibold mb-1 text-gray-700";
    const inputCls =
        "w-full border rounded-lg p-2 border-gray-300 text-sm focus:ring-2 focus:ring-blue-300 focus:outline-none";

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold text-[#A00000] mb-6 pb-3 border-b-2 border-red-200">
                ✍️ Edit University: {name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ========================= ROW 1: ABOUT + SEO ========================= */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* ABOUT */}
                    <div className="p-5 border border-blue-200 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#0056B3] border-b pb-2">1. About Us</h3>

                        {isValidUrl(universityImage_old) && (
                            <div className="mb-4 p-3 border border-blue-300 rounded-lg bg-blue-50 flex flex-col items-center">
                                <h4 className="font-semibold text-sm mb-2 text-blue-800">Current University Image</h4>
                                <div className="w-32 h-16 overflow-hidden">
                                    <img src={universityImage_old} alt="current" style={{ objectFit: "contain", width: "100%", height: "100%" }} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <div>
                                <label className={labelCls}>University Name *</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Delhi University" />
                            </div>
                            <div>
                                <label className={labelCls}>YouTube Video Link</label>
                                <input type="url" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className={inputCls} placeholder="https://www.youtube.com/watch?v=..." />
                            </div>
                            <div>
                                <label className={labelCls}>University Image</label>
                                <input type="file" accept="image/*" onChange={(e) => { setUniversityImage(e.target.files?.[0] || null); setUniversityImage_old(""); }} className="w-full text-sm text-gray-700 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-[#0056B3] hover:file:bg-blue-200 cursor-pointer" />
                            </div>
                            <div>
                                <label className={labelCls}>Main Description (Detailed)</label>
                                <RichTextField value={description} onChange={setDescription} placeholder="Detailed information about the university" />
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="p-5 border border-yellow-300 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#CC6600] border-b pb-2">2. SEO & Card Details</h3>
                        <div className="space-y-3">
                            <div>
                                <label className={labelCls}>Share Description (SEO)</label>
                                <RichTextField value={shareDescription} onChange={setShareDescription} placeholder="Short catchy description for sharing" />
                            </div>
                            <div>
                                <label className={labelCls}>Card Description With CV benifit</label>
                                <RichTextField value={cardDescription} onChange={setCardDescription} placeholder="Brief summary of the university" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================= ROW 2: BACKGROUND + HIGHLIGHTS ========================= */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* BACKGROUND */}
                    <div className="p-5 border border-indigo-300 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#4B0082] border-b pb-2">3. Background Section</h3>
                        <div className="space-y-3">
                            <div>
                                <label className={labelCls}>Background Image</label>
                                <input type="file" accept="image/*" onChange={(e) => { setBackgroundImage(e.target.files?.[0] || null); setBackgroundImage_old(""); }} className="w-full text-sm text-gray-700 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-100 file:text-[#4B0082] hover:file:bg-indigo-200 cursor-pointer" />
                                {isValidUrl(backgroundImage_old) && !backgroundImage && (
                                    <p className="text-xs text-gray-500 mt-1">Current: <a href={backgroundImage_old} target="_blank" rel="noreferrer" className="text-indigo-700 hover:underline">View Current</a></p>
                                )}
                            </div>
                            <div>
                                <label className={labelCls}>Background Description</label>
                                <RichTextField value={backgroundDescription} onChange={setBackgroundDescription} placeholder="History or background details of the university" />
                            </div>
                        </div>
                    </div>

                    {/* HIGHLIGHTS + FACTS */}
                    <div className="p-5 border border-green-300 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#006400] border-b pb-2">4. Career Outcome & Placement</h3>

                        <div className="p-3 border border-green-200 rounded-lg bg-green-50 mb-4">
                            <label className={labelCls}>Highlights Heading</label>
                            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className={`${inputCls} mb-3`} placeholder="e.g. Why Choose This University?" />
                            {points.map((point, index) => (
                                <div key={`p-${index}`} className="flex gap-2 mb-2 items-center">
                                    <input type="text" value={point} onChange={(e) => handlePointChange(index, e.target.value)} className={inputCls} placeholder={`Point ${index + 1}`} />
                                    {points.length > 1 && (
                                        <button type="button" onClick={() => removePoint(index)} className="text-red-600 text-xs px-2">✕</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addPoint} className="bg-[#006400] text-white px-3 py-1.5 rounded-lg text-xs mt-2">+ Add Highlight Point</button>
                        </div>

                        <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <input type="text" value={factsHeading} onChange={(e) => setFactsHeading(e.target.value)} className={inputCls} placeholder="Facts Heading" />
                                <input type="text" value={factsSubHeading} onChange={(e) => setFactsSubHeading(e.target.value)} className={inputCls} placeholder="Sub-Heading" />
                            </div>
                            {factsPoints.map((point, index) => (
                                <div key={`fp-${index}`} className="flex gap-2 mb-2 items-center">
                                    <input type="text" value={point} onChange={(e) => handleFactsPointChange(index, e.target.value)} className={inputCls} placeholder={`Fact ${index + 1}`} />
                                    {factsPoints.length > 1 && (
                                        <button type="button" onClick={() => removeFactsPoint(index)} className="text-red-600 text-xs px-2">✕</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addFactsPoint} className="bg-green-800 text-white px-3 py-1.5 rounded-lg text-xs mt-2">+ Add Fact Point</button>
                        </div>
                    </div>
                </div>

                {/* ========================= ROW 3: APPROVALS + RECOGNITION ========================= */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* APPROVALS */}
                    <div className="p-5 border border-red-300 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#A00000] border-b pb-2">5. University Approvals</h3>
                        {approvals.map((approval, index) => (
                            <div key={`a-${index}`} className="mb-3 p-3 border rounded-lg border-red-200 bg-red-50">
                                <div className="grid grid-cols-12 gap-2 items-center mb-2">
                                    <input type="text" value={approval.name} onChange={(e) => handleApprovalChange(index, "name", e.target.value)} className={`${inputCls} col-span-6`} placeholder="Approval Name" />
                                    <input type="file" accept="image/*" onChange={(e) => handleApprovalChange(index, "logo", e.target.files?.[0] || null)} className="col-span-4 text-[10px]" />
                                    {approvals.length > 1 && (
                                        <button type="button" onClick={() => removeApproval(index)} className="col-span-2 bg-red-500 text-white px-2 py-1 rounded text-xs">✕</button>
                                    )}
                                </div>
                                {approval.logo_old && !approval.logo && (
                                    <p className="text-xs text-gray-500">Current Logo: <a href={approval.logo_old} target="_blank" rel="noreferrer" className="text-red-700 hover:underline">View</a></p>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addApproval} className="bg-[#A00000] text-white px-3 py-1.5 rounded-lg text-xs mt-2">+ Add Another Approval</button>
                    </div>

                    {/* RECOGNITION */}
                    <div className="p-5 border border-teal-400 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#008080] border-b pb-2">6. University Recognition</h3>
                        <div className="space-y-3">
                            <input type="text" value={recognitionHeading} onChange={(e) => setRecognitionHeading(e.target.value)} className={inputCls} placeholder="Recognition Heading" />
                            <div>
                                <label className={labelCls}>Recognition Description</label>
                                <RichTextField value={recognitionDescription} onChange={setRecognitionDescription} placeholder="Recognition Description" />
                            </div>
                            {recognitionPoints.map((point, index) => (
                                <div key={`rp-${index}`} className="flex gap-2 items-center">
                                    <input type="text" value={point} onChange={(e) => handleRecognitionPointChange(index, e.target.value)} className={inputCls} />
                                    {recognitionPoints.length > 1 && (
                                        <button type="button" onClick={() => removeRecognitionPoint(index)} className="text-red-600 text-xs px-2">✕</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addRecognitionPoint} className="bg-[#008080] text-white px-3 py-1.5 rounded-lg text-xs">+ Add Recognition Point</button>
                            <div>
                                <label className={labelCls}>Certificate Image</label>
                                <input type="file" accept="image/*" onChange={(e) => { setCertificateImage(e.target.files?.[0] || null); setCertificateImage_old(""); }} className="block w-full text-sm" />
                                {certificateImage_old && !certificateImage && (
                                    <p className="text-xs text-gray-500 mt-1">Current Certificate: <a href={certificateImage_old} target="_blank" rel="noreferrer" className="text-teal-700 hover:underline">View</a></p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================= ROW 4: ADMISSION + FAQ ========================= */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* ADMISSION */}
                    <div className="p-5 border border-orange-400 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#FF4500] border-b pb-2">7. Admission Process</h3>
                        <div className="space-y-3">
                            <input type="text" value={admissionHeading} onChange={(e) => setAdmissionHeading(e.target.value)} className={inputCls} placeholder="Admission Heading" />
                            <input type="text" value={admissionSubHeading} onChange={(e) => setAdmissionSubHeading(e.target.value)} className={inputCls} placeholder="Sub-Heading" />
                            <div>
                                <label className={labelCls}>Admission Description</label>
                                <RichTextField value={admissionDescription} onChange={setAdmissionDescription} placeholder="Admission Description" />
                            </div>
                            {admissionPoints.map((point, index) => (
                                <div key={`ap-${index}`} className="flex gap-2 items-center">
                                    <input type="text" value={point} onChange={(e) => handleAdmissionPointChange(index, e.target.value)} className={inputCls} placeholder={`Step ${index + 1}`} />
                                    {admissionPoints.length > 1 && (
                                        <button type="button" onClick={() => removeAdmissionPoint(index)} className="text-red-600 text-xs px-2">✕</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addAdmissionPoint} className="bg-[#FF4500] text-white px-3 py-1.5 rounded-lg text-xs">+ Add Step</button>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="p-5 border border-indigo-400 rounded-xl bg-white shadow-md">
                        <h3 className="font-bold text-lg mb-4 text-[#4B0082] border-b pb-2">8. Frequently Asked Questions (FAQ)</h3>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                            {faqs.map((faq, index) => (
                                <div key={`faq-${index}`} className="p-3 border rounded-lg border-indigo-200 bg-indigo-50">
                                    <label className="block text-xs font-bold mb-1 text-indigo-700">Question {index + 1}</label>
                                    <input type="text" value={faq.question} onChange={(e) => handleFaqChange(index, "question", e.target.value)} className={`${inputCls} mb-3`} placeholder="Enter question..." />
                                    <label className="block text-xs font-bold mb-1 text-indigo-700">Answer</label>
                                    <RichTextField value={faq.answer} onChange={(val) => handleFaqChange(index, "answer", val)} placeholder="Enter answer..." />
                                    {faqs.length > 1 && (
                                        <button type="button" onClick={() => removeFaq(index)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs">✕ Remove</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addFaq} className="bg-[#4B0082] text-white px-3 py-1.5 rounded-lg text-xs mt-3">+ Add FAQ</button>
                    </div>
                </div>

                {/* =====================================================
                    ✅ ROW 5: CAREER VIDYA BENEFITS
                ===================================================== */}
                <div className="p-5 border border-pink-400 rounded-xl bg-white shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-[#C2185B] border-b pb-2">9. Career Vidya Benefits</h3>

                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className={labelCls}>Heading</label>
                            <input type="text" value={careerVidyaHeading} onChange={(e) => setCareerVidyaHeading(e.target.value)} className={inputCls} placeholder="Career Vidya Benefits" />
                        </div>
                        <div>
                            <label className={labelCls}>Sub Heading</label>
                            <input type="text" value={careerVidyaSubHeading} onChange={(e) => setCareerVidyaSubHeading(e.target.value)} className={inputCls} placeholder="Why Choose Us?" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className={labelCls}>Description</label>
                        <RichTextField value={careerVidyaDescription} onChange={setCareerVidyaDescription} placeholder="Description" />
                    </div>

                    <h4 className="font-bold text-sm mb-2 text-[#C2185B]">Benefits List</h4>

                    {careerBenefits.map((benefit, index) => (
                        <div key={`cb-${index}`} className="grid grid-cols-12 gap-2 items-start mb-3 p-3 border rounded-lg border-pink-200 bg-pink-50">
                            <div className="col-span-4">
                                <label className="block text-[10px] font-bold mb-1">Title</label>
                                <input type="text" value={benefit.title} onChange={(e) => handleCareerBenefitChange(index, "title", e.target.value)} className={inputCls} placeholder="Placement Support" />
                            </div>
                            <div className="col-span-4">
                                <label className="block text-[10px] font-bold mb-1">Description</label>
                                <input type="text" value={benefit.description} onChange={(e) => handleCareerBenefitChange(index, "description", e.target.value)} className={inputCls} placeholder="3000+ companies" />
                            </div>
                            <div className="col-span-3">
                                <label className="block text-[10px] font-bold mb-1">Icon</label>
                                <input type="file" accept="image/*" onChange={(e) => handleCareerBenefitChange(index, "icon", e.target.files?.[0] || null)} className="w-full text-[10px]" />
                                {benefit.icon_old && !benefit.icon && (
                                    <p className="text-[10px] text-gray-500 mt-1">Current: <a href={benefit.icon_old} target="_blank" rel="noreferrer" className="text-pink-700 hover:underline">View</a></p>
                                )}
                            </div>
                            <div className="col-span-1 pt-5">
                                {careerBenefits.length > 1 && (
                                    <button type="button" onClick={() => removeCareerBenefit(index)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">✕</button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addCareerBenefit} className="bg-[#C2185B] text-white px-3 py-1.5 rounded-lg text-xs">+ Add Benefit</button>
                </div>

                {/* =====================================================
                    ✅ ROW 6: ELIGIBILITY
                ===================================================== */}
                <div className="p-5 border border-cyan-400 rounded-xl bg-white shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-[#00838F] border-b pb-2">10. Eligibility</h3>

                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className={labelCls}>Heading</label>
                            <input type="text" value={eligibilityHeading} onChange={(e) => setEligibilityHeading(e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Sub Heading</label>
                            <input type="text" value={eligibilitySubHeading} onChange={(e) => setEligibilitySubHeading(e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className={labelCls}>Description</label>
                        <RichTextField value={eligibilityDescription} onChange={setEligibilityDescription} placeholder="Eligibility description" />
                    </div>

                    <h4 className="font-bold text-sm mb-2 text-[#00838F]">Course-wise Criteria</h4>

                    {eligibilityCriteria.map((criteria, index) => (
                        <div key={`ec-${index}`} className="grid grid-cols-12 gap-2 items-center mb-2 p-2 border rounded-lg border-cyan-200 bg-cyan-50">
                            <input type="text" value={criteria.courseName} onChange={(e) => handleEligibilityCriterionChange(index, "courseName", e.target.value)} className={`${inputCls} col-span-4`} placeholder="Course (e.g. MBA)" />
                            <input type="text" value={criteria.requirement} onChange={(e) => handleEligibilityCriterionChange(index, "requirement", e.target.value)} className={`${inputCls} col-span-7`} placeholder="Requirement (e.g. 50% in Bachelor's)" />
                            {eligibilityCriteria.length > 1 && (
                                <button type="button" onClick={() => removeEligibilityCriterion(index)} className="col-span-1 bg-red-500 text-white px-2 py-1 rounded text-xs">✕</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addEligibilityCriterion} className="bg-[#00838F] text-white px-3 py-1.5 rounded-lg text-xs mb-3">+ Add Course Criteria</button>

                    <div>
                        <label className={labelCls}>Additional Points</label>
                        {eligibilityPoints.map((point, index) => (
                            <div key={`ep-${index}`} className="flex gap-2 mb-2 items-center">
                                <input type="text" value={point} onChange={(e) => handleEligibilityPointChange(index, e.target.value)} className={inputCls} />
                                {eligibilityPoints.length > 1 && (
                                    <button type="button" onClick={() => removeEligibilityPoint(index)} className="text-red-600 text-xs px-2">✕</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addEligibilityPoint} className="bg-[#00838F] text-white px-3 py-1.5 rounded-lg text-xs">+ Add Point</button>
                    </div>
                </div>

                {/* =====================================================
                    ✅ ROW 7: EXAM PATTERN
                ===================================================== */}
                <div className="p-5 border border-amber-400 rounded-xl bg-white shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-[#B45309] border-b pb-2">11. Examination Pattern</h3>

                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className={labelCls}>Heading</label>
                            <input type="text" value={examPattern.heading} onChange={(e) => handleExamPatternChange("heading", e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Sub Heading</label>
                            <input type="text" value={examPattern.subHeading} onChange={(e) => handleExamPatternChange("subHeading", e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className={labelCls}>Description</label>
                        <RichTextField value={examPattern.description} onChange={(val) => handleExamPatternChange("description", val)} placeholder="Exam pattern description" />
                    </div>

                    <div className="grid md:grid-cols-4 gap-3 mb-3">
                        <div>
                            <label className={labelCls}>Mode</label>
                            <input type="text" value={examPattern.mode} onChange={(e) => handleExamPatternChange("mode", e.target.value)} className={inputCls} placeholder="Online Proctored" />
                        </div>
                        <div>
                            <label className={labelCls}>Duration</label>
                            <input type="text" value={examPattern.duration} onChange={(e) => handleExamPatternChange("duration", e.target.value)} className={inputCls} placeholder="2 Hours" />
                        </div>
                        <div>
                            <label className={labelCls}>Total Marks</label>
                            <input type="text" value={examPattern.totalMarks} onChange={(e) => handleExamPatternChange("totalMarks", e.target.value)} className={inputCls} placeholder="100" />
                        </div>
                        <div>
                            <label className={labelCls}>Passing Marks</label>
                            <input type="text" value={examPattern.passingMarks} onChange={(e) => handleExamPatternChange("passingMarks", e.target.value)} className={inputCls} placeholder="40" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Question Types</label>
                            {examPattern.questionTypes.map((q, index) => (
                                <div key={`qt-${index}`} className="flex gap-2 mb-2 items-center">
                                    <input type="text" value={q} onChange={(e) => handleExamQuestionTypeChange(index, e.target.value)} className={inputCls} placeholder="MCQ, Descriptive..." />
                                    {examPattern.questionTypes.length > 1 && (
                                        <button type="button" onClick={() => removeExamQuestionType(index)} className="text-red-600 text-xs px-2">✕</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addExamQuestionType} className="bg-[#B45309] text-white px-3 py-1.5 rounded-lg text-xs">+ Add Question Type</button>
                        </div>

                        <div>
                            <label className={labelCls}>Additional Points</label>
                            {examPattern.points.map((p, index) => (
                                <div key={`ep-${index}`} className="flex gap-2 mb-2 items-center">
                                    <input type="text" value={p} onChange={(e) => handleExamPointChange(index, e.target.value)} className={inputCls} />
                                    {examPattern.points.length > 1 && (
                                        <button type="button" onClick={() => removeExamPoint(index)} className="text-red-600 text-xs px-2">✕</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addExamPoint} className="bg-[#B45309] text-white px-3 py-1.5 rounded-lg text-xs">+ Add Point</button>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    ✅ ROW 8: LMS
                ===================================================== */}
                <div className="p-5 border border-lime-400 rounded-xl bg-white shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-[#4D7C0F] border-b pb-2">12. LMS (Learning Management System)</h3>

                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className={labelCls}>Heading</label>
                            <input type="text" value={lms.heading} onChange={(e) => handleLmsChange("heading", e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Sub Heading</label>
                            <input type="text" value={lms.subHeading} onChange={(e) => handleLmsChange("subHeading", e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className={labelCls}>Description</label>
                        <RichTextField value={lms.description} onChange={(val) => handleLmsChange("description", val)} placeholder="LMS description" />
                    </div>

                    <div className="mb-3">
                        <label className={labelCls}>LMS Image</label>
                        <input type="file" accept="image/*" onChange={(e) => handleLmsChange("image", e.target.files?.[0] || null)} className="w-full text-sm" />
                        {lms.image_old && !lms.image && (
                            <p className="text-xs text-gray-500 mt-1">Current: <a href={lms.image_old} target="_blank" rel="noreferrer" className="text-lime-700 hover:underline">View</a></p>
                        )}
                    </div>

                    <label className={labelCls}>Features</label>
                    {lms.features.map((f, index) => (
                        <div key={`lf-${index}`} className="flex gap-2 mb-2 items-center">
                            <input type="text" value={f} onChange={(e) => handleLmsFeatureChange(index, e.target.value)} className={inputCls} placeholder="Live Classes, E-Books..." />
                            {lms.features.length > 1 && (
                                <button type="button" onClick={() => removeLmsFeature(index)} className="text-red-600 text-xs px-2">✕</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addLmsFeature} className="bg-[#4D7C0F] text-white px-3 py-1.5 rounded-lg text-xs">+ Add Feature</button>
                </div>

                {/* =====================================================
                    ✅ ROW 9: EMI OPTIONS
                ===================================================== */}
                <div className="p-5 border border-violet-400 rounded-xl bg-white shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-[#6D28D9] border-b pb-2">13. EMI & Education Loan Support</h3>

                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className={labelCls}>Heading</label>
                            <input type="text" value={emiOptions.heading} onChange={(e) => handleEmiChange("heading", e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Sub Heading</label>
                            <input type="text" value={emiOptions.subHeading} onChange={(e) => handleEmiChange("subHeading", e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className={labelCls}>Description</label>
                        <RichTextField value={emiOptions.description} onChange={(val) => handleEmiChange("description", val)} placeholder="EMI description" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-3 mb-3">
                        <div>
                            <label className={labelCls}>Lenders Count</label>
                            <input type="text" value={emiOptions.lendersCount} onChange={(e) => handleEmiChange("lendersCount", e.target.value)} className={inputCls} placeholder="20+ Lenders" />
                        </div>
                        <div>
                            <label className={labelCls}>Approval Time</label>
                            <input type="text" value={emiOptions.approvalTime} onChange={(e) => handleEmiChange("approvalTime", e.target.value)} className={inputCls} placeholder="24 hours" />
                        </div>
                        <div>
                            <label className={labelCls}>EMI Starting From</label>
                            <input type="text" value={emiOptions.emiStartingFrom} onChange={(e) => handleEmiChange("emiStartingFrom", e.target.value)} className={inputCls} placeholder="₹5,000/month" />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="flex items-center gap-2 text-sm font-semibold">
                            <input type="checkbox" checked={emiOptions.noBankVisit} onChange={(e) => handleEmiChange("noBankVisit", e.target.checked)} />
                            No Bank Visit Required
                        </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Partners</label>
                            {emiOptions.partners.map((p, index) => (
                                <div key={`ep-${index}`} className="flex gap-2 mb-2 items-center">
                                    <input type="text" value={p} onChange={(e) => handleEmiPartnerChange(index, e.target.value)} className={inputCls} placeholder="HDFC, ICICI..." />
                                    {emiOptions.partners.length > 1 && (
                                        <button type="button" onClick={() => removeEmiPartner(index)} className="text-red-600 text-xs px-2">✕</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addEmiPartner} className="bg-[#6D28D9] text-white px-3 py-1.5 rounded-lg text-xs">+ Add Partner</button>
                        </div>

                        <div>
                            <label className={labelCls}>Additional Points</label>
                            {emiOptions.points.map((p, index) => (
                                <div key={`ep-${index}`} className="flex gap-2 mb-2 items-center">
                                    <input type="text" value={p} onChange={(e) => handleEmiPointChange(index, e.target.value)} className={inputCls} />
                                    {emiOptions.points.length > 1 && (
                                        <button type="button" onClick={() => removeEmiPoint(index)} className="text-red-600 text-xs px-2">✕</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addEmiPoint} className="bg-[#6D28D9] text-white px-3 py-1.5 rounded-lg text-xs">+ Add Point</button>
                        </div>
                    </div>
                </div>

                {/* =========================
                    COURSE MANAGEMENT
                ========================== */}
                <div className="p-5 border border-purple-300 rounded-xl bg-white shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-[#6A0DAD] border-b pb-2">14. Course Management</h3>

                    <div className="p-4 border border-gray-300 rounded-xl bg-gray-50">
                        <h4 className="font-bold text-md mb-3 text-[#0056B3]">Final Courses List ({courses.length})</h4>

                        {courses.map((course, index) => (
                            <div key={`c-${index}`} className="mb-4 p-3 border rounded-lg border-gray-200 bg-white shadow-sm">
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <div>
                                        <label className="block text-[10px] font-bold mb-1">Name</label>
                                        <input type="text" value={course.name} onChange={(e) => handleCourseChange(index, "name", e.target.value)} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold mb-1 text-blue-600">Course Slug</label>
                                        <input type="text" value={course.courseSlug} onChange={(e) => handleCourseChange(index, "courseSlug", e.target.value)} className={`${inputCls} border-blue-200`} placeholder="mba-online" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold mb-1">Duration</label>
                                        <input type="text" value={course.duration} onChange={(e) => handleCourseChange(index, "duration", e.target.value)} className={inputCls} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <div>
                                        <label className="block text-[10px] font-bold mb-1">Fees</label>
                                        <input type="text" value={course.fees} onChange={(e) => handleCourseChange(index, "fees", e.target.value)} className={inputCls} placeholder="₹ 50,000 / Year" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold mb-1">Details</label>
                                        <input type="text" value={course.details} onChange={(e) => handleCourseChange(index, "details", e.target.value)} className={inputCls} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <label className="block text-[10px] font-bold mb-1">Course Logo</label>
                                        <input type="file" accept="image/*" onChange={(e) => handleCourseChange(index, "logo", e.target.files?.[0] || null)} className="w-full text-[10px]" />
                                        {course.logo_old && !course.logo && (
                                            <p className="text-[10px] text-gray-500 mt-1">Current: <a href={course.logo_old} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline">View</a></p>
                                        )}
                                    </div>
                                    <div className="flex items-end">
                                        {courses.length > 1 && (
                                            <button type="button" onClick={() => removeCourse(index)} className="w-full bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs">✕ Remove Course</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button type="button" onClick={addCourse} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 mt-4">+ Add Another Course Manually</button>
                    </div>
                </div>

                {/* =========================
                    SUBMIT BAR (Sticky)
                ========================== */}
                <div className="sticky bottom-4 bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <button type="submit" disabled={submitting} className="flex-1 bg-[#A00000] text-white py-3 rounded-lg text-base font-semibold hover:bg-red-700 transition disabled:bg-gray-400 shadow-lg">
                            {submitting ? "Updating..." : "💾 Update University Data"}
                        </button>
                    </div>
                    {message && (
                        <p className={`text-center mt-3 text-sm font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                            {message}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}