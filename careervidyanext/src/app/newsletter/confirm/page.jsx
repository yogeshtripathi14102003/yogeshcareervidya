"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

function ConfirmContent() {
  const params = useSearchParams();
  const status = params.get("status");

  const content = {
    success: {
      icon: <CheckCircle2 className="text-green-500 mx-auto" size={48} />,
      title: "Subscription confirmed!",
      body: "You're all set — you'll now receive updates from CareerVidya.",
    },
    expired: {
      icon: <AlertTriangle className="text-amber-500 mx-auto" size={48} />,
      title: "This link has expired",
      body: "Confirmation links are valid for 48 hours. Please subscribe again to get a fresh link.",
    },
    error: {
      icon: <XCircle className="text-red-500 mx-auto" size={48} />,
      title: "Something went wrong",
      body: "We couldn't confirm your subscription. Please try subscribing again.",
    },
  }[status] || {
    icon: <XCircle className="text-red-500 mx-auto" size={48} />,
    title: "Invalid link",
    body: "This confirmation link looks incomplete or incorrect.",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-sm w-full text-center">
        {content.icon}
        <h1 className="text-xl font-bold mt-4 text-gray-800">{content.title}</h1>
        <p className="text-sm text-gray-500 mt-2">{content.body}</p>
        <Link href="/" className="inline-block mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium">
          Back to CareerVidya
        </Link>
      </div>
    </div>
  );
}

export default function NewsletterConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmContent />
    </Suspense>
  );
}
