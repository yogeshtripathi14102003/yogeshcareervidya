"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [questionsPage, setQuestionsPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [productQuestions, setProductQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const productsPerPage = 5;
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/",
  });

  // attach token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("admintoken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // fetch all questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/admin/qna/questions");

        const productMap = new Map();
        res.data.questions.forEach((q) => {
          const prod = q.product;
          if (!productMap.has(prod._id)) {
            productMap.set(prod._id, {
              id: prod._id,
              productId: prod.productId,
              name: prod.name || `Product ${prod._id}`,
              questions: [],
            });
          }

          const product = productMap.get(prod._id);
          product.questions.push({
            id: q._id,
            customerId: q.user?._id,
            customerName: q.user?.name || "Anonymous",
            question: q.questionText,
            createdAt: q.createdAt,
            answers: (q.answers || []).map((a) => ({
              id: a._id,
              text: a.answerText,
              userId: a.user?._id,
              userName: a.user?.name || "User",
              createdAt: a.createdAt,
              isVerified: a.isVerified || false,
            })),
          });
        });

        setProducts(Array.from(productMap.values()));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // fetch questions by product
  const fetchProductQuestions = async (productId) => {
    try {
      const res = await axiosInstance.get(
        `/questions/products/${productId}/questions`
      );
      const questions = res.data.questions.map((q) => ({
        id: q._id,
        customerId: q.user?._id,
        customerName: q.user?.name || "Anonymous",
        question: q.questionText,
        createdAt: q.createdAt,
        answers: (q.answers || []).map((a) => ({
          id: a._id,
          text: a.answerText,
          userId: a.user?._id,
          userName: a.user?.name || "User",
          createdAt: a.createdAt,
          isVerified: a.isVerified || false,
        })),
      }));
      setProductQuestions(questions);
    } catch (err) {
      console.error("Failed to fetch product questions:", err);
    }
  };

  // verify / unverify / delete handlers
  const handleVerifyAnswer = async (answerId) => {
    try {
      setVerifying(answerId);
      await axiosInstance.patch(`/admin/qna/answers/${answerId}/verify`);
      if (selectedProduct) await fetchProductQuestions(selectedProduct.productId);
    } catch (err) {
      console.error("Failed to verify answer:", err);
    } finally {
      setVerifying(false);
    }
  };

  const handleUnverifyAnswer = async (answerId) => {
    try {
      setVerifying(answerId);
      await axiosInstance.patch(`/admin/qna/answers/${answerId}/unverify`);
      if (selectedProduct) await fetchProductQuestions(selectedProduct.productId);
    } catch (err) {
      console.error("Failed to unverify answer:", err);
    } finally {
      setVerifying(false);
    }
  };

  const handleDeleteQuestion = async (qid) => {
    if (!confirm("Delete this question?")) return;
    try {
      setDeleting(qid);
      await axiosInstance.delete(`/admin/qna/questions/${qid}`);
      if (selectedProduct) await fetchProductQuestions(selectedProduct.productId);
    } catch (err) {
      console.error("Failed to delete question:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAnswer = async (aid) => {
    if (!confirm("Delete this answer?")) return;
    try {
      setDeleting(aid);
      await axiosInstance.delete(`/admin/qna/answers/${aid}`);
      if (selectedProduct) await fetchProductQuestions(selectedProduct.productId);
    } catch (err) {
      console.error("Failed to delete answer:", err);
    } finally {
      setDeleting(false);
    }
  };

  // pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleSelectProduct = async (product) => {
    setSelectedProduct(product);
    setQuestionsPage(1);
    await fetchProductQuestions(product.productId);
  };

  const allQuestions = selectedProduct
    ? [
        ...productQuestions,
        ...(selectedProduct.questions || []).filter(
          (q) => !productQuestions.some((pq) => pq.id === q.id)
        ),
      ]
    : [];

  const sortedQuestions = allQuestions.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-xl md:text-2xl font-bold">Admin Q&A Management</h1>

        {/* Products table */}
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 whitespace-nowrap">Product ID</th>
                <th className="p-3 whitespace-nowrap">Name</th>
                <th className="p-3 whitespace-nowrap">Questions</th>
                <th className="p-3 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.productId}</td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.questions.length}</td>
                    <td className="p-3">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleSelectProduct(p)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No products with questions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Questions */}
        {selectedProduct && (
          <div className="bg-white shadow rounded">
            <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="font-semibold text-lg">
                Questions for: {selectedProduct.name}
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-sm text-red-600"
              >
                Close
              </button>
            </div>

            {sortedQuestions.map((q) => (
              <div key={q.id} className="border-t p-4">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <div className="font-medium">{q.customerName}</div>
                    <div className="text-sm text-gray-500">{q.question}</div>
                  </div>
                  <button
                    className="text-red-600 text-sm self-start"
                    onClick={() => handleDeleteQuestion(q.id)}
                    disabled={deleting === q.id}
                  >
                    {deleting === q.id ? "Deleting..." : "Delete Q"}
                  </button>
                </div>

                {/* answers */}
                <div className="ml-3 sm:ml-6 mt-3 space-y-2">
                  {q.answers.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 bg-gray-50 border rounded flex flex-col sm:flex-row justify-between gap-2"
                    >
                      <div>
                        <div className="font-medium">
                          {a.userName}
                          {a.isVerified && (
                            <span className="ml-2 text-green-600 text-xs">
                              Verified ✓
                            </span>
                          )}
                        </div>
                        <div className="text-sm">{a.text}</div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {a.isVerified ? (
                          <button
                            className="text-red-600 text-sm"
                            onClick={() => handleUnverifyAnswer(a.id)}
                            disabled={verifying === a.id}
                          >
                            {verifying === a.id ? "Unverifying..." : "Unverify"}
                          </button>
                        ) : (
                          <button
                            className="text-green-600 text-sm"
                            onClick={() => handleVerifyAnswer(a.id)}
                            disabled={verifying === a.id}
                          >
                            {verifying === a.id ? "Verifying..." : "Verify"}
                          </button>
                        )}
                        <button
                          className="text-red-600 text-sm"
                          onClick={() => handleDeleteAnswer(a.id)}
                          disabled={deleting === a.id}
                        >
                          {deleting === a.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
