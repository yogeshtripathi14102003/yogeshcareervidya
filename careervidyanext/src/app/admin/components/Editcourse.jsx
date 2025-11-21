"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/utlis/api.js"; // your axios instance

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams?.get("id") || null;

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    duration: "",
    tag: "",
  });

  const [specializations, setSpecializations] = useState([""]);
  const [courseLogo, setCourseLogo] = useState(null);
  const [courseLogoPreview, setCourseLogoPreview] = useState(null);

  const [overview, setOverview] = useState([
    { heading: "", description: "", image: null, videoLink: "" },
  ]);
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

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all courses (optional, kept from original)
  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/v1/course");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // Fetch single course when courseId present (for edit)
  const fetchSingleCourse = async () => {
    if (!courseId) return;
    try {
      const res = await api.get(`/api/v1/course/${courseId}`);
      const c = res.data.course;

      // Basic fields
      setFormData({
        category: c.category || "",
        name: c.name || "",
        duration: c.duration || "",
        tag: c.tag || "",
      });

      // specializations: ensure at least one element
      setSpecializations(
        Array.isArray(c.specialization) && c.specialization.length > 0
          ? c.specialization
          : [""]
      );

      // overview — set image to null (file inputs cannot be prefilled). Keep videoLink and texts.
      setOverview(
        Array.isArray(c.overview) && c.overview.length > 0
          ? c.overview.map((o) => ({
              heading: o.heading || "",
              description: o.description || "",
              image: null, // user can upload new one
              videoLink: o.videoLink || "",
            }))
          : [{ heading: "", description: "", image: null, videoLink: "" }]
      );

      // whyChooseUs
      setWhyChooseUs(
        Array.isArray(c.whyChooseUs) && c.whyChooseUs.length > 0
          ? c.whyChooseUs.map((w) => ({
              image: null,
              description: w.description || "",
            }))
          : [{ image: null, description: "" }]
      );

      // good things
      setGoodThings(
        Array.isArray(c.goodThings) && c.goodThings.length > 0
          ? c.goodThings
          : [""]
      );

      // top universities
      setTopUniversities(
        Array.isArray(c.topUniversities) && c.topUniversities.length > 0
          ? c.topUniversities.map((u) => ({
              name: u.name || "",
              description: u.description || "",
            }))
          : [{ name: "", description: "" }]
      );

      // key highlights
      setKeyHighlights(
        Array.isArray(c.keyHighlights) && c.keyHighlights.length > 0
          ? c.keyHighlights.map((h) => ({
              heading: h.heading || "",
              subHeading: h.subHeading || "",
              description: h.description || "",
            }))
          : [{ heading: "", subHeading: "", description: "" }]
      );

      // syllabus
      setSyllabus(
        Array.isArray(c.syllabus) && c.syllabus.length > 0
          ? c.syllabus.map((s) => ({
              semester: s.semester || "",
              subjects: Array.isArray(s.subjects) && s.subjects.length > 0 ? s.subjects : [""],
            }))
          : [{ semester: "", subjects: [""] }]
      );

      // course logo preview (optional)
      if (c.courseLogo && typeof c.courseLogo === "string") {
        setCourseLogoPreview(c.courseLogo);
      }
    } catch (err) {
      console.error("Error loading course:", err);
      alert("Error loading course data");
    }
  };

  useEffect(() => {
    fetchCourses();
    if (courseId) fetchSingleCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Generic handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setCourseLogo(file);
    if (file) {
      setCourseLogoPreview(URL.createObjectURL(file));
    } else {
      setCourseLogoPreview(null);
    }
  };

  const handleDynamicChange = (setter, index, key, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const addField = (setter, newObj) => setter((prev) => [...prev, newObj]);
  const removeField = (setter, index) =>
    setter((prev) => prev.filter((_, i) => i !== index));

  // Specializations
  const handleSpecializationChange = (i, val) => {
    const updated = [...specializations];
    updated[i] = val;
    setSpecializations(updated);
  };
  const addSpecialization = () => setSpecializations([...specializations, ""]);
  const removeSpecialization = (i) =>
    setSpecializations(specializations.filter((_, idx) => idx !== i));

  // Syllabus subjects
  const handleSubjectChange = (semIndex, subIndex, value) => {
    const updated = [...syllabus];
    updated[semIndex].subjects[subIndex] = value;
    setSyllabus(updated);
  };
  const addSubject = (semIndex) => {
    const updated = [...syllabus];
    updated[semIndex].subjects.push("");
    setSyllabus(updated);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = new FormData();

      // slug helper
      const slugify = (text) =>
        text
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-");

      // Basic fields
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) payload.append(k, v);
      });

      // slug from name
      payload.append("slug", slugify(formData.name || ""));

      // course logo (optional)
      if (courseLogo) payload.append("courseLogo", courseLogo);

      // specializations
      specializations
        .filter((s) => s && s.toString().trim() !== "")
        .forEach((spec) => payload.append("specialization", spec));

      // overview — send each field; images appended to a file field (backend must handle overviewImages[] or similar)
      overview.forEach((item, i) => {
        payload.append(`overview[${i}][heading]`, item.heading || "");
        payload.append(`overview[${i}][description]`, item.description || "");
        payload.append(`overview[${i}][videoLink]`, item.videoLink || "");
        if (item.image) {
          // push image file to a dedicated key — backend should expect overviewImages (array)
          payload.append("overviewImages", item.image);
          // you may also send a mapping index if backend expects it:
          // payload.append(`overview[${i}][image]`, item.image);
        }
      });

      // why choose us
      whyChooseUs.forEach((item, i) => {
        payload.append(`whyChooseUs[${i}][description]`, item.description || "");
        if (item.image) {
          payload.append("whyChooseUsImages", item.image);
        }
      });

      // good things
      goodThings
        .filter((g) => g && g.toString().trim() !== "")
        .forEach((g) => payload.append("goodThings", g));

      // top universities
      topUniversities
        .filter((item) => item && (item.name || item.description))
        .forEach((item, i) => {
          payload.append(`topUniversities[${i}][name]`, item.name || "");
          payload.append(
            `topUniversities[${i}][description]`,
            item.description || ""
          );
        });

      // key highlights
      keyHighlights
        .filter((item) => item && (item.heading || item.description))
        .forEach((item, i) => {
          payload.append(`keyHighlights[${i}][heading]`, item.heading || "");
          payload.append(
            `keyHighlights[${i}][subHeading]`,
            item.subHeading || ""
          );
          payload.append(
            `keyHighlights[${i}][description]`,
            item.description || ""
          );
        });

      // syllabus
      syllabus
        .filter((sem) => sem && sem.semester)
        .forEach((sem, i) => {
          payload.append(`syllabus[${i}][semester]`, sem.semester || "");
          (sem.subjects || [])
            .filter((s) => s && s.toString().trim() !== "")
            .forEach((sub) => payload.append(`syllabus[${i}][subjects]`, sub));
        });

      // send to backend: POST (create) or PUT (update)
      if (courseId) {
        // update existing
        await api.put(`/api/v1/course/${courseId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Course Updated Successfully!");
      } else {
        // create new
        await api.post("/api/v1/course", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Course Created Successfully!");
      }

      // refresh listing and redirect (optional)
      await fetchCourses();
      router.push("/admin/courses"); // adjust redirect path as per your routes
    } catch (err) {
      console.error("Error saving course:", err);
      alert("❌ Error saving course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        🎓 {courseId ? "Edit Course" : "Create Course"}
      </h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white shadow p-6 rounded-xl space-y-8"
      >
        {/* BASIC DETAILS */}
        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1">Category</label>
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
            <label className="block mb-1">Name</label>
            <input
              type="text"
              placeholder="Add Course name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Duration</label>
            <input
              type="text"
              placeholder="Course duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Tag</label>
            <input
              type="text"
              placeholder="optional tag"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1">Course Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-md"
            />
            {courseLogoPreview && (
              <div className="mt-2">
                <p className="text-sm">Preview:</p>
                <img
                  src={courseLogoPreview}
                  alt="preview"
                  className="w-32 h-20 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </section>

        {/* SPECIALIZATIONS */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Specializations</h2>
          {specializations.map((spec, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Relevant branch"
                value={spec}
                onChange={(e) => handleSpecializationChange(i, e.target.value)}
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
          <button type="button" onClick={addSpecialization} className="text-blue-600">
            + Add
          </button>
        </section>

        {/* OVERVIEW */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Overview</h2>
          {overview.map((item, i) => (
            <div
              key={i}
              className="grid md:grid-cols-2 gap-2 mb-4 border p-3 rounded-md"
            >
              <input
                type="text"
                placeholder="Heading"
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
                  handleDynamicChange(setOverview, i, "videoLink", e.target.value)
                }
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleDynamicChange(setOverview, i, "description", e.target.value)
                }
                className="border p-2 rounded-md md:col-span-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleDynamicChange(setOverview, i, "image", e.target.files[0])
                }
                className="border p-2 rounded-md md:col-span-2"
              />
              {item.image && (
                <p className="text-sm text-gray-500 md:col-span-2">
                  (New image chosen)
                </p>
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                addField(setOverview, { heading: "", description: "", image: null, videoLink: "" })
              }
              className="text-blue-600"
            >
              + Add Overview
            </button>
            {overview.length > 1 && (
              <button
                type="button"
                onClick={() => removeField(setOverview, overview.length - 1)}
                className="text-red-500"
              >
                Remove last
              </button>
            )}
          </div>
        </section>

        {/* WHY CHOOSE US */}
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
                  handleDynamicChange(setWhyChooseUs, i, "image", e.target.files[0])
                }
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleDynamicChange(setWhyChooseUs, i, "description", e.target.value)
                }
                className="border p-2 rounded-md w-full"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addField(setWhyChooseUs, { image: null, description: "" })}
              className="text-blue-600"
            >
              + Add
            </button>
            {whyChooseUs.length > 1 && (
              <button
                type="button"
                onClick={() => removeField(setWhyChooseUs, whyChooseUs.length - 1)}
                className="text-red-500"
              >
                Remove last
              </button>
            )}
          </div>
        </section>

        {/* GOOD THINGS */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Good Things</h2>
          {goodThings.map((g, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Point about the course"
                value={g}
                onChange={(e) =>
                  setGoodThings((prev) =>
                    prev.map((val, idx) => (idx === i ? e.target.value : val))
                  )
                }
                className="w-full border p-2 rounded-md"
              />
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => removeField(setGoodThings, i)}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button" onClick={() => addField(setGoodThings, "")} className="text-blue-600">
              + Add
            </button>
            {goodThings.length > 1 && (
              <button type="button" onClick={() => removeField(setGoodThings, goodThings.length - 1)} className="text-red-500">
                Remove last
              </button>
            )}
          </div>
        </section>

        {/* TOP UNIVERSITIES */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Top Universities</h2>
          {topUniversities.map((item, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-2 mb-4 border p-3 rounded-md">
              <input
                type="text"
                placeholder="Name"
                value={item.name}
                onChange={(e) => handleDynamicChange(setTopUniversities, i, "name", e.target.value)}
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description or approvals"
                value={item.description}
                onChange={(e) => handleDynamicChange(setTopUniversities, i, "description", e.target.value)}
                className="border p-2 rounded-md"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button" onClick={() => addField(setTopUniversities, { name: "", description: "" })} className="text-blue-600">
              + Add
            </button>
            {topUniversities.length > 1 && (
              <button type="button" onClick={() => removeField(setTopUniversities, topUniversities.length - 1)} className="text-red-500">
                Remove last
              </button>
            )}
          </div>
        </section>

        {/* KEY HIGHLIGHTS */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Key Highlights</h2>
          {keyHighlights.map((item, i) => (
            <div key={i} className="grid md:grid-cols-3 gap-2 mb-4 border p-3 rounded-md">
              <input
                type="text"
                placeholder="Heading"
                value={item.heading}
                onChange={(e) => handleDynamicChange(setKeyHighlights, i, "heading", e.target.value)}
                className="border p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Sub Heading"
                value={item.subHeading}
                onChange={(e) => handleDynamicChange(setKeyHighlights, i, "subHeading", e.target.value)}
                className="border p-2 rounded-md"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleDynamicChange(setKeyHighlights, i, "description", e.target.value)}
                className="border p-2 rounded-md md:col-span-3"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button type="button" onClick={() => addField(setKeyHighlights, { heading: "", subHeading: "", description: "" })} className="text-blue-600">
              + Add
            </button>
            {keyHighlights.length > 1 && (
              <button type="button" onClick={() => removeField(setKeyHighlights, keyHighlights.length - 1)} className="text-red-500">
                Remove last
              </button>
            )}
          </div>
        </section>

        {/* SYLLABUS */}
        <section>
          <h2 className="font-semibold text-lg mb-2">Syllabus</h2>
          {syllabus.map((sem, i) => (
            <div key={i} className="border p-4 rounded-md mb-4">
              <input
                type="text"
                placeholder="Semester"
                value={sem.semester}
                onChange={(e) => handleDynamicChange(setSyllabus, i, "semester", e.target.value)}
                className="border p-2 rounded-md w-full mb-2"
              />
              {(sem.subjects || []).map((sub, j) => (
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
                      onClick={() => {
                        const updated = [...syllabus];
                        updated[i].subjects = updated[i].subjects.filter((_, idx) => idx !== j);
                        setSyllabus(updated);
                      }}
                      className="bg-red-500 text-white px-3 rounded"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <button type="button" onClick={() => addSubject(i)} className="text-blue-600">
                  + Add Subject
                </button>
                {sem.subjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...syllabus];
                      updated[i].subjects = updated[i].subjects.slice(0, -1);
                      setSyllabus(updated);
                    }}
                    className="text-red-500"
                  >
                    Remove last subject
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addField(setSyllabus, { semester: "", subjects: [""] })}
              className="text-blue-600"
            >
              + Add Semester
            </button>
            {syllabus.length > 1 && (
              <button type="button" onClick={() => removeField(setSyllabus, syllabus.length - 1)} className="text-red-500">
                Remove last semester
              </button>
            )}
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Saving..." : courseId ? "Update Course" : "Create Course"}
        </button>
      </form>
    </main>
  );
}
