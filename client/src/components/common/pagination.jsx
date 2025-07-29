import { Fragment } from "react";

import { cn } from "@/lib/utils";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showInfo = true,
  itemsPerPage = 9,
  totalItems = 0,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [];

  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4",
        className
      )}
    >
      {/* Info */}
      {showInfo && (
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
            currentPage === 1
              ? "text-gray-500 cursor-not-allowed"
              : "text-gray-300 hover:text-white hover:bg-gray-700"
          )}
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  )}
                >
                  {page}
                </button>
              )}
            </Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
            currentPage === totalPages
              ? "text-gray-500 cursor-not-allowed"
              : "text-gray-300 hover:text-white hover:bg-gray-700"
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
