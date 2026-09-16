
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import api from "@/utlis/api.js";
// import Sendemailfrom from "../components/sendemailfrom.jsx";

// export default function ApplicationManagementPage() {
//   const [applications, setApplications] = useState([]);
//   const [search, setSearch] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedApplicantEmail, setSelectedApplicantEmail] = useState("");

//   // Fetch Applications
//   const fetchApplications = async () => {
//     try {
//       const res = await api.get("/api/v1/resume");

//       console.log("API RAW RESPONSE => ", res.data);

//       // Support ANY backend structure automatically
//       const apps =
//         res.data?.applications ||
//         res.data?.data ||
//         res.data?.allApplications ||
//         res.data?.resumeList ||
//         res.data?.resumes ||
//         res.data?.items ||
//         [];

//       setApplications(apps);
//     } catch (error) {
//       console.log("Fetch Error:", error.response?.data || error);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   // Search Filter
//   const filtered = applications.filter((a) =>
//     `${a.name} ${a.email} ${a.experience}`
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   // Delete Application
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure?")) return;

//     try {
//       await api.delete(`/api/v1/resume/${id}`);
//       fetchApplications();
//     } catch (error) {
//       console.log("Delete Error:", error.response?.data || error);
//     }
//   };

//   // Send Email Modal
//   const handleSendEmailClick = (email) => {
//     setSelectedApplicantEmail(email);
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="p-5">
//       <h1 className="text-3xl font-bold mb-5">Application Management</h1>

//       {/* Search Bar */}
//       <input
//         type="text"
//         placeholder="Search by name, email, or experience..."
//         className="border px-4 py-2 rounded w-full mb-6"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full border">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-3 border">No.</th>
//               <th className="p-3 border">Name</th>
//               <th className="p-3 border">Email</th>
//               <th className="p-3 border">Experience</th>
//               <th className="p-3 border">Resume</th>
//               <th className="p-3 border">Status</th>
//               <th className="p-3 border">Applied At</th>
//               <th className="p-3 border">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filtered.map((app, index) => (
//               <tr key={app._id} className="border">
//                 <td className="p-3 border">{index + 1}</td>
//                 <td className="p-3 border">{app.name}</td>
//                 <td className="p-3 border">{app.email}</td>
//                 <td className="p-3 border">{app.experience} yrs</td>

//                 <td className="p-3 border">
//                   {app.resume ? (
//                     <a
//                       href={app.resume}
//                       target="_blank"
//                       className="text-blue-500 underline"
//                     >
//                       View
//                     </a>
//                   ) : (
//                     "No File"
//                   )}
//                 </td>

//                 {/* STATUS UPDATE */}
//                 <td className="p-3 border">
//                   <select
//                     value={app.status || "Pending"}
//                     className="border p-1 rounded"
//                     onChange={async (e) => {
//                       try {
//                         const newStatus = e.target.value;

//                         await api.patch(
//                           `/api/v1/resume/${app._id}/status`,
//                           { status: newStatus }
//                         );

//                         // Update UI immediately
//                         setApplications((prev) =>
//                           prev.map((item) =>
//                             item._id === app._id
//                               ? { ...item, status: newStatus }
//                               : item
//                           )
//                         );
//                       } catch (error) {
//                         console.log("Status Update Error", error);
//                       }
//                     }}
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Reviewed">Reviewed</option>
//                     <option value="Interview Scheduled">
//                       Interview Scheduled
//                     </option>
//                     <option value="Rejected">Rejected</option>
//                     <option value="Hired">Hired</option>
//                   </select>
//                 </td>

//                 <td className="p-3 border">
//                   {new Date(app.createdAt).toLocaleDateString()}
//                 </td>

//                 <td className="p-3 border flex gap-2">
//                   <button
//                     onClick={() => handleSendEmailClick(app.email)}
//                     className="bg-green-500 text-white px-3 py-1 rounded"
//                   >
//                     Send Email
//                   </button>

//                   <Link
//                     href={`/admin/applications/${app._id}`}
//                     className="bg-blue-500 text-white px-3 py-1 rounded"
//                   >
//                     View
//                   </Link>

//                   <button
//                     onClick={() => handleDelete(app._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Email Modal */}
//       {isModalOpen && (
//         <Sendemailfrom
//           toEmail={selectedApplicantEmail}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// }


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
          item._id === id
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (error) {
      console.log("Status Update Error:", error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">
        Application Management
      </h1>

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
                  <td className="p-3 border">
                    {index + 1}
                  </td>

                  {/* Name */}
                  <td className="p-3 border whitespace-nowrap">
                    {app.name || "-"}
                  </td>

                  {/* Email */}
                  <td className="p-3 border">
                    {app.email || "-"}
                  </td>

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
                    {app.experience
                      ? `${app.experience} yrs`
                      : "-"}
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
                      <a
                        href={app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>

                  {/* Additional Document */}
                  <td className="p-3 border">
                    {app.additionalDocument ? (
                      <a
                        href={app.additionalDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Document
                      </a>
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
                        handleStatusChange(
                          app._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Reviewed">
                        Reviewed
                      </option>

                      <option value="Interview Scheduled">
                        Interview Scheduled
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>

                      <option value="Hired">
                        Hired
                      </option>
                    </select>
                  </td>

                  {/* Applied At */}
                  <td className="p-3 border whitespace-nowrap">
                    {app.createdAt
                      ? new Date(
                          app.createdAt
                        ).toLocaleString()
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="p-3 border">
                    <div className="flex gap-2 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleSendEmailClick(app.email)
                        }
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
                        onClick={() =>
                          handleDelete(app._id)
                        }
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
                <td
                  colSpan="12"
                  className="p-6 text-center text-gray-500"
                >
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
    </div>
  );
}

