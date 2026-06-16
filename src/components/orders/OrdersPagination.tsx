import React from "react";

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function OrdersPagination({
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  onPageChange,
  // We keep onPageSizeChange in props so we don't break the parent page, even if not used in UI
}: OrdersPaginationProps) {
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    const currentChunk = Math.floor((currentPage - 1) / maxVisible);
    const startPage = currentChunk * maxVisible + 1;
    const endPage = Math.min(startPage + maxVisible - 1, totalPages);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="text-sm text-slate-700 font-medium">
        Showing {startRecord} to {endRecord} of {totalRecords} entries
      </div>

      <div className="flex">
        <div className="inline-flex rounded border border-slate-200 bg-white overflow-hidden shadow-sm">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 text-sm text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed border-r border-slate-200 transition-colors focus:outline-none"
          >
            Previous
          </button>
          
          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 text-sm border-r border-slate-200 transition-colors focus:outline-none ${
                currentPage === page
                  ? "bg-blue-500 text-white border-blue-500 relative z-10"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="px-4 py-2 text-sm text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
