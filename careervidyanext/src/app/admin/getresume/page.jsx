"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utlis/api.js";
import Sendemailfrom from "../components/sendemailfrom.jsx";

export default function ApplicationManagementPage() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicantEmail, setSelectedApplicantEmail] = useState("");

  // Resume viewer states
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeRawUrl, setResumeRawUrl] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [resumeError, setResumeError] = useState(false);

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      const res = await api.get("/api/v1/resume");

      console.log("API RAW RESPONSE =>", res.data);

      const apps =
        res.data?.applications ||
        res.data?.data ||
        res.data?.allApplications ||
        res.data?.resumeList ||
        res.data?.resumes ||
        res.data?.items ||
        [];

      setApplications(Array.isArray(apps) ? apps : []);
    } catch (error) {
      console.log("Fetch Error:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Search Filter
  const filtered = applications.filter((a) =>
    `${a.name || ""} ${a.email || ""} ${a.phone || ""} ${
      a.experience || ""
    } ${a.expectedSalary || ""} ${a.noticePeriod || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Delete Application
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await api.delete(`/api/v1/resume/${id}`);
      fetchApplications();
    } catch (error) {
      console.log("Delete Error:", error.response?.data || error);
    }
  };

  // Send Email Modal
  const handleSendEmailClick = (email) => {
    setSelectedApplicantEmail(email);
    setIsModalOpen(true);
  };

  // Status Update
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/api/v1/resume/${id}/status`, {
        status: newStatus,
      });

      setApplications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.log("Status Update Error:", error);
    }
  };

  // Open Resume / Document in modal
  const handleOpenResume = async (url, title) => {
    if (!url) return;

    const cleanUrl = url
      .replace("http://", "https://")
      .replace("/fl_attachment", "")
      .replace("fl_attachment/", "");

    setResumeTitle(title || "Document");
    setResumeRawUrl(cleanUrl);
    setResumeError(false);
    setResumeUrl("");
    setIsResumeOpen(true);

    const lower = cleanUrl.toLowerCase().split("?")[0];
    const isPdf = lower.endsWith(".pdf");
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/.test(lower);

    // Image ho to seedha dikhao
    if (isImage) {
      setResumeUrl(cleanUrl);
      return;
    }

    // doc/docx browser me inline nahi khulti
    if (!isPdf) {
      setResumeError(true);
      return;
    }

    const toBlobUrl = async (res) => {
      const blob = await res.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      return URL.createObjectURL(pdfBlob);
    };

    try {
      // 1) Seedha Cloudinary se fetch
      const res = await fetch(cleanUrl);
      if (!res.ok) throw new Error("Direct fetch failed");
      setResumeUrl(await toBlobUrl(res));
    } catch (err) {
      console.log("Direct fetch failed, trying proxy:", err);

      try {
        // 2) Proxy route se fetch
        const res = await fetch(
          `/api/file-proxy?url=${encodeURIComponent(cleanUrl)}`
        );
        if (!res.ok) throw new Error("Proxy fetch failed");
        setResumeUrl(await toBlobUrl(res));
      } catch (proxyErr) {
        console.log("Proxy fetch failed:", proxyErr);
        setResumeError(true);
      }
    }
  };

  const handleCloseResume = () => {
    if (resumeUrl.startsWith("blob:")) URL.revokeObjectURL(resumeUrl);
    setIsResumeOpen(false);
    setResumeUrl("");
    setResumeRawUrl("");
    setResumeError(false);
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Application Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, phone, salary, experience..."
        className="border px-4 py-2 rounded w-full mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[1600px] w-full border-collapse border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">No.</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Expected Salary</th>
              <th className="p-3 border">Experience</th>
              <th className="p-3 border">Notice Period</th>
              <th className="p-3 border">Resume</th>
              <th className="p-3 border">Additional Document</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Applied At</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((app, index) => (
                <tr key={app._id} className="border hover:bg-gray-50">
                  {/* No */}
                  <td className="p-3 border">{index + 1}</td>

                  {/* Name */}
                  <td className="p-3 border whitespace-nowrap">
                    {app.name || "-"}
                  </td>

                  {/* Email */}
                  <td className="p-3 border">{app.email || "-"}</td>

                  {/* Phone */}
                  <td className="p-3 border whitespace-nowrap">
                    {app.phone || "-"}
                  </td>

                  {/* Expected Salary */}
                  <td className="p-3 border whitespace-nowrap">
                    {app.expectedSalary || "-"}
                  </td>

                  {/* Experience */}
                  <td className="p-3 border whitespace-nowrap">
                    {app.experience ? `${app.experience} yrs` : "-"}
                  </td>

                  {/* Notice Period */}
                  <td className="p-3 border whitespace-nowrap">
                    {app.noticePeriod !== undefined &&
                    app.noticePeriod !== null
                      ? `${app.noticePeriod} days`
                      : "-"}
                  </td>

                  {/* Resume */}
                  <td className="p-3 border">
                    {app.resume ? (
                      <button
                        onClick={() =>
                          handleOpenResume(app.resume, `${app.name} - Resume`)
                        }
                        className="text-blue-600 underline"
                      >
                        View Resume
                      </button>
                    ) : (
                      "No File"
                    )}
                  </td>

                  {/* Additional Document */}
                  <td className="p-3 border">
                    {app.additionalDocument ? (
                      <button
                        onClick={() =>
                          handleOpenResume(
                            app.additionalDocument,
                            `${app.name} - Document`
                          )
                        }
                        className="text-blue-600 underline"
                      >
                        View Document
                      </button>
                    ) : (
                      "No File"
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-3 border">
                    <select
                      value={app.status || "Pending"}
                      className="border p-1 rounded"
                      onChange={(e) =>
                        handleStatusChange(app._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Interview Scheduled">
                        Interview Scheduled
                      </option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hired">Hired</option>
                    </select>
                  </td>

                  {/* Applied At */}
                  <td className="p-3 border whitespace-nowrap">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleString()
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="p-3 border">
                    <div className="flex gap-2 whitespace-nowrap">
                      <button
                        onClick={() => handleSendEmailClick(app.email)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Send Email
                      </button>

                      <Link
                        href={`/admin/applications/${app._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => handleDelete(app._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="p-6 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Email Modal */}
      {isModalOpen && (
        <Sendemailfrom
          toEmail={selectedApplicantEmail}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Resume Viewer Modal */}
      {isResumeOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold">{resumeTitle}</h2>
              <button
                onClick={handleCloseResume}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="flex-1">
              {resumeError ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-6">
                  <p className="text-red-500">
                    File yahan load nahi ho paayi.
                  </p>
                  <a
                    href={resumeRawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    New Tab me kholo
                  </a>
                </div>
              ) : resumeUrl ? (
                <iframe
                  src={resumeUrl}
                  title={resumeTitle}
                  className="w-full h-full"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}