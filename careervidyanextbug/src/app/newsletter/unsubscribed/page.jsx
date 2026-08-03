import Link from "next/link";
import { MailX } from "lucide-react";

export const metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: false },
};

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-sm w-full text-center">
        <MailX className="text-gray-400 mx-auto" size={48} />
        <h1 className="text-xl font-bold mt-4 text-gray-800">You've been unsubscribed</h1>
        <p className="text-sm text-gray-500 mt-2">
          You won't receive any more newsletter emails from CareerVidya. Changed your mind? You can
          subscribe again any time.
        </p>
        <Link href="/" className="inline-block mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium">
          Back to CareerVidya
        </Link>
      </div>
    </div>
  );
}
