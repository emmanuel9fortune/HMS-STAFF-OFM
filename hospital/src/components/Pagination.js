import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Left ellipsis
    if (currentPage > 4) {
      pages.push("...");
    }

    // Pages around the current page
    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      pages.push(i);
    }

    // Right ellipsis
    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{padding: "10px 15px", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer"}}
      >
        Previous
      </button>

      {getPages().map((page, index) =>
        page === "..." ? (
          <span key={index}>...</span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            style={{
              fontWeight: currentPage === page ? "bold" : "normal",
              backgroundColor: currentPage === page ? "#0d6efd" : "",
              color: currentPage === page ? "#fff" : "",
              padding: "4px 8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {page}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{padding: "10px 15px", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer"}}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination