import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { API_URL } from '../../api';

const ProductsCarousel = ({ 
    products, 
    scroll, 
    carouselRef, 
    calculateDiscount, 
    imageErrors, 
    handleImageError, 
    renderStars, 
    addToCart, 
    onProductClick,
    handleNavigation 
}) => {
    return (
        <section className="py-20 bg-gradient-to-b from-[#F8FAF5] to-white relative overflow-hidden" >
            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-left max-w-2xl">
                        <span className="text-[#F7931E] font-bold text-sm tracking-widest uppercase mb-3 block">
                            Discover Quality
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#0A7A2F] mb-4">
                            Featured Products
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Our best-selling products are trusted by customers and partners for their quality and effectiveness.
                        </p>
                    </div>

                    {/* Custom Navigation - Right Corner */}
                    <div className="flex gap-3 flex-shrink-0">
                        <button
                            onClick={() => scroll('left')}
                            className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#0A7A2F] hover:text-[#0A7A2F] hover:bg-green-50 transition-all duration-300"
                        >
                            <ChevronDown className="w-6 h-6 rotate-90" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-14 h-14 rounded-full bg-[#0A7A2F] flex items-center justify-center text-white shadow-xl shadow-green-900/20 hover:bg-[#086326] hover:scale-105 transition-all duration-300"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Products Carousel */}
                <div
                    ref={carouselRef}
                    className="flex gap-8 overflow-x-auto pb-12 pt-4 snap-x snap-mandatory scrollbar-hide no-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => {
                        const price = product.price || product.dp || 0;
                        const oldPrice = product.oldPrice || product.mrp || 0;
                        const bv = product.bv || 0;
                        const rating = product.rating || 5;
                        const reviews = product.numReviews || product.reviews || 0;
                        const category = product.category || "General";
                        const discount = calculateDiscount(oldPrice, price);

                        // Image logic
                        const getImageUrl = (image) => {
                            if (!image) return null;
                            if (image.startsWith('http')) return image;
                            const path = image.startsWith('/uploads') ? image : `/uploads/${image}`;
                            return `${API_URL}${path}`;
                        };

                        const imageUrl = getImageUrl(product.image);

                        return (
                            <div
                                key={product._id || product.slug}
                                className="min-w-[260px] sm:min-w-[300px] md:min-w-[340px] snap-center"
                            >
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-[32px] shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 group relative"
                                >
                                    {/* Product Image Container */}
                                    <div 
                                        className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer"
                                        onClick={() => onProductClick(product)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                                        {imageUrl && !imageErrors[product._id || product.name] ? (
                                            <motion.img
                                                whileHover={{ scale: 1.15 }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                src={imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={() => handleImageError(product._id || product.name)}
                                            />
                                        ) : (
                                            <div className="text-9xl grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110">
                                                {product.fallbackIcon || "📦"}
                                            </div>
                                        )}

                                        {/* Top Utility Buttons */}
                                        <div className="absolute top-6 left-6 flex flex-col items-start gap-3 z-20">
                                            {parseInt(discount) > 0 && (
                                                <span className="w-fit bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                                    -{discount}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Float Area */}
                                        <div className="absolute bottom-6 right-6 z-20 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product);
                                                }}
                                                className="w-16 h-16 rounded-full bg-white text-[#0A7A2F] shadow-2xl flex items-center justify-center hover:bg-[#0A7A2F] hover:text-white transition-colors"
                                            >
                                                <ShoppingCart className="w-7 h-7" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                        <div
                                            className="p-6 cursor-pointer group/details"
                                            onClick={() => onProductClick(product)}
                                        >
                                            <div className="flex items-center gap-1.5 mb-3">
                                                {renderStars(rating)}
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-1">
                                                    {reviews} Reviews
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-1.5 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-[#0A7A2F] group-hover/details:text-[#0A7A2F] transition-colors">
                                                    {product.name}
                                                </h3>
                                                <span className="w-fit text-[10px] font-black bg-green-50 text-[#0A7A2F] px-2 py-1 rounded-md uppercase tracking-wider border border-green-100">
                                                    {category === "Beauty and cosmetic home based products" ? "Beauty & Cosmetics" : category}
                                                </span>
                                            </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-black text-[#0A7A2F]">
                                                    ₹{price}
                                                </span>
                                                {oldPrice > price && (
                                                    <span className="text-gray-400 text-xs line-through font-medium">
                                                        MRP ₹{oldPrice}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="bg-orange-50 text-[#F7931E] px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border border-orange-100">
                                                    BV {bv}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-col gap-3">
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleNavigation('/checkout', { state: { product } })}
                                                className="w-full py-4 bg-[#F7931E] text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 group/btn shadow-lg shadow-orange-100"
                                            >
                                                <span>Instant Buy</span>
                                                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                            </motion.button>
                                            
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onProductClick(product);
                                                }}
                                                className="w-full py-4 border-2 border-[#0A7A2F] text-[#0A7A2F] font-bold rounded-xl hover:bg-[#0A7A2F] hover:text-white transition-all duration-300 uppercase tracking-widest text-xs"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-40 -right-20 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-50 z-0"></div>
            <div className="absolute bottom-40 -left-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-50 z-0"></div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default ProductsCarousel;
