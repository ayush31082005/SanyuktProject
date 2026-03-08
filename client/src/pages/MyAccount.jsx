import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from "../api";
import CartPage from './Cart';

// Material-UI imports
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlagIcon from '@mui/icons-material/Flag';
import VillaIcon from '@mui/icons-material/Villa';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GroupsIcon from '@mui/icons-material/Groups';
import WcIcon from '@mui/icons-material/Wc';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingIcon from '@mui/icons-material/Pending';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Styled Components
const AnimatedCard = styled(Card)(({ theme }) => ({
    transition: 'all 0.3s ease-in-out',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 20px rgba(10, 122, 47, 0.15)',
    },
}));

const AnimatedPaper = styled(Paper)(({ theme }) => ({
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    '&:hover': {
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)',
    },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    transition: 'all 0.2s ease-in-out',
    flex: 1,
    '&:hover': {
        backgroundColor: 'rgba(10, 122, 47, 0.05)',
        transform: 'scale(1.05)',
    },
}));

const InfoItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    borderRadius: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(0,0,0,0.03)',
    '&:hover': {
        backgroundColor: 'rgba(10, 122, 47, 0.08)',
        transform: 'translateX(10px)',
        boxShadow: '0 4px 15px rgba(10, 122, 47, 0.1)',
        '& .MuiSvgIcon-root': {
            transform: 'scale(1.2) rotate(5deg)',
            color: '#0A7A2F',
        },
    },
}));

const FullPageContainer = styled(Box)(({ theme }) => ({
    height: 'calc(100vh - 60px)', // Fixed height based on viewport
    width: '100%',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    position: 'relative',
    overflow: 'hidden', // Prevent outer scrolling
    padding: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
        height: 'calc(100vh - 80px)', // Adjust for taller header on desktop
        padding: theme.spacing(3),
    },
    display: 'flex',
    flexDirection: 'column',
}));

const StatusChip = styled(Chip)(({ status }) => ({
    fontWeight: 700,
    borderRadius: '10px',
    fontSize: '0.75rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    padding: '4px 2px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    ...(status === 'Pending' && {
        backgroundColor: 'rgba(247, 147, 30, 0.15)',
        color: '#F7931E',
        border: '1px solid rgba(247, 147, 30, 0.3)',
    }),
    ...(status === 'In Progress' && {
        backgroundColor: 'rgba(10, 122, 47, 0.15)',
        color: '#0A7A2F',
        border: '1px solid rgba(10, 122, 47, 0.3)',
    }),
    ...(status === 'Resolved' && {
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        color: '#4caf50',
        border: '1px solid rgba(76, 175, 80, 0.3)',
    }),
}));

