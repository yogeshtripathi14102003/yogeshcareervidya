"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api";
import { CheckCircle, Send } from "lucide-react";
import Applicationpopup from "@/app/university/Applictionpopup.jsx";

export default function AdmissionProcess({ slug }) {
  const [admission, setAdmission] = useState({
    admissionHeading: "Admission Process",
    admissionSubHeading: "",
    admissionDescription: "",
    admissionPoints: [],
  });

  const [universityName, setUniversityName] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/v1/university/slug/${slug}`);
        setAdmission(res.data?.data?.admission || {});
        setUniversityName(res.data?.data?.name || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load admission details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading)
    return (
      <div className="text-center py-16 text-blue-600 font-medium italic">
        Loading admission process...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-16 text-red-500 font-medium">
        {error}
      </div>
    );

  if (!admission?.admissionPoints?.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      {/* Heading - Space reduced to mb-2 */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {admission.admissionHeading}
      </h2>

      {/* Description Box with Expanded Width */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
        <div className="w-full md:flex-[2]"> {/* Isse left side ko zyada jagah milegi */}
          {admission.admissionSubHeading && (
            <p className="text-xl text-blue-700 font-semibold mb-1">
              {admission.admissionSubHeading}
            </p>
          )}

          {admission.admissionDescription && (
            <p className="text-gray-600 leading-relaxed max-w-4xl text-lg"> {/* Width badha kar max-w-4xl kiya */}
              {admission.admissionDescription}
            </p>
          )}
        </div>

        {/* Apply Now Button - Stays on right */}
        <div className="flex-shrink-0">
          <button
            onClick={() => setOpenPopup(true)}
            className="cursor-pointer bg-[#c15304] hover:bg-[#c15304] text-white px-10 py-3 rounded-3xl font-bold transition-all shadow-md flex items-center gap-2 w-full md:w-auto justify-center group"
          >
            Apply Now 
            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="grid gap-4">
        {admission.admissionPoints.map((point, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-5 rounded-xl border bg-white shadow-sm hover:border-blue-200 transition-colors"
          >
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-[#0b3a6f] font-bold border border-blue-100">
              {index + 1}
            </div>

            <div className="flex-1 pt-1">
              <p className="text-gray-800 text-lg leading-relaxed">
                {point}
              </p>
            </div>

            <div className="pt-1 hidden sm:block">
              <CheckCircle className="text-green-500" size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Application Popup Component */}
      {openPopup && (
        <Applicationpopup
          open={openPopup}
          setOpen={setOpenPopup}
          universityName={universityName}
          course={{ name: "General Admission" }}
        />
      )}
    </section>
  );
}