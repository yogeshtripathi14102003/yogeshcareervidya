"use client";
 
import { useState, useEffect } from "react";
import api from "@/utlis/api.js";
import UniversitiesFetchComponent from "@/app/admin/getonlinecourese/UniversitiesFetchComponent";

export default function CoursesPage() {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    duration: "",
    tag: "",
  });
  const [specializations, setSpecializations] = useState([""]);
  const [courseLogo, setCourseLogo] = useState(null);

  const [overview, setOverview] = useState([
    { heading: "", description: "", image: null, videoLink: "" },
  ]);

  // For Universities selection
const [universities, setUniversities] = useState([]);
const [syllabusPdf, setSyllabusPdf] = useState(null);

  const [whyChooseUs, setWhyChooseUs] = useState([
    { image: null, description: "" },
  ]);
  const [goodThings, setGoodThings] = useState([""]);
  const [topUniversities, setTopUniversities] = useState([
    { name: "", description: "" },
  ]);
  const [keyHighlights, setKeyHighlights] = useState([
    { heading: "", subHeading: "", description: "" },
  ]);
  const [syllabus, setSyllabus] = useState([{ semester: "", subjects: [""] }]);

  // ⭐ NEW STATE VARIABLES ADDED HERE
  const [offeredCourses, setOfferedCourses] = useState([
    { heading: "", points: [""] },
  ]);
  const [onlineEligibility, setOnlineEligibility] = useState([
    { heading: "", description: "", subHeading: "", subDescription: "" },
  ]);
  const [feeStructureSidebar, setFeeStructureSidebar] = useState([
    { heading: "", points: [""] },
  ]);
  const [detailedFees, setDetailedFees] = useState([
    {
      heading: "",
      description: "",
      table: [{ universityName: "", courseFees: "", detailedFeeStructure: "" }],
    },
  ]);
  const [onlineCourseWorthIt, setOnlineCourseWorthIt] = useState({
    description: "",
    topics: [{ subHeading: "", description: "" }],
    image: null,
  });
  const [jobOpportunities, setJobOpportunities] = useState([
    { heading: "", description: "", jobPost: "", salary: "" },
  ]);
  const [topRecruiters, setTopRecruiters] = useState([
    { companyName: "", packageOffered: "" },
  ]);
  // ⭐ END OF NEW STATE VARIABLES

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing courses
  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/v1/course");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };
  

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ Input Handlers (Omitted for brevity, but they are all correct)

  // Basic form field change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Course Logo file change
  const handleFileChange = (e) => setCourseLogo(e.target.files[0]);
  
