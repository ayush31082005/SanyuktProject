import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Tag } from 'lucide-react';
import { useEffect } from 'react';
import { API_URL } from '../api';

const NewsDetailsModal = ({ isOpen, onClose, news }) => {
    if (!news) return null;

    // Build the image URL - handle both absolute and relative paths
    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/600x400";
        if (url.startsWith('http')) return url;
        // Handle path consistency
        const path = url.startsWith('/uploads') ? url : `/uploads/${url}`;
        return API_URL + path;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Today";
        const d = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
            return "Today";
        } else if (d.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    };

    // Prevent background scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-6 overflow-y-auto pt-[100px] md:pt-[120px]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 flex flex-col"
                    >
                        {/* Close Button - More Premium */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-[110] p-2.5 bg-white/90 backdrop-blur-md hover:bg-[#0A7A2F] hover:text-white rounded-full text-gray-900 shadow-xl transition-all duration-300 group hover:scale-110 active:scale-95"
                        >
                            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        {/* Modal Header (Integrated Layout) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                            <div className="relative">
                                {/* Large Featured Image */}
                                <div className="relative h-[300px] md:h-[450px] w-full bg-gray-100">
                                    <img
                                        src={getImageUrl(news.image)}
                                        alt={news.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
                                </div>

                                {/* Header Content Overlaying slightly */}
                                <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
                                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100">
                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-center gap-3">
                                                <span className="px-5 py-2 bg-[#F7931E]/10 text-[#F7931E] text-[10px] font-black tracking-widest uppercase rounded-xl">
                                                    {news.category}
                                                </span>
                                            </div>
                                            
                                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-950 leading-[1.15]">
                                                {news.title}
                                            </h2>

                                            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#0A7A2F] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-green-900/10">
                                                        {news.authorAvatar || (news.author ? news.author[0] : 'A')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-950">{news.author || 'Admin'}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Publication Author</p>
                                                    </div>
                                                </div>

                                                <div className="h-10 w-px bg-gray-100 md:block hidden" />

                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-gray-50 rounded-2xl">
                                                        <Calendar className="w-5 h-5 text-[#0A7A2F]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-950">{formatDate(news.createdAt)}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date Published</p>
                                                    </div>
                                                </div>

                                                <div className="h-10 w-px bg-gray-100 md:block hidden" />

                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-gray-50 rounded-2xl">
                                                        <Clock className="w-5 h-5 text-[#0A7A2F]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-950">{news.readTime || '5 min read'}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time to Read</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Reading Flow */}
                            <div className="max-w-4xl mx-auto px-8 md:px-12 py-16">
                                <div className="prose prose-xl prose-stone max-w-none">
                                    {news.content ? (
                                        news.content.split('\n').map((para, i) => (
                                            para.trim() && (
                                                <p key={i} className="mb-10 text-gray-700 text-lg md:text-xl leading-relaxed font-medium">
                                                    {para}
                                                </p>
                                            )
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic">No detailed description available.</p>
                                    )}
                                </div>
                                
                                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-[#0A7A2F]" />
                                        <span className="text-[10px] font-black uppercase tracking-[2px] text-gray-400">Section: <span className="text-[#0A7A2F] underline decoration-2">{news.category}</span></span>
                                    </div>
                                    
                                    <button
                                        onClick={onClose}
                                        className="group flex items-center gap-2 text-[#0A7A2F] font-black text-xs uppercase tracking-widest hover:gap-4 transition-all"
                                    >
                                        Finish Reading
                                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-[#0A7A2F] group-hover:text-white transition-colors">
                                            <X className="w-3 h-3" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NewsDetailsModal;
