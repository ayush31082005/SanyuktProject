import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Button,
    Chip,
    Fade,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { 
    X as CloseIcon, 
    ShoppingCart, 
    Trash2, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    Info, 
    Tag, 
    Package,
    Star,
    Banknote,
    QrCode,
    CreditCard as CardIcon
} from 'lucide-react';
import { API_URL } from '../api';

const ProductDetailsModal = ({
    isOpen,
    onClose,
    product,
    onAddToCart,
    onRemoveFromCart,
    onBuyNow,
    isInCart
}) => {
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (!product) return null;

    // Helpers
    const calculateDiscount = (price, oldPrice) => {
        if (!oldPrice || oldPrice <= price) return null;
        const discount = ((oldPrice - price) / oldPrice) * 100;
        return Math.round(discount);
    };

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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const productImage = product.image 
        ? (product.image.startsWith('http') ? product.image : `${API_URL}${product.image.startsWith('/uploads') ? product.image : '/uploads/' + product.image}`)
        : null;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            fullScreen={isMobile}
            maxWidth="lg"
            fullWidth
            TransitionComponent={Fade}
            PaperProps={{
                sx: {
                    borderRadius: { xs: 0, md: '28px' },
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    maxHeight: '95vh'
                }
            }}
        >
            <Box sx={{ position: 'relative', bgcolor: '#fff' }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        zIndex: 10,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': { bgcolor: '#fff', color: '#0A7A2F' }
                    }}
                >
                    <CloseIcon size={20} />
                </IconButton>

                <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: { md: '500px' } }}>
                        {/* Left Column */}
                        <Box sx={{
                            flex: 0.8,
                            bgcolor: '#ffffff',
                            p: { xs: 2, md: 4 },
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
                                maxWidth: '400px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2
                            }}>
                                {productImage ? (
                                    <img
                                        src={productImage}
                                        alt={product.name}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))'
                                        }}
                                    />
                                ) : (
                                    <div className="text-9xl grayscale opacity-20">📦</div>
                                )}

                                {calculateDiscount(product.price, product.oldPrice) && (
                                    <div className="absolute top-0 left-0 bg-gradient-to-br from-[#f7931e] to-orange-600 text-white px-4 py-2 rounded-2xl font-black text-sm shadow-xl shadow-orange-200 ring-4 ring-white">
                                        {calculateDiscount(product.price, product.oldPrice)}% OFF
                                    </div>
                                )}
                            </Box>

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

                        {/* Right Column */}
                        <Box sx={{
                            flex: 1.2,
                            p: { xs: 4, md: 6 },
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#111827', lineHeight: 1.2, mb: 2, letterSpacing: '-0.02em' }}>
                                    {product.name}
                                </Typography>
                                <Chip
                                    label={product.category === "Beauty and cosmetic home based products" ? "Beauty & Cosmetics" : (product.category || "General")}
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

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <div className="flex text-[#f7931e]">
                                        {renderRatingStars(product.rating || 5)}
                                    </div>
                                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                        ({product.numReviews || 0} Reviews)
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mb: 4, p: 3, bgcolor: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 0.5 }}>
                                    <Typography sx={{ fontSize: '2.5rem', fontWeight: 900, color: '#15803d', letterSpacing: '-0.04em' }}>
                                        ₹{formatCurrency(product.price)}
                                    </Typography>
                                    {product.oldPrice && (
                                        <Typography sx={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '1.25rem', fontWeight: 600 }}>
                                            ₹{formatCurrency(product.oldPrice)}
                                        </Typography>
                                    )}
                                </Box>
                                {product.oldPrice && (
                                    <Typography variant="caption" sx={{ color: '#f7931e', fontWeight: 800 }}>
                                        You save ₹{formatCurrency(product.oldPrice - product.price)} ({calculateDiscount(product.price, product.oldPrice)}%)
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mb: 6 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Info className="w-4 h-4 text-green-600" /> Description
                                </Typography>
                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#4b5563',
                                            lineHeight: 1.8,
                                            fontSize: '15px',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: isDescExpanded ? 'none' : 5,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {product.description || "Indulge in our premium quality product, crafted with the finest ingredients and rigorous quality checks."}
                                    </Typography>
                                    {product.description && product.description.length > 300 && (
                                        <Button
                                            size="small"
                                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                                            sx={{
                                                mt: 1,
                                                textTransform: 'none',
                                                fontWeight: 800,
                                                color: '#f7931e',
                                                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                                                p: 0,
                                                minWidth: 'auto'
                                            }}
                                        >
                                            {isDescExpanded ? 'View Less' : 'View More'}
                                        </Button>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 6 }}>
                                <Box sx={{ p: 2, bgcolor: '#fff', border: '1px solid #f3f4f6', borderRadius: '16px' }}>
                                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700, display: 'block', mb: 0.5 }}>BUSINESS VOLUME</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Tag className="w-4 h-4 text-[#f7931e]" /> BV: {product.bv || '0'}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 2, bgcolor: '#fff', border: '1px solid #f3f4f6', borderRadius: '16px' }}>
                                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 700, display: 'block', mb: 0.5 }}>AVAILABILITY</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: product.stock > 0 ? '#16a34a' : '#f59e0b', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Package className="w-4 h-4" /> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mb: 6 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Banknote className="w-4 h-4 text-green-600" /> Accepted Payment Methods
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {(product.paymentMethods || ['cod', 'upi', 'card']).includes('cod') && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, bgcolor: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                                            <Banknote size={14} className="text-green-600" />
                                            <Typography variant="caption" fontWeight="700" color="#166534">COD</Typography>
                                        </Box>
                                    )}
                                    {(product.paymentMethods || ['cod', 'upi', 'card']).includes('upi') && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, bgcolor: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                                            <QrCode size={14} className="text-blue-600" />
                                            <Typography variant="caption" fontWeight="700" color="#1e40af">UPI</Typography>
                                        </Box>
                                    )}
                                    {(product.paymentMethods || ['cod', 'upi', 'card']).includes('card') && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, bgcolor: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                                            <CardIcon size={14} className="text-orange-600" />
                                            <Typography variant="caption" fontWeight="700" color="#9a3412">Card</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                                {isInCart ? (
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        size="large"
                                        startIcon={<Trash2 className="w-5 h-5" />}
                                        onClick={() => onRemoveFromCart(product._id, product.name)}
                                        sx={{
                                            borderRadius: '16px',
                                            py: 2,
                                            borderColor: '#f7931e',
                                            color: '#f7931e',
                                            fontWeight: 900,
                                            fontSize: '15px',
                                            '&:hover': { borderColor: '#e67e00', bgcolor: '#fffaf0' }
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
                                        onClick={() => onAddToCart(product)}
                                        disabled={product.stock === 0}
                                        sx={{
                                            borderRadius: '16px',
                                            py: 2,
                                            borderColor: '#059669',
                                            color: '#059669',
                                            fontWeight: 900,
                                            fontSize: '15px',
                                            '&:hover': { borderColor: '#047857', bgcolor: '#f0fdf4' }
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={() => onBuyNow(product)}
                                    disabled={product.stock === 0}
                                    sx={{
                                        borderRadius: '16px',
                                        py: 2,
                                        bgcolor: '#059669',
                                        color: '#fff',
                                        fontWeight: 900,
                                        fontSize: '15px',
                                        boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)',
                                        '&:hover': { bgcolor: '#047857' }
                                    }}
                                >
                                    Buy Now
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default ProductDetailsModal;