const handleSyllabusPdfChange = (e) => {
  setSyllabusPdf(e.target.files[0]);
};

  // Handle file change for onlineCourseWorthIt section
  const handleOnlineCourseWorthItImageChange = (e) => {
    setOnlineCourseWorthIt((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  // Generic handler for dynamic arrays of objects (e.g., overview)
  const handleDynamicChange = (setter, index, key, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  // Generic handler for nested dynamic fields (e.g., offeredCourses points)
  const handleNestedDynamicChange = (setter, outerIndex, innerKey, innerIndex, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[outerIndex][innerKey][innerIndex] = value;
      return updated;
    });
  };

  // Generic handler for single object state (onlineCourseWorthIt)
  const handleSingleObjectChange = (key, value) => {
    setOnlineCourseWorthIt((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  // Generic handler for dynamic array fields (e.g., specialization, goodThings)
  const handleArrayChange = (setter, index, value) => {
    setter((prev) => prev.map((val, i) => (i === index ? value : val)));
  };

  // Generic add/remove array item functions
  const addField = (setter, newObj) => setter((prev) => [...prev, newObj]);
  const removeField = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  // Handler for adding/removing items in arrays *nested inside* an array of objects
  const addNestedArrayItem = (setter, index, key, defaultValue = "") => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][key].push(defaultValue);
      return updated;
    });
  };

  const removeNestedArrayItem = (setter, index, key, innerIndex) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][key] = updated[index][key].filter((_, i) => i !== innerIndex);
      // Ensure there's at least one item if removing the last one
      if (updated[index][key].length === 0) {
        updated[index][key].push("");
      }
      return updated;
    });
  };
  
  // Handler for nested table data (detailedFees.table)
  const handleDetailedFeesTableChange = (outerIndex, tableIndex, key, value) => {
    setDetailedFees((prev) => {
      const updated = [...prev];
      updated[outerIndex].table[tableIndex][key] = value;
      return updated;
    });
  };

  const addDetailedFeesTableItem = (index) => {
    setDetailedFees((prev) => {
      const updated = [...prev];
      updated[index].table.push({ universityName: "", courseFees: "", detailedFeeStructure: "" });
      return updated;
    });
  };

  const removeDetailedFeesTableItem = (outerIndex, tableIndex) => {
    setDetailedFees((prev) => {
      const updated = [...prev];
      updated[outerIndex].table = updated[outerIndex].table.filter((_, i) => i !== tableIndex);
      return updated;
    });
  };

  // Handler for onlineCourseWorthIt topics
  const handleOnlineCourseWorthItTopicChange = (i, key, value) => {
    setOnlineCourseWorthIt((prev) => {
      const updatedTopics = [...prev.topics];
      updatedTopics[i][key] = value;
      return { ...prev, topics: updatedTopics };
    });
  };

  const addOnlineCourseWorthItTopic = () => {
    setOnlineCourseWorthIt((prev) => ({
      ...prev,
      topics: [...prev.topics, { subHeading: "", description: "" }],
    }));
  };

  const removeOnlineCourseWorthItTopic = (i) => {
    setOnlineCourseWorthIt((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, idx) => idx !== i),
    }));
  };


  // Custom handlers for existing fields now using generic helper functions
  const handleSpecializationChange = (i, val) => handleArrayChange(setSpecializations, i, val);
  const addSpecialization = () => setSpecializations([...specializations, ""]);
  const removeSpecialization = (i) => removeField(setSpecializations, i);

  const handleGoodThingChange = (i, val) => handleArrayChange(setGoodThings, i, val);
  const addGoodThing = () => addField(setGoodThings, "");
  const removeGoodThing = (i) => removeField(setGoodThings, i);


  // Syllabus subjects handlers
  const handleSubjectChange = (semIndex, subIndex, value) =>
    handleNestedDynamicChange(setSyllabus, semIndex, "subjects", subIndex, value);
  const addSubject = (semIndex) => addNestedArrayItem(setSyllabus, semIndex, "subjects");
  const removeSubject = (semIndex, subIndex) => removeNestedArrayItem(setSyllabus, semIndex, "subjects", subIndex);
  // End of existing handlers

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = new FormData();

      // Helper function for slug
      const slugify = (text) =>
        text
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-");

      // Basic fields
      Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
      payload.append("slug", slugify(formData.name));

      if (courseLogo) payload.append("courseLogo", courseLogo);
if (syllabusPdf) payload.append("syllabusPdf", syllabusPdf);

      // --- FIXED DATA SUBMISSION: Use JSON.stringify for all complex arrays ---

      // Specializations (already correct)
      payload.append("specializations", JSON.stringify(specializations.filter((s) => s.trim() !== "")));

      // 1. Overview (FIXED: Send text data as JSON string)
      const overviewTextData = overview.map(({ image, ...rest }) => rest); // Exclude the local File object
      payload.append("overview", JSON.stringify(overviewTextData));
      // Append actual image files separately
      overview.forEach((item) => {
        if (item.image) {
          payload.append("overviewImages", item.image); 
        }
      });

      // 2. Why Choose Us (FIXED: Send text data as JSON string)
      const whyChooseUsTextData = whyChooseUs.map(({ image, ...rest }) => rest); // Exclude the local File object
      payload.append("whyChooseUs", JSON.stringify(whyChooseUsTextData));
      // Append actual image files separately
      whyChooseUs.forEach((item) => {
        if (item.image) {
          payload.append("whyChooseUsImages", item.image);
        }
      });

      // 3. Good Things 
      payload.append("goodThings", JSON.stringify(goodThings.filter((g) => g.trim() !== "")));
