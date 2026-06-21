import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination component
 * Props:
 *   currentPage  {number}   - 1-indexed current page
 *   totalPages   {number}   - total number of pages
 *   onPageChange {Function} - called with the new page number
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build page number list with ellipsis logic
  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    // Always show first, last, current ±1, with '...' gaps
    const range = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
    const sorted = [...range].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

    sorted.forEach((page, i) => {
      if (i > 0 && page - sorted[i - 1] > 1) pages.push('...');
      pages.push(page);
    });
    return pages;
  };

  return (
    <nav className="pagination" aria-label="Product pages">
      {/* Prev */}
      <button
        className="pg-btn pg-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      {getPages().map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="pg-ellipsis">…</span>
        ) : (
          <button
            key={page}
            className={`pg-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        className="pg-btn pg-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
