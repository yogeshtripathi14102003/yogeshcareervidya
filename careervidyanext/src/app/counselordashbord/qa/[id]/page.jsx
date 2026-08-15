"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QAThread from "@/app/components/QAThread.jsx";

export default function CounselorQAThreadPage() {
  const { id } = useParams();
  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <Link href="/counselordashbord/qa" className="text-sm text-indigo-600 flex items-center gap-1 w-fit">
          <ArrowLeft size={14} /> Back to Q&A
        </Link>
      </div>
      <QAThread questionId={id} />
    </div>
  );
}
