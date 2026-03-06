import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Star, ChevronUp } from 'lucide-react'; // Heart हटाया
import api from '../api';

const ProductsPage = () => {
    const navigate = useNavigate();

    const [expandedProduct, setExpandedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState({});

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

    // Buy Now function
    const buyNow = (product) => {
        if (product.stock > 0) {
            navigate('/checkout', {
                state: { product }
            });
        } else {
            alert(`${product.name} is out of stock!`);
        }
    };

    // Toggle product details
    const toggleDetails = (productId) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
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
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">Our Products</h1>
                        <div className="flex items-center gap-4">
                            {/* Search Bar */}
                            <div className="hidden md:block relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 pl-8 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                                />
                                <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                            </div>

                            {/* Cart Icon */}
                            <button className="relative p-2">
                                <ShoppingCart className="w-6 h-6 text-gray-600" />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartItems.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="md:hidden mt-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                            />
                            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
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
                                            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
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
                                                    <span className="text-xs text-gray-500">
                                                        ({product.numReviews})
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Product Name */}
                                        <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2 h-10 hover:text-green-600 transition-colors">
                                            {product.name}
                                        </h3>

                                        {/* Price */}
                                        <div className="mb-2">
                                            <span className="text-lg font-bold text-green-600">
                                                ₹{formatCurrency(product.price)}
                                            </span>
                                            {product.oldPrice && (
                                                <span className="text-xs text-gray-400 line-through ml-2">
                                                    ₹{formatCurrency(product.oldPrice)}
                                                </span>
                                            )}
                                        </div>

                                        {/* BV */}
                                        {product.bv && (
                                            <div className="text-xs text-gray-500 mb-3">
                                                BV: <span className="font-medium text-orange-500">{product.bv}</span>
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
                                            <button
                                                onClick={() => buyNow(product)}
                                                disabled={product.stock === 0}
                                                className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${product.stock > 0
                                                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-lg'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                                            </button>

                                            <button
                                                onClick={() => toggleDetails(product._id)}
                                                className="w-full border border-green-600 text-green-600 py-2 rounded-lg text-sm font-medium hover:bg-green-600 hover:text-white transition-all hover:shadow-md"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedProduct === product._id && (
                                        <div className="border-t border-gray-200 p-4 bg-gradient-to-b from-gray-50 to-white rounded-b-lg">
                                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                                {product.description}
                                            </p>

                                            {/* Additional Info */}
                                            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                                {product.bv && (
                                                    <div className="bg-purple-50 p-2 rounded-lg">
                                                        <span className="text-purple-600 font-medium">BV: </span>
                                                        <span className="text-gray-700">{product.bv}</span>
                                                    </div>
                                                )}
                                                {product.stock > 0 && (
                                                    <div className="bg-green-50 p-2 rounded-lg">
                                                        <span className="text-green-600 font-medium">Stock: </span>
                                                        <span className="text-gray-700">{product.stock} units</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => toggleDetails(product._id)}
                                                className="text-green-600 text-sm font-medium flex items-center gap-1 hover:underline"
                                            >
                                                Show less <ChevronUp className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
