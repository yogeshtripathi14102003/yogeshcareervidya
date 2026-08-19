"use client";

import React, { useState } from "react";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/v1/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.msg || "Subscribed successfully!");
      setEmail("");
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
      <label htmlFor="newsletter-email" className="sr-only">
        Email Address
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Your email address"
        required
        aria-required="true"
        className="w-full bg-[#001642] border border-gray-700 rounded-md py-4 px-4 text-white focus:outline-none focus:border-blue-500 placeholder:text-gray-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black font-bold py-4 rounded-full hover:bg-gray-200 transition text-md disabled:opacity-50"
      >
        {loading ? "Subscribing..." : "Subscribe Now"}
      </button>
      {message && (
        <p className="text-xs text-center text-orange-400" aria-live="polite">
          {message}
        </p>
      )}
    </form>
  );
}