"use client";

import { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  FaSearch,
  FaSpinner,
  FaTrash,
  FaPhoneAlt,
  FaEnvelope,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaVenusMars,
  FaFilter,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaHourglassHalf,
  FaPhoneVolume,
} from "react-icons/fa";
import api from "@/utlis/api.js";

// ============================================================
// 🛠️ ADMIN — ALL CALLBACKS PAGE
// ============================================================
export default function AdminCallbacksPage() {
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all | Request Call Back | Book Counselling
  const [statusFilter, setStatusFilter] = useState("all"); // all | Pending | Contacted | Closed

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // Detail modal
  const [selected, setSelected] = useState(null);

  // ============================================================
  // 📥 FETCH ALL CALLBACKS
  // ============================================================
  const fetchCallbacks = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.get("/api/v1/callback/all");
      // Expected: { success, data: [...] }
      const data = res.data?.data || res.data || [];
      setCallbacks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load callbacks");
      setCallbacks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCallbacks();
  }, []);

  // ============================================================
  // 🔍 FILTER + SEARCH
  // ============================================================
  const filtered = useMemo(() => {
    let list = [...callbacks];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.fullName?.toLowerCase().includes(q) ||
          c.mobileNumber?.includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.course?.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      list = list.filter((c) => c.inquiryType === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter(
        (c) => (c.status || "Pending") === statusFilter
      );
    }

    // Sort by newest first
    list.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );

    return list;
  }, [callbacks, search, typeFilter, statusFilter]);

  // ============================================================
  // 📄 PAGINATION
  // ============================================================
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, statusFilter]);

  // ============================================================
  // 🗑️ DELETE
  // ============================================================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await api.delete(`/api/v1/callback/${id}`);
      setCallbacks((prev) => prev.filter((c) => c._id !== id));
      toast.success("Entry deleted");
      if (selected?._id === id) setSelected(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    }
  };

  // ============================================================
  // 🔄 STATUS UPDATE
  // ============================================================
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/api/v1/callback/${id}`, { status: newStatus });
      setCallbacks((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
      toast.success(`Marked as ${newStatus}`);
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  // ============================================================
  // 🎨 STATUS STYLES
  // ============================================================
  const statusStyle = (status = "Pending") => {
    switch (status) {
      case "Contacted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Closed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  const statusIcon = (status = "Pending") => {
    switch (status) {
      case "Contacted":
        return <FaPhoneVolume className="text-xs" />;
      case "Closed":
        return <FaCheckCircle className="text-xs" />;
      default:
        return <FaHourglassHalf className="text-xs" />;
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* ================= HEADER ================= */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Callback Requests
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                All callback & counselling requests from students
              </p>
            </div>

            <button
              onClick={() => fetchCallbacks(true)}
              disabled={refreshing}
              className="self-start sm:self-auto flex items-center gap-2 bg-white border border-slate-200 hover:border-[#3B4FE4] text-slate-700 hover:text-[#3B4FE4] font-semibold text-sm px-4 py-2.5 rounded-lg transition-all shadow-sm"
            >
              <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* ================= STATS CARDS ================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatCard
              label="Total"
              value={callbacks.length}
              color="bg-[#3B4FE4]"
            />
            <StatCard
              label="Callback"
              value={callbacks.filter((c) => c.inquiryType === "Request Call Back").length}
              color="bg-orange-500"
            />
            <StatCard
              label="Counselling"
              value={callbacks.filter((c) => c.inquiryType === "Book Counselling").length}
              color="bg-purple-500"
            />
            <StatCard
              label="Pending"
              value={
                callbacks.filter((c) => (c.status || "Pending") === "Pending")
                  .length
              }
              color="bg-red-500"
            />
          </div>

          {/* ================= FILTERS ================= */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative md:col-span-1">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search name, mobile, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE4]/40 focus:border-[#3B4FE4] transition-all"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE4]/40 focus:border-[#3B4FE4] transition-all appearance-none cursor-pointer bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="Request Call Back">Request Call Back</option>
                  <option value="Book Counselling">Book Counselling</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE4]/40 focus:border-[#3B4FE4] transition-all appearance-none cursor-pointer bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================= TABLE / LOADING / EMPTY ================= */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <FaSpinner className="animate-spin text-3xl mb-3 text-[#3B4FE4]" />
              <p className="text-sm">Loading callbacks...</p>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-left text-slate-600 font-semibold">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Mobile</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Preferred</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginated.map((c) => (
                      <tr
                        key={c._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800">
                            {c.fullName}
                          </div>
                          {c.email && c.email !== "notprovided@carrervidya.com" && (
                            <div className="text-xs text-slate-500">
                              {c.email}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          +91 {c.mobileNumber}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {c.course || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              c.inquiryType === "Book Counselling"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {c.inquiryType === "Book Counselling"
                              ? "Counselling"
                              : "Callback"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {c.preferredTime || "—"}
                          {c.preferredDate && (
                            <div className="text-[11px] text-slate-400">
                              {c.preferredDate}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={c.status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(c._id, e.target.value)
                            }
                            className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-full border cursor-pointer focus:outline-none ${statusStyle(
                              c.status
                            )}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelected(c)}
                              className="w-8 h-8 flex items-center justify-center rounded-md text-[#3B4FE4] hover:bg-[#3B4FE4]/10 transition-all"
                              title="View details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleDelete(c._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-all"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {paginated.map((c) => (
                  <div
                    key={c._id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {c.fullName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          +91 {c.mobileNumber}
                        </p>
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.inquiryType === "Book Counselling"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {c.inquiryType === "Book Counselling"
                          ? "Counselling"
                          : "Callback"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                      {c.course && (
                        <div className="flex items-center gap-2">
                          <FaGraduationCap className="text-slate-400" />
                          {c.course}
                        </div>
                      )}
                      {c.preferredTime && (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-slate-400" />
                          {c.preferredTime}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <select
                        value={c.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(c._id, e.target.value)
                        }
                        className={`flex-1 text-[11px] font-semibold px-2 py-1.5 rounded-md border cursor-pointer focus:outline-none ${statusStyle(
                          c.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <button
                        onClick={() => setSelected(c)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-[#3B4FE4] hover:bg-[#3B4FE4]/10 transition-all"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:border-[#3B4FE4] hover:text-[#3B4FE4] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-semibold transition-all ${
                        currentPage === i + 1
                          ? "bg-[#3B4FE4] text-white shadow-md"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-[#3B4FE4] hover:text-[#3B4FE4]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:border-[#3B4FE4] hover:text-[#3B4FE4] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= DETAIL MODAL ================= */}
      {selected && (
        <DetailModal
          data={selected}
          onClose={() => setSelected(null)}
          onDelete={() => handleDelete(selected._id)}
          statusStyle={statusStyle}
          statusIcon={statusIcon}
        />
      )}
    </>
  );
}

/* ============================================================
   📊 STAT CARD
============================================================ */
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
      <div className={`w-11 h-11 ${color} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
        {value}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

/* ============================================================
   🗳️ EMPTY STATE
============================================================ */
function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaPhoneAlt className="text-slate-400 text-xl" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">
        No callbacks found
      </h3>
      <p className="text-sm text-slate-500">
        Jab students form submit karenge, unki entries yaha dikhengi.
      </p>
    </div>
  );
}

/* ============================================================
   👁️ DETAIL MODAL
============================================================ */
function DetailModal({ data, onClose, onDelete, statusStyle, statusIcon }) {
  const formatDate = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return d;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-[#0B1437] text-white px-5 py-4 pr-12">
          <h3 className="text-lg font-bold">{data.fullName}</h3>
          <p className="text-xs text-gray-300 mt-0.5">
            {data.inquiryType === "Book Counselling"
              ? "Book Counselling"
              : "Request Call Back"}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          aria-label="Close"
        >
          <FaTimes className="text-base" />
        </button>

        {/* Body */}
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          <DetailRow icon={<FaUser />} label="Full Name" value={data.fullName} />
          <DetailRow
            icon={<FaPhoneAlt />}
            label="Mobile Number"
            value={`+91 ${data.mobileNumber}`}
          />
          {data.email && data.email !== "notprovided@carrervidya.com" && (
            <DetailRow icon={<FaEnvelope />} label="Email" value={data.email} />
          )}
          {data.gender && data.gender !== "Other" && (
            <DetailRow
              icon={<FaVenusMars />}
              label="Gender"
              value={data.gender}
            />
          )}
          {data.course && data.course !== "Not Specified" && (
            <DetailRow
              icon={<FaGraduationCap />}
              label="Course"
              value={data.course}
            />
          )}
          {data.state && data.state !== "Not Specified" && (
            <DetailRow
              icon={<FaMapMarkerAlt />}
              label="State"
              value={data.state}
            />
          )}
          {data.fullAddress && data.fullAddress !== "Not Provided" && (
            <DetailRow
              icon={<FaMapMarkerAlt />}
              label="Address"
              value={data.fullAddress}
            />
          )}
          {data.preferredDate && (
            <DetailRow
              icon={<FaCalendarAlt />}
              label="Preferred Date"
              value={data.preferredDate}
            />
          )}
          {data.preferredTime && (
            <DetailRow
              icon={<FaClock />}
              label="Preferred Time"
              value={data.preferredTime}
            />
          )}

          <DetailRow
            icon={statusIcon(data.status)}
            label="Status"
            value={data.status || "Pending"}
            badgeClass={statusStyle(data.status)}
          />

          <DetailRow
            icon={<FaCalendarAlt />}
            label="Received On"
            value={formatDate(data.createdAt)}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 border-t border-slate-100 bg-slate-50">
          <a
            href={`tel:${data.mobileNumber}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#3B4FE4] hover:bg-[#2d3fd0] text-white font-semibold text-sm py-2.5 rounded-lg transition-all shadow-sm"
          >
            <FaPhoneAlt className="text-xs" />
            Call Now
          </a>
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-2 border-2 border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all"
          >
            <FaTrash className="text-xs" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, badgeClass }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[11px] uppercase text-slate-400 font-semibold tracking-wide mb-0.5">
          {label}
        </p>
        {badgeClass ? (
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeClass}`}
          >
            {value}
          </span>
        ) : (
          <p className="text-sm text-slate-800 font-medium break-words">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}