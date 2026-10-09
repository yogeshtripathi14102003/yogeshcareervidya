"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  maxVisiblePages = 5,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage ||
      typeof onPageChange !== "function"
    ) {
      return;
    }

    onPageChange(page);

    // Optional: scroll to top after page change
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    let startPage = Math.max(
      2,
      currentPage - Math.floor(maxVisiblePages / 2)
    );

    let endPage = Math.min(
      totalPages - 1,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(2, endPage - maxVisiblePages + 1);
    }

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className={`flex w-full items-center justify-center py-6 ${className}`}
      aria-label="Pagination"
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg border border-slate-200
            bg-white text-slate-600
            transition-all duration-200
            hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-40
            sm:h-10 sm:w-10
          "
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="
                    flex h-9 min-w-7 items-center
                    justify-center text-sm font-medium
                    text-slate-400
                    sm:h-10 sm:min-w-8
                  "
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex h-9 min-w-9 items-center justify-center
                  rounded-lg px-2 text-sm font-semibold
                  transition-all duration-200
                  sm:h-10 sm:min-w-10
                  ${
                    isActive
                      ? "bg-blue-700 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="
            flex h-9 w-9 items-center justify-center
            rounded-lg border border-slate-200
            bg-white text-slate-600
            transition-all duration-200
            hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-40
            sm:h-10 sm:w-10
          "
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;