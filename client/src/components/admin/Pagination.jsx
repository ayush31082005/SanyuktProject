import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    limit, 
    onLimitChange, 
    totalItems,
    simpleLoadMore = false,
    loadStep = 12,
    showLimit = true,
}) => {
    if (simpleLoadMore) {
        const shownItems = Math.min(limit, totalItems);
        const hasMore = shownItems < totalItems;

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-6 border-t border-[#C8A96A]/10 bg-[#121212]/50 gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/40">
                    Showing <span className="text-[#C8A96A]">{shownItems}</span> of <span className="text-[#C8A96A]">{totalItems}</span>
                </span>

                {hasMore ? (
                    <button
                        onClick={() => onLimitChange(limit + loadStep)}
                        className="px-5 py-2.5 rounded-lg border border-[#C8A96A]/30 text-[#C8A96A] text-[11px] font-black uppercase tracking-widest hover:bg-[#C8A96A]/10 transition-all"
                    >
                        Load More
                    </button>
                ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C8A96A]/55">
                        All items loaded
                    </span>
                )}
            </div>
        );
    }

    if (totalPages <= 1 && totalItems <= limit) {
        return (
            <div className="flex justify-end items-center px-6 py-4 border-t border-[#C8A96A]/10 bg-[#121212]/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/40">
                    Showing all {totalItems} items
                </span>
            </div>
        );
    }

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-6 border-t border-[#C8A96A]/10 bg-[#121212]/50 gap-6">
            {/* Left: Total Info & Limit Selector */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/40">
                    Showing <span className="text-[#C8A96A]">{Math.min((currentPage - 1) * limit + 1, totalItems)}</span> to <span className="text-[#C8A96A]">{Math.min(currentPage * limit, totalItems)}</span> of <span className="text-[#C8A96A]">{totalItems}</span>
                </span>
                
                {showLimit && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/20">Per Page:</span>
                        <select
                            value={limit}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                            className="bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#C8A96A] focus:border-[#C8A96A] outline-none transition-colors cursor-pointer appearance-none pr-6 relative"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 \
0 24 24\' stroke=\'%23C8A96A\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.75rem' }}
                        >
                            {[5, 10, 20, 50, 100].map(val => (
                                <option key={val} value={val}>{val}</option>
                            ))}
                        </select>
                    </div>
                )}

            </div>

            {/* Right: Navigation Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-[#C8A96A]/20 text-[#C8A96A] hover:bg-[#C8A96A] hover:text-[#0D0D0D] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    title="First Page"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-[#C8A96A]/20 text-[#C8A96A] hover:bg-[#C8A96A] hover:text-[#0D0D0D] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    title="Previous"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 mx-2">
                    {startPage > 1 && (
                        <>
                            <span className="text-[#C8A96A]/40 text-xs px-2">...</span>
                        </>
                    )}
                    
                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${
                                currentPage === page
                                    ? 'bg-[#C8A96A] text-[#0D0D0D] shadow-[0_0_15px_rgba(200,169,106,0.3)]'
                                    : 'border border-[#C8A96A]/20 text-[#C8A96A] hover:border-[#C8A96A] hover:bg-[#C8A96A]/10'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            <span className="text-[#C8A96A]/40 text-xs px-2">...</span>
                        </>
                    )}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-[#C8A96A]/20 text-[#C8A96A] hover:bg-[#C8A96A] hover:text-[#0D0D0D] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    title="Next"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-[#C8A96A]/20 text-[#C8A96A] hover:bg-[#C8A96A] hover:text-[#0D0D0D] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    title="Last Page"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
