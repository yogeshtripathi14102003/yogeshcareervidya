"use client";

import React, { useState, useTransition } from 'react';

// Aapke backend routes ke routers ke hisaab se permissions list
const PERMISSIONS_LIST = [
  { id: 'manage_banner', label: 'Banners Control' },
  { id: 'manage_team', label: 'Team Members' },
  { id: 'manage_students', label: 'Student Management' },
  { id: 'manage_newsletter', label: 'Newsletter/Emails' },
  { id: 'manage_courses', label: 'Courses Management' },
  { id: 'manage_university', label: 'University List' },
  { id: 'manage_contacts', label: 'Inquiries (Get in Touch)' },
  { id: 'manage_jobs', label: 'Job Portal' },
  { id: 'manage_blogs', label: 'Blog/Articles' },
  { id: 'manage_reviews', label: 'Reviews & Feedback' },
];

export default function GiveAccessPage() {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isPending, startTransition] = useTransition();

  async function handleAccessSubmit(formData) {
    setMessage({ type: '', text: '' });

    startTransition(async () => {
      const payload = {
        email: formData.get("email"),
        permissions: formData.getAll("permissions"), // Saari selected permissions array mein aayengi
      };

      try {
        // Aapka Express Backend API URL yahan aayega
        const response = await fetch("http://localhost:5000/api/v1/auth/assign-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage({ type: 'success', text: `Access granted successfully to ${payload.email}` });
        } else {
          setMessage({ type: 'error', text: data.msg || "Kuch error aaya" });
        }
      } catch (err) {
        setMessage({ type: 'error', text: "Backend se connection nahi ho paya" });
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="border-b pb-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel Access Control</h1>
        <p className="text-gray-500">Kisi bhi email ko specific modules ka access dene ke liye niche form bharein.</p>
      </div>

      <form action={handleAccessSubmit} className="space-y-8">
        
        {/* Email Input Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
            Sub-Admin Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="example@careervidya.in"
            className="w-full p-4 border-2 rounded-xl outline-none focus:border-indigo-500 transition-all text-lg"
          />
        </div>

        {/* Permissions Grid */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3 text-sm">Step 2</span>
            Modules ka Access Select Karein
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PERMISSIONS_LIST.map((item) => (
              <label 
                key={item.id} 
                className="relative flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
              >
                <input
                  type="checkbox"
                  name="permissions"
                  value={item.id}
                  className="w-6 h-6 text-indigo-600 rounded-md border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-4 font-semibold text-gray-700 group-hover:text-indigo-900">
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Feedback Message */}
        {message.text && (
          <div className={`p-4 rounded-xl font-bold text-center ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-indigo-600 text-white font-extrabold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:bg-gray-400 disabled:scale-100 transform active:scale-95 text-lg"
        >
          {isPending ? "Updating Permissions..." : "Confirm Access Permission"}
        </button>
      </form>

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Is email ko access dene ke baad, user ko login ke waqt koi password nahi mangega, unhe direct unke email par OTP bheja jayega.
        </p>
      </div>
    </div>
  );
}