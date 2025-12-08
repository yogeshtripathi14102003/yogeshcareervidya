


"use client";

import { useState, useEffect } from "react";
// Removed useRouter since we are using props and callbacks for modal flow
// import { useRouter } from "next/navigation"; 
import api from "@/utlis/api.js"; // Adjust path as necessary

// --- Utility Functions ---
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

// --- Default States for Complex Fields ---
const defaultOverview = { heading: "", description: "", image: null, image_old: null, videoLink: "" };
const defaultWhyChooseUs = { image: null, image_old: null, description: "" };
const defaultTopUniversity = { name: "", description: "" };
const defaultKeyHighlight = { heading: "", subHeading: "", description: "" };
const defaultSyllabus = { semester: "", subjects: [""] };
const defaultOfferedCourse = { heading: "", points: [""] };
const defaultEligibility = { heading: "", description: "", subHeading: "", subDescription: "" };
const defaultFeeSidebar = { heading: "", points: [""] };
const defaultDetailedFeeTable = { universityName: "", courseFees: "", detailedFeeStructure: "" };
const defaultDetailedFee = { heading: "", description: "", table: [defaultDetailedFeeTable] };
const defaultWorthItTopic = { subHeading: "", description: "" };
const defaultJobOpportunity = { heading: "", description: "", jobPost: "", salary: "" };
const defaultRecruiter = { companyName: "", packageOffered: "" };