const MyAccount = ({ defaultTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Determine active tab from URL path or prop
    const pathToTab = {
        '/my-account': 0,
        '/my-account/profile': 0,
        '/my-account/address': 1,
        '/my-account/orders': 2,
        '/my-account/transactions': 3,
        '/my-account/grievances': 4,
        '/my-account/kyc': 5,
        '/my-account/cart': -1,
    };
    const tabValue = defaultTab !== undefined ? defaultTab : (pathToTab[location.pathname] ?? 0);
    const setTabValue = (index) => {
        if (defaultTab !== undefined) {
            // When in new Dashboard, we navigate via sidebar but this keeps compatibility
            const tabPaths = ['/my-account/profile', '/my-account/address', '/my-account/orders', '/my-account/transactions', '/my-account/grievances', '/my-account/kyc'];
            navigate(tabPaths[index] || '/my-account/profile');
            return;
        }
        const tabPaths = ['/my-account/profile', '/my-account/address', '/my-account/orders', '/my-account/transactions', '/my-account/grievances', '/my-account/kyc'];
        navigate(tabPaths[index] || '/my-account/profile');
    };

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [userGrievances, setUserGrievances] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [userTransactions, setUserTransactions] = useState([]);
    const [grievancesLoading, setGrievancesLoading] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [showContent, setShowContent] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuOpen = Boolean(menuAnchorEl);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    // KYC State
    const [kycData, setKycData] = useState({
        aadharNumber: '',
        panNumber: '',
        bankDetails: { accountNumber: '', ifscCode: '', bankName: '' },
        kycDocuments: { aadharFront: '', aadharBack: '', panCard: '', passbook: '' }
    });
    const [kycSubmitting, setKycSubmitting] = useState(false);
    const kycReadOnly = userData?.kycStatus === 'Submitted' || userData?.kycStatus === 'Verified';

    // Orders UI State
    const [orderSearchQuery, setOrderSearchQuery] = useState('');
    const [orderTab, setOrderTab] = useState('All Orders'); // 'Active', 'All Orders', 'To Invoice', 'To Ship', 'To Backorder' -> mapped to our status


    const handleEditStart = () => {
        setEditData({
            userName: userData.userName || '',
            fatherName: userData.fatherName || '',
            mobile: userData.mobile || '',
            gender: userData.gender || '',
        });
        setEditMode(true);
    };

    const handleEditCancel = () => {
        setEditMode(false);
        setEditData({});
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const payload = { ...editData };
            if (profileImage) payload.profileImage = profileImage;
            const res = await api.put('/profile', payload);
            const updatedUser = res.data.user;
            setUserData(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('storage')); // refresh navbar avatar
            setEditMode(false);
            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update profile', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleKycImageUpload = (e, docType) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setKycData(prev => ({
                ...prev,
                kycDocuments: {
                    ...prev.kycDocuments,
                    [docType]: reader.result
                }
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleKycSubmit = async () => {
        // Validation
        if (!kycData.aadharNumber || !kycData.panNumber || !kycData.bankDetails.accountNumber) {
            setSnackbar({ open: true, message: 'Please fill all required KYC fields', severity: 'warning' });
            return;
        }

        setKycSubmitting(true);
        try {
            const res = await api.put('/kyc', kycData);
            const updatedUser = res.data.user;
            setUserData(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setSnackbar({ open: true, message: 'KYC submitted successfully!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to submit KYC', severity: 'error' });
        } finally {
            setKycSubmitting(false);
        }
    };

    // Fetch user orders
    const fetchUserOrders = async () => {
        setOrdersLoading(true);
        try {
            console.log("Fetching user orders...");
            const res = await api.get('/orders/myorders');
            console.log("Orders received:", res.data);
            setUserOrders(res.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            // Don't show snackbar error for orders to avoid cluttering if it's just empty
        } finally {
            setOrdersLoading(false);
        }
    };

    // Fetch user grievances
    const fetchUserGrievances = async (email) => {
        if (!email) return;

        setGrievancesLoading(true);
        try {
            console.log("Fetching grievances for:", email);
            const res = await api.get(`/grievance/user/${email}`);
            console.log("Grievances received:", res.data);

            if (res.data.success) {
                setUserGrievances(res.data.grievances || []);
            }
        } catch (error) {
            console.error("Error fetching grievances:", error);
            setSnackbar({
                open: true,
                message: 'Error fetching your grievances',
                severity: 'error'
            });
        } finally {
            setGrievancesLoading(false);
        }
    };

    // Fetch user transactions
    const fetchUserTransactions = async () => {
        setTransactionsLoading(true);
        try {
            const res = await api.get('/recharge/my-transactions');
            setUserTransactions(res.data || []);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setTransactionsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        console.log('MyAccount - Checking auth:', { token, user });

        if (!token || !user) {
            console.log('No token/user, redirecting to login');
            navigate('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(user);
            console.log('User data loaded:', parsedUser);
            setUserData(parsedUser);
            if (parsedUser.profileImage) setProfileImage(parsedUser.profileImage);

            // Set initial KYC data if available
            setKycData({
                aadharNumber: parsedUser.aadharNumber || '',
                panNumber: parsedUser.panNumber || '',
                bankDetails: parsedUser.bankDetails || { accountNumber: '', ifscCode: '', bankName: '' },
                kycDocuments: parsedUser.kycDocuments || { aadharFront: '', aadharBack: '', panCard: '', passbook: '' }
            });

            // Fetch data
            fetchUserGrievances(parsedUser.email);
            fetchUserOrders();
            fetchUserTransactions();

            // Show content with animation after loading
            setTimeout(() => setShowContent(true), 300);
        } catch (error) {
            console.error('Error parsing user:', error);
            localStorage.clear();
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setSnackbar({
            open: true,
            message: 'Logged out successfully!',
            severity: 'success'
        });
        setTimeout(() => {
            navigate('/login');
        }, 1500);
    };

    const getDisplayName = () => {
        if (!userData) return 'User';
        return userData.userName ||
            userData.name ||
            userData.email?.split('@')[0] ||
            'User';
    };

    const formatValue = (value) => {
        if (value === undefined || value === null || value === '') return 'Not provided';
        return value;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <PendingIcon />;
            case 'In Progress': return <HistoryIcon />;
            case 'Resolved': return <CheckCircleIcon />;
            default: return <AssignmentIcon />;
        }
    };

    if (loading) {
        return (
            <FullPageContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Zoom in={true} timeout={1000}>
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress
                            size={isMobile ? 50 : 60}
                            thickness={4}
                            sx={{ color: '#0A7A2F' }}
                        />
                        <Typography
                            variant={isMobile ? "body1" : "h6"}
                            sx={{ mt: 2, color: '#0A7A2F', fontWeight: 500 }}
                        >
                            Loading your profile...
                        </Typography>
                    </Box>
                </Zoom>
            </FullPageContainer>
        );
    }

    if (!userData) {
        return (
            <FullPageContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Fade in={true} timeout={1000}>
                    <Paper sx={{
                        p: isMobile ? 3 : 4,
                        textAlign: 'center',
                        borderRadius: '16px',
                        maxWidth: '500px',
                        width: '100%',
                        margin: '0 auto'
                    }}>
                        <Typography variant={isMobile ? "body1" : "h6"} color="error" gutterBottom>
                            No user data found. Please login again.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2, bgcolor: '#0A7A2F' }}
                            onClick={() => navigate('/login')}
                        >
                            Go to Login
                        </Button>
                    </Paper>
                </Fade>
            </FullPageContainer>
        );
    }

    return (
        <FullPageContainer>
            <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2, md: 0 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Welcome Header */}
                <Slide direction="down" in={showContent} timeout={800}>
                    <AnimatedPaper sx={{
                        p: { xs: 3, sm: 5 },
                        mb: 4,
                        background: 'linear-gradient(135deg, #0A7A2F 0%, #1a8c3a 50%, #065a22 100%)',
                        color: 'white',
                        borderRadius: { xs: '0px', sm: '28px' },
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(10,122,47,0.25)',
                        display: defaultTab !== undefined ? 'none' : 'block',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-20%',
                            left: '-10%',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(247,147,30,0.2) 0%, transparent 70%)',
                            borderRadius: '50%',
                            filter: 'blur(40px)',
                            animation: 'pulse 8s infinite alternate',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-30%',
                            right: '-5%',
                            width: '350px',
                            height: '350px',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            borderRadius: '50%',
                            filter: 'blur(50px)',
                        },
                        '@keyframes pulse': {
                            '0%': { transform: 'scale(1) translate(0, 0)' },
                            '100%': { transform: 'scale(1.2) translate(20px, 20px)' },
                        }
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: 2
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    src={profileImage || undefined}
                                    sx={{
                                        bgcolor: '#F7931E',
                                        width: { xs: 64, sm: 80 },
                                        height: { xs: 64, sm: 80 },
                                        fontSize: 28,
                                        fontWeight: 800,
                                        border: '4px solid rgba(255,255,255,0.4)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': { transform: 'scale(1.1) rotate(5deg)' }
                                    }}
                                >
                                    {!profileImage && (userData.userName || 'U')[0].toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>
                                        Welcome, {getDisplayName()}!
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 3 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EmailIcon fontSize="small" />
                                            <Typography variant="body2">{formatValue(userData.email)}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PhoneIcon fontSize="small" />
                                            <Typography variant="body2">{formatValue(userData.mobile)}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Button
                                variant="outlined"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    width: { xs: '100%', sm: 'auto' },
                                    '&:hover': {
                                        borderColor: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                    }
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </AnimatedPaper>
                </Slide>

                {/* Mobile Menu Toggle Button */}
                {isMobile && defaultTab === undefined && (
                    <Box sx={{ display: 'flex', mb: 1, px: 1 }}>
                        <Button
                            variant="contained"
                            startIcon={<MenuIcon />}
                            onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                            sx={{
                                bgcolor: '#0A7A2F',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#1a8c3a' }
                            }}
                        >
                            Menu
                        </Button>
                    </Box>
                )}

                {/* Mobile Navigation Menu (Dropdown) */}
                <Menu
                    anchorEl={menuAnchorEl}
                    open={menuOpen}
                    onClose={() => setMenuAnchorEl(null)}
                    PaperProps={{
                        sx: {
                            width: 220,
                            mt: 1.5,
                            borderRadius: '18px',
                            background: 'rgba(10, 122, 47, 0.9)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                            '& .MuiList-root': { p: 1.5 }
                        }
                    }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                >
                    {[
                        { icon: <PersonIcon />, label: 'Profile', index: 0, path: '/my-account/profile' },
                        { icon: <LocationOnIcon />, label: 'Address', index: 1, path: '/my-account/address' },
                        { icon: <ShoppingCartIcon />, label: 'My Cart', index: -1, path: '/my-account/cart' },
                        { icon: <ReceiptIcon />, label: 'Orders', index: 2, path: '/my-account/orders' },
                        { icon: <ReceiptIcon />, label: 'Transactions', index: 3, path: '/my-account/transactions' },
                        { icon: <SupportAgentIcon />, label: 'Grievances', index: 4, path: '/my-account/grievances' },
                        { icon: <FingerprintIcon />, label: 'KYC Verification', index: 5, path: '/my-account/kyc' },
                    ].map((item) => (
                        <MenuItem
                            key={item.index}
                            onClick={() => {
                                navigate(item.path);
                                setMenuAnchorEl(null);
                            }}
                            sx={{
                                borderRadius: '8px',
                                py: 1,
                                mb: 0.5,
                                bgcolor: tabValue === item.index ? 'rgba(255,255,255,0.2)' : 'transparent',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
                                {React.cloneElement(item.icon, { sx: { fontSize: 18, color: tabValue === item.index ? '#F7931E' : 'rgba(255,255,255,0.8)' } })}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    sx: {
                                        fontWeight: tabValue === item.index ? 700 : 500,
                                        fontSize: '13px'
                                    }
                                }}
                            />
                        </MenuItem>
                    ))}
                </Menu>

                {/* Vertical Sidebar + Content Layout */}
                <Fade in={showContent} timeout={800}>
                    <AnimatedPaper sx={{ 
                        borderRadius: defaultTab !== undefined ? '0px' : '16px', 
                        overflow: 'hidden', 
                        display: 'flex', 
                        flex: 1, 
                        minHeight: 0,
                        boxShadow: defaultTab !== undefined ? 'none' : undefined,
                        border: defaultTab !== undefined ? 'none' : undefined,
                        bgcolor: defaultTab !== undefined ? 'transparent' : undefined
                    }}>
                        {/* Left Sidebar (Desktop only) */}
                        <Box sx={{
                            width: { xs: 0, sm: '220px' },
                            display: defaultTab !== undefined ? 'none' : { xs: 'none', sm: 'flex' },
                            flexShrink: 0,
                            background: 'linear-gradient(180deg, #0A7A2F 0%, #1a8c3a 60%, #0A7A2F 100%)',
                            flexDirection: 'column',
                            py: 3,
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': { width: '4px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px' }
                        }}>
                            {[
                                { icon: <PersonIcon />, label: 'Profile', index: 0, path: '/my-account/profile' },
                                { icon: <LocationOnIcon />, label: 'Address', index: 1, path: '/my-account/address' },
                                { icon: <ShoppingCartIcon />, label: 'My Cart', index: -1, path: '/my-account/cart' },
                                { icon: <ReceiptIcon />, label: 'Orders', index: 2, path: '/my-account/orders' },
                                { icon: <ReceiptIcon />, label: 'Transactions', index: 3, path: '/my-account/transactions' },
                                { icon: <SupportAgentIcon />, label: 'Grievances', index: 4, path: '/my-account/grievances' },
                                { icon: <FingerprintIcon />, label: 'KYC Verification', index: 5, path: '/my-account/kyc' },
                            ].map((item) => (
                                <Box
                                    key={item.index}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        display: 'flex', alignItems: 'center',
                                        gap: { xs: 0, sm: 1.5 },
                                        justifyContent: { xs: 'center', sm: 'flex-start' },
                                        px: { xs: 0, sm: 2.5 }, py: 1.75,
                                        mx: 1.5, mb: 0.5,
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        bgcolor: tabValue === item.index ? 'rgba(255,255,255,0.2)' : 'transparent',
                                        borderLeft: tabValue === item.index ? '3px solid #F7931E' : '3px solid transparent',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                                    }}
                                >
                                    <Box sx={{ color: tabValue === item.index ? '#F7931E' : 'rgba(255,255,255,0.8)', display: 'flex' }}>
                                        {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
                                    </Box>
                                    <Typography sx={{
                                        display: { xs: 'none', sm: 'block' },
                                        color: tabValue === item.index ? 'white' : 'rgba(255,255,255,0.75)',
                                        fontWeight: tabValue === item.index ? 700 : 500,
                                        fontSize: '14px',
                                    }}>
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Right Content Panel */}
                        <Box sx={{
                            flex: 1,
                            p: defaultTab !== undefined ? { xs: 0, sm: 1, md: 2 } : { xs: 1.5, sm: 2, md: 3 },
                            overflowY: 'auto',
                            bgcolor: defaultTab !== undefined ? 'transparent' : '#fafafa',
                            height: '100%', // Fill the parent container
                            position: 'relative'
                        }}>
                            {/* Cart Tab (index -1) */}
                            {tabValue === -1 && (
                                <Box>
                                    <CartPage />
                                </Box>
                            )}

                            {/* Profile Tab */}
                            {tabValue === 0 && (
                                <Box>
                                    {/* Avatar Hero Card */}
                                    <Box sx={{ mb: 3, borderRadius: '18px', overflow: 'hidden', border: '1px solid #e8f5e9', boxShadow: '0 4px 20px rgba(10,122,47,0.1)' }}>
                                        <Box sx={{ height: '6px', background: 'linear-gradient(90deg, #0A7A2F, #F7931E, #0A7A2F)' }} />
                                        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, bgcolor: 'white', flexWrap: 'wrap' }}>
                                            <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2.5, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
                                                {/* Avatar with Camera Upload Overlay */}
                                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                                    <Avatar
                                                        src={profileImage || undefined}
                                                        sx={{ width: 80, height: 80, bgcolor: '#0A7A2F', fontSize: 32, fontWeight: 700, border: '3px solid #e8f5e9' }}
                                                    >
                                                        {!profileImage && (userData.userName || 'U')[0].toUpperCase()}
                                                    </Avatar>
                                                    {editMode && (
                                                        <Tooltip title="Upload photo">
                                                            <Box
                                                                component="label"
                                                                htmlFor="profile-image-upload"
                                                                sx={{
                                                                    position: 'absolute', bottom: 0, right: 0,
                                                                    bgcolor: '#0A7A2F', borderRadius: '50%', width: 26, height: 26,
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    cursor: 'pointer', border: '2px solid white',
                                                                    '&:hover': { bgcolor: '#085c22' }, transition: 'background 0.2s'
                                                                }}
                                                            >
                                                                <CameraAltIcon sx={{ color: 'white', fontSize: 13 }} />
                                                            </Box>
                                                        </Tooltip>
                                                    )}
                                                    <input
                                                        id="profile-image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        hidden
                                                        disabled={!editMode}
                                                        onChange={handleImageUpload}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 800, fontSize: '20px', color: '#111', lineHeight: 1.2 }}>{formatValue(userData.userName)}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                                                        <Box sx={{ bgcolor: '#e8f5e9', color: '#0A7A2F', fontWeight: 600, fontSize: '11px', px: 1.5, py: 0.25, borderRadius: '20px' }}>ID: {formatValue(userData.memberId)}</Box>
                                                        <Box sx={{ bgcolor: '#fffbed', color: '#F7931E', fontWeight: 600, fontSize: '11px', px: 1.5, py: 0.25, borderRadius: '20px' }}>{formatValue(userData.position)}</Box>
                                                        <Typography sx={{ color: '#bbb', fontSize: '13px' }}>{[userData.district, userData.state].filter(Boolean).join(', ') || 'India'}</Typography>
                                                    </Box>
                                                    <Typography sx={{ color: '#999', fontSize: '13px', mt: 0.5, wordBreak: 'break-all' }}>{formatValue(userData.email)}</Typography>
                                                </Box>
                                            </Box>
                                            {/* Edit / Save / Cancel Buttons */}
                                            {!editMode ? (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<EditIcon />}
                                                    onClick={handleEditStart}
                                                    size="small"
                                                    sx={{ borderColor: '#0A7A2F', color: '#0A7A2F', borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: '#e8f5e9' }, ml: { xs: 0, sm: 'auto' } }}
                                                >
                                                    Edit Profile
                                                </Button>
                                            ) : (
                                                <Box sx={{ display: 'flex', gap: 1, ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={saving ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <SaveIcon />}
                                                        onClick={handleSaveProfile}
                                                        disabled={saving}
                                                        size="small"
                                                        sx={{ bgcolor: '#0A7A2F', borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: '#085c22' }, flex: { xs: 1, sm: 'none' } }}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<CancelIcon />}
                                                        onClick={handleEditCancel}
                                                        size="small"
                                                        sx={{ borderColor: '#ddd', color: '#666', borderRadius: '8px', fontWeight: 600, flex: { xs: 1, sm: 'none' } }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Personal Information Section */}
                                    <Paper variant="outlined" sx={{ borderRadius: '18px', overflow: 'hidden', mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fcfdfc' }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#111', letterSpacing: '0.2px' }}>Personal Information</Typography>
                                        </Box>
                                        <Box sx={{ px: 3, py: 1.5 }}>
                                            {editMode ? (
                                                // Edit mode — TextFields
                                                <Grid container spacing={1.5} sx={{ py: 1.5 }}>
                                                    {[
                                                        { label: 'User Name', key: 'userName' },
                                                        { label: "Father's Name", key: 'fatherName' },
                                                        { label: 'Phone', key: 'mobile' },
                                                        { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
                                                    ].map((field) => (
                                                        <Grid item xs={12} sm={6} key={field.key}>
                                                            {field.type === 'select' ? (
                                                                <TextField
                                                                    select
                                                                    fullWidth
                                                                    size="small"
                                                                    label={field.label}
                                                                    value={editData[field.key] || ''}
                                                                    onChange={(e) => setEditData(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                                    SelectProps={{ native: true }}
                                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                                                >
                                                                    <option value=""></option>
                                                                    {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                                                                </TextField>
                                                            ) : (
                                                                <TextField
                                                                    fullWidth
                                                                    size="small"
                                                                    label={field.label}
                                                                    value={editData[field.key] || ''}
                                                                    onChange={(e) => setEditData(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                                                />
                                                            )}
                                                        </Grid>
                                                    ))}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth size="small" label="Email Address"
                                                            value={formatValue(userData.email)}
                                                            disabled
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#f9f9f9' } }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth size="small" label="Position"
                                                            value={formatValue(userData.position)}
                                                            disabled
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#f9f9f9' } }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            ) : (
                                                // View mode — 3-column grid with card-style items
                                                <Grid container spacing={2.5} sx={{ py: 2 }}>
                                                    {[
                                                        { label: 'User Name', value: formatValue(userData.userName), icon: <PersonIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                        { label: "Father's Name", value: formatValue(userData.fatherName), icon: <GroupsIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                        { label: 'Email Address', value: formatValue(userData.email), icon: <EmailIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                        { label: 'Phone', value: formatValue(userData.mobile), icon: <PhoneIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                        { label: 'Gender', value: formatValue(userData.gender), icon: <WcIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                        { label: 'Position', value: formatValue(userData.position), icon: <BadgeIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                    ].map((field, fi) => (
                                                        <Grid item xs={12} sm={6} md={6} key={fi}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1.5,
                                                                p: 2,
                                                                borderRadius: '12px',
                                                                bgcolor: '#fcfdfc',
                                                                border: '1px solid rgba(10, 122, 47, 0.08)',
                                                                height: '100%',
                                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                                '&:hover': {
                                                                    transform: 'translateY(-2px)',
                                                                    boxShadow: '0 4px 12px rgba(10,122,47,0.08)',
                                                                    bgcolor: 'white'
                                                                }
                                                            }}>
                                                                <Box sx={{ bgcolor: '#f0f9f1', p: 1, borderRadius: '8px', display: 'flex' }}>
                                                                    {field.icon}
                                                                </Box>
                                                                <Box>
                                                                    <Typography sx={{ color: '#999', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>{field.label}</Typography>
                                                                    <Typography sx={{ color: '#111', fontSize: '14px', fontWeight: 700 }}>{field.value}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            )}
                                        </Box>
                                    </Paper>

                                    {/* Account Details Section (read-only) */}
                                    <Paper variant="outlined" sx={{ borderRadius: '18px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.02)', mb: 3 }}>
                                        <Box sx={{ px: 3, py: 2, bgcolor: '#f8fbf9', borderBottom: '1px solid #f0f0f0' }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#111', display: 'flex', alignItems: 'center', gap: 1.2, letterSpacing: '0.2px' }}>
                                                <FingerprintIcon sx={{ fontSize: 22, color: '#0A7A2F' }} /> Account Details
                                            </Typography>
                                        </Box>
                                        <Box sx={{ px: 3, py: 1.5 }}>
                                            <Grid container spacing={2.5} sx={{ py: 2 }}>
                                                {[
                                                    { label: 'My Sponsor ID', value: formatValue(userData.memberId), icon: <FingerprintIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                    { label: 'Referrer ID', value: formatValue(userData.sponsorId), icon: <GroupsIcon sx={{ fontSize: 18, color: '#F7931E' }} /> },
                                                    { label: 'Sponsor Name', value: formatValue(userData.sponsorName), icon: <PersonIcon sx={{ fontSize: 18, color: '#F7931E' }} /> },
                                                    { label: 'State', value: formatValue(userData.state), icon: <FlagIcon sx={{ fontSize: 18, color: '#F7931E' }} /> },
                                                ].map((field, fi) => (
                                                    <Grid item xs={12} sm={6} md={6} key={fi}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                            p: 2,
                                                            borderRadius: '12px',
                                                            bgcolor: '#fffdf9',
                                                            border: '1px solid rgba(247, 147, 30, 0.08)',
                                                            height: '100%',
                                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 4px 12px rgba(247,147,30,0.08)',
                                                                bgcolor: 'white'
                                                            }
                                                        }}>
                                                            <Box sx={{ bgcolor: '#fffbed', p: 1, borderRadius: '8px', display: 'flex' }}>
                                                                {field.icon}
                                                            </Box>
                                                            <Box>
                                                                <Typography sx={{ color: '#999', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>{field.label}</Typography>
                                                                <Typography sx={{ color: '#111', fontSize: '14px', fontWeight: 700 }}>{field.value}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Paper>
                                </Box>
                            )}

                            {/* Address Tab */}
                            {tabValue === 1 && (
                                <Box>
                                    {/* Address Summary Card */}
                                    <Box sx={{ mb: 3, borderRadius: '18px', overflow: 'hidden', border: '1px solid #e8f5e9', boxShadow: '0 4px 20px rgba(10,122,47,0.1)' }}>
                                        <Box sx={{ height: '6px', background: 'linear-gradient(90deg, #0A7A2F, #F7931E, #0A7A2F)' }} />
                                        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Box sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: '12px', bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <LocationOnIcon sx={{ color: '#0A7A2F', fontSize: { xs: 20, sm: 26 } }} />
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontSize: { xs: '14px', sm: '16px' }, color: '#111' }}>Address Information</Typography>
                                                <Typography sx={{ color: '#999', fontSize: { xs: '11px', sm: '13px' }, mt: 0.25 }}>
                                                    {[userData.village, userData.district, userData.state].filter(Boolean).join(', ') || 'No address on file'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Location Details */}
                                    <Paper variant="outlined" sx={{ borderRadius: '18px', overflow: 'hidden', mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.02)' }}>
                                        <Box sx={{ px: 3, py: 2, bgcolor: '#f8fbf9', borderBottom: '1px solid #f0f0f0' }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#111', display: 'flex', alignItems: 'center', gap: 1.2, letterSpacing: '0.2px' }}>
                                                <HomeIcon sx={{ fontSize: 22, color: '#0A7A2F' }} /> Location Details
                                            </Typography>
                                        </Box>
                                        <Box sx={{ px: 3, py: 1.5 }}>
                                            <Grid container spacing={2.5} sx={{ py: 2 }}>
                                                {[
                                                    { label: 'State', value: formatValue(userData.state), icon: <FlagIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                    { label: 'District', value: formatValue(userData.district), icon: <LocationOnIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                    { label: 'Assembly Area', value: formatValue(userData.assemblyArea), icon: <GroupsIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                    { label: 'Block', value: formatValue(userData.block), icon: <VillaIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                    { label: 'Village Council', value: formatValue(userData.villageCouncil), icon: <AccountCircleIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                    { label: 'Village', value: formatValue(userData.village), icon: <AgricultureIcon sx={{ fontSize: 18, color: '#0A7A2F' }} /> },
                                                ].map((field, fi) => (
                                                    <Grid item xs={12} sm={6} md={6} key={fi}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                            p: 2,
                                                            borderRadius: '12px',
                                                            bgcolor: '#fcfdfc',
                                                            border: '1px solid rgba(10, 122, 47, 0.08)',
                                                            height: '100%',
                                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 4px 12px rgba(10,122,47,0.08)',
                                                                bgcolor: 'white'
                                                            }
                                                        }}>
                                                            <Box sx={{ bgcolor: '#f0f9f1', p: 1, borderRadius: '8px', display: 'flex' }}>
                                                                {field.icon}
                                                            </Box>
                                                            <Box>
                                                                <Typography sx={{ color: '#999', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>{field.label}</Typography>
                                                                <Typography sx={{ color: '#111', fontSize: '14px', fontWeight: 700 }}>{field.value}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Paper>

                                    {/* Shipping Address */}
                                    <Paper variant="outlined" sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                                        <Box sx={{ px: 2, py: 1.5, bgcolor: '#fffbed', borderBottom: '1px solid #f0f0f0' }}>
                                            <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#111', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationOnIcon sx={{ fontSize: 20, color: '#F7931E' }} /> Shipping Address
                                            </Typography>
                                        </Box>
                                        <Box sx={{ px: 2, py: 1.5, bgcolor: 'white' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <Box sx={{ bgcolor: '#fff8e1', p: 1.5, borderRadius: '10px', display: 'flex' }}>
                                                    <HomeIcon sx={{ color: '#F7931E' }} />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ color: '#999', fontSize: '12px', fontWeight: 500, mb: 0.75 }}>Full Address</Typography>
                                                    <Typography sx={{ color: '#111', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 700, lineHeight: 1.6, maxWidth: '100%' }}>
                                                        {[userData.shippingAddress, userData.village, userData.villageCouncil, userData.block, userData.district, userData.state].filter(Boolean).join(', ') || 'Address not provided'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Box>
                            )}

                            {/* Orders Tab */}
                            {tabValue === 2 && (
                                <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                                    {/* Header Section */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#111' }}>
                                            Orders
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <TextField
                                                size="small"
                                                placeholder="Search order, invoice, email"
                                                value={orderSearchQuery}
                                                onChange={(e) => setOrderSearchQuery(e.target.value)}
                                                sx={{
                                                    width: { xs: '100%', sm: '320px' },
                                                    '& .MuiOutlinedInput-root': { borderRadius: '6px' }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon sx={{ color: '#aaa', fontSize: 20 }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate('/products')}
                                                sx={{ bgcolor: '#f3791e', '&:hover': { bgcolor: '#e0681a' }, borderRadius: '6px', textTransform: 'none', px: 2.5, py: 1, whiteSpace: 'nowrap', fontWeight: 600, boxShadow: 'none' }}
                                            >
                                                New sales order
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Tabs */}
                                    <Box sx={{ borderBottom: 1, borderColor: '#f0f0f0', mb: 4 }}>
                                        <Tabs
                                            value={orderTab}
                                            onChange={(e, newValue) => setOrderTab(newValue)}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            sx={{
                                                minHeight: '44px',
                                                '& .MuiTab-root': {
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    fontSize: '14px',
                                                    minWidth: 'auto',
                                                    px: 3,
                                                    py: 1,
                                                    minHeight: '44px',
                                                    color: '#999',
                                                    transition: 'all 0.2s'
                                                },
                                                '& .Mui-selected': {
                                                    color: '#0A7A2F !important'
                                                },
                                                '& .MuiTabs-indicator': {
                                                    backgroundColor: '#0A7A2F',
                                                    height: 3,
                                                    borderRadius: '3px 3px 0 0'
                                                }
                                            }}
                                        >
                                            <Tab label="Active" value="Active" />
                                            <Tab label="All Orders" value="All Orders" />
                                            <Tab label="To Invoice" value="To Invoice" />
                                            <Tab label="To Ship" value="To Ship" />
                                            <Tab label="To Backorder" value="To Backorder" />
                                        </Tabs>
                                    </Box>

                                    {ordersLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={40} sx={{ color: '#7856d6' }} /></Box>
                                    ) : (
                                        <Box>
                                            {/* Empty State / Promotional Banner */}
                                            {userOrders.length === 0 && (
                                                <Paper variant="outlined" sx={{ borderRadius: '12px', p: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderColor: '#eee', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                                                    <Box>
                                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111', mb: 1, letterSpacing: '-0.5px' }}>
                                                            Create your first order
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ color: '#777', maxWidth: '600px', lineHeight: 1.6 }}>
                                                            Sanyukt Parivaar aggregates orders from all of your different sales channels here. Manage orders from creation to fulfilment in one place.
                                                        </Typography>
                                                    </Box>
                                                    <Button variant="outlined" onClick={() => navigate('/products')} sx={{ borderRadius: '6px', textTransform: 'none', borderColor: '#d0d0d0', color: '#555', fontWeight: 600, '&:hover': { borderColor: '#111', color: '#111', bgcolor: 'transparent' } }}>
                                                        Create a New Sales order
                                                    </Button>
                                                </Paper>
                                            )}

                                            {/* Data Table - Desktop */}
                                            {userOrders.length > 0 && (
                                                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                                    <TableContainer sx={{ border: '1px solid #eee', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                                        <Table sx={{ minWidth: 800 }} aria-label="orders table">
                                                            <TableHead sx={{ bgcolor: '#fcfdfc' }}>
                                                                <TableRow>
                                                                    <TableCell padding="checkbox" sx={{ borderBottom: '1px solid #eee', py: 2 }}><Checkbox size="small" sx={{ color: '#ccc' }} /></TableCell>
                                                                    <TableCell sx={{ color: '#111', fontWeight: 700, fontSize: '13.5px', borderBottom: '1px solid #eee', py: 2 }}>Order ID</TableCell>
                                                                    <TableCell sx={{ color: '#111', fontWeight: 700, fontSize: '13.5px', borderBottom: '1px solid #eee', py: 2 }}>Product / Item</TableCell>
                                                                    <TableCell sx={{ color: '#111', fontWeight: 700, fontSize: '13.5px', borderBottom: '1px solid #eee', py: 2 }}>Status</TableCell>
                                                                    <TableCell sx={{ color: '#111', fontWeight: 700, fontSize: '13.5px', borderBottom: '1px solid #eee', py: 2 }}>Total</TableCell>
                                                                    <TableCell sx={{ color: '#111', fontWeight: 700, fontSize: '13.5px', borderBottom: '1px solid #eee', py: 2 }}>Date</TableCell>
                                                                    <TableCell sx={{ color: '#111', fontWeight: 700, fontSize: '13.5px', borderBottom: '1px solid #eee', py: 2 }} align="center">Action</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {userOrders
                                                                    .filter(order => {
                                                                        const q = orderSearchQuery.toLowerCase();
                                                                        const orderId = order._id?.slice(-8) || '';
                                                                        const prodName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || '';
                                                                        const matchesSearch = orderId.toLowerCase().includes(q) || prodName.toLowerCase().includes(q);

                                                                        let matchesTab = true;
                                                                        const status = (order.status || 'pending').toLowerCase();
                                                                        if (orderTab === 'Active') matchesTab = ['pending', 'processing'].includes(status);
                                                                        if (orderTab === 'To Invoice') matchesTab = ['processing', 'shipped'].includes(status);
                                                                        if (orderTab === 'To Ship') matchesTab = ['processing'].includes(status);
                                                                        if (orderTab === 'To Backorder') matchesTab = status === 'backorder';
                                                                        if (orderTab === 'All Orders') matchesTab = true;

                                                                        return matchesSearch && matchesTab;
                                                                    })
                                                                    .map((order, index) => {
                                                                        const orderNum = `#CR00${String(index + 1).padStart(2, '0')}`;
                                                                        const productName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || 'Item';

                                                                        const statusMatch = order.status?.toLowerCase() || 'pending';

                                                                        let statusColor = '#fff3e0';
                                                                        let statusTextCode = '#e65100';
                                                                        let statusLabel = 'Pending';

                                                                        if (statusMatch === 'processing') {
                                                                            statusColor = '#e3f2fd';
                                                                            statusTextCode = '#1565c0';
                                                                            statusLabel = 'Processing';
                                                                        } else if (statusMatch === 'shipped') {
                                                                            statusColor = '#f3e5f5';
                                                                            statusTextCode = '#7b1fa2';
                                                                            statusLabel = 'Shipped';
                                                                        } else if (statusMatch === 'delivered') {
                                                                            statusColor = '#e8f5e9';
                                                                            statusTextCode = '#2e7d32';
                                                                            statusLabel = 'Delivered';
                                                                        } else if (statusMatch === 'cancelled') {
                                                                            statusColor = '#ffebee';
                                                                            statusTextCode = '#c62828';
                                                                            statusLabel = 'Cancelled';
                                                                        }

                                                                        const total = order.totalAmount || order.total || '0';
                                                                        const date = new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

                                                                        return (
                                                                            <TableRow
                                                                                key={order._id || index}
                                                                                hover
                                                                                sx={{
                                                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                                                    bgcolor: index % 2 === 0 ? '#fcfdfc' : 'white',
                                                                                    '&:hover': { bgcolor: '#f4faf5' },
                                                                                    transition: 'background 0.2s'
                                                                                }}
                                                                            >
                                                                                <TableCell padding="checkbox" sx={{ borderBottom: 'none', py: 2 }}><Checkbox size="small" sx={{ color: '#ddd' }} /></TableCell>
                                                                                <TableCell sx={{ fontWeight: 700, color: '#333', fontSize: '13.5px', borderBottom: 'none' }}>{order._id ? `#${order._id.slice(-8).toUpperCase()}` : orderNum}</TableCell>
                                                                                <TableCell sx={{ color: '#111', fontWeight: 600, fontSize: '13.5px', borderBottom: 'none' }}>{productName}</TableCell>
                                                                                <TableCell sx={{ borderBottom: 'none' }}>
                                                                                    <Box sx={{
                                                                                        display: 'inline-block', px: 1.5, py: 0.5, borderRadius: '6px',
                                                                                        bgcolor: statusColor, color: statusTextCode,
                                                                                        fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px'
                                                                                    }}>
                                                                                        {statusLabel}
                                                                                    </Box>
                                                                                </TableCell>
                                                                                <TableCell sx={{ fontWeight: 800, color: '#0A7A2F', fontSize: '14px', borderBottom: 'none' }}>₹{parseFloat(total).toFixed(2)}</TableCell>
                                                                                <TableCell sx={{ color: '#666', fontSize: '13px', borderBottom: 'none' }}>{date}</TableCell>
                                                                                <TableCell align="center" sx={{ borderBottom: 'none' }}>
                                                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                                                        <Button
                                                                                            size="small"
                                                                                            variant="outlined"
                                                                                            sx={{
                                                                                                textTransform: 'none',
                                                                                                borderRadius: '6px',
                                                                                                borderColor: '#0A7A2F',
                                                                                                color: '#0A7A2F',
                                                                                                fontWeight: 600,
                                                                                                '&:hover': { bgcolor: '#f4faf5', borderColor: '#086325' }
                                                                                            }}
                                                                                            onClick={() => navigate(`/order-details/${order._id}`)}
                                                                                        >
                                                                                            Details
                                                                                        </Button>
                                                                                        {(statusMatch === 'shipped' || statusMatch === 'delivered') && (
                                                                                            <Button
                                                                                                size="small"
                                                                                                variant="contained"
                                                                                                sx={{
                                                                                                    textTransform: 'none',
                                                                                                    borderRadius: '6px',
                                                                                                    bgcolor: '#f3791e',
                                                                                                    color: 'white',
                                                                                                    fontWeight: 600,
                                                                                                    boxShadow: 'none',
                                                                                                    '&:hover': { bgcolor: '#e0681a', boxShadow: 'none' }
                                                                                                }}
                                                                                                onClick={() => window.open(`/api/orders/${order._id}/invoice`, '_blank')}
                                                                                            >
                                                                                                Invoice
                                                                                            </Button>
                                                                                        )}
                                                                                    </Box>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Box>
                                            )}

                                            {/* Data Cards - Mobile */}
                                            {userOrders.length > 0 && (
                                                <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
                                                    {userOrders
                                                        .filter(order => {
                                                            const q = orderSearchQuery.toLowerCase();
                                                            const orderId = order._id?.slice(-8) || '';
                                                            const prodName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || '';
                                                            const matchesSearch = orderId.toLowerCase().includes(q) || prodName.toLowerCase().includes(q);

                                                            let matchesTab = true;
                                                            const status = (order.status || 'pending').toLowerCase();
                                                            if (orderTab === 'Active') matchesTab = ['pending', 'processing'].includes(status);
                                                            if (orderTab === 'To Invoice') matchesTab = ['processing', 'shipped'].includes(status);
                                                            if (orderTab === 'To Ship') matchesTab = ['processing'].includes(status);
                                                            if (orderTab === 'To Backorder') matchesTab = status === 'backorder';
                                                            if (orderTab === 'All Orders') matchesTab = true;

                                                            return matchesSearch && matchesTab;
                                                        })
                                                        .map((order, index) => {
                                                            const productName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || 'Item';
                                                            const statusMatch = order.status?.toLowerCase() || 'pending';
                                                            let statusColor = '#fff3e0';
                                                            let statusTextCode = '#e65100';
                                                            let statusLabel = 'Pending';
                                                            if (statusMatch === 'processing') { statusColor = '#e3f2fd'; statusTextCode = '#1565c0'; statusLabel = 'Processing'; }
                                                            else if (statusMatch === 'shipped') { statusColor = '#f3e5f5'; statusTextCode = '#7b1fa2'; statusLabel = 'Shipped'; }
                                                            else if (statusMatch === 'delivered') { statusColor = '#e8f5e9'; statusTextCode = '#2e7d32'; statusLabel = 'Delivered'; }
                                                            else if (statusMatch === 'cancelled') { statusColor = '#ffebee'; statusTextCode = '#c62828'; statusLabel = 'Cancelled'; }
                                                            const total = order.totalAmount || order.total || '0';
                                                            const date = new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

                                                            return (
                                                                <Paper key={order._id || index} variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: 'white' }}>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                                        <Box>
                                                                            <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#111' }}>
                                                                                #{order._id?.slice(-8).toUpperCase() || index + 1}
                                                                            </Typography>
                                                                            <Typography sx={{ fontSize: '12px', color: '#666' }}>{date}</Typography>
                                                                        </Box>
                                                                        <Box sx={{
                                                                            px: 1, py: 0.25, borderRadius: '4px', bgcolor: statusColor, color: statusTextCode,
                                                                            fontWeight: 800, fontSize: '10px', textTransform: 'uppercase'
                                                                        }}>
                                                                            {statusLabel}
                                                                        </Box>
                                                                    </Box>
                                                                    <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1, color: '#333' }}>{productName}</Typography>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Typography sx={{ fontWeight: 800, color: '#0A7A2F', fontSize: '15px' }}>₹{parseFloat(total).toFixed(2)}</Typography>
                                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                                            <Button size="small" variant="text" sx={{ color: '#0A7A2F', fontWeight: 700, minWidth: 'auto', p: 0.5 }} onClick={() => navigate(`/order-details/${order._id}`)}>Details</Button>
                                                                            {(statusMatch === 'shipped' || statusMatch === 'delivered') && (
                                                                                <Button size="small" variant="text" sx={{ color: '#f3791e', fontWeight: 700, minWidth: 'auto', p: 0.5 }} onClick={() => window.open(`/api/orders/${order._id}/invoice`, '_blank')}>Invoice</Button>
                                                                            )}
                                                                        </Box>
                                                                    </Box>
                                                                </Paper>
                                                            );
                                                        })}
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Transactions Tab */}
                            {tabValue === 3 && (
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#0A7A2F', mb: 3, fontWeight: 700, borderBottom: '3px solid #0A7A2F', pb: 1, display: 'inline-block' }}>
                                        Transaction History
                                    </Typography>

                                    {/* Dashboard Overview / Stats */}
                                    <Grid container spacing={2} sx={{ mb: 4 }}>
                                        <Grid item xs={12} sm={4}>
                                            <Paper sx={{ p: 2.5, borderRadius: '12px', borderLeft: '4px solid #0A7A2F', bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                <Typography variant="caption" sx={{ color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>Total Orders</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: '#111' }}>{userOrders.length}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Paper sx={{ p: 2.5, borderRadius: '12px', borderLeft: '4px solid #F7931E', bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                <Typography variant="caption" sx={{ color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>Recharges</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: '#111' }}>{userTransactions.length}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Paper sx={{ p: 2.5, borderRadius: '12px', borderLeft: '4px solid #2196f3', bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                <Typography variant="caption" sx={{ color: '#999', fontWeight: 600, textTransform: 'uppercase' }}>Support Tickets</Typography>
                                                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: '#111' }}>{userGrievances.length}</Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>


                                    {/* ── ORDER HISTORY SECTION ── */}
                                    <Typography variant="h6" sx={{ color: '#0A7A2F', mb: 2, fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        🛒 Order History
                                    </Typography>

                                    {ordersLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={36} sx={{ color: '#0A7A2F' }} /></Box>
                                    ) : userOrders.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'white', borderRadius: '12px', border: '1px solid #eee', mb: 4 }}>
                                            <ShoppingBagIcon sx={{ fontSize: 60, color: '#eee', mb: 1 }} />
                                            <Typography sx={{ color: '#999', fontWeight: 600 }}>No Orders Yet</Typography>
                                            <Typography variant="body2" sx={{ color: '#ccc', mt: 0.5 }}>Your product orders will appear here.</Typography>
                                        </Box>
                                    ) : (
                                        <Box sx={{ mb: 4 }}>
                                            {userOrders.map((order, index) => (
                                                <Paper
                                                    key={order._id || index}
                                                    variant="outlined"
                                                    sx={{
                                                        p: 0,
                                                        borderRadius: '14px',
                                                        mb: 2,
                                                        cursor: 'pointer',
                                                        overflow: 'hidden',
                                                        '&:hover': { boxShadow: '0 6px 18px rgba(10,122,47,0.08)', borderColor: '#0A7A2F' },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onClick={() => setTabValue(2)}
                                                >
                                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}>
                                                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: '#f4faf5', borderRight: { xs: 'none', sm: '1px solid #f0f0f0' }, borderBottom: { xs: '1px solid #f0f0f0', sm: 'none' }, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                                            <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                                                                <ShoppingBagIcon sx={{ color: '#0A7A2F', fontSize: 24 }} />
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ p: 2, flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Box>
                                                                <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#111', mb: 0.25 }}>
                                                                    Order #{order._id?.slice(-8).toUpperCase() || index + 1}
                                                                </Typography>
                                                                <Typography sx={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <EventIcon sx={{ fontSize: 12 }} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.75, flexWrap: 'wrap' }}>
                                                                    {order.items?.slice(0, 2).map((item, i) => (
                                                                        <Chip
                                                                            key={i}
                                                                            label={`${item.name || item.productId?.name || 'Product'} × ${item.quantity}`}
                                                                            size="small"
                                                                            sx={{ height: 18, fontSize: '10px', fontWeight: 500, bgcolor: '#f5f5f5' }}
                                                                        />
                                                                    ))}
                                                                    {(order.items?.length > 2) && (
                                                                        <Typography sx={{ fontSize: '10px', color: '#999', alignSelf: 'center', ml: 0.5 }}>+{order.items.length - 2} more</Typography>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ textAlign: 'right' }}>
                                                                <Typography sx={{ fontWeight: 800, color: '#0A7A2F', fontSize: '16px' }}>
                                                                    ₹{order.totalAmount || order.total || '0'}
                                                                </Typography>
                                                                <Chip
                                                                    label={(order.status || 'Placed').toUpperCase()}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 20, fontSize: '10px', fontWeight: 800, mt: 0.75, px: 0.5,
                                                                        bgcolor: order.status === 'delivered' ? '#0A7A2F' : order.status === 'cancelled' ? '#d32f2f' : '#F7931E',
                                                                        color: 'white',
                                                                        borderRadius: '4px'
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Paper>
                                            ))}
                                        </Box>
                                    )}

                                    {/* ── RECHARGE HISTORY SECTION ── */}
                                    <Typography variant="h6" sx={{ color: '#0A7A2F', mb: 2, fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        ⚡ Recharge History
                                    </Typography>

                                    {transactionsLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={36} sx={{ color: '#0A7A2F' }} /></Box>
                                    ) : userTransactions.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                                            <ReceiptIcon sx={{ fontSize: 60, color: '#eee', mb: 1 }} />
                                            <Typography sx={{ color: '#999', fontWeight: 600 }}>No Recharges Yet</Typography>
                                            <Typography variant="body2" sx={{ color: '#ccc', mt: 0.5 }}>Your Mobile / DTH / Data recharges will appear here.</Typography>
                                            <Button variant="outlined" size="small" sx={{ mt: 2, borderColor: '#0A7A2F', color: '#0A7A2F', borderRadius: '8px' }} onClick={() => navigate('/recharge')}>
                                                Do a Recharge
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box>
                                            {userTransactions.map((txn, index) => (
                                                <Paper
                                                    key={txn._id || index}
                                                    variant="outlined"
                                                    sx={{
                                                        p: 0,
                                                        borderRadius: '14px',
                                                        mb: 2,
                                                        overflow: 'hidden',
                                                        '&:hover': { boxShadow: '0 6px 18px rgba(0,0,0,0.06)' },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}>
                                                        <Box sx={{
                                                            p: 2,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            bgcolor: txn.status === 'success' ? '#f4faf5' : txn.status === 'failed' ? '#fff9f9' : '#fffdf4',
                                                            borderRight: { xs: 'none', sm: '1px solid #f0f0f0' },
                                                            borderBottom: { xs: '1px solid #f0f0f0', sm: 'none' },
                                                            justifyContent: { xs: 'center', sm: 'flex-start' }
                                                        }}>
                                                            <Box sx={{
                                                                width: 44, height: 44, borderRadius: '10px', bgcolor: 'white',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                                                            }}>
                                                                <ReceiptIcon sx={{
                                                                    fontSize: 24,
                                                                    color: txn.status === 'success' ? '#0A7A2F' : txn.status === 'failed' ? '#d32f2f' : '#fbc02d'
                                                                }} />
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ p: 2, flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Box>
                                                                <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#111', mb: 0.25 }}>
                                                                    {txn.operator} {txn.type?.toUpperCase()}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                    <Typography sx={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                        <PhoneIcon sx={{ fontSize: 12 }} /> {txn.rechargeNumber}
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                        <EventIcon sx={{ fontSize: 12 }} /> {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ textAlign: 'right' }}>
                                                                <Typography sx={{ fontWeight: 800, color: '#111', fontSize: '16px' }}>₹{txn.amount}</Typography>
                                                                <Chip
                                                                    label={txn.status?.toUpperCase()}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 20, fontSize: '10px', fontWeight: 800, mt: 0.75, px: 0.5,
                                                                        bgcolor: txn.status === 'success' ? '#0A7A2F' : txn.status === 'failed' ? '#d32f2f' : '#fbc02d',
                                                                        color: 'white',
                                                                        borderRadius: '4px'
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Paper>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Grievances Tab */}
                            {tabValue === 4 && (
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#0A7A2F', mb: 3, fontWeight: 700, borderBottom: '3px solid #0A7A2F', pb: 1, display: 'inline-block' }}>
                                        My Grievances / Tickets
                                    </Typography>
                                    {grievancesLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={40} sx={{ color: '#0A7A2F' }} /></Box>
                                    ) : userGrievances.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4 }}>
                                            <SupportAgentIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                                            <Typography variant="h6" color="textSecondary" gutterBottom>No Grievances Found</Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>You haven't submitted any grievances yet</Typography>
                                            <Button variant="contained" startIcon={<AssignmentIcon />} sx={{ bgcolor: '#F7931E', '&:hover': { bgcolor: '#e67e22' } }} onClick={() => navigate('/grievance')}>Submit a Grievance</Button>
                                        </Box>
                                    ) : (
                                        <Grid container spacing={2}>
                                            {userGrievances.map((grievance, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <Zoom in={showContent} timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
                                                        <Card variant="outlined" sx={{ '&:hover': { boxShadow: '0 8px 24px rgba(10,122,47,0.12)', borderColor: '#0A7A2F' }, transition: 'all 0.3s ease', borderRadius: '14px', overflow: 'hidden' }}>
                                                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 0 }}>
                                                                {/* Left Section: Ticket Info */}
                                                                <Box sx={{ p: 3, flex: 1.5 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                                        <Typography variant="caption" sx={{ color: '#0A7A2F', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#e8f5e9', px: 1.5, py: 0.5, borderRadius: '6px', letterSpacing: '0.5px' }}>
                                                                            <SupportAgentIcon sx={{ fontSize: 16 }} /> {grievance.ticket}
                                                                        </Typography>
                                                                        {grievance.category && (
                                                                            <Chip label={grievance.category} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, color: '#666', bgcolor: '#f0f0f0' }} />
                                                                        )}
                                                                        <Chip
                                                                            label={['Technical', 'Payment', 'Order'].includes(grievance.category) ? 'High Priority' : 'Normal Priority'}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{ height: 24, fontSize: '0.7rem', fontWeight: 700, borderColor: ['Technical', 'Payment', 'Order'].includes(grievance.category) ? '#d32f2f' : '#ccc', color: ['Technical', 'Payment', 'Order'].includes(grievance.category) ? '#d32f2f' : '#888' }}
                                                                        />
                                                                    </Box>

                                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111', mb: 1.5, fontSize: '1.15rem' }}>
                                                                        {grievance.subject || 'No Subject Provided'}
                                                                    </Typography>

                                                                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                        {grievance.message || '—'}
                                                                    </Typography>

                                                                    <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                                                        <Box>
                                                                            <Typography variant="caption" sx={{ color: '#999', textTransform: 'uppercase', fontWeight: 700, fontSize: '10px' }}>Contact Mobile</Typography>
                                                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>{grievance.mobile || '—'}</Typography>
                                                                        </Box>
                                                                        <Box>
                                                                            <Typography variant="caption" sx={{ color: '#999', textTransform: 'uppercase', fontWeight: 700, fontSize: '10px' }}>Submitted On</Typography>
                                                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>{new Date(grievance.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
                                                                        </Box>
                                                                        <Box>
                                                                            <Typography variant="caption" sx={{ color: '#999', textTransform: 'uppercase', fontWeight: 700, fontSize: '10px' }}>Last Activity</Typography>
                                                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>
                                                                                {grievance.updatedAt ? new Date(grievance.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>

                                                                {/* Middle Section: Progress/Info */}
                                                                <Box sx={{ flex: 1, p: 3, display: { xs: 'none', lg: 'flex' }, flexDirection: 'column', justifyContent: 'center', bgcolor: '#fbfbfb', borderLeft: '1px solid #f0f0f0' }}>
                                                                    <Typography variant="caption" sx={{ color: '#999', fontWeight: 700, mb: 2, textTransform: 'uppercase' }}>Resolution Progress</Typography>
                                                                    <Box sx={{ position: 'relative', width: '100%', mb: 1 }}>
                                                                        <Box sx={{ height: 4, bgcolor: '#eee', borderRadius: 2 }} />
                                                                        <Box sx={{
                                                                            height: 4,
                                                                            bgcolor: grievance.status === 'Resolved' ? '#0A7A2F' : grievance.status === 'Processing' ? '#F7931E' : '#999',
                                                                            borderRadius: 2,
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            width: grievance.status === 'Resolved' ? '100%' : grievance.status === 'Processing' ? '60%' : '15%'
                                                                        }} />
                                                                    </Box>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <Typography sx={{ fontSize: '10px', color: '#0A7A2F', fontWeight: 700 }}>Open</Typography>
                                                                        <Typography sx={{ fontSize: '10px', color: grievance.status !== 'Pending' ? '#F7931E' : '#999', fontWeight: 700 }}>Processing</Typography>
                                                                        <Typography sx={{ fontSize: '10px', color: grievance.status === 'Resolved' ? '#0A7A2F' : '#999', fontWeight: 700 }}>Resolved</Typography>
                                                                    </Box>

                                                                    <Box sx={{ mt: 3, p: 1.5, bgcolor: 'white', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                                                                        <Typography variant="caption" sx={{ color: '#777', fontStyle: 'italic', fontSize: '11px' }}>
                                                                            {grievance.status === 'Resolved' ? "This ticket has been marked as resolved by our support team." : "Our team is currently reviewing your grievance."}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>

                                                                {/* Right Section: Status & Actions */}
                                                                <Box sx={{
                                                                    width: { xs: '100%', md: '240px' },
                                                                    bgcolor: '#fafafa',
                                                                    borderLeft: { xs: 'none', md: '1px solid #eaeaea' },
                                                                    borderTop: { xs: '1px solid #eaeaea', md: 'none' },
                                                                    p: { xs: 2.5, sm: 3 },
                                                                    display: 'flex',
                                                                    flexDirection: { xs: 'row', md: 'column' },
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    gap: 2
                                                                }}>
                                                                    <StatusChip size="medium" icon={getStatusIcon(grievance.status)} label={grievance.status} status={grievance.status} sx={{ width: '100%', py: 2.2, borderRadius: '8px', flex: { xs: 1, md: 'none' } }} />

                                                                    <Button
                                                                        fullWidth
                                                                        variant="contained"
                                                                        startIcon={<HistoryIcon />}
                                                                        sx={{ bgcolor: '#0A7A2F', color: 'white', '&:hover': { bgcolor: '#086325', boxShadow: '0 4px 12px rgba(10,122,47,0.3)' }, textTransform: 'none', borderRadius: '8px', py: 1.2, fontWeight: 700, boxShadow: 'none', flex: { xs: 1, md: 'none' } }}
                                                                        onClick={() => navigate(`/grievance?ticket=${grievance.ticket}`)}
                                                                    >
                                                                        Track Status
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        </Card>
                                                    </Zoom>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </Box>
                            )}

                            {/* KYC Verification Tab */}
                            {tabValue === 5 && (
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#0A7A2F', mb: 3, fontWeight: 700, borderBottom: '3px solid #0A7A2F', pb: 1, display: 'inline-block' }}>
                                        KYC Verification
                                    </Typography>

                                    <Paper variant="outlined" sx={{ borderRadius: '14px', p: 2.5, mb: 4, bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#333' }}>Verification Status</Typography>
                                            <Typography variant="body2" color="textSecondary">Your KYC application status</Typography>
                                        </Box>
                                        <StatusChip
                                            label={userData.kycStatus || 'Pending'}
                                            status={userData.kycStatus || 'Pending'}
                                            sx={{
                                                px: 2, py: 2.5, fontSize: '0.9rem', borderRadius: '8px',
                                                ...(userData.kycStatus === 'Verified' && { bgcolor: '#0A7A2F', color: 'white' }),
                                                ...(userData.kycStatus === 'Rejected' && { bgcolor: '#d32f2f', color: 'white' }),
                                                ...(userData.kycStatus === 'Submitted' && { bgcolor: '#F7931E', color: 'white' }),
                                                ...(userData.kycStatus === 'Pending' && { bgcolor: '#757575', color: 'white' }),
                                                ...(userData.kycStatus === undefined && { bgcolor: '#757575', color: 'white' })
                                            }}
                                        />
                                    </Paper>

                                    {userData.kycMessage && userData.kycStatus === 'Rejected' && (
                                        <Alert severity="error" sx={{ mb: 4, borderRadius: '10px' }}>
                                            <strong>Rejection Reason:</strong> {userData.kycMessage}
                                        </Alert>
                                    )}

                                    {/* Identity Details */}
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#111' }}>Identity Details</Typography>
                                    <Paper variant="outlined" sx={{ borderRadius: '12px', p: 3, mb: 4 }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <TextField fullWidth label="Aadhar Number" value={kycData.aadharNumber} onChange={(e) => setKycData({ ...kycData, aadharNumber: e.target.value })} disabled={kycReadOnly} />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField fullWidth label="PAN Number" value={kycData.panNumber} onChange={(e) => setKycData({ ...kycData, panNumber: e.target.value.toUpperCase() })} disabled={kycReadOnly} />
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                    {/* Bank Information */}
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: '#111' }}>Bank Information</Typography>
                                    <Paper variant="outlined" sx={{ borderRadius: '12px', p: 3, mb: 4 }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={4}>
                                                <TextField fullWidth label="Account Number" value={kycData.bankDetails.accountNumber} onChange={(e) => setKycData({ ...kycData, bankDetails: { ...kycData.bankDetails, accountNumber: e.target.value } })} disabled={kycReadOnly} />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <TextField fullWidth label="IFSC Code" value={kycData.bankDetails.ifscCode} onChange={(e) => setKycData({ ...kycData, bankDetails: { ...kycData.bankDetails, ifscCode: e.target.value.toUpperCase() } })} disabled={kycReadOnly} />
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <TextField fullWidth label="Bank Name" value={kycData.bankDetails.bankName} onChange={(e) => setKycData({ ...kycData, bankDetails: { ...kycData.bankDetails, bankName: e.target.value } })} disabled={kycReadOnly} />
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                    {/* Documents */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111' }}>Document Proofs</Typography>
                                        <Chip label="JPG, PNG" size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 600, bgcolor: '#e8f5e9', color: '#0A7A2F' }} />
                                    </Box>
                                    <Paper variant="outlined" sx={{ borderRadius: '12px', p: 3, mb: 4 }}>
                                        <Grid container spacing={3}>
                                            {['aadharFront', 'aadharBack', 'panCard', 'passbook'].map((docType) => (
                                                <Grid item xs={12} sm={6} md={3} key={docType}>
                                                    <Box sx={{ border: '2px dashed #e0e0e0', borderRadius: '12px', p: 2, textAlign: 'center', position: 'relative', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: kycData.kycDocuments[docType] ? '#fff' : '#fafafa', transition: 'all 0.2s', '&:hover': { borderColor: '#0A7A2F', bgcolor: '#f4fbf5' } }}>
                                                        {kycData.kycDocuments[docType] ? (
                                                            <>
                                                                <img src={kycData.kycDocuments[docType]} alt={docType} style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                                                                {!kycReadOnly && (
                                                                    <IconButton size="small" sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { bgcolor: '#ffebee' } }} onClick={() => setKycData({ ...kycData, kycDocuments: { ...kycData.kycDocuments, [docType]: '' } })}>
                                                                        <CancelIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                                                                    </IconButton>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CameraAltIcon sx={{ color: '#bdbdbd', fontSize: 36, mb: 1.5 }} />
                                                                <Typography variant="body2" sx={{ color: '#555', fontWeight: 500, mb: 1.5 }}>
                                                                    {docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                                </Typography>
                                                                {!kycReadOnly && (
                                                                    <Button component="label" size="small" variant="outlined" sx={{ textTransform: 'none', borderRadius: '6px', px: 2, color: '#0A7A2F', borderColor: '#0A7A2F', '&:hover': { bgcolor: '#e8f5e9', borderColor: '#0A7A2F' } }}>
                                                                        Upload
                                                                        <input type="file" hidden accept="image/*" onChange={(e) => handleKycImageUpload(e, docType)} />
                                                                    </Button>
                                                                )}
                                                            </>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Paper>

                                    {!kycReadOnly && (
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                size="large"
                                                onClick={handleKycSubmit}
                                                disabled={kycSubmitting}
                                                startIcon={kycSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                                                sx={{ bgcolor: '#0A7A2F', '&:hover': { bgcolor: '#085c22' }, py: 1.5, px: 4, borderRadius: '8px', fontSize: '15px', fontWeight: 600, boxShadow: '0 4px 14px rgba(10,122,47,0.2)' }}
                                            >
                                                {kycSubmitting ? 'Submitting...' : 'Submit KYC Details'}
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </AnimatedPaper>
                </Fade >

                {/* Snackbar */}
                < Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    TransitionComponent={Slide}
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
                            bgcolor: '#f7931e',
                            color: 'white',
                            '& .MuiAlert-icon': { color: 'white' }
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar >
            </Container >
        </FullPageContainer >
    );
};

export default MyAccount;