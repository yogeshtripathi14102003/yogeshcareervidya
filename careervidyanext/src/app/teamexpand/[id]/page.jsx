"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/utlis/api.js"; 
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import ReviewForm from "@/app/components/ReviewForm.jsx";
import { 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  Star, 
  Phone, 
  IndianRupee, 
  Award, 
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

export default function TeamDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [mentorRes, reviewsRes] = await Promise.all([
        api.get(`/api/v1/team/${id}`),
        api.get(`/api/v1/review/${id}`)
      ]);
      setMentor(mentorRes.data.data || mentorRes.data);
      setReviews(reviewsRes.data.reviews || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="py-32 text-center animate-pulse text-blue-600 font-semibold text-xl">Loading Expert Profile...</div>;
  if (!mentor) return <div className="py-32 text-center text-red-500">Counsellor not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Experts
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="relative bg-gray-100 flex items-center justify-center">
                {/* Image Fix: object-contain use kiya hai taaki image crop na ho */}
                <img 
                  src={mentor.image || "/images/default-avatar.png"} 
                  className="w-full h-80 object-contain"
                  alt={mentor.name}
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/50">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-800">{mentor.rating || "0.0"}</span>
                  <span className="text-gray-500 text-xs">({reviews.length} Reviews)</span>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                <p className="text-blue-600 font-semibold mb-4">{mentor.designation}</p>
                
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <span>{mentor.experience} Years Experience</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span>{mentor.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-800">
                       {mentor.fee > 0 ? `₹${mentor.fee}` : "Free Consultation"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span>{mentor.mobileNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Detailed Info & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About & Expertise Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="text-blue-600" /> Professional Expertise
              </h2>
              
              {/* Added Expertise Field from Model */}
              <div className="mb-6">
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium border border-blue-100 inline-block">
                  {mentor.expertise}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-8">{mentor.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8 border-t pt-6">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-blue-500" /> Education
                  </h3>
                  <p className="text-gray-600">{mentor.education || "Not Specified"}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Languages className="w-5 h-5 text-blue-500" /> Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages?.length > 0 ? (
                      mentor.languages.map((lang, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Not Specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Highlights Section (from Model) */}
              {mentor.highlights?.length > 0 && (
                <div className="mt-8 bg-blue-50/30 p-6 rounded-2xl border border-blue-50">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" /> Key Highlights
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mentor.highlights.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                        <span className="text-blue-500 mt-1">•</span> {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Patient Feedbacks</h3>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{mentor.rating || "0.0"}</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Overall Rating</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                {/* Left: Review Form */}
                <div>
                  <ReviewForm 
                    counsellorId={mentor._id} 
                    onSuccess={() => fetchData()} 
                  />
                </div>

                {/* Right: Reviews List */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-gray-400 italic">No reviews yet.</p>
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev._id} className="p-4 rounded-xl bg-gray-50 border border-transparent hover:border-blue-100 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{rev.guestName}</p>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm italic leading-snug">"{rev.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}