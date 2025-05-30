import { memo } from 'react';
import { PaginationControlsProps } from '../models/trainerCard.model';

const PaginationControls = memo(({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-8" role="navigation" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                aria-label="Previous page"
            >
                Previous
            </button>
            <span className="text-gray-600" aria-current="page">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                aria-label="Next page"
            >
                Next
            </button>
        </div>
    );
});

PaginationControls.displayName = 'PaginationControls';

export default PaginationControls; 