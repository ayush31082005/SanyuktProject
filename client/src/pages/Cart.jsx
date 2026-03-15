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
            <div className="min-h-screen bg-[#f8fafc] py-12 flex flex-col items-center justify-center">
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center max-w-md text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-[#0A7A2F]" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">Discover amazing wellness products and start your healthy journey today!</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="w-full py-4 bg-[#0A7A2F] text-white rounded-xl font-bold hover:bg-[#086325] transition-all shadow-lg shadow-green-900/10 active:scale-95"
                    >
                        Explore Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8 pb-20">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Cart</h1>
                        <p className="text-slate-500 text-sm mt-1">Review your items before proceeding to checkout</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                        <ShoppingBag size={16} className="text-[#0A7A2F]" />
                        <span className="font-bold text-slate-700">{cartItems.length}</span> Items
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-5">
                        {cartItems.map((item) => (
                            <div key={item._id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-5 transition-all hover:shadow-md hover:border-green-100 relative overflow-hidden">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Item Image */}
                                    <div className="w-full md:w-32 h-32 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-50 relative group-hover:scale-105 transition-transform duration-500">
                                        {item.image ? (
                                            <img
                                                src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image.startsWith('/uploads') ? item.image : '/uploads/' + item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <ShoppingBag size={32} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Item Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-[#0A7A2F] transition-colors">
                                                {item.name}
                                            </h3>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="p-2 text-slate-400 hover:text-[#f7931e] hover:bg-orange-50 rounded-full transition-all"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                                            {item.description || "Premium quality health and wellness product."}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4">
                                            {item.bv && (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-100">
                                                    <Award size={14} />
                                                    BV: {item.bv}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-medium border border-slate-100">
                                                <Info size={14} />
                                                Price: {formatCurrency(item.price)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                                        <button
                                            onClick={() => updateQuantity(item._id, (item.cartQuantity || 1) - 1)}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-[#0A7A2F] hover:shadow transition-all active:scale-90"
                                            disabled={item.cartQuantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center text-lg font-bold text-slate-800">{item.cartQuantity || 1}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, (item.cartQuantity || 1) + 1)}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-[#0A7A2F] hover:shadow transition-all active:scale-90"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Item Total</p>
                                            <p className="text-xl font-black text-[#0A7A2F]">{formatCurrency((Number(item.price) || 0) * (Number(item.cartQuantity) || 1))}</p>
                                        </div>
                                        <button
                                            onClick={() => handleCheckout(item)}
                                            className="px-6 py-3 bg-[#0A7A2F] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#086325] shadow-lg shadow-green-900/10 transition-all active:scale-95"
                                        >
                                            Buy Item <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sticky top-24">
                            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <ShoppingBag className="text-[#0A7A2F]" size={20} />
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Total Items</span>
                                    <span className="text-slate-800 font-bold">{cartItems.reduce((acc, item) => acc + (item.cartQuantity || 1), 0)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">Free</span>
                                </div>
                                <div className="h-px bg-slate-100 my-4"></div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-sm text-slate-400 font-medium mb-1">Estimated Total</p>
                                        <p className="text-3xl font-black text-[#0A7A2F] leading-none">{formatCurrency(getCartTotal())}</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 text-center leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                Note: You are currently purchasing each item individually to ensure optimal shipping and processing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