// 🚨 The Component is now designed to accept props, NOT Next.js routing params.
export default function Editcourse({ courseId, onClose, onUpdated }) {
    
    // --- 1. CORE & BASIC DATA ---
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [duration, setDuration] = useState("");
    const [tag, setTag] = useState("");
    const [specializations, setSpecializations] = useState([""]);
    const [courseLogo, setCourseLogo] = useState(null);
    const [courseLogo_old, setCourseLogo_old] = useState("");
    
    // --- 2. OVERVIEW & WHY CHOOSE US ---
    const [overview, setOverview] = useState([defaultOverview]);
    const [whyChooseUs, setWhyChooseUs] = useState([defaultWhyChooseUs]);
    const [goodThings, setGoodThings] = useState([""]);
    
    // --- 3. TOP UNIVERSITIES & HIGHLIGHTS ---
    const [topUniversities, setTopUniversities] = useState([defaultTopUniversity]);
    const [keyHighlights, setKeyHighlights] = useState([defaultKeyHighlight]);
    
    // --- 4. SYLLABUS & OFFERED COURSES ---
    const [syllabus, setSyllabus] = useState([defaultSyllabus]);
    const [syllabusPdf, setSyllabusPdf] = useState(null);
    const [syllabusPdf_old, setSyllabusPdf_old] = useState("");
    const [offeredCourses, setOfferedCourses] = useState([defaultOfferedCourse]);

    // --- 5. ELIGIBILITY & WORTH IT ---
    const [onlineEligibility, setOnlineEligibility] = useState([defaultEligibility]);
    const [worthItDescription, setWorthItDescription] = useState("");
    const [worthItTopics, setWorthItTopics] = useState([defaultWorthItTopic]);
    const [worthItImage, setWorthItImage] = useState(null);
    const [worthItImage_old, setWorthItImage_old] = useState("");

    // --- 6. FEES ---
    const [feeSidebar, setFeeSidebar] = useState([defaultFeeSidebar]);
    const [detailedFees, setDetailedFees] = useState([defaultDetailedFee]);

    // --- 7. PLACEMENTS ---
    const [jobOpportunities, setJobOpportunities] = useState([defaultJobOpportunity]);
    const [topRecruiters, setTopRecruiters] = useState([defaultRecruiter]);


    // --- Utility States ---
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [dataLoadingError, setDataLoadingError] = useState(false);
    
    // ######################################################################
    // 1. DATA AUTOFULL (FETCH) LOGIC
    // ######################################################################
    useEffect(() => {
        // 🚨 This is the key fix: courseId comes from props, not params.
        if (!courseId) {
            setDataLoadingError(true);
            setMessage("Error: Course ID is missing.");
            setLoading(false);
            return;
        }

        const fetchCourseData = async () => {
            try {
                setLoading(true);
                // Use the prop courseId for the API call
                const response = await api.get(`/api/v1/course/${courseId}`);
                const data = response.data?.data || {};

                // --- DATA MAPPING LOGIC (Same as before) ---
                setName(data.name || "");
                setCategory(data.category || "");
                setDuration(data.duration || "");
                setTag(data.tag || "");
                setSpecializations(
                    data.specializations?.length > 0 ? data.specializations : [""]
                );
                setCourseLogo_old(data.courseLogo?.url || "");

                const mapImageFields = (arr, defaultObj) => (arr || []).map(item => ({ 
                    ...defaultObj, 
                    ...item, 
                    image_old: item.image?.url || null, 
                    image: null 
                }));

                setOverview(mapImageFields(data.overview, defaultOverview).length > 0 ? mapImageFields(data.overview, defaultOverview) : [defaultOverview]);
                setWhyChooseUs(mapImageFields(data.whyChooseUs, defaultWhyChooseUs).length > 0 ? mapImageFields(data.whyChooseUs, defaultWhyChooseUs) : [defaultWhyChooseUs]);
                setGoodThings(data.goodThings?.length > 0 ? data.goodThings : [""]);

                setTopUniversities(data.topUniversities?.length > 0 ? data.topUniversities : [defaultTopUniversity]);
                setKeyHighlights(data.keyHighlights?.length > 0 ? data.keyHighlights : [defaultKeyHighlight]);

                setSyllabus(
                    (data.syllabus || []).map(s => ({ ...s, subjects: s.subjects?.length > 0 ? s.subjects : [""] })) || [defaultSyllabus]
                );
                setSyllabusPdf_old(data.syllabusPdf?.url || "");
                setOfferedCourses(
                    (data.offeredCourses || []).map(oc => ({ ...oc, points: oc.points?.length > 0 ? oc.points : [""] })) || [defaultOfferedCourse]
                );

                setOnlineEligibility(data.onlineEligibility?.length > 0 ? data.onlineEligibility : [defaultEligibility]);
                setWorthItDescription(data.onlineCourseWorthIt?.description || "");
                setWorthItTopics(data.onlineCourseWorthIt?.topics?.length > 0 ? data.onlineCourseWorthIt.topics : [defaultWorthItTopic]);
                setWorthItImage_old(data.onlineCourseWorthIt?.image?.url || "");

                setFeeSidebar(
                    (data.feeStructureSidebar || []).map(item => ({ ...item, points: item.points?.length > 0 ? item.points : [""] })) || [defaultFeeSidebar]
                );
                setDetailedFees(
                    (data.detailedFees || []).map(item => ({ 
                        ...item, 
                        table: item.table?.length > 0 ? item.table : [defaultDetailedFeeTable] 
                    })) || [defaultDetailedFee]
                );

                setJobOpportunities(data.jobOpportunities?.length > 0 ? data.jobOpportunities : [defaultJobOpportunity]);
                setTopRecruiters(data.topRecruiters?.length > 0 ? data.topRecruiters : [defaultRecruiter]);

                setMessage("Course data loaded successfully.");
            } catch (error) {
                console.error("Error fetching course data:", error);
                setDataLoadingError(true);
                setMessage("❌ Error loading course data: " + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    // ######################################################################
    // 2. DYNAMIC LIST HANDLERS (Same as before)
    // ######################################################################

    const handleStringArrayChange = (setter) => (index, value) => {
        setter(prev => prev.map((item, i) => (i === index ? value : item)));
    };
    const handleStringArrayAdd = (setter, defaultValue) => () => {
        setter(prev => [...prev, defaultValue]);
    };
    const handleStringArrayRemove = (setter) => (index) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const handleObjectArrayChange = (setter) => (index, field, value) => {
        setter(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };
    const handleObjectArrayFileChange = (setter) => (index, field, file) => {
        setter(prev => prev.map((item, i) => (i === index ? { ...item, [field]: file, [`${field}_old`]: null } : item)));
    };
    const handleObjectArrayAdd = (setter, defaultObj) => () => {
        setter(prev => [...prev, defaultObj]);
    };
    const handleObjectArrayRemove = (setter) => (index) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleSyllabusChange = (index, field, value) => {
        setSyllabus(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };
    const handleSubjectChange = (semesterIndex, subjectIndex, value) => {
        setSyllabus(prev => prev.map((s, i) => 
            i === semesterIndex ? { ...s, subjects: s.subjects.map((sub, j) => (j === subjectIndex ? value : sub)) } : s
        ));
    };
    const addSubject = (index) => {
        setSyllabus(prev => prev.map((s, i) => (i === index ? { ...s, subjects: [...s.subjects, ""] } : s)));
    };
    const removeSubject = (semesterIndex, subjectIndex) => {
        setSyllabus(prev => prev.map((s, i) => 
            i === semesterIndex ? { ...s, subjects: s.subjects.filter((_, j) => j !== subjectIndex) } : s
        ));
    };

    const handleOfferedCourseChange = (index, field, value) => {
        setOfferedCourses(prev => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
    };
    const handleOfferedCoursePointChange = (blockIndex, pointIndex, value) => {
        setOfferedCourses(prev => prev.map((oc, i) => 
            i === blockIndex ? { ...oc, points: oc.points.map((p, j) => (j === pointIndex ? value : p)) } : oc
        ));
    };
    const addOfferedCoursePoint = (index) => {
        setOfferedCourses(prev => prev.map((oc, i) => (i === index ? { ...oc, points: [...oc.points, ""] } : oc)));
    };
    const removeOfferedCoursePoint = (blockIndex, pointIndex) => {
        setOfferedCourses(prev => prev.map((oc, i) => 
            i === blockIndex ? { ...oc, points: oc.points.filter((_, j) => j !== pointIndex) } : oc
        ));
    };

    const handleDetailedFeesTableChange = (sectionIndex, rowIndex, field, value) => {
        setDetailedFees(prev => prev.map((section, si) =>
            si === sectionIndex ? { ...section, table: section.table.map((row, ri) => 
                ri === rowIndex ? { ...row, [field]: value } : row
            ) } : section
        ));
    };
    const addDetailedFeesTable = (sectionIndex) => {
        setDetailedFees(prev => prev.map((section, si) =>
            si === sectionIndex ? { ...section, table: [...section.table, defaultDetailedFeeTable] } : section
        ));
    };
    const removeDetailedFeesTable = (sectionIndex, rowIndex) => {
        setDetailedFees(prev => prev.map((section, si) =>
            si === sectionIndex ? { ...section, table: section.table.filter((_, ri) => ri !== rowIndex) } : section
        ));
    };


    // ######################################################################
    // 3. SUBMIT HANDLER
    // ######################################################################
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const formData = new FormData();

            const prepareArrayForSubmission = (arr, fileFieldName) => {
                const data = arr.map(item => ({
                    ...item,
                    // Use "new_file" placeholder if a file object is present, otherwise use old URL or null
                    [fileFieldName]: item[fileFieldName] instanceof File ? "new_file" : item[`${fileFieldName}_old`] || null,
                }));
                arr.forEach((item, index) => {
                    if (item[fileFieldName] instanceof File) {
                        formData.append(`${fileFieldName}[${index}]`, item[fileFieldName]);
                    }
                });
                return JSON.stringify(filterEmptyObjects(data));
            };

            // --- 1. CORE & BASIC DATA ---
            formData.append("name", name);
            formData.append("category", category);
            formData.append("duration", duration);
            formData.append("tag", tag);
            formData.append("specializations", JSON.stringify(filterEmptyObjects(specializations)));
            formData.append("courseLogo_old", courseLogo_old || "");
            if (courseLogo instanceof File) formData.append("courseLogo", courseLogo);

            // --- 2. OVERVIEW & WHY CHOOSE US ---
            formData.append("overview", prepareArrayForSubmission(overview, "image"));
            formData.append("whyChooseUs", prepareArrayForSubmission(whyChooseUs, "image"));
            formData.append("goodThings", JSON.stringify(filterEmptyObjects(goodThings)));

            // --- 3. TOP UNIVERSITIES & HIGHLIGHTS ---
            formData.append("topUniversities", JSON.stringify(filterEmptyObjects(topUniversities)));
            formData.append("keyHighlights", JSON.stringify(filterEmptyObjects(keyHighlights)));

            // --- 4. SYLLABUS & OFFERED COURSES ---
            const cleanedSyllabus = syllabus.map(s => ({ ...s, subjects: filterEmptyObjects(s.subjects) }));
            formData.append("syllabus", JSON.stringify(filterEmptyObjects(cleanedSyllabus)));
            
            formData.append("syllabusPdf_old", syllabusPdf_old || "");
            if (syllabusPdf instanceof File) formData.append("syllabusPdf", syllabusPdf);

            const cleanedOfferedCourses = offeredCourses.map(oc => ({ ...oc, points: filterEmptyObjects(oc.points) }));
            formData.append("offeredCourses", JSON.stringify(filterEmptyObjects(cleanedOfferedCourses)));

            // --- 5. ELIGIBILITY & WORTH IT ---
            formData.append("onlineEligibility", JSON.stringify(filterEmptyObjects(onlineEligibility)));
            
            const worthItData = {
                description: worthItDescription,
                topics: filterEmptyObjects(worthItTopics),
                // Pass a placeholder if a new file exists, otherwise old URL or null
                image: worthItImage instanceof File ? "new_file" : worthItImage_old || null
            };
            formData.append("onlineCourseWorthIt", JSON.stringify(worthItData));
            if (worthItImage instanceof File) formData.append("worthItImage", worthItImage);

            // --- 6. FEES ---
            const cleanedFeeSidebar = feeSidebar.map(item => ({...item, points: filterEmptyObjects(item.points)}));
            formData.append("feeStructureSidebar", JSON.stringify(filterEmptyObjects(cleanedFeeSidebar)));

            const cleanedDetailedFees = detailedFees.map(section => ({...section, table: filterEmptyObjects(section.table)}));
            formData.append("detailedFees", JSON.stringify(filterEmptyObjects(cleanedDetailedFees)));

            // --- 7. PLACEMENTS ---
            formData.append("jobOpportunities", JSON.stringify(filterEmptyObjects(jobOpportunities)));
            formData.append("topRecruiters", JSON.stringify(filterEmptyObjects(topRecruiters)));


            // PUT request to update, using the prop courseId
            const response = await api.put(`/api/v1/course/${courseId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("✅ Course updated successfully!");
            onUpdated(); // Call the update callback to refresh the list table
            // onClose(); // Optionally close the modal upon success
        } catch (error) {
            console.error("Submission Error:", error);
            setMessage(
                "❌ Error updating course: " +
                (error.response?.data?.error || error.response?.data?.message || error.message)
            );
        } finally {
            setLoading(false);
        }
    };


    // ######################################################################
    // 4. RENDER LOGIC
    // ######################################################################

    if (loading && !dataLoadingError) {
        return <div className="max-w-4xl w-full p-8 text-center text-xl font-semibold bg-white rounded-xl">🔄 Loading Course Data...</div>;
    }

    if (dataLoadingError) {
        return (
            <div className="max-w-4xl w-full p-8 text-center text-xl font-semibold bg-white rounded-xl">
                🛑 Failed to load data. {message}
                <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm block mx-auto mt-4">
                    Close
                </button>
            </div>
        );
    }
    
    // Main form render
    return (
        <div className="max-w-6xl w-full mx-auto p-8 bg-white shadow-2xl rounded-xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-extrabold text-[#002D62]">✍️ Edit Course: {name}</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-semibold">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* 1. CORE DETAILS & METADATA */}
                <div className="p-6 border border-blue-400 rounded-xl bg-blue-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#002D62]">1. Core Details & Metadata</h3>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Course Name *" required />
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Category *" required />
                        <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Duration *" required />
                        <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300" placeholder="Tag (e.g., Popular)" />
                    </div>
                    
                    <h4 className="font-semibold text-lg mt-4 mb-2 text-blue-800">Specializations</h4>
                    {specializations.map((spec, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center">
                            <input type="text" value={spec} onChange={(e) => handleStringArrayChange(setSpecializations)(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Specialization ${index + 1}`} />
                            {specializations.length > 1 && (<button type="button" onClick={() => handleStringArrayRemove(setSpecializations)(index)} className="text-red-600 hover:text-red-800">Remove</button>)}
                        </div>
                    ))}
                    <button type="button" onClick={handleStringArrayAdd(setSpecializations, "")} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 mt-2 shadow-md">+ Add Specialization</button>

                    <div className="mt-6 pt-4 border-t border-blue-200">
                        <label className="block font-medium mb-1">Course Logo</label>
                        <input type="file" accept="image/*" onChange={(e) => { setCourseLogo(e.target.files[0]); setCourseLogo_old(null); }} className="w-full text-gray-700 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-[#002D62] hover:file:bg-blue-200 cursor-pointer" />
                        {courseLogo_old && !courseLogo && (<p className="text-sm text-gray-500 mt-1">Current Logo: <span className="font-semibold text-blue-700">Present</span></p>)}
                    </div>
                </div>
                
                {/* 2. OVERVIEW & WHY CHOOSE US */}
                <div className="p-6 border border-green-400 rounded-xl bg-green-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#006400]">2. Overview & Selling Points</h3>
                    
                    {/* Overview Section */}
                    <h4 className="font-semibold text-lg mb-3 text-green-800 border-b pb-2">Course Overview Blocks</h4>
                    {overview.map((item, index) => (
                        <div key={`o-${index}`} className="p-4 mb-4 border border-green-200 rounded-lg bg-white shadow-inner grid md:grid-cols-4 gap-4 items-end">
                            <input type="text" value={item.heading} onChange={(e) => handleObjectArrayChange(setOverview)(index, "heading", e.target.value)} className="border rounded-lg p-2 col-span-2" placeholder="Heading *" required />
                            <input type="url" value={item.videoLink} onChange={(e) => handleObjectArrayChange(setOverview)(index, "videoLink", e.target.value)} className="border rounded-lg p-2 col-span-2" placeholder="YouTube Video Link" />
                            <textarea rows="2" value={item.description} onChange={(e) => handleObjectArrayChange(setOverview)(index, "description", e.target.value)} className="border rounded-lg p-2 col-span-4" placeholder="Description *" required />
                            <div className="col-span-3">
                                <label className="block text-sm font-medium mb-1">Image</label>
                                <input type="file" accept="image/*" onChange={(e) => handleObjectArrayFileChange(setOverview)(index, "image", e.target.files[0])} className="w-full text-gray-700 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-100 file:text-green-700 cursor-pointer" />
                                {item.image_old && !item.image && (<p className="text-xs text-gray-500 mt-1">Current Image: <span className="text-green-700">Present</span></p>)}
                            </div>
                            <div className="col-span-1">
                                {overview.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setOverview)(index)} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600">Remove</button>)}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setOverview, defaultOverview)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition mt-2 shadow-md">+ Add Overview Block</button>

                    {/* Why Choose Us Section */}
                    <h4 className="font-semibold text-lg mt-8 mb-3 text-green-800 border-b pb-2">Why Choose Us Points</h4>
                    {whyChooseUs.map((item, index) => (
                        <div key={`wc-${index}`} className="p-4 mb-4 border border-green-200 rounded-lg bg-white shadow-inner grid md:grid-cols-4 gap-4 items-end">
                            <textarea rows="2" value={item.description} onChange={(e) => handleObjectArrayChange(setWhyChooseUs)(index, "description", e.target.value)} className="border rounded-lg p-2 col-span-2" placeholder="Description *" required />
                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Image</label>
                                <input type="file" accept="image/*" onChange={(e) => handleObjectArrayFileChange(setWhyChooseUs)(index, "image", e.target.files[0])} className="w-full text-gray-700 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-100 file:text-green-700 cursor-pointer" />
                                {item.image_old && !item.image && (<p className="text-xs text-gray-500 mt-1">Current Image: <span className="text-green-700">Present</span></p>)}
                            </div>
                            <div className="col-span-1">
                                {whyChooseUs.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setWhyChooseUs)(index)} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600">Remove</button>)}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setWhyChooseUs, defaultWhyChooseUs)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition mt-2 shadow-md">+ Add Why Choose Point</button>

                    {/* Good Things (Simple List) */}
                    <h4 className="font-semibold text-lg mt-8 mb-3 text-green-800 border-b pb-2">Quick Good Things List</h4>
                    {goodThings.map((item, index) => (
                        <div key={`gt-${index}`} className="flex gap-2 mb-2 items-center">
                            <input type="text" value={item} onChange={(e) => handleStringArrayChange(setGoodThings)(index, e.target.value)} className="w-full border rounded-lg p-2 border-gray-300" placeholder={`Good Thing ${index + 1}`} />
                            {goodThings.length > 1 && (<button type="button" onClick={() => handleStringArrayRemove(setGoodThings)(index)} className="text-red-600 hover:text-red-800">Remove</button>)}
                        </div>
                    ))}
                    <button type="button" onClick={handleStringArrayAdd(setGoodThings, "")} className="bg-green-800 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-900 mt-2 shadow-md">+ Add Good Thing</button>
                </div>

                {/* 3. TOP UNIVERSITIES & HIGHLIGHTS */}
                <div className="p-6 border border-yellow-400 rounded-xl bg-yellow-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#CC6600]">3. Key Highlights & Top Universities</h3>

                    {/* Key Highlights Section */}
                    <h4 className="font-semibold text-lg mb-3 text-yellow-800 border-b pb-2">Key Highlights</h4>
                    {keyHighlights.map((item, index) => (
                        <div key={`kh-${index}`} className="p-4 mb-4 border border-yellow-200 rounded-lg bg-white shadow-inner grid md:grid-cols-4 gap-4 items-end">
                            <input type="text" value={item.heading} onChange={(e) => handleObjectArrayChange(setKeyHighlights)(index, "heading", e.target.value)} className="border rounded-lg p-2 col-span-2" placeholder="Main Heading *" required />
                            <input type="text" value={item.subHeading} onChange={(e) => handleObjectArrayChange(setKeyHighlights)(index, "subHeading", e.target.value)} className="border rounded-lg p-2 col-span-2" placeholder="Sub-Heading" />
                            <textarea rows="2" value={item.description} onChange={(e) => handleObjectArrayChange(setKeyHighlights)(index, "description", e.target.value)} className="border rounded-lg p-2 col-span-3" placeholder="Description" />
                            <div className="flex items-center justify-end">
                                {keyHighlights.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setKeyHighlights)(index)} className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600">Remove</button>)}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setKeyHighlights, defaultKeyHighlight)} className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition mt-2 shadow-md">+ Add Key Highlight</button>
                    
                    {/* Top Universities Section */}
                    <h4 className="font-semibold text-lg mt-8 mb-3 text-yellow-800 border-b pb-2">Top Universities Offering This Course</h4>
                    {topUniversities.map((item, index) => (
                        <div key={`tu-${index}`} className="p-4 mb-4 border border-yellow-200 rounded-lg bg-white shadow-inner grid md:grid-cols-4 gap-4 items-end">
                            <input type="text" value={item.name} onChange={(e) => handleObjectArrayChange(setTopUniversities)(index, "name", e.target.value)} className="border rounded-lg p-2 col-span-2" placeholder="University Name *" required />
                            <textarea rows="2" value={item.description} onChange={(e) => handleObjectArrayChange(setTopUniversities)(index, "description", e.target.value)} className="border rounded-lg p-2 col-span-1" placeholder="Short Description" />
                            <div className="flex items-center justify-end">
                                {topUniversities.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setTopUniversities)(index)} className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600">Remove</button>)}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setTopUniversities, defaultTopUniversity)} className="bg-yellow-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-900 transition mt-2 shadow-md">+ Add University</button>
                </div>

                {/* 4. SYLLABUS & OFFERED COURSES */}
                <div className="p-6 border border-teal-400 rounded-xl bg-teal-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#008080]">4. Syllabus Structure & Content</h3>
                    
                    {/* Syllabus Structure */}
                    <h4 className="font-semibold text-lg mb-3 text-teal-800 border-b pb-2">Syllabus by Semester/Module</h4>
                    {syllabus.map((semester, semIndex) => (
                        <div key={`s-${semIndex}`} className="p-4 mb-4 border border-teal-200 rounded-lg bg-white shadow-inner">
                            <h5 className="font-semibold text-md mb-2 flex justify-between items-center">
                                <span className="text-teal-700">Semester/Module:</span>
                                <input type="text" value={semester.semester} onChange={(e) => handleSyllabusChange(semIndex, "semester", e.target.value)} className="border rounded-lg p-1 w-1/2" placeholder="e.g. Semester I" required />
                                {syllabus.length > 1 && (<button type="button" onClick={() => setSyllabus(syllabus.filter((_, i) => i !== semIndex))} className="text-red-600 text-sm hover:text-red-800">Remove Semester</button>)}
                            </h5>
                            
                            <label className="block font-medium mt-3 mb-1 text-sm">Subjects/Topics</label>
                            {semester.subjects.map((subject, subIndex) => (
                                <div key={`subj-${subIndex}`} className="flex gap-2 mb-2 items-center">
                                    <input type="text" value={subject} onChange={(e) => handleSubjectChange(semIndex, subIndex, e.target.value)} className="w-full border rounded-lg p-2" placeholder={`Subject ${subIndex + 1}`} />
                                    {semester.subjects.length > 1 && (<button type="button" onClick={() => removeSubject(semIndex, subIndex)} className="text-red-600 hover:text-red-800">Remove</button>)}
                                </div>
                            ))}
                            <button type="button" onClick={() => addSubject(semIndex)} className="bg-teal-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-teal-700 mt-2 shadow-sm">+ Add Subject</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => setSyllabus(prev => [...prev, defaultSyllabus])} className="bg-[#008080] text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition mt-2 shadow-md">+ Add New Semester</button>

                    {/* Syllabus PDF */}
                    <div className="mt-6 pt-4 border-t border-teal-200">
                        <label className="block font-medium mb-1">Syllabus PDF (File)</label>
                        <input type="file" accept=".pdf" onChange={(e) => { setSyllabusPdf(e.target.files[0]); setSyllabusPdf_old(null); }} className="w-full text-gray-700 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-[#008080] hover:file:bg-teal-200 cursor-pointer" />
                        {syllabusPdf_old && !syllabusPdf && (<p className="text-sm text-gray-500 mt-1">Current PDF: <a href={syllabusPdf_old} target="_blank" className="font-semibold text-teal-700 hover:underline">View PDF</a></p>)}
                    </div>

                    {/* Offered Courses List */}
                    <h4 className="font-semibold text-lg mt-8 mb-3 text-teal-800 border-b pb-2">Offered Courses (List Blocks)</h4>
                    {offeredCourses.map((oc, blockIndex) => (
                        <div key={`oc-${blockIndex}`} className="p-4 mb-4 border border-teal-200 rounded-lg bg-white shadow-inner">
                            <h5 className="font-semibold text-md mb-2 flex justify-between items-center">
                                <span className="text-teal-700">Block Heading:</span>
                                <input type="text" value={oc.heading} onChange={(e) => handleOfferedCourseChange(blockIndex, "heading", e.target.value)} className="border rounded-lg p-1 w-1/2" placeholder="e.g. UG Programs" required />
                                {offeredCourses.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setOfferedCourses)(blockIndex)} className="text-red-600 text-sm hover:text-red-800">Remove Block</button>)}
                            </h5>
                            
                            <label className="block font-medium mt-3 mb-1 text-sm">Points</label>
                            {oc.points.map((point, pointIndex) => (
                                <div key={`p-${pointIndex}`} className="flex gap-2 mb-2 items-center">
                                    <input type="text" value={point} onChange={(e) => handleOfferedCoursePointChange(blockIndex, pointIndex, e.target.value)} className="w-full border rounded-lg p-2" placeholder={`Point ${pointIndex + 1}`} />
                                    {oc.points.length > 1 && (<button type="button" onClick={() => removeOfferedCoursePoint(blockIndex, pointIndex)} className="text-red-600 hover:text-red-800">Remove</button>)}
                                </div>
                            ))}
                            <button type="button" onClick={() => addOfferedCoursePoint(blockIndex)} className="bg-teal-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-teal-700 mt-2 shadow-sm">+ Add Point</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setOfferedCourses, defaultOfferedCourse)} className="bg-teal-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-900 transition mt-2 shadow-md">+ Add New Offered Courses Block</button>
                </div>
                
                {/* 5. ELIGIBILITY & WORTH IT */}
                <div className="p-6 border border-purple-400 rounded-xl bg-purple-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#6A0DAD]">5. Eligibility & Course Value</h3>
                    
                    {/* Eligibility Section */}
                    <h4 className="font-semibold text-lg mb-3 text-purple-800 border-b pb-2">Online Eligibility Requirements</h4>
                    {onlineEligibility.map((item, index) => (
                        <div key={`e-${index}`} className="p-4 mb-4 border border-purple-200 rounded-lg bg-white shadow-inner grid md:grid-cols-4 gap-4 items-end">
                            <input type="text" value={item.heading} onChange={(e) => handleObjectArrayChange(setOnlineEligibility)(index, "heading", e.target.value)} className="border rounded-lg p-2 col-span-2" placeholder="Heading *" required />
                            <input type="text" value={item.subHeading} onChange={(e) => handleObjectArrayChange(setOnlineEligibility)(index, "subHeading", e.target.value)} className="border rounded-lg p-2 col-span-2" placeholder="Sub Heading (e.g., Duration)" />
                            <textarea rows="2" value={item.description} onChange={(e) => handleObjectArrayChange(setOnlineEligibility)(index, "description", e.target.value)} className="border rounded-lg p-2 col-span-4" placeholder="Description/Paragraph Text *" required />
                            <textarea rows="2" value={item.subDescription} onChange={(e) => handleObjectArrayChange(setOnlineEligibility)(index, "subDescription", e.target.value)} className="border rounded-lg p-2 col-span-3" placeholder="Specific Requirement Text" />
                            <div className="flex items-center justify-end">
                                {onlineEligibility.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setOnlineEligibility)(index)} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600">Remove</button>)}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setOnlineEligibility, defaultEligibility)} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition mt-2 shadow-md">+ Add Eligibility Block</button>

                    {/* Course Worth It Section */}
                    <h4 className="font-semibold text-lg mt-8 mb-3 text-purple-800 border-b pb-2">Course Worth It Details</h4>
                    <textarea rows="3" value={worthItDescription} onChange={(e) => setWorthItDescription(e.target.value)} className="w-full border rounded-lg p-3 border-gray-300 mb-6" placeholder="Main Introductory Description" />
                    
                    <label className="block font-medium mt-3 mb-1 text-sm">Worth It Topics</label>
                    {worthItTopics.map((topic, index) => (
                        <div key={`wt-${index}`} className="grid md:grid-cols-4 gap-4 mb-4 p-4 border border-purple-200 rounded-lg bg-white shadow-inner">
                            <input type="text" value={topic.subHeading} onChange={(e) => handleObjectArrayChange(setWorthItTopics)(index, "subHeading", e.target.value)} className="border rounded-lg p-2 col-span-4" placeholder="Topic Heading (e.g., Flexibility)" />
                            <textarea rows="2" value={topic.description} onChange={(e) => handleObjectArrayChange(setWorthItTopics)(index, "description", e.target.value)} className="border rounded-lg p-2 col-span-3" placeholder="Topic Description" />
                            <div className="flex items-center justify-end">
                                {worthItTopics.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setWorthItTopics)(index)} className="w-full bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600">Remove</button>)}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setWorthItTopics, defaultWorthItTopic)} className="bg-purple-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-900 transition mt-2 shadow-md">+ Add Worth It Topic</button>

                    <div className="mt-6 pt-4 border-t border-purple-200">
                        <label className="block font-medium mb-1">Worth It Illustration Image</label>
                        <input type="file" accept="image/*" onChange={(e) => { setWorthItImage(e.target.files[0]); setWorthItImage_old(null); }} className="w-full text-gray-700 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-[#6A0DAD] hover:file:bg-purple-200 cursor-pointer" />
                        {worthItImage_old && !worthItImage && (<p className="text-sm text-gray-500 mt-1">Current Image: <span className="font-semibold text-purple-700">Present</span></p>)}
                    </div>
                </div>

                {/* 6. FEES STRUCTURE */}
                <div className="p-6 border border-red-400 rounded-xl bg-red-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#A00000]">6. Fee Structure Details</h3>
                    
                    {/* Fee Sidebar */}
                    <h4 className="font-semibold text-lg mb-3 text-red-800 border-b pb-2">Fee Sidebar Structure</h4>
                    {feeSidebar.map((block, blockIndex) => (
                        <div key={`fsb-${blockIndex}`} className="p-4 mb-4 border border-red-200 rounded-lg bg-white shadow-inner">
                            <h5 className="font-semibold text-md mb-2 flex justify-between items-center">
                                <span className="text-red-700">Block Heading:</span>
                                <input type="text" value={block.heading} onChange={(e) => handleObjectArrayChange(setFeeSidebar)(blockIndex, "heading", e.target.value)} className="border rounded-lg p-1 w-1/2" placeholder="e.g. Starting at" required />
                                {feeSidebar.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setFeeSidebar)(blockIndex)} className="text-red-600 text-sm hover:text-red-800">Remove Block</button>)}
                            </h5>
                            
                            <label className="block font-medium mt-3 mb-1 text-sm">Points</label>
                            {block.points.map((point, pointIndex) => (
                                <div key={`p-${pointIndex}`} className="flex gap-2 mb-2 items-center">
                                    <input type="text" value={point} onChange={(e) => handleOfferedCoursePointChange(blockIndex, pointIndex, e.target.value)} className="w-full border rounded-lg p-2" placeholder={`Point ${pointIndex + 1}`} />
                                    {block.points.length > 1 && (<button type="button" onClick={() => removeOfferedCoursePoint(blockIndex, pointIndex)} className="text-red-600 hover:text-red-800">Remove</button>)}
                                </div>
                            ))}
                            <button type="button" onClick={() => addOfferedCoursePoint(blockIndex)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700 mt-2 shadow-sm">+ Add Point</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setFeeSidebar, defaultFeeSidebar)} className="bg-red-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-900 transition mt-2 shadow-md">+ Add New Fee Sidebar Block</button>

                    {/* Detailed Fees (Nested Table) */}
                    <h4 className="font-semibold text-lg mt-8 mb-3 text-red-800 border-b pb-2">Detailed Fees Tables</h4>
                    {detailedFees.map((section, sectionIndex) => (
                        <div key={`df-${sectionIndex}`} className="p-4 mb-4 border border-red-200 rounded-lg bg-white shadow-inner">
                            <h5 className="font-semibold text-md mb-2 flex justify-between items-center">
                                <span className="text-red-700">Section Heading:</span>
                                <input type="text" value={section.heading} onChange={(e) => handleObjectArrayChange(setDetailedFees)(sectionIndex, "heading", e.target.value)} className="border rounded-lg p-1 w-1/2" placeholder="e.g. Total Fees Breakdown" required />
                                {detailedFees.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setDetailedFees)(sectionIndex)} className="text-red-600 text-sm hover:text-red-800">Remove Section</button>)}
                            </h5>
                            <textarea rows="1" value={section.description} onChange={(e) => handleObjectArrayChange(setDetailedFees)(sectionIndex, "description", e.target.value)} className="w-full border rounded-lg p-2 mb-3" placeholder="Section Description" />
                            
                            {/* Nested Table Rows */}
                            <label className="block font-medium mt-3 mb-1 text-sm">Fee Rows</label>
                            {section.table.map((row, rowIndex) => (
                                <div key={`dr-${rowIndex}`} className="grid md:grid-cols-4 gap-2 mb-2 items-center">
                                    <input type="text" value={row.universityName} onChange={(e) => handleDetailedFeesTableChange(sectionIndex, rowIndex, "universityName", e.target.value)} className="border rounded-lg p-2" placeholder="University Name *" required />
                                    <input type="text" value={row.courseFees} onChange={(e) => handleDetailedFeesTableChange(sectionIndex, rowIndex, "courseFees", e.target.value)} className="border rounded-lg p-2" placeholder="Course Fees *" required />
                                    <input type="text" value={row.detailedFeeStructure} onChange={(e) => handleDetailedFeesTableChange(sectionIndex, rowIndex, "detailedFeeStructure", e.target.value)} className="border rounded-lg p-2" placeholder="Detailed Structure" />
                                    <div className="flex items-center justify-end">
                                        {section.table.length > 1 && (<button type="button" onClick={() => removeDetailedFeesTable(sectionIndex, rowIndex)} className="text-red-600 hover:text-red-800">Remove</button>)}
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={() => addDetailedFeesTable(sectionIndex)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700 mt-2 shadow-sm">+ Add Fee Row</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setDetailedFees, defaultDetailedFee)} className="bg-[#A00000] text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition mt-2 shadow-md">+ Add New Detailed Fees Section</button>
                </div>

                {/* 7. PLACEMENTS */}
                <div className="p-6 border border-indigo-400 rounded-xl bg-indigo-50 shadow-sm">
                    <h3 className="font-bold text-xl mb-4 text-[#4B0082]">7. Job Opportunities & Recruiters</h3>
                    
                    {/* Job Opportunities */}
                    <h4 className="font-semibold text-lg mb-3 text-indigo-800 border-b pb-2">Job Opportunities</h4>
                    {jobOpportunities.map((job, index) => (
                        <div key={`jo-${index}`} className="grid md:grid-cols-4 gap-4 mb-4 p-4 border border-indigo-200 rounded-lg bg-white shadow-inner">
                            <input type="text" value={job.jobPost} onChange={(e) => handleObjectArrayChange(setJobOpportunities)(index, "jobPost", e.target.value)} className="border rounded-lg p-2 col-span-2" placeholder="Job Role" />
                            <input type="text" value={job.salary} onChange={(e) => handleObjectArrayChange(setJobOpportunities)(index, "salary", e.target.value)} className="border rounded-lg p-2 col-span-1" placeholder="Salary Range" />
                            <div className="flex items-center justify-end">
                                {jobOpportunities.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setJobOpportunities)(index)} className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm">Remove</button>)}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setJobOpportunities, defaultJobOpportunity)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition mt-2 shadow-md">+ Add Job Role</button>
                    
                    {/* Top Recruiters */}
                    <h4 className="font-semibold text-lg mt-8 mb-3 text-indigo-800 border-b pb-2">Top Recruiters</h4>
                    {topRecruiters.map((recruiter, index) => (
                        <div key={`tr-${index}`} className="grid md:grid-cols-3 gap-4 mb-4 p-4 border border-indigo-200 rounded-lg bg-white shadow-inner">
                            <input type="text" value={recruiter.companyName} onChange={(e) => handleObjectArrayChange(setTopRecruiters)(index, "companyName", e.target.value)} className="border rounded-lg p-2 col-span-1" placeholder="Company Name *" required />
                            <input type="text" value={recruiter.packageOffered} onChange={(e) => handleObjectArrayChange(setTopRecruiters)(index, "packageOffered", e.target.value)} className="border rounded-lg p-2 col-span-1" placeholder="Package Offered" />
                            <div className="flex items-center justify-end">
                                {topRecruiters.length > 1 && (<button type="button" onClick={() => handleObjectArrayRemove(setTopRecruiters)(index)} className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm">Remove</button>)}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleObjectArrayAdd(setTopRecruiters, defaultRecruiter)} className="bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-900 transition mt-2 shadow-md">+ Add Recruiter</button>
                </div>

                {/* Submit */}
                <div className="pt-8 border-t border-gray-200">
                    {message && (
                        <p className={`text-center font-semibold mb-4 text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                            {message}
                        </p>
                    )}
                    <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-lg font-bold text-white transition shadow-lg ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#002D62] hover:bg-blue-800"}`}>
                        {loading ? "Updating..." : "💾 Update Course Data"}
                    </button>
                </div>
            </form>
        </div>
    );
}