"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utlis/api.js";

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchCourse = async () => {
      try {
        // ✅ Match your backend route — GET /api/v1/course/:slug
        const res = await api.get(`/api/v1/course/${slug}`);
        setCourse(res.data.course);
      } catch (err) {
        console.error("❌ Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (!course)
    return (
      <p className="p-8 text-center text-red-500">
        ❌ Course not found — please check the slug route.
      </p>
    );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      {/* Course Header */}
      <section className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-xl shadow">
        {course.courseLogo?.url && (
          <img
            src={course.courseLogo.url}
            alt={course.name}
            className="w-40 h-40 object-contain rounded"
          />
        )}
        <div>
          <h1 className="text-3xl font-semibold">{course.name}</h1>
          <p className="text-gray-600">
            {course.category} • {course.duration}
          </p>
          <p className="mt-2 text-blue-600">
            {course.specialization?.join(", ")}
          </p>
          <p className="mt-1 text-gray-500">{course.tag}</p>
        </div>
      </section>

      {/* Overview */}
      {course.overview?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {course.overview.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow">
                {item.image?.url && (
                  <img
                    src={item.image.url}
                    alt={item.heading}
                    className="w-full h-40 object-cover rounded"
                  />
                )}
                <h3 className="font-semibold text-lg mt-3">{item.heading}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
                {item.videoLink && (
                  <a
                    href={item.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm mt-2 inline-block"
                  >
                    🎥 Watch Video
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {course.whyChooseUs?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {course.whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow text-center"
              >
                {item.image?.url && (
                  <img
                    src={item.image.url}
                    alt="why"
                    className="w-24 h-24 object-contain mx-auto mb-2"
                  />
                )}
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Good Things */}
      {course.goodThings?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Good Things</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            {course.goodThings.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Top Universities */}
      {course.topUniversities?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Top Universities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {course.topUniversities.map((u, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold text-lg">{u.name}</h3>
                <p className="text-gray-600">{u.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Highlights */}
      {course.keyHighlights?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Key Highlights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {course.keyHighlights.map((h, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold">{h.heading}</h3>
                <p className="text-sm text-gray-500 mb-1">{h.subHeading}</p>
                <p className="text-gray-700">{h.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Syllabus */}
      {course.syllabus?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Syllabus</h2>
          {course.syllabus.map((sem, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow mb-4">
              <h3 className="font-semibold text-lg mb-2">{sem.semester}</h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-1">
                {sem.subjects.map((sub, j) => (
                  <li key={j}>{sub}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
