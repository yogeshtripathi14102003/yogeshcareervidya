"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { useAuth } from "@/context/AuthContext.jsx";
import RichTextEditor from "@/app/components/RichTextEditor.jsx";

import {
  MessageSquare,
  CheckCircle2,
  Lock,
  Unlock,
  Pencil,
  ThumbsUp,
  Eye,
  Clock,
  User as UserIcon,
  Shield,
} from "lucide-react";

const ROLE_LABELS = {
  admin: "CareerVidya Team",
  subadmin: "CareerVidya Team",
  counselor: "Counselor",
  user: "Student",
  student: "Student",
};

const STAFF_ROLES = ["admin", "subadmin", "counselor"];

// Rich text HTML ko validate karne ke liye
// <p>Hello</p> => true | <div><br></div> => false | <p>&nbsp;</p> => false
const hasRichText = (html) => {
  if (!html) return false;
  const plainText = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .trim();
  return plainText.length > 0;
};

const fmt = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function QAThread({ questionId }) {
  const auth = useAuth();
  const user = auth?.user;
  const role = auth?.role || user?.role;
  const myId = user?._id || user?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [answerBody, setAnswerBody] = useState("");

  const [replyBody, setReplyBody] = useState({});
  const [replyOpenFor, setReplyOpenFor] = useState(null);

  const [editingAnswer, setEditingAnswer] = useState(null);
  const [editBody, setEditBody] = useState("");

  const [posting, setPosting] = useState(false);
  const [editing, setEditing] = useState(false);

  const isStaff = STAFF_ROLES.includes(role);
  const isAdmin = ["admin", "subadmin"].includes(role);

  const fetchThread = async () => {
    try {
      setError(null);
      const res = await api.get(`/api/v1/qa/questions/${questionId}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch QA thread:", err);
      if (err.response?.status === 404) {
        setData(null);
      } else {
        setError(err.response?.data?.message || "Failed to load discussion.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!questionId) return;
    setLoading(true);
    fetchThread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  // student populated object bhi ho sakta hai ya plain id bhi
  const questionStudentId =
    data?.question?.student?._id || data?.question?.student;

  const isMyQuestion =
    !!myId && !!questionStudentId && String(questionStudentId) === String(myId);

  // Backend rule: apna staff answer ya admin/subadmin kisi ka bhi
  const canEditAnswer = (answer) => {
    if (!isStaff) return false;
    if (isAdmin) return true;
    return (
      !!myId &&
      String(answer.authorId) === String(myId) &&
      answer.authorType === role
    );
  };

  /* ---------- POST TOP LEVEL ANSWER ---------- */
  const submitAnswer = async () => {
    if (!hasRichText(answerBody)) {
      alert("Please write an answer first.");
      return;
    }

    setPosting(true);
    try {
      await api.post(`/api/v1/qa/questions/${questionId}/answers`, {
        body: answerBody,
      });
      setAnswerBody("");
      await fetchThread();
    } catch (err) {
      console.error("Answer post error:", err);
      alert(err.response?.data?.message || "Failed to post answer");
    } finally {
      setPosting(false);
    }
  };

  /* ---------- POST REPLY ---------- */
  const submitReply = async (parentAnswerId) => {
    const body = replyBody[parentAnswerId] || "";

    if (!hasRichText(body)) {
      alert("Please write a reply first.");
      return;
    }

    setPosting(true);
    try {
      await api.post(`/api/v1/qa/questions/${questionId}/answers`, {
        body,
        parentAnswer: parentAnswerId,
      });

      setReplyBody((prev) => ({ ...prev, [parentAnswerId]: "" }));
      setReplyOpenFor(null);
      await fetchThread();
    } catch (err) {
      console.error("Reply post error:", err);
      alert(err.response?.data?.message || "Failed to post reply");
    } finally {
      setPosting(false);
    }
  };

  /* ---------- EDIT ANSWER ---------- */
  const submitEdit = async (answerId) => {
    if (!hasRichText(editBody)) {
      alert("Answer cannot be empty.");
      return;
    }

    setEditing(true);
    try {
      await api.patch(`/api/v1/qa/answers/${answerId}`, { body: editBody });
      setEditingAnswer(null);
      setEditBody("");
      await fetchThread();
    } catch (err) {
      console.error("Edit answer error:", err);
      alert(err.response?.data?.message || "Failed to save edit");
    } finally {
      setEditing(false);
    }
  };

  /* ---------- HELPFUL ---------- */
  const toggleHelpful = async (answerId) => {
    try {
      await api.patch(`/api/v1/qa/answers/${answerId}/helpful`);
      await fetchThread();
    } catch (err) {
      console.error("Helpful action error:", err);
      alert(err.response?.data?.message || "Action failed");
    }
  };

  /* ---------- CLOSE / REOPEN ---------- */
  const toggleClose = async () => {
    try {
      const action = data.question.status === "open" ? "close" : "reopen";
      await api.patch(`/api/v1/qa/questions/${questionId}/${action}`);
      await fetchThread();
    } catch (err) {
      console.error("Close/reopen error:", err);
      alert(err.response?.data?.message || "Action failed");
    }
  };

  /* ---------- STATES ---------- */
  if (loading) {
    return <p className="text-sm text-gray-400 p-6">Loading…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500 p-6">{error}</p>;
  }

  if (!data?.question) {
    return <p className="text-sm text-gray-400 p-6">Question not found.</p>;
  }

  const { question, answers = [] } = data;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-5">
      {/* ================= QUESTION ================= */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[11px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
            {question.category}
          </span>

          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              question.status === "open"
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {question.status === "open" ? "Open" : "Closed"}
          </span>

          {question.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h2 className="text-lg font-bold text-slate-800">{question.title}</h2>

        <div
          className="prose prose-sm max-w-none text-slate-600 mt-2"
          dangerouslySetInnerHTML={{ __html: question.body || "" }}
        />

        <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-4 pt-3 border-t flex-wrap">
          <span className="flex items-center gap-1">
            <UserIcon size={12} />
            {question.student?.name || "Student"}
          </span>

          <span className="flex items-center gap-1">
            <Clock size={12} />
            {fmt(question.createdAt)}
          </span>

          <span className="flex items-center gap-1">
            <Eye size={12} />
            {question.views || 0} views
          </span>

          <span className="flex items-center gap-1">
            <MessageSquare size={12} />
            {answers.length} answer{answers.length !== 1 ? "s" : ""}
          </span>

          {isStaff && (
            <button
              type="button"
              onClick={toggleClose}
              className="ml-auto flex items-center gap-1 text-indigo-600 font-medium"
            >
              {question.status === "open" ? (
                <>
                  <Lock size={12} />
                  Close discussion
                </>
              ) : (
                <>
                  <Unlock size={12} />
                  Reopen
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ================= ANSWERS ================= */}
      <div className="space-y-3">
        {answers.length === 0 ? (
          <div className="bg-white border rounded-xl p-5 text-center text-sm text-gray-400">
            No answers yet.
          </div>
        ) : (
          answers.map((answer) => (
            <div
              key={answer._id}
              className={`bg-white rounded-xl border shadow-sm p-4 ${
                answer.isHelpful ? "border-green-300" : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-full">
                  <Shield size={12} />
                </div>

                <span className="text-xs font-semibold">{answer.authorName}</span>

                <span className="text-[10px] text-gray-400">
                  {ROLE_LABELS[answer.authorType] || answer.authorType}
                </span>

                {answer.edited && (
                  <span className="text-[10px] text-gray-400">(edited)</span>
                )}

                {answer.isHelpful && (
                  <span className="ml-auto text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Marked helpful
                  </span>
                )}
              </div>

              {/* Edit mode / Body */}
              {editingAnswer === answer._id ? (
                <div className="space-y-2">
                  <RichTextEditor
                    value={editBody}
                    onChange={setEditBody}
                    minHeight={100}
                    placeholder="Edit your answer…"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={editing}
                      onClick={() => submitEdit(answer._id)}
                      className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-60"
                    >
                      {editing ? "Saving…" : "Save"}
                    </button>

                    <button
                      type="button"
                      disabled={editing}
                      onClick={() => {
                        setEditingAnswer(null);
                        setEditBody("");
                      }}
                      className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="prose prose-sm max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{ __html: answer.body || "" }}
                />
              )}

              {/* Footer */}
              <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-3 flex-wrap">
                <span>{fmt(answer.createdAt)}</span>

                {/* Edit — sirf jisko permission hai */}
                {canEditAnswer(answer) && editingAnswer !== answer._id && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAnswer(answer._id);
                      setEditBody(answer.body || "");
                    }}
                    className="flex items-center gap-1 text-indigo-600 font-medium"
                  >
                    <Pencil size={11} />
                    Edit
                  </button>
                )}

                {/* Helpful */}
                {isMyQuestion && !isStaff && (
                  <button
                    type="button"
                    onClick={() => toggleHelpful(answer._id)}
                    className="flex items-center gap-1 text-indigo-600 font-medium"
                  >
                    <ThumbsUp size={11} />
                    {answer.isHelpful ? "Unmark helpful" : "Mark helpful"}
                  </button>
                )}

                {/* Reply */}
                {isMyQuestion && !isStaff && question.status === "open" && (
                  <button
                    type="button"
                    onClick={() =>
                      setReplyOpenFor(replyOpenFor === answer._id ? null : answer._id)
                    }
                    className="flex items-center gap-1 text-indigo-600 font-medium"
                  >
                    Reply
                  </button>
                )}
              </div>

              {/* Replies */}
              {answer.replies?.length > 0 && (
                <div className="ml-6 mt-3 space-y-2 border-l-2 border-slate-100 pl-4">
                  {answer.replies.map((reply) => (
                    <div key={reply._id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-semibold">
                          {reply.authorName}
                        </span>

                        <span className="text-[10px] text-gray-400">
                          {ROLE_LABELS[reply.authorType] || reply.authorType}
                        </span>

                        <span className="text-[10px] text-gray-400">
                          {fmt(reply.createdAt)}
                        </span>
                      </div>

                      <div
                        className="prose prose-sm max-w-none text-slate-600"
                        dangerouslySetInnerHTML={{ __html: reply.body || "" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Reply editor */}
              {replyOpenFor === answer._id && (
                <div className="ml-6 mt-3 space-y-2">
                  <RichTextEditor
                    value={replyBody[answer._id] || ""}
                    onChange={(html) =>
                      setReplyBody((prev) => ({ ...prev, [answer._id]: html }))
                    }
                    minHeight={80}
                    placeholder="Write a reply…"
                  />

                  <button
                    type="button"
                    disabled={posting}
                    onClick={() => submitReply(answer._id)}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-60"
                  >
                    {posting ? "Posting…" : "Post Reply"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ================= STAFF ANSWER BOX ================= */}
      {isStaff && question.status === "open" && (
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <h3 className="text-sm font-semibold mb-2">Post an Answer</h3>

          <RichTextEditor
            value={answerBody}
            onChange={setAnswerBody}
            placeholder="Write your answer…"
            minHeight={160}
          />

          <button
            type="button"
            disabled={posting}
            onClick={submitAnswer}
            className="mt-3 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-60"
          >
            {posting ? "Posting…" : "Post Answer"}
          </button>
        </div>
      )}

      {/* ================= CLOSED MESSAGE ================= */}
      {question.status === "closed" && (
        <p className="text-center text-xs text-gray-400 py-2">
          This discussion has been closed.
        </p>
      )}
    </div>
  );
}