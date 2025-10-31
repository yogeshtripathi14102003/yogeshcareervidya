// "use client";
 
// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js"; // ✅ your axios instance with baseURL
  

// export default function NewsletterPage() {
//   const [subscribers, setSubscribers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");
//   const [logs, setLogs] = useState([]);

//   // 🧠 Fetch subscribers
//   const fetchSubscribers = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/api/admin/newsletter/subscribers", {
//         withCredentials: true, // ⬅️ keep cookies if your auth uses them
//       });
//       if (res.data?.subscribers) {
//         setSubscribers(res.data.subscribers);
//       }
//     } catch (err) {
//       console.error("Failed to fetch subscribers:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🧠 Send newsletter
//   const handleSend = async (e) => {
//     e.preventDefault();

//     if (!subject || !body) {
//       alert("Please enter both subject and content.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await api.post(
//         "/api/admin/newsletter/send",
//         { subject, body },
//         { withCredentials: true }
//       );

//       if (res.status === 200) {
//         alert("✅ Newsletter sent successfully!");
//         setLogs((prev) => [res.data.log, ...prev]);
//         setSubject("");
//         setBody("");
//       } else {
//         alert(res.data?.message || "Failed to send newsletter.");
//       }
//     } catch (err) {
//       console.error("Error sending newsletter:", err);
//       alert("Error while sending newsletter.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubscribers();
//   }, []);

//   return (
//     <div className="container">
//       <main className="main-content">
//         {/* Header */}
//         <div className="header">
//           <h1>
//             <i className="fas fa-newspaper"></i> Newsletter Management
//           </h1>
//         </div>

//         {/* Stats */}
//         <div className="stats-cards">
//           <div className="stat-card">
//             <div className="stat-info">
//               <h3>Total Subscribers</h3>
//               <p>{loading ? "Loading..." : subscribers.length}</p>
//             </div>
//             <div className="stat-icon green">
//               <i className="fas fa-users"></i>
//             </div>
//           </div>
//         </div>

//         {/* Logs Table */}
//         <div className="newsletter-table">
//           <div className="table-header">
//             <h2>Sent Newsletters</h2>
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Subject</th>
//                 <th>Recipients</th>
//                 <th>Status</th>
//                 <th>Sent At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {logs.length === 0 ? (
//                 <tr>
//                   <td colSpan="4">No newsletters sent yet</td>
//                 </tr>
//               ) : (
//                 logs.map((log) => (
//                   <tr key={log._id}>
//                     <td>{log.subject}</td>
//                     <td>{log.recipients?.length || 0}</td>
//                     <td>
//                       <span className={`status ${log.status}`}>{log.status}</span>
//                     </td>
//                     <td>
//                       {log.sentAt ? new Date(log.sentAt).toLocaleString() : "-"}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Newsletter Form */}
//         <div className="create-newsletter">
//           <div className="create-header">
//             <h2>
//               <i className="fas fa-plus-circle"></i> Create New Newsletter
//             </h2>
//           </div>
//           <form onSubmit={handleSend}>
//             <div className="form-group">
//               <label>Email Subject</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter email subject"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <label>Content</label>
//               <textarea
//                 className="form-control"
//                 placeholder="Write your newsletter..."
//                 value={body}
//                 onChange={(e) => setBody(e.target.value)}
//               ></textarea>
//             </div>
//             <button type="submit" className="btn btn-primary" disabled={loading}>
//               {loading ? "Sending..." : "Send Newsletter"}
//             </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [logs, setLogs] = useState([]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/subscribers", {
        withCredentials: true,
      });
      if (res.data?.subscribers) {
        setSubscribers(res.data.subscribers);
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !body) return alert("Please enter both subject and content.");

    try {
      setLoading(true);
      const res = await api.post(
        "/api/v1/send",
        { subject, body },
        { withCredentials: true }
      );
      if (res.status === 200) {
        alert("✅ Newsletter sent successfully!");
        setLogs((prev) => [res.data.log, ...prev]);
        setSubject("");
        setBody("");
      }
    } catch (err) {
      console.error("Error sending newsletter:", err);
      alert("Error while sending newsletter.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white p-6 shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <i className="fas fa-newspaper text-blue-500"></i> Newsletter Management
        </h1>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 font-medium">Total Subscribers</h3>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? "..." : subscribers.length}
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>

        {/* Newsletter Logs */}
        <section className="bg-white shadow rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Sent Newsletters</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-100">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                  <th className="p-3">Subject</th>
                  <th className="p-3">Recipients</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No newsletters sent yet
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-800">{log.subject}</td>
                      <td className="p-3">{log.recipients?.length || 0}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            log.status === "sent"
                              ? "bg-green-100 text-green-700"
                              : log.status === "scheduled"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {log.sentAt
                          ? new Date(log.sentAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Create Newsletter Form */}
        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-plus-circle text-blue-500"></i> Create New Newsletter
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Write your newsletter..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Newsletter"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
