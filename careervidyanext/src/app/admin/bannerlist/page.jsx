// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// export default function Page() {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const bannersPerPage = 7;

//   const router = useRouter();
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("admintoken") : "";

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   const fetchBanners = async () => {
//     try {
//       const res = await axios.get("http://localhost:8080/api/admin/banner", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(res.data);
//     } catch (error) {
//       console.error("❌ Error fetching banners:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this banner?")) return;

//     try {
//       await axios.delete(`http://localhost:8080/api/admin/banner/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setBanners(banners.filter((b) => b._id !== id));
//       alert("✅ Banner deleted!");
//     } catch (error) {
//       console.error("❌ Error deleting banner:", error);
//       alert("Error deleting banner!");
//     }
//   };

//   // 🔍 Filter by all fields
//   const filteredBanners = banners.filter((b) => {
//     const query = search.toLowerCase();
//     return (
//       b.title?.toLowerCase().includes(query) ||
//       b.position?.toLowerCase().includes(query) ||
//       b.linkUrl?.toLowerCase().includes(query) ||
//       b.promotionId?.toLowerCase().includes(query) ||
//       (b.startDate &&
//         new Date(b.startDate).toLocaleDateString().toLowerCase().includes(query)) ||
//       (b.endDate &&
//         new Date(b.endDate).toLocaleDateString().toLowerCase().includes(query))
//     );
//   });

//   // 📄 Pagination logic
//   const indexOfLast = currentPage * bannersPerPage;
//   const indexOfFirst = indexOfLast - bannersPerPage;
//   const currentBanners = filteredBanners.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredBanners.length / bannersPerPage);

//   if (loading) return <p className="text-center">Loading banners...</p>;

//   return (
//     <div className="p-6 product-slider">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center mb-4">
//         <input
//           type="text"
//           placeholder="Search by any field..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setCurrentPage(1); // reset to page 1 when searching
//           }}
//           className="border rounded px-3 py-2 w-1/3"
//         />
//         <button
//           onClick={() => router.push("/admin/bannar")} // ✅ update path to your form
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           + Add Banner
//         </button>
//       </div>

//       {/* Table */}
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">#</th>
//             <th className="border p-2">Image</th>
//             <th className="border p-2">Title</th>
//             <th className="border p-2">Position</th>
//             <th className="border p-2">LinkUrl</th>
//             <th className="border p-2">Promotion</th>
//             <th className="border p-2">Start - End</th>
//             <th className="border p-2">Status</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentBanners.length > 0 ? (
//             currentBanners.map((b, i) => {
//               const now = new Date();
//               const endDate = b.endDate ? new Date(b.endDate) : null;
//               const status =
//                 endDate && endDate < now ? "Unavailable" : "Available";

//               return (
//                 <tr key={b._id}>
//                   <td className="border p-2">{indexOfFirst + i + 1}</td>
//                   <td className="border p-2">
//                     <img
//                       src={b.image?.url || "/placeholder.png"}
//                       alt={b.title}
//                       className="h-12 w-24 object-cover"
//                     />
//                   </td>
//                   <td className="border p-2">{b.title}</td>
//                   <td className="border p-2">{b.position}</td>
//                   <td className="border p-2">{b.linkUrl || "-"}</td>
//                   <td className="border p-2">{b.promotionId || "-"}</td>
//                   <td className="border p-2">
//                     {b.startDate
//                       ? new Date(b.startDate).toLocaleDateString()
//                       : "-"}{" "}
//                     -{" "}
//                     {b.endDate
//                       ? new Date(b.endDate).toLocaleDateString()
//                       : "-"}
//                   </td>
//                   <td className="border p-2">
//                     <span
//                       className={`px-2 py-1 rounded text-white ${
//                         status === "Available"
//                           ? "bg-green-600"
//                           : "bg-red-600"
//                       }`}
//                     >
//                       {status}
//                     </span>
//                   </td>
//                   <td className="border p-2 space-x-2">
//                     <button
//                       onClick={() => handleDelete(b._id)}
//                       className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan="9" className="text-center p-4">
//                 No banners found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-4 space-x-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((p) => p - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 border rounded ${
//                 currentPage === i + 1 ? "bg-blue-600 text-white" : ""
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((p) => p + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const bannersPerPage = 7;

  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admintoken") : "";

  useEffect(() => {
    fetchBanners();
  }, []);

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      const res = await axios.get("https://api.careervidya.in/api/v1/banner", {
        // const res = await axios.get("http://localhost:8080/api/v1/banner", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Map desktopImage and mobileImage to image.desktop.url and image.mobile.url
      const mappedBanners = res.data.map((b) => ({
        ...b,
        image: {
          desktop: { url: b.desktopImage?.url },
          mobile: { url: b.mobileImage?.url },
        },
      }));

      setBanners(mappedBanners);
    } catch (error) {
      console.error("❌ Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      await axios.delete(`https://api.careervidya.in/api/v1/banner/${id}`, {
        // await axios.delete(`http://localhost:8080/api/v1/banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBanners(banners.filter((b) => b._id !== id));
      alert("✅ Banner deleted!");
    } catch (error) {
      console.error("❌ Error deleting banner:", error);
      alert("Error deleting banner!");
    }
  };

  // Filter banners by search
  const filteredBanners = banners.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.position?.toLowerCase().includes(q) ||
      b.linkUrl?.toLowerCase().includes(q) ||
      b.promotionId?.toLowerCase().includes(q) ||
      (b.startDate &&
        new Date(b.startDate).toLocaleDateString().toLowerCase().includes(q)) ||
      (b.endDate &&
        new Date(b.endDate).toLocaleDateString().toLowerCase().includes(q))
    );
  });

  // Pagination logic
  const indexOfLast = currentPage * bannersPerPage;
  const indexOfFirst = indexOfLast - bannersPerPage;
  const currentBanners = filteredBanners.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBanners.length / bannersPerPage);

  if (loading) return <p className="text-center">Loading banners...</p>;

  return (
    <div className="p-4 md:p-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by any field..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />

        <button
          onClick={() => router.push("/admin/bannar")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
        >
          + Add Banner
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm md:text-base">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2">#</th>
              <th className="border p-2">Images</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">LinkUrl</th>
              <th className="border p-2">Promotion</th>
              <th className="border p-2">Start - End</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentBanners.length > 0 ? (
              currentBanners.map((b, i) => {
                const now = new Date();
                const endDate = b.endDate ? new Date(b.endDate) : null;
                const status =
                  endDate && endDate < now ? "Unavailable" : "Available";

                return (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="border p-2">{indexOfFirst + i + 1}</td>

                    {/* Desktop + Mobile Images */}
                    <td className="border p-2">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500">Desktop</span>
                          <img
                            src={b.image?.desktop?.url || "/placeholder.png"}
                            alt="Desktop Banner"
                            className="h-14 w-28 object-cover rounded border"
                          />
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-500">Mobile</span>
                          <img
                            src={b.image?.mobile?.url || "/placeholder.png"}
                            alt="Mobile Banner"
                            className="h-14 w-12 object-cover rounded border"
                          />
                        </div>
                      </div>
                    </td>

                    <td className="border p-2">{b.title}</td>
                    <td className="border p-2">{b.position}</td>
                    <td className="border p-2 truncate max-w-[150px]">
                      {b.linkUrl || "-"}
                    </td>
                    <td className="border p-2">{b.promotionId || "-"}</td>

                    <td className="border p-2 whitespace-nowrap">
                      {b.startDate
                        ? new Date(b.startDate).toLocaleDateString()
                        : "-"}{" "}
                      -{" "}
                      {b.endDate
                        ? new Date(b.endDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          status === "Available"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  No banners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center mt-4 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
