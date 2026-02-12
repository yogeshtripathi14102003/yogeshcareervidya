"use client";

import { useState, useEffect } from "react";
import API from "@/utlis/api.js"; // use centralized API

export default function ContentPage() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    type: "offer",
    title: "",
    description: "",
    discountPercentage: "",
    validFrom: "",
    validTill: "",
    provider: "",
    amount: "",
    eligibility: "",
    fileUrl: "",
    thumbnail: "",
  });

  // Fetch all content
  const fetchContents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/v1/offer");
      setContents(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/v1/offer", form);
      setForm({
        type: "offer",
        title: "",
        description: "",
        discountPercentage: "",
        validFrom: "",
        validTill: "",
        provider: "",
        amount: "",
        eligibility: "",
        fileUrl: "",
        thumbnail: "",
      });
      fetchContents();
    } catch (err) {
      console.error(err);
      alert("Error creating content");
    }
  };

  // Delete content
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    try {
      await API.delete(`/api/v1/offer/${id}`);
      fetchContents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Content Manager</h1>

      {/* ===== Add Content Form ===== */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded mb-6 space-y-4"
      >
        <div>
          <label className="block font-semibold mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="offer">Offer</option>
            <option value="subsidy">Subsidy</option>
            <option value="brochure">Brochure</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Conditional Fields based on Type */}
        {form.type === "offer" && (
          <>
            <input
              type="number"
              placeholder="Discount %"
              name="discountPercentage"
              value={form.discountPercentage}
              onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="date"
              placeholder="Valid From"
              name="validFrom"
              value={form.validFrom}
              onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="date"
              placeholder="Valid Till"
              name="validTill"
              value={form.validTill}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </>
        )}

        {form.type === "subsidy" && (
          <>
            <input
              placeholder="Provider"
              name="provider"
              value={form.provider}
              onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="number"
              placeholder="Amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              placeholder="Eligibility"
              name="eligibility"
              value={form.eligibility}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </>
        )}

        {form.type === "brochure" && (
          <>
            <input
              placeholder="File URL"
              name="fileUrl"
              value={form.fileUrl}
              onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              placeholder="Thumbnail URL"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Content
        </button>
      </form>

      {/* ===== Content List ===== */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contents.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded shadow relative"
            >
              <span className="absolute top-2 right-2 text-sm text-gray-500">
                {item.couponId}
              </span>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.type.toUpperCase()}</p>
              <p className="mt-2">{item.description}</p>

              {/* Type-specific display */}
              {item.type === "offer" && (
                <p>Discount: {item.discountPercentage}% | Valid: {new Date(item.validFrom).toLocaleDateString()} - {new Date(item.validTill).toLocaleDateString()}</p>
              )}
              {item.type === "subsidy" && (
                <p>Provider: {item.provider} | Amount: ₹{item.amount} | Eligibility: {item.eligibility}</p>
              )}
              {item.type === "brochure" && (
                <p>File: <a href={item.fileUrl} target="_blank" className="text-blue-600 underline">View</a></p>
              )}

              <button
                onClick={() => handleDelete(item._id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
