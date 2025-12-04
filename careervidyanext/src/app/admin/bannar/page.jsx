// "use client";
// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js";// ✅ import the axios instance

// export default function BannerForm() {
//   const [title, setTitle] = useState("");
//   const [position, setPosition] = useState("HERO");
//   const [linkUrl, setLinkUrl] = useState("");
//   const [promotionId, setPromotionId] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!image) {
//       alert("Please select an image before submitting");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("position", position);
//       if (linkUrl) formData.append("linkUrl", linkUrl);
//       if (promotionId) formData.append("promotionId", promotionId);
//       if (startDate) formData.append("startDate", startDate);
//       if (endDate) formData.append("endDate", endDate);
//       formData.append("image", image);

//       // ✅ Use api.js (no auth headers needed)
//       const res = await api.post("/api/v1/banner", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("✅ Banner created:", res.data);
//       alert("Banner created successfully!");

//       // Reset form
//       setTitle("");
//       setLinkUrl("");
//       setPromotionId("");
//       setStartDate("");
//       setEndDate("");
//       setImage(null);
//     } catch (error) {
//       console.error("❌ Error creating banner:", error);
//       alert(error.response?.data?.msg || "Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 space-y-3 max-w-lg mx-auto mt-6 bg-white"
//     >
//       <h2 className="text-xl font-bold">Upload Banner</h2>

//       <input
//         type="text"
//         placeholder="Banner Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         required
//         className="w-full border rounded p-2"
//       />

//       <select
//         value={position}
//         onChange={(e) => setPosition(e.target.value)}
//         className="w-full border rounded p-2"
//         required
//       >
//         <option value="HERO">HERO</option>
//         <option value="STRIP">STRIP</option>
//       </select>

//       <input
//         type="text"
//         placeholder="Link URL (optional)"
//         value={linkUrl}
//         onChange={(e) => setLinkUrl(e.target.value)}
//         className="w-full border rounded p-2"
//       />

//       <input
//         type="text"
//         placeholder="Promotion ID (optional)"
//         value={promotionId}
//         onChange={(e) => setPromotionId(e.target.value)}
//         className="w-full border rounded p-2"
//       />

//       <div className="flex gap-2">
//         <input
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           className="border rounded p-2 w-1/2"
//         />
//         <input
//           type="date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           className="border rounded p-2 w-1/2"
//         />
//       </div>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setImage(e.target.files[0])}
//         required
//         className="w-full border rounded p-2"
//       />

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//       >
//         {loading ? "Uploading..." : "Create Banner"}
//       </button>
//     </form>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import api from "@/utlis/api.js"; // axios instance

export default function BannerForm() {
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("HERO");
  const [linkUrl, setLinkUrl] = useState("");
  const [promotionId, setPromotionId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // NEW FIELDS
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!desktopImage || !mobileImage) {
      alert("Please upload both Desktop and Mobile images.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("position", position);

      if (linkUrl) formData.append("linkUrl", linkUrl);

      // ✅ FIX: Only send promotionId when valid
      if (promotionId.trim() !== "") {
        formData.append("promotionId", promotionId.trim());
      }

      if (startDate) formData.append("startDate", startDate);
      if (endDate) formData.append("endDate", endDate);

      // IMAGES
      formData.append("desktopImage", desktopImage);
      formData.append("mobileImage", mobileImage);

      const res = await api.post("/api/v1/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Banner created successfully!");
      console.log("Banner created:", res.data);

      // Reset form
      setTitle("");
      setLinkUrl("");
      setPromotionId("");
      setStartDate("");
      setEndDate("");
      setDesktopImage(null);
      setMobileImage(null);
    } catch (error) {
      console.error("Error creating banner:", error);
      alert(error.response?.data?.msg || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300 space-y-3 max-w-lg mx-auto mt-6 bg-white"
    >
      <h2 className="text-xl font-bold">Upload Banner</h2>

      <input
        type="text"
        placeholder="Banner Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border rounded p-2"
      />

      <select
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        className="w-full border rounded p-2"
        required
      >
        <option value="HERO">HERO</option>
        <option value="STRIP">STRIP</option>
      </select>

      <input
        type="text"
        placeholder="Link URL (optional)"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        className="w-full border rounded p-2"
      />

      <input
        type="text"
        placeholder="Promotion ID (optional)"
        value={promotionId}
        onChange={(e) => setPromotionId(e.target.value)}
        className="w-full border rounded p-2"
      />

      <div className="flex gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded p-2 w-1/2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-2 w-1/2"
        />
      </div>

      {/* Desktop */}
      <div>
        <label className="font-semibold block">Desktop Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setDesktopImage(e.target.files[0])}
          required
          className="w-full border rounded p-2"
        />
      </div>

      {/* Mobile */}
      <div>
        <label className="font-semibold block">Mobile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setMobileImage(e.target.files[0])}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Create Banner"}
      </button>
    </form>
  );
}
