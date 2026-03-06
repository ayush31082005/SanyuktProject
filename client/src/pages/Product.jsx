import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Star, ChevronUp, Trash2, ShieldCheck, Truck, RotateCcw, Info, Tag, Package } from 'lucide-react';
import api from '../api';
import { useCart } from '../context/CartContext';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Box,
    Button,
    Snackbar,
    Alert,
    Divider,
    Chip,
    Fade,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { X as CloseIcon } from 'lucide-react';

const ProductsPage = () => {
    const navigate = useNavigate();

    const { cartItems, addToCart, isInCart, removeFromCart } = useCart();
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState({});

    // Notifications State
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // बेस URL
    const BASE_URL = 'http://localhost:5001';

    // Fetch products from API
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products');
            console.log('Products fetched:', response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on search
    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper: check if user is logged in
    const isLoggedIn = () => {
        try {
            const user = localStorage.getItem('user');
            return user && JSON.parse(user);
        } catch {
            return false;
        }
    };

    // Buy Now function
    const buyNow = (product) => {
        if (!isLoggedIn()) {
            setSnackbar({ open: true, message: 'Please login first to buy products!', severity: 'error' });
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        if (product.stock > 0) {
            navigate('/checkout', {
                state: { product }
            });
        } else {
            setSnackbar({ open: true, message: `${product.name} is out of stock!`, severity: 'error' });
        }
    };

    // Toggle product details
    const openProductModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAddToCart = (product) => {
        if (!isLoggedIn()) {
            setSnackbar({ open: true, message: 'Please login first to add items to cart!', severity: 'error' });
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        if (isInCart(product._id)) {
            setSnackbar({ open: true, message: `${product.name} is already in your cart!`, severity: 'warning' });
            return;
        }
        addToCart(product);
        setSnackbar({ open: true, message: `${product.name} added to cart!`, severity: 'success' });
    };

    const handleRemoveFromCart = (productId, productName) => {
        removeFromCart(productId);
        setSnackbar({ open: true, message: `${productName} removed from cart!`, severity: 'info' });
    };

    // Calculate discount percentage
    const calculateDiscount = (price, oldPrice) => {
        if (!oldPrice || oldPrice <= price) return null;
        const discount = ((oldPrice - price) / oldPrice) * 100;
        return Math.round(discount);
    };

    // Render rating stars
    const renderRatingStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round(rating * 2) / 2;

        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
            } else if (i - 0.5 === roundedRating) {
                stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />);
            } else {
                stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
            }
        }
        return stars;
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    // इमेज एरर हैंडल करने के लिए फंक्शन
    const handleImageError = (productId) => {
        setImageErrors(prev => ({ ...prev, [productId]: true }));
        console.log(`Image load failed for product: ${productId}`);
    };

    // इमेज URL बनाने के लिए फंक्शन
    const getImageUrl = (imageName) => {
        if (!imageName) return null;
        if (imageName.startsWith('http')) return imageName;
        return `${BASE_URL}/uploads/${imageName}`;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header with Cart */}
            {/* Premium Header Container */}
            <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl items-center justify-center shadow-lg shadow-green-100 ring-4 ring-green-50">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-[#111827] tracking-tight">
                                    Our <span className="text-green-600">Products</span>
                                </h1>
                                <p className="text-[11px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">
                                    Trusted Quality • Best Value
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Modern Search Bar */}
                            <div className="relative flex-1 md:w-72 group">
                                <input
                                    type="text"
                                    placeholder="Search for items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
                                />
                                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                            </div>

                            {/* Premium Cart Button */}
                            <button
                                className="relative p-2.5 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-green-200 transition-all duration-300 group"
                                onClick={() => navigate('/my-account/cart')}
                            >
                                <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-[#f7931e] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg shadow-orange-200 border-2 border-white ring-2 ring-orange-100">
                                        {cartItems.reduce((acc, item) => acc + (item.cartQuantity || 1), 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🛍️</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                        <p className="text-gray-500">Try searching with different keywords</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product, index) => {
                            const discount = calculateDiscount(product.price, product.oldPrice);
                            const hasImageError = imageErrors[product._id];
                            const imageUrl = getImageUrl(product.image);

                            return (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-all hover:-translate-y-1 duration-300 animate-slide-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Product Image */}
                                    <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                                        {product.image && !hasImageError ? (
                                            <img
                                                src={imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                onError={() => handleImageError(product._id)}
                                                onLoad={() => console.log('Image loaded:', imageUrl)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                                                <span className="text-5xl mb-2">📷</span>
                                                <span className="text-sm">No Image Available</span>
                                            </div>
                                        )}

                                        {/* Offer Badge */}
                                        {discount && (
                                            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                                {discount}% OFF
                                            </div>
                                        )}

                                        {/* Out of Stock Overlay */}
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                                <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-4">
                                        {/* Rating */}
                                        {product.rating > 0 && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center">
                                                    {renderRatingStars(product.rating)}
                                                </div>
                                                {product.numReviews > 0 && (
                                                    <span className="text-xs text-gray-600 font-medium">
                                                        ({product.numReviews} Reviews)
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Product Name */}
                                        <h3 className="font-bold text-[#111827] text-sm mb-2 line-clamp-2 h-10 hover:text-green-600 transition-all duration-300 leading-snug">
                                            {product.name}
                                        </h3>

                                        {/* Price */}
                                        <div className="mb-2 flex items-baseline gap-2">
                                            <span className="text-xl font-black text-green-700">
                                                ₹{formatCurrency(product.price)}
                                            </span>
                                            {product.oldPrice && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    ₹{formatCurrency(product.oldPrice)}
                                                </span>
                                            )}
                                        </div>

                                        {/* BV */}
                                        {product.bv && (
                                            <div className="text-xs text-gray-600 mb-3 bg-orange-50 w-fit px-2 py-0.5 rounded-md border border-orange-100">
                                                BV: <span className="font-bold text-[#f7931e]">{product.bv}</span>
                                            </div>
                                        )}

                                        {/* Stock Status with Quantity */}
                                        <div className="mb-3">
                                            {product.stock > 0 ? (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-green-600 text-xs flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
                                                        In Stock
                                                    </span>
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                        {product.stock} left
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-red-600 text-xs flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                {isInCart(product._id) ? (
                                                    <button
                                                        onClick={() => handleRemoveFromCart(product._id, product.name)}
                                                        className="flex-1 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 border-2 border-[#f7931e] text-[#f7931e] hover:bg-orange-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Remove
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={product.stock === 0}
                                                        className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 border-2 ${product.stock === 0
                                                            ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                                                            : 'border-green-600 text-green-600 hover:bg-green-50'
                                                            }`}
                                                    >
                                                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => buyNow(product)}
                                                    disabled={product.stock === 0}
                                                    className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${product.stock > 0
                                                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Buy Now
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => openProductModal(product)}
                                                className="w-full border border-green-600 text-green-600 py-2 rounded-lg text-sm font-medium hover:bg-green-600 hover:text-white transition-all hover:shadow-md"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Professional Product Details Modal */}
            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fullScreen={useMediaQuery(useTheme().breakpoints.down('md'))}
                maxWidth="lg"
                fullWidth
                TransitionComponent={Fade}
                PaperProps={{
                    sx: {
                        borderRadius: { xs: 0, md: '28px' },
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }
                }}
            >
                {selectedProduct && (
                    <Box sx={{ position: 'relative', bgcolor: '#fff' }}>
                        {/* Close Button */}
                        <IconButton
                            onClick={() => setIsModalOpen(false)}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: 16,
                                zIndex: 10,
                                bgcolor: 'rgba(255,255,255,0.8)',
                                backdropFilter: 'blur(4px)',
                                '&:hover': { bgcolor: '#fff', color: '#ef4444' }
                            }}
                        >
                            <CloseIcon size={20} />
                        </IconButton>

                        <DialogContent sx={{ p: 0 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: { md: '600px' } }}>

                                {/* Left Column: Media & Visuals */}
                                <Box sx={{
                                    flex: 1,
                                    bgcolor: '#f9fafb',
                                    p: { xs: 4, md: 8 },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    borderRight: { md: '1px solid #f3f4f6' }
                                }}>
                                    <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: '450px',
                                        aspectRatio: '1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <img
                                            src={getImageUrl(selectedProduct.image)}
                                            alt={selectedProduct.name}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))'
                                            }}
                                        />

                                        {calculateDiscount(selectedProduct.price, selectedProduct.oldPrice) && (
                                            <div className="absolute top-0 left-0 bg-gradient-to-br from-[#f7931e] to-orange-600 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-xl shadow-orange-200 ring-4 ring-white">
                                                {calculateDiscount(selectedProduct.price, selectedProduct.oldPrice)}% OFF
                                            </div>
                                        )}
                                    </Box>

                                    {/* Quick Trust Indicators */}
                                    <Box sx={{ mt: 6, display: 'flex', gap: 4, opacity: 0.7 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-green-600" />
                                            <Typography variant="caption" fontWeight="700">100% Secure</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Truck className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                                            <Typography variant="caption" fontWeight="700">Fast Delivery</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <RotateCcw className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                                            <Typography variant="caption" fontWeight="700">Easy Returns</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Right Column: Details & Actions */}
                                <Box sx={{ flex: 1.2, p: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ mb: 4 }}>
                                        <Chip
                                            label={selectedProduct.category || "General"}
                                            size="small"
                                            sx={{
                                                bgcolor: '#f0fdf4',
                                                color: '#166534',
                                                fontWeight: 800,
                                                fontSize: '10px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                mb: 2,
                                                border: '1px solid #dcfce7'
                                            }}
                                        />
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827', lineHeight: 1.2, mb: 1, letterSpacing: '-0.02em' }}>
                                            {selectedProduct.name}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <div className="flex text-[#f7931e]">
                                                {renderRatingStars(selectedProduct.rating || 5)}
                                            </div>
                                            <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                                ({selectedProduct.numReviews || 150}+ Reviews)
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 4, p: 3, bgcolor: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 0.5 }}>
                                            <Typography sx={{ fontSize: '2.5rem', fontWeight: 900, color: '#15803d', letterSpacing: '-0.04em' }}>
                                                ₹{formatCurrency(selectedProduct.price)}
                                            </Typography>
                                            {selectedProduct.oldPrice && (
                                                <Typography sx={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1.25rem', fontWeight: 600 }}>
                                                    ₹{formatCurrency(selectedProduct.oldPrice)}
                                                </Typography>
                                            )}
                                        </Box>
                                        {selectedProduct.oldPrice && (
                                            <Typography variant="caption" sx={{ color: '#f7931e', fontWeight: 800 }}>
                                                You save ₹{formatCurrency(selectedProduct.oldPrice - selectedProduct.price)} ({calculateDiscount(selectedProduct.price, selectedProduct.oldPrice)}%)
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{ mb: 6 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Info className="w-4 h-4 text-green-600" /> Description
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#4b5563', lineHeight: 1.8, fontSize: '15px' }}>
                                            {selectedProduct.description || "Indulge in our premium quality product, crafted with the finest ingredients and rigorous quality checks to ensure your maximum satisfaction and wellness."}
                                        </Typography>
                                    </Box>

                                    {/* Structured Specs Grid */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 6 }}>
                                        <Box sx={{ p: 2, bgcolor: '#fff', border: '1px solid #f3f4f6', borderRadius: '16px' }}>
                                            <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700, display: 'block', mb: 0.5 }}>BUSINESS VOLUME</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Tag className="w-4 h-4 text-[#f7931e]" /> BV: {selectedProduct.bv || '00'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ p: 2, bgcolor: '#fff', border: '1px solid #f3f4f6', borderRadius: '16px' }}>
                                            <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700, display: 'block', mb: 0.5 }}>AVAILABILITY</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: selectedProduct.stock > 0 ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Package className="w-4 h-4" /> {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                                        {isInCart(selectedProduct._id) ? (
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                size="large"
                                                startIcon={<Trash2 className="w-5 h-5" />}
                                                onClick={() => handleRemoveFromCart(selectedProduct._id, selectedProduct.name)}
                                                sx={{
                                                    borderRadius: '16px',
                                                    py: 2,
                                                    borderColor: '#f7931e',
                                                    color: '#f7931e',
                                                    fontWeight: 900,
                                                    fontSize: '15px',
                                                    '&:hover': { borderColor: '#e67e00', bgcolor: '#fffaf0', transform: 'translateY(-2px)' },
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                            >
                                                Remove Item
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                size="large"
                                                startIcon={<ShoppingCart className="w-5 h-5" />}
                                                onClick={() => {
                                                    handleAddToCart(selectedProduct);
                                                    if (!isInCart(selectedProduct._id)) setIsModalOpen(false);
                                                }}
                                                disabled={selectedProduct.stock === 0}
                                                sx={{
                                                    borderRadius: '16px',
                                                    py: 2,
                                                    borderColor: '#059669',
                                                    color: '#059669',
                                                    fontWeight: 900,
                                                    fontSize: '15px',
                                                    '&:hover': { borderColor: '#047857', bgcolor: '#f0fdf4', transform: 'translateY(-2px)' },
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                            >
                                                Add to Cart
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            onClick={() => {
                                                buyNow(selectedProduct);
                                                setIsModalOpen(false);
                                            }}
                                            disabled={selectedProduct.stock === 0}
                                            sx={{
                                                borderRadius: '16px',
                                                py: 2,
                                                bgcolor: '#059669',
                                                color: '#fff',
                                                fontWeight: 900,
                                                fontSize: '15px',
                                                boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)',
                                                '&:hover': { bgcolor: '#047857', transform: 'translateY(-2px)' },
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            Buy Now
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </DialogContent>
                    </Box>
                )}
            </Dialog>

            {/* Global Notifications Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '16px',
                        fontWeight: 800,
                        boxShadow: '0 8px 30px rgba(247,147,30,0.25)',
                        bgcolor: '#f7931e', // User requested alert bg
                        color: 'white',
                        '& .MuiAlert-icon': { color: 'white' }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ProductsPage;
