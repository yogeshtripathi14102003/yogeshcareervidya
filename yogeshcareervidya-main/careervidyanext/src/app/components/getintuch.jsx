"use client";
import { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import api from "@/utlis/api.js"; // ✅ Your existing API setup

export default function ContactUsPage() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Match backend model field names exactly
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    email: "",
    mobile: "",
    message: "",
     course: "",
        branch: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ API POST call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/v1/getintouch", formData);

      if (res.status === 200 || res.status === 201) {
        alert("✅ Thank you! Your message has been sent successfully.");
        setFormData({
          name: "",
          city: "",
          email: "",
          mobile: "",
          message: "",
           course: "",
        branch: "",
        });
      } else {
        alert("⚠️ Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Unable to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Testimonials data
  const testimonials = [
    {
      name: "Aditi Sharma",
      location: "Delhi University",
      message:
        "Career Vidya’s guidance helped me find the right course and college. Their counselors are friendly and truly care about students.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Rohan Patel",
      location: "Ahmedabad",
      message:
        "I was confused about which course to choose, but Career Vidya made everything easy and clear. Thank you for guiding me.",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
    {
      name: "Sneha Verma",
      location: "Pune",
      message:
        "The free counseling session was very helpful. They explained the admission process and gave honest suggestions.",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (!isClient) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-16 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-center text-[#0056A4] mb-6">
          Let’s Discuss Your Future!
        </h1>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Get <strong>free career guidance</strong> from our experts to choose the best course, college,
          or career path for you. Your data is <strong>100% confidential</strong> — we’re here to help,
          not to sell.
        </p>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Support</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <Mail className="text-blue-500" size={18} /> Info@careervidya.in
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="text-blue-500" size={18} /> +91 9289712364
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">For Collaboration</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <Mail className="text-blue-500" size={18} /> Careervidya.edu@gmail.com
                </li>
              </ul>
            </div>

            {/* Rotating testimonial */}
            {/* <div className="bg-[#0056A4] text-white rounded-2xl p-6 shadow-lg flex gap-4 items-center transition-all duration-500">
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div>
                <h3 className="font-semibold text-lg">
                  {testimonials[currentTestimonial].name}
                </h3>
                <p className="text-sm opacity-90">{testimonials[currentTestimonial].location}</p>
                <p className="text-sm mt-2 opacity-90">
                  {testimonials[currentTestimonial].message}
                </p>
              </div>
            </div> */}
          </div>

          {/* RIGHT SIDE - FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input
      type="text"
      name="name"
      placeholder="Full Name *"
      value={formData.name}
      onChange={handleChange}
      required
      className="border rounded-lg p-3 w-full"
    />
    <input
      type="text"
      name="city"
      placeholder="City *"
      value={formData.city}
      onChange={handleChange}
      required
      className="border rounded-lg p-3 w-full"
    />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input
      type="email"
      name="email"
      placeholder="Email *"
      value={formData.email}
      onChange={handleChange}
      required
      className="border rounded-lg p-3 w-full"
    />
    <input
      type="text"
      name="mobile"
      placeholder="Mobile *"
      value={formData.mobile}
      onChange={handleChange}
      required
      className="border rounded-lg p-3 w-full"
    />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input
      type="text"
      name="course"
      placeholder="Course *"
      value={formData.course}
      onChange={handleChange}
      required
      className="border rounded-lg p-3 w-full"
    />
    <input
      type="text"
      name="branch"
      placeholder="Branch *"
      value={formData.branch}
      onChange={handleChange}
      required
      className="border rounded-lg p-3 w-full"
    />
  </div>

  <textarea
    name="message"
    placeholder="How can we help you? *"
    rows={4}
    value={formData.message}
    onChange={handleChange}
    required
    className="border rounded-lg p-3 w-full"
  />

  <button
    type="submit"
    disabled={loading}
    className={`w-full bg-[#c15304] text-white py-3 rounded-lg transition-all ${
      loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#c15304]"
    }`}
  >
    {loading ? "Submitting..." : "Submit"}
  </button>
</form>

        </div>
      </div>
    </div>
  );
}

