import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_URL } from '../api';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Info, Award } from 'lucide-react';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = (item) => {
        navigate('/checkout', { state: { product: item } });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[80vh] bg-[#0D0D0D] py-12 flex flex-col items-center justify-center p-4 rounded-[2rem] md:rounded-[3rem] border border-[#C8A96A]/10 my-4 md:my-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8A96A]/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="bg-[#1A1A1A] p-12 rounded-3xl shadow-2xl border border-[#C8A96A]/20 flex flex-col items-center max-w-md text-center relative z-10">
                    <div className="w-24 h-24 bg-[#0D0D0D] border border-[#C8A96A]/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(200,169,106,0.15)]">
                        <ShoppingBag className="w-10 h-10 text-[#C8A96A]" />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-[#F5E6C8] mb-4">Your Cart is Empty</h2>
                    <p className="text-[#F5E6C8]/60 mb-8 font-medium leading-relaxed">Discover our premium range of wellness products and start your healthy journey today!</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="w-full py-4 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] rounded-2xl font-black uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(200,169,106,0.4)] transition-all active:scale-95"
                    >
                        Explore Collection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] py-8 pb-24 text-[#F5E6C8] font-sans rounded-none sm:rounded-[2rem] border border-[#C8A96A]/10 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#C8A96A]/10 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#C8A96A] tracking-tight mb-2">My Cart</h1>
                        <p className="text-[#F5E6C8]/50 text-sm font-medium uppercase tracking-[0.2em]">Review your items before proceeding to checkout</p>
                    </div>
                    <div className="inline-flex items-center gap-3 bg-[#1A1A1A] px-6 py-3 rounded-2xl border border-[#C8A96A]/20 shadow-lg w-fit">
                        <ShoppingBag className="w-5 h-5 text-[#C8A96A]" />
                        <span className="text-[#F5E6C8]/80 font-medium tracking-wider text-sm">
                            <strong className="text-lg text-[#F5E6C8] mr-1">{cartItems.length}</strong> {cartItems.length === 1 ? 'Item' : 'Items'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-[#1A1A1A] rounded-2xl sm:rounded-3xl border border-[#C8A96A]/10 p-4 sm:p-6 transition-all duration-300 hover:border-[#C8A96A]/30 hover:shadow-[0_0_40px_rgba(200,169,106,0.05)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/5 rounded-bl-[100px] pointer-events-none -mr-10 -mt-10"></div>
                                
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 relative z-10">
                                    {/* Item Image */}
                                    <div className="w-full sm:w-40 h-28 sm:h-40 flex-shrink-0 bg-[#0D0D0D] rounded-xl sm:rounded-2xl overflow-hidden border border-[#C8A96A]/20 flex items-center justify-center relative transition-colors">
                                        {item.image ? (
                                            <img
                                                src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image.startsWith('/uploads') ? item.image : '/uploads/' + item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-[#0D0D0D]/40">
                                                <ShoppingBag className="w-10 h-10 mb-2" />
                                                <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Item Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex justify-between items-start gap-3 mb-2">
                                            <h3 className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-[#F5E6C8] line-clamp-2 leading-snug group-hover:text-[#C8A96A] transition-colors">
                                                {item.name}
                                            </h3>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="p-2 text-[#F5E6C8]/40 hover:text-[#C8A96A] hover:bg-[#C8A96A]/10 border border-transparent hover:border-[#C8A96A]/20 rounded-xl transition-all flex-shrink-0"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <p className="text-[#F5E6C8]/50 text-xs sm:text-sm line-clamp-2 mb-3 leading-relaxed font-medium">
                                            {item.description || "Premium quality health and wellness product. Formulated for maximum results."}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3">
                                            {item.bv && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C8A96A]/10 text-[#C8A96A] rounded-lg text-xs font-bold border border-[#C8A96A]/20 uppercase tracking-wider">
                                                    <Award size={14} />
                                                    BV: {item.bv}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D0D0D] text-[#F5E6C8]/80 rounded-lg text-xs font-bold border border-[#C8A96A]/10 tracking-wide">
                                                <Info size={14} className="text-[#C8A96A]" />
                                                Price: {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-[#C8A96A]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-5 relative z-10">
                                    <div className="flex items-center justify-center sm:justify-start bg-[#0D0D0D] p-1.5 rounded-xl border border-[#C8A96A]/20 h-[52px] w-full sm:w-auto">
                                        <button
                                            onClick={() => updateQuantity(item._id, (item.cartQuantity || 1) - 1)}
                                            className="w-10 h-full flex items-center justify-center rounded-lg text-[#F5E6C8]/60 hover:text-[#0D0D0D] hover:bg-[#C8A96A] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#F5E6C8]/60"
                                            disabled={item.cartQuantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-14 text-center text-lg font-black text-[#F5E6C8]">{item.cartQuantity || 1}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, (item.cartQuantity || 1) + 1)}
                                            className="w-10 h-full flex items-center justify-center rounded-lg text-[#F5E6C8]/60 hover:text-[#0D0D0D] hover:bg-[#C8A96A] transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-end w-full sm:w-auto gap-3 md:gap-8 bg-[#0D0D0D] sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none">
                                        <div className="text-left sm:text-right">
                                            <p className="text-[10px] text-[#C8A96A] font-bold uppercase tracking-[0.2em] mb-1">Item Total</p>
                                            <p className="text-xl sm:text-2xl font-black text-[#F5E6C8] tracking-tight">{formatCurrency((Number(item.price) || 0) * (Number(item.cartQuantity) || 1))}</p>
                                        </div>
                                        <button
                                            onClick={() => handleCheckout(item)}
                                            className="w-full sm:w-auto min-w-[136px] px-5 md:px-8 py-3 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] rounded-xl font-black uppercase tracking-[0.14em] text-sm md:text-base flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(200,169,106,0.3)] transition-all active:scale-95 flex-shrink-0 whitespace-nowrap"
                                        >
                                            <span className="sm:hidden">Buy Now</span>
                                            <span className="hidden sm:inline">Buy Item</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1A1A1A] rounded-3xl shadow-2xl border border-[#C8A96A]/20 p-8 sticky top-32 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/5 rounded-bl-[100px] pointer-events-none"></div>
                            
                            <h2 className="text-2xl font-serif font-bold text-[#F5E6C8] mb-8 flex items-center gap-3 relative z-10">
                                <ShoppingBag className="text-[#C8A96A]" size={24} />
                                Order Summary
                            </h2>

                            <div className="space-y-5 mb-8 relative z-10">
                                <div className="flex justify-between items-center text-[#F5E6C8]/70 font-medium">
                                    <span className="tracking-wide text-sm">Total Items</span>
                                    <span className="text-[#F5E6C8] font-bold text-base bg-[#0D0D0D] px-4 py-1.5 rounded-lg border border-[#C8A96A]/10">{cartItems.reduce((acc, item) => acc + (item.cartQuantity || 1), 0)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[#F5E6C8]/70 font-medium">
                                    <span className="tracking-wide text-sm">Shipping</span>
                                    <span className="text-[#0D0D0D] bg-[#C8A96A] font-black text-xs tracking-widest uppercase px-4 py-1.5 rounded-lg shadow-sm">Free</span>
                                </div>
                                <div className="h-px bg-gradient-to-r from-transparent via-[#C8A96A]/20 to-transparent my-6"></div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-[#C8A96A] font-bold uppercase tracking-[0.2em]">Estimated Total</p>
                                    <p className="text-4xl font-black text-[#F5E6C8] leading-none tracking-tighter">{formatCurrency(getCartTotal())}</p>
                                </div>
                            </div>

                            <p className="text-[11px] text-[#F5E6C8]/40 text-center leading-relaxed bg-[#0D0D0D] p-5 rounded-2xl border border-[#C8A96A]/10 mt-6 relative z-10 shadow-inner">
                                <span className="block text-[#C8A96A] font-bold mb-1.5 uppercase tracking-widest">Pricing Notice</span>
                                You are currently purchasing each item individually to ensure optimal shipping and processing protocols.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
