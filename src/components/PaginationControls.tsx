import { memo, useMemo } from 'react';
import { PaginationControlsProps } from '../models/trainerCard.model';

const PaginationControls = memo(({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = useMemo(() => {
        const delta = 2; // Number of pages to show on each side of current page
        const range: number[] = [];
        const rangeWithDots: (number | string)[] = [];
        let l: number | undefined;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // First page
                i === totalPages || // Last page
                (i >= currentPage - delta && i <= currentPage + delta) // Pages around current page
            ) {
                range.push(i);
            }
        }

        range.forEach(i => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    }, [currentPage, totalPages]);

    return (
        <div className="flex justify-center items-center gap-2 mt-8" role="navigation" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                aria-label="Previous page"
            >
                Previous
            </button>

            <div className="flex items-center gap-1">
                {getPageNumbers.map((pageNum, index) => (
                    pageNum === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-600">...</span>
                    ) : (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum as number)}
                            className={`px-3 py-2 rounded-md text-sm ${currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                            {pageNum}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                aria-label="Next page"
            >
                Next
            </button>
        </div>
    );
});

PaginationControls.displayName = 'PaginationControls';

export default PaginationControls; 