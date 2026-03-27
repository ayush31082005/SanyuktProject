import React, { useState, useEffect } from 'react';
import api, { API_URL } from '../../api';
import NewsDetailsModal from '../../components/NewsDetailsModal';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

const NewsSection = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const { data } = await api.get(`/news?t=${new Date().getTime()}`);

            if (data.success) {
                setNewsItems(data.data);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewsClick = (news) => {
        setSelectedNews(news);
        setIsModalOpen(true);
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/600x400";
        if (url.startsWith('http')) return url;
        // If the URL already starts with /uploads, don't prepend it again
        const path = url.startsWith('/uploads') ? url : `/uploads/${url}`;
        return `${API_URL}${path}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
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

    if (loading) {
        return (
            <div className="py-10 bg-[#121212] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C8A96A]"></div>
            </div>
        );
    }

    if (!loading && newsItems.length === 0) {
        return (
            <section className="py-10 bg-[#121212] text-center" >
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#F5E6C8] mb-3">
                        Latest News & <span className="text-[#C8A96A]">Updates</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent mx-auto mb-8"></div>
                    <p className="text-[#F5E6C8]/40 max-w-2xl mx-auto text-lg font-light">
                        No news updates available at the moment. Please check back later or visit the admin panel to add news.
                    </p>
                </div>
            </section>
        );
    }
    return (
        <section className="py-10 md:py-16 bg-[#121212] relative overflow-hidden" >
            <div className="container mx-auto px-4 max-w-6xl">
                <h2 className="text-xl md:text-3xl font-serif font-bold text-center text-[#F5E6C8] mb-2 uppercase tracking-widest">
                    Latest News & <span className="text-[#C8A96A]">Updates</span>
                </h2>
                <div className="w-16 h-[1px] bg-[#C8A96A]/40 mx-auto mb-6"></div>
                <p className="text-center text-[#F5E6C8]/60 mb-8 max-w-2xl mx-auto text-[10px] md:text-xs font-light tracking-tight uppercase">
                    Stay updated with the latest company announcements and success stories.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
                    {newsItems.map((news) => (
                        <div
                            key={news._id}
                            onClick={() => handleNewsClick(news)}
                            className="luxury-box transition-all duration-500 overflow-hidden cursor-pointer flex flex-col group"
                        >
                            {/* Cover Image */}
                            <div className="relative h-36 overflow-hidden p-1">
                                <img
                                    src={getImageUrl(news.image)}
                                    alt={news.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2">
                                    <span className="px-2 py-0.5 bg-[#C8A96A] text-[#0D0D0D] text-[7px] font-bold tracking-widest uppercase shadow-lg">
                                        {news.category}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-2.5 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-1.5 text-[#F5E6C8]/40 text-[9px] font-medium uppercase tracking-tight">
                                    <Calendar className="w-2.5 h-2.5 text-[#C8A96A]" />
                                    <span>{formatDate(news.createdAt)}</span>
                                    <span className="text-[#C8A96A] font-bold mx-1">|</span>
                                    <span>{news.readTime}</span>
                                </div>

                                <h4 className="font-bold text-[#F5E6C8] text-xs mb-1 leading-snug group-hover:text-[#C8A96A] transition-colors line-clamp-2 uppercase tracking-tight">
                                    {news.title}
                                </h4>

                                <p className="text-[10px] text-gray-500 line-clamp-2 mb-2 flex-1 font-light">
                                    {news.content}
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-[#C8A96A]/10">
                                    <span className="text-[9px] font-bold text-[#C8A96A] uppercase tracking-widest">READ MORE</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-4 bg-[#C8A96A] text-[#0D0D0D] flex items-center justify-center font-bold text-[7px]">
                                            {news.authorAvatar || (news.author ? news.author[0] : 'A')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <NewsDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                news={selectedNews}
            />
        </section>
    );
};

export default NewsSection;
