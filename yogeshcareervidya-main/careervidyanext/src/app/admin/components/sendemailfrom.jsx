// src/app/admin/components/sendemailfrom.jsx

"use client";

import { useState } from "react";
import api from "@/utlis/api";

export default function SendEmailModal({ app, onClose }) {
  // FIX: Use optional chaining (app?.status) to prevent error if app is undefined
  const [status, setStatus] = useState(app?.status || "Pending"); 
  const [description, setDescription] = useState("");

  const sendEmail = async () => {
    // You should also safely access app.email and app.name here
    const res = await api.post("/api/send-email", {
      email: app?.email,
      status,
      description,
    });

    alert(res.message || "Email Sent!");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">
          Send Email to {app?.name} {/* Use optional chaining here too */}
        </h2>

        {/* Status Dropdown */}
        <label className="font-semibold">Status</label>
        <select
          className="w-full border p-2 rounded mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Rejected">Rejected</option>
          <option value="Hired">Hired</option>
        </select>

        {/* Description */}
        <label className="font-semibold">Description</label>
        <textarea
          className="w-full border p-2 rounded mb-4"
          rows={3}
          placeholder="Write custom message..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={sendEmail}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import api from "@/utlis/api";

// export default function SendEmailModal({ app, onClose, onUpdated }) {
//   const [email, setEmail] = useState(app?.email || "");
//   const [status] = useState(app?.status || "Pending"); // READ ONLY
//   const [description, setDescription] = useState("");

//   const updateStatus = async () => {
//     const res = await api.patch(`/api/v1/resume/${app?._id}/status`, {
//       status,          // status direct DB me jayega
//       description,
//       email,           // admin ne input me jo diya
//     });

//     alert(res.message || "Updated!");
//     onUpdated();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg w-[400px]">
//         <h2 className="text-xl font-semibold mb-4">
//           Send Email — {app?.name}
//         </h2>

//         {/* Email Input */}
//         <label className="font-semibold">Send To Email</label>
//         <input
//           className="w-full border p-2 rounded mb-4"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter email address"
//         />

//         {/* Status (read-only) */}
//         <label className="font-semibold">Status</label>
//         <input
//           className="w-full border p-2 rounded mb-4 bg-gray-100"
//           type="text"
//           value={status}
//           readOnly
//         />

//         {/* Description */}
//         <label className="font-semibold">Message</label>
//         <textarea
//           className="w-full border p-2 rounded mb-4"
//           rows={3}
//           placeholder="Write custom message..."
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         ></textarea>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-400 text-white rounded"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={updateStatus}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Send Email
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