// Add this inside handleSubmit AFTER you created `const payload = new FormData();`

payload.append("universities", JSON.stringify(universities));


      // 4. Top Universities
      const filteredTopUniversities = topUniversities.filter((item) => item.name);
      payload.append("topUniversities", JSON.stringify(filteredTopUniversities));

      // 5. Key Highlights
      const filteredKeyHighlights = keyHighlights.filter((item) => item.heading);
      payload.append("keyHighlights", JSON.stringify(filteredKeyHighlights));

      // 6. Syllabus 
      const filteredSyllabus = syllabus
        .filter((sem) => sem.semester)
        .map((sem) => ({
          ...sem,
          subjects: sem.subjects.filter((s) => s.trim() !== ""),
        }));
      payload.append("syllabus", JSON.stringify(filteredSyllabus));


      // ⭐ NEW FIELD PAYLOAD APPENDING (All converted to JSON.stringify)

      // Offered Courses
      const filteredOfferedCourses = offeredCourses
        .filter((item) => item.heading)
        .map((item) => ({
          ...item,
          points: item.points.filter((p) => p.trim() !== ""),
        }));
      payload.append("offeredCourses", JSON.stringify(filteredOfferedCourses));

      // Online Eligibility
      const filteredOnlineEligibility = onlineEligibility.filter((item) => item.heading);
      payload.append("onlineEligibility", JSON.stringify(filteredOnlineEligibility));

      // Fees Structure Sidebar
      const filteredFeeStructureSidebar = feeStructureSidebar
        .filter((item) => item.heading)
        .map((item) => ({
          ...item,
          points: item.points.filter((p) => p.trim() !== ""),
        }));
      payload.append("feeStructureSidebar", JSON.stringify(filteredFeeStructureSidebar));


      // Detailed Fees
      const filteredDetailedFees = detailedFees
        .filter((item) => item.heading)
        .map((item) => ({
          ...item,
          table: item.table.filter((row) => row.universityName && row.courseFees),
        }));
      payload.append("detailedFees", JSON.stringify(filteredDetailedFees));

    
      // Online Course Worth It (Object with a file - must send text/json separately)
      const ocwTextData = {
        description: onlineCourseWorthIt.description,
        topics: onlineCourseWorthIt.topics.filter(topic => topic.subHeading),
      };
      payload.append("onlineCourseWorthIt", JSON.stringify(ocwTextData));
      if (onlineCourseWorthIt.image) {
        payload.append("onlineCourseWorthItImage", onlineCourseWorthIt.image);
      }

      // Job Opportunities
      const filteredJobOpportunities = jobOpportunities.filter((item) => item.heading);
      payload.append("jobOpportunities", JSON.stringify(filteredJobOpportunities));


      // Top Recruiters
      const filteredTopRecruiters = topRecruiters.filter((item) => item.companyName);
      payload.append("topRecruiters", JSON.stringify(filteredTopRecruiters));
      
      // ⭐ END OF FIELD PAYLOAD

      // ✅ Send to backend
      await api.post("/api/v1/course", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Course Created Successfully!");
      fetchCourses();
    } catch (err) {
      console.error("Submission Error:", err);
      // Provide a more descriptive alert
      alert("❌ Error creating course: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI STARTS HERE
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        🎓 Course Management
      </h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white shadow p-6 rounded-xl space-y-8"
      >
        {/* BASIC DETAILS (Existing) */}
        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
              <option value="Doctorate">Doctorate</option>
              <option value="JobGuarantee">Job Guarantee</option>
            </select>
          </div>

          <div>
            <label>Name</label>
            <input
              type="text"
              placeholder=" add Course name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          <div>
            <label>Duration</label>
            <input
              type="text"
              placeholder="Course ki durection"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          <div>

            <label>Tag</label>
            <input
              type="text"
              placeholder="like card ke uper side optional "
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          <div>
            <label>Course Logo</label>
            <input
              type="file"
              placeholder="course ka logo  show card"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
        </section>
        
        {/* --- */}

        {/* SPECIALIZATIONS (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Specializations</h2>
          {specializations.map((spec, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder=" Please add the relevant branches assigned to each specific course "
                value={spec}
                onChange={(e) =>
                  handleSpecializationChange(i, e.target.value)
                }
                className="w-full border p-2 rounded-md"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeSpecialization(i)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecialization}
            className="text-blue-600"
          >
            + Add
          </button>
        </section>

        {/* --- */}

        {/* OVERVIEW (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Overview</h2>
          {overview.map((item, i) => (
            <div
              key={i}
              className="grid md:grid-cols-2 gap-2 mb-4 border p-3 rounded-md"
            >
              <input
                type="text"
                placeholder="Heading  course ka name complete "
                value={item.heading}
                onChange={(e) =>
                  handleDynamicChange(setOverview, i, "heading", e.target.value)
                }
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Video Link"
                value={item.videoLink}
                onChange={(e) =>
                  handleDynamicChange(
                    setOverview,
                    i,
                    "videoLink",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleDynamicChange(
                    setOverview,
                    i,
                    "description",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md md:col-span-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleDynamicChange(
                    setOverview,
                    i,
                    "image",
                    e.target.files[0]
                  )
                }
                className="border p-2 rounded-md md:col-span-2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setOverview, {
                heading: "",
                description: "",
                image: null,
                videoLink: "",
              })
            }
            className="text-blue-600"
          >
            + Add Overview
          </button>
        </section>
        
        {/* --- */}

<div className="mb-4">
  <label className="block text-sm font-semibold mb-1">
    Syllabus PDF
  </label>
  <input
    type="file"
    accept="application/pdf"
    onChange={handleSyllabusPdfChange}
    className="border p-2 rounded w-full"
  />
</div>

        {/* WHY CHOOSE US (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Why Choose Us</h2>
          {whyChooseUs.map((item, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-2 mb-4 border p-3 rounded-md"
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleDynamicChange(
                    setWhyChooseUs,
                    i,
                    "image",
                    e.target.files[0]
                  )
                }
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleDynamicChange(
                    setWhyChooseUs,
                    i,
                    "description",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md w-full"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setWhyChooseUs, { image: null, description: "" })
            }
            className="text-blue-600"
          >
            + Add
          </button>
        </section>

        {/* --- */}

        {/* GOOD THINGS (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Program And Highlight </h2>
          {goodThings.map((g, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="point about the course "
                value={g}
                onChange={(e) => handleGoodThingChange(i, e.target.value)}
                className="w-full border p-2 rounded-md"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeGoodThing(i)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addGoodThing}
            className="text-blue-600"
          >
            + Add
          </button>
        </section>




        {/* TOP UNIVERSITIES (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Top Universities</h2>
          {topUniversities.map((item, i) => (
            <div
              key={i}
              className="grid md:grid-cols-2 gap-2 mb-4 border p-3 rounded-md"
            >
              <input
                type="text"
                placeholder="Name"
                value={item.name}
                onChange={(e) =>
                  handleDynamicChange(
                    setTopUniversities,
                    i,
                    "name",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description or approvels"
                value={item.description}
                onChange={(e) =>
                  handleDynamicChange(
                    setTopUniversities,
                    i,
                    "description",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setTopUniversities, { name: "", description: "" })
            }
            className="text-blue-600"
          >
            + Add
          </button>
       <UniversitiesFetchComponent onSelect={setUniversities} />



        </section>

        {/* --- */}

        {/* KEY HIGHLIGHTS (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Key Highlights</h2>
          {keyHighlights.map((item, i) => (
            <div
              key={i}
              className="grid md:grid-cols-3 gap-2 mb-4 border p-3 rounded-md"
            >
              <input
                type="text"
                placeholder="Heading"
                value={item.heading}
                onChange={(e) =>
                  handleDynamicChange(
                    setKeyHighlights,
                    i,
                    "heading",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Sub Heading"
                value={item.subHeading}
                onChange={(e) =>
                  handleDynamicChange(
                    setKeyHighlights,
                    i,
                    "subHeading",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleDynamicChange(
                    setKeyHighlights,
                    i,
                    "description",
                    e.target.value
                  )
                }
                className="border p-2 rounded-md md:col-span-3"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setKeyHighlights, {
                heading: "",
                subHeading: "",
                description: "",
              })
            }
            className="text-blue-600"
          >
            + Add
          </button>
        </section>

        {/* --- */}

        {/* SYLLABUS (Existing) */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Syllabus</h2>
          {syllabus.map((sem, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Semester"
                  value={sem.semester}
                  onChange={(e) =>
                    handleDynamicChange(setSyllabus, i, "semester", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeField(setSyllabus, i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <h4 className="font-medium text-sm my-2">Subjects:</h4>
              {sem.subjects.map((sub, j) => (
                <div key={j} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder={`Subject ${j + 1}`}
                    value={sub}
                    onChange={(e) => handleSubjectChange(i, j, e.target.value)}
                    className="border p-2 rounded-md w-full"
                  />
                  {j > 0 && (
                    <button
                      type="button"
                      onClick={() => removeSubject(i, j)}
                      className="bg-red-500 text-white px-3 rounded text-sm"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSubject(i)}
                className="text-blue-600 text-sm mt-2"
              >
                + Add Subject
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setSyllabus, { semester: "", subjects: [""] })
            }
            className="text-blue-600"
          >
            + Add Semester
          </button>
        </section>

        {/* --- */}
        {/* ⭐ NEW UI SECTIONS START HERE ⭐ */}
        {/* --- */}

        {/* OFFERED COURSE SECTION */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Offered Courses</h2>
          {offeredCourses.map((item, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Heading (e.g., 'Core Courses')"
                  value={item.heading}
                  onChange={(e) =>
                    handleDynamicChange(setOfferedCourses, i, "heading", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                  required
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeField(setOfferedCourses, i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <h4 className="font-medium text-sm my-2">Points:</h4>
              {item.points.map((point, j) => (
                <div key={j} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder={`Point ${j + 1}`}
                    value={point}
                    onChange={(e) => handleNestedDynamicChange(setOfferedCourses, i, "points", j, e.target.value)}
                    className="border p-2 rounded-md w-full"
                  />
                  {j > 0 && (
                    <button
                      type="button"
                      onClick={() => removeNestedArrayItem(setOfferedCourses, i, "points", j)}
                      className="bg-red-500 text-white px-3 rounded text-sm"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addNestedArrayItem(setOfferedCourses, i, "points")}
                className="text-blue-600 text-sm mt-2"
              >
                + Add Point
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setOfferedCourses, { heading: "", points: [""] })}
            className="text-blue-600"
          >
            + Add Offered Course Section
          </button>
        </section>

        {/* --- */}

        {/* ONLINE COURSE ELIGIBILITY */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Online Course Eligibility</h2>
          {onlineEligibility.map((item, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="grid md:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Heading (e.g., 'Minimum Qualification')"
                  value={item.heading}
                  onChange={(e) =>
                    handleDynamicChange(setOnlineEligibility, i, "heading", e.target.value)
                  }
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Sub Heading (Optional)"
                  value={item.subHeading}
                  onChange={(e) =>
                    handleDynamicChange(setOnlineEligibility, i, "subHeading", e.target.value)
                  }

                  className="border p-2 rounded-md"
                />
                <textarea
                  placeholder="Description (Required)"
                  value={item.description}
                  onChange={(e) =>
                    handleDynamicChange(setOnlineEligibility, i, "description", e.target.value)
                  }
                  className="border p-2 rounded-md"
                  required
                />
                <textarea
                  placeholder="Sub Description (Optional)"
                  value={item.subDescription}
                  onChange={(e) =>
                    handleDynamicChange(setOnlineEligibility, i, "subDescription", e.target.value)
                  }
                  className="border p-2 rounded-md"
                />
              </div>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeField(setOnlineEligibility, i)}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                >
                  ✕ Remove Eligibility
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setOnlineEligibility, { heading: "", description: "", subHeading: "", subDescription: "" })
            }
            className="text-blue-600"
          >
            + Add Eligibility
          </button>
        </section>

        {/* --- */}

        {/* FEES STRUCTURE (Sidebar) */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Fees Structure (Sidebar)</h2>
          {feeStructureSidebar.map((item, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Heading (e.g., 'Total Course Fee')"
                  value={item.heading}
                  onChange={(e) =>
                    handleDynamicChange(setFeeStructureSidebar, i, "heading", e.target.value)
                  }
                  className="border p-2 rounded-md w-full"
                  required
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeField(setFeeStructureSidebar, i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <h4 className="font-medium text-sm my-2">Points:</h4>
              {item.points.map((point, j) => (
                <div key={j} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder={`Point ${j + 1} (e.g., 'Approx. ₹1,50,000')`}
                    value={point}
                    onChange={(e) => handleNestedDynamicChange(setFeeStructureSidebar, i, "points", j, e.target.value)}
                    className="border p-2 rounded-md w-full"
                  />
                  {j > 0 && (
                    <button
                      type="button"
                      onClick={() => removeNestedArrayItem(setFeeStructureSidebar, i, "points", j)}
                      className="bg-red-500 text-white px-3 rounded text-sm"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addNestedArrayItem(setFeeStructureSidebar, i, "points")}
                className="text-blue-600 text-sm mt-2"
              >
                + Add Point
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setFeeStructureSidebar, { heading: "", points: [""] })}
            className="text-blue-600"
          >
            + Add Fee Structure Section
          </button>
        </section>

        {/* --- */}

        {/* DETAILED FEES TABLE */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Detailed Fees Table</h2>
          {detailedFees.map((item, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Heading (e.g., 'University-wise Fee')"
                  value={item.heading}
                  onChange={(e) => handleDynamicChange(setDetailedFees, i, "heading", e.target.value)}
                  className="border p-2 rounded-md w-full"
                  required
                />
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => removeField(setDetailedFees, i)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
              <textarea
                placeholder="Description (Optional)"
                value={item.description}
                onChange={(e) => handleDynamicChange(setDetailedFees, i, "description", e.target.value)}
                className="border p-2 rounded-md w-full mb-2"
              />

              <h4 className="font-medium text-base my-2">Fee Table Rows:</h4>
              {item.table.map((row, j) => (
                <div key={j} className="grid md:grid-cols-3 gap-2 mb-2 p-2 border rounded-md bg-gray-50">
                  <input
                    type="text"
                    placeholder="University Name (Required)"
                    value={row.universityName}
                    onChange={(e) => handleDetailedFeesTableChange(i, j, "universityName", e.target.value)}
                    className="border p-2 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Course Fees (Required)"
                    value={row.courseFees}
                    onChange={(e) => handleDetailedFeesTableChange(i, j, "courseFees", e.target.value)}
                    className="border p-2 rounded-md"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Detailed Fee Link (Optional)"
                      value={row.detailedFeeStructure}
                      onChange={(e) => handleDetailedFeesTableChange(i, j, "detailedFeeStructure", e.target.value)}
                      className="border p-2 rounded-md w-full"
                    />
                    {j > 0 && (
                      <button
                        type="button"
                        onClick={() => removeDetailedFeesTableItem(i, j)}
                        className="bg-red-500 text-white px-3 rounded text-sm"
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addDetailedFeesTableItem(i)}
                className="text-blue-600 text-sm mt-2"
              >
                + Add Table Row
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField(setDetailedFees, {
                heading: "",
                description: "",
                table: [{ universityName: "", courseFees: "", detailedFeeStructure: "" }],
              })
            }
            className="text-blue-600"
          >
            + Add Detailed Fees Section
          </button>
        </section>

        {/* --- */}

        {/* ONLINE COURSE WORTH IT? */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Online Course Worth It?</h2>
          <textarea
            placeholder="Main Description"
            value={onlineCourseWorthIt.description}
            onChange={(e) => handleSingleObjectChange("description", e.target.value)}
            className="border p-2 rounded-md w-full mb-4"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleOnlineCourseWorthItImageChange}
            className="border p-2 rounded-md w-full mb-4"
          />

          <h4 className="font-medium text-base my-2">Topics:</h4>
          {onlineCourseWorthIt.topics.map((topic, i) => (
            <div key={i} className="border p-3 rounded-md mb-2 bg-gray-50">
              <input
                type="text"
                placeholder="Sub Heading"
                value={topic.subHeading}
                onChange={(e) => handleOnlineCourseWorthItTopicChange(i, "subHeading", e.target.value)}
                className="border p-2 rounded-md w-full mb-2"
              />
              <textarea
                placeholder="Description"
                value={topic.description}
                onChange={(e) => handleOnlineCourseWorthItTopicChange(i, "description", e.target.value)}
                className="border p-2 rounded-md w-full"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeOnlineCourseWorthItTopic(i)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm mt-2"
                >
                  - Remove Topic
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOnlineCourseWorthItTopic}
            className="text-blue-600"
          >
            + Add Topic
          </button>
        </section>

        {/* --- */}

        {/* JOB OPPORTUNITIES */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Job Opportunities</h2>
          {jobOpportunities.map((item, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <div className="grid md:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Heading (Required)"
                  value={item.heading}
                  onChange={(e) => handleDynamicChange(setJobOpportunities, i, "heading", e.target.value)}
                  className="border p-2 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Job Post"
                  value={item.jobPost}
                  onChange={(e) => handleDynamicChange(setJobOpportunities, i, "jobPost", e.target.value)}
                  className="border p-2 rounded-md"
                />
                <textarea
                  placeholder="Description (Optional)"
                  value={item.description}
                  onChange={(e) => handleDynamicChange(setJobOpportunities, i, "description", e.target.value)}
                  className="border p-2 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Salary"
                  value={item.salary}
                  onChange={(e) => handleDynamicChange(setJobOpportunities, i, "salary", e.target.value)}
                  className="border p-2 rounded-md"
                />
              </div>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeField(setJobOpportunities, i)}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                >
                  ✕ Remove Opportunity
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setJobOpportunities, { heading: "", description: "", jobPost: "", salary: "" })}
            className="text-blue-600"
          >
            + Add Job Opportunity
          </button>
        </section>

        {/* --- */}

        {/* TOP RECRUITERS */}
        <section>
          <h2 className="font-semibold text-xl mb-3 border-b pb-1">Top Recruiters</h2>
          {topRecruiters.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Company Name (Required)"
                value={item.companyName}
                onChange={(e) =>
                  handleDynamicChange(setTopRecruiters, i, "companyName", e.target.value)
                }
                className="border p-2 rounded-md w-full"
                required
              />
              <input
                type="text"
                placeholder="Package Offered (Optional)"
                value={item.packageOffered}
                onChange={(e) =>
                  handleDynamicChange(setTopRecruiters, i, "packageOffered", e.target.value)
                }
                className="border p-2 rounded-md w-full"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeField(setTopRecruiters, i)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  ✕
                </button>
               
              )}
              
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField(setTopRecruiters, { companyName: "", packageOffered: "" })}
            className="text-blue-600"
          >
            + Add Recruiter
          </button>
        </section>

        {/* --- */}
        {/* ⭐ NEW UI SECTIONS END HERE ⭐ */}
        {/* --- */}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Create Course"}
        </button>
      </form>

      {/* Existing Courses List (Optional - not modified) */}
      <h2 className="text-xl font-semibold text-gray-800 mt-10 mb-4">
        Existing Courses ({courses.length})
      </h2>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li
            key={course._id}
            className="bg-white p-3 rounded-md shadow-sm border border-gray-100"
          >
            {course.name} - **{course.category}** (Slug: {course.slug})
          </li>
        ))}
      </ul>
    </main> 
  );
}