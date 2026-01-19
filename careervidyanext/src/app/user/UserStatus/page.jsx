"use client";

import { useState } from "react";
import api from "@/utlis/api.js";
import { Search, Loader2, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react"; // XCircle add kiya rejected ke liye

export default function StatusPage() {
  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await api.get(`/api/v1/admissions/status?email=${email}`);
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || " “There was an issue while checking the status.” ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admission Status</h1>
        <p className="text-gray-600 mt-2 text-sm">Please enter your registered email address below.</p>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleCheckStatus} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:bg-blue-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Check My Status"}
          </button>
        </form>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-xs border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      {data && (
        <div className="w-full max-w-md mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            
            {/* 1. STATUS BAR LOGIC (Pending/Verified/Rejected) */}
            <div className={`p-4 text-center text-white font-bold flex flex-col items-center gap-1 
              ${data.status === "verified" ? "bg-green-500" : data.status === "rejected" ? "bg-red-500" : "bg-orange-500"}`}>
               {data.status === "verified" ? <CheckCircle size={32} /> : data.status === "rejected" ? <XCircle size={32} /> : <Info size={32} />}
               <span className="text-base uppercase tracking-wider">
                 {data.status === "verified" ? "Approved" : data.status === "rejected" ? "Rejected" : "In Progress"}
               </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-tight">
                <div>
                  <p className="text-gray-400 font-semibold">Applicant Name</p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">{data.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Course Applied</p>
                  <p className="font-bold text-gray-800 text-sm mt-0.5">{data.course}</p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* 2. REMARK LOGIC: Backend se 'adminRemark' aa raha hai */}
              <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Message from Admission Cell:</p>
                
                {data.status === "verified" ? (
                  <p className="text-green-700 text-sm leading-relaxed font-medium">
                  “Congratulations! Your admission has been approved. Please visit the campus to complete the next steps.”
                  </p>
                ) : (
                  <div>
                    {/* Yahan data.remark ki jagah data.adminRemark use kiya hai */}
                    {data.adminRemark ? (
                      <p className="text-red-700 text-sm leading-relaxed italic font-semibold">
                        " {data.adminRemark} "
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm italic font-medium">
                      “Your application is currently under review. Please check the status regularly.”
                      </p>
                    )}
                  </div>
                )}
              </div>

              {data.status === "rejected" && (
                <p className="text-[10px] text-center text-red-500 mt-2 font-medium">
          “Please re-submit the required documents as per the remarks mentioned above.”
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 text-center text-gray-400 text-[11px] leading-relaxed">
      In case of any issues, our team is here to help—please contact us <br />
        <span className="font-bold text-gray-600">info@careervidya.in</span> |📞 +91 9289712364
      </div>
    </div>
  );
}