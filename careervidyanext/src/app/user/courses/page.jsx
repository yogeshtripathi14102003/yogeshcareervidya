"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import {
  BookOpen,
  Loader2,
  GraduationCap,
  Building2,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CourseApplyPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/api/v1/students/applied-courses");
      setCourses(res.data?.courses || []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Could not load your applied courses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl">
      {/* Heading */}
      <div className="mb-6 flex items-center gap-3 sm:mb-8">
        <div className="cv-icon-gradient h-11 w-11 shrink-0">
          <BookOpen size={20} />
        </div>

        <div className="min-w-0">
          <h1 className="m-0 text-xl font-bold leading-tight text-neutral-dark sm:text-2xl">
            My Applied Courses
          </h1>
          <p className="m-0 mt-0.5 text-xs text-neutral-mid sm:text-sm">
            {loading
              ? "Loading your applications..."
              : error
              ? "Something went wrong"
              : `${courses.length} ${
                  courses.length === 1 ? "application" : "applications"
                } submitted`}
          </p>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          aria-busy="true"
          aria-label="Loading courses"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-neutral-border bg-white p-5"
            >
              <div className="h-4 w-3/4 rounded bg-neutral-border" />
              <div className="mt-3 h-3 w-1/2 rounded bg-neutral-border" />
              <div className="mt-6 flex items-center justify-between">
                <div className="h-6 w-20 rounded-full bg-neutral-border" />
                <div className="h-3 w-24 rounded bg-neutral-border" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          role="alert"
          className="flex flex-col items-center rounded-xl border border-red-200 bg-red-50 px-4 py-10 text-center sm:py-12"
        >
          <AlertCircle size={32} className="mb-3 text-red-500" />
          <h2 className="m-0 text-base font-semibold text-red-700">
            Unable to load courses
          </h2>
          <p className="mx-auto mb-5 mt-1 max-w-sm text-sm text-red-600">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchCourses}
            className="cv-btn-cta inline-flex min-h-10 items-center justify-center gap-2 px-5 text-sm"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && courses.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-neutral-border bg-white px-4 py-12 text-center sm:py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-light text-accent">
            <BookOpen size={30} />
          </div>
          <h2 className="m-0 text-lg font-semibold text-neutral-dark">
            No Course Found
          </h2>
          <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-neutral-mid">
            You haven&apos;t applied to any course yet. Once you apply, it
            will show up here.
          </p>
        </div>
      )}

      {/* Courses */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <article
              key={course._id}
              className="group relative min-w-0 overflow-hidden rounded-xl border border-neutral-border bg-white p-4 pl-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(15,23,42,0.25)] sm:p-5 sm:pl-6"
            >
              {/* Accent strip */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1"
                style={{ background: "var(--cv-grad-cta)" }}
              />

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <GraduationCap size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="m-0 break-words text-base font-semibold leading-snug text-neutral-dark">
                    {course.courseName || "Untitled Course"}
                  </h2>

                  <p className="m-0 mt-1.5 flex items-start gap-1.5 text-xs text-neutral-mid sm:text-sm">
                    <Building2 size={14} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 break-words">
                      {course.universityName || "-"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-border pt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 size={13} />
                  Applied
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs text-neutral-mid">
                  <CalendarDays size={13} />
                  {formatDate(course.createdAt)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}