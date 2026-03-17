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
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShieldIcon from '@mui/icons-material/Shield';

// ─── Styled Components ───────────────────────────────────────────────────────

const AnimatedCard = styled(Card)(() => ({
    transition: 'all 0.3s ease-in-out',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 20px rgba(10, 122, 47, 0.15)',
    },
}));

const AnimatedPaper = styled(Paper)(() => ({
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

const FullPageContainer = styled(Box)(({ theme }) => ({
    height: 'calc(100vh - 60px)',
    width: '100%',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: theme.spacing(1),
    [theme.breakpoints.up('sm')]: { padding: theme.spacing(2) },
    [theme.breakpoints.up('md')]: { height: 'calc(100vh - 80px)', padding: theme.spacing(3) },
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
    ...(status === 'Pending' && { backgroundColor: 'rgba(247, 147, 30, 0.15)', color: '#F7931E', border: '1px solid rgba(247, 147, 30, 0.3)' }),
    ...(status === 'In Progress' && { backgroundColor: 'rgba(10, 122, 47, 0.15)', color: '#0A7A2F', border: '1px solid rgba(10, 122, 47, 0.3)' }),
    ...(status === 'Resolved' && { backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', border: '1px solid rgba(76, 175, 80, 0.3)' }),
}));

// ─── Main Component ───────────────────────────────────────────────────────────

const MyAccount = ({ defaultTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const pathToTab = {
        '/my-account': 0, '/my-account/profile': 0, '/my-account/address': 1,
        '/my-account/orders': 2, '/my-account/transactions': 3,
        '/my-account/grievances': 4, '/my-account/kyc': 5, '/my-account/cart': -1,
    };
    const tabValue = defaultTab !== undefined ? defaultTab : (pathToTab[location.pathname] ?? 0);
    const setTabValue = (index) => {
        const tabPaths = ['/my-account/profile', '/my-account/address', '/my-account/orders', '/my-account/transactions', '/my-account/grievances', '/my-account/kyc'];
        navigate(tabPaths[index] || '/my-account/profile');
    };

    // ── Core State ──
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [userGrievances, setUserGrievances] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [userTransactions, setUserTransactions] = useState([]);
    const [grievancesLoading, setGrievancesLoading] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [showContent, setShowContent] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuOpen = Boolean(menuAnchorEl);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    // ── Wallet Transaction State ──
    const [allWalletTransactions, setAllWalletTransactions] = useState([]);
    const [walletTxLoading, setWalletTxLoading] = useState(false);
    const [walletTxError, setWalletTxError] = useState(null);
    const [walletTxSearch, setWalletTxSearch] = useState('');
    const [walletTxFilter, setWalletTxFilter] = useState('All');

    // ── KYC State ──
    const [kycData, setKycData] = useState({
        aadharNumber: '',
        panNumber: '',
        bankDetails: { accountNumber: '', ifscCode: '', bankName: '', upiId: '' },
        kycDocuments: { aadharFront: '', aadharBack: '', panCard: '', passbook: '' }
    });
    const [kycSubmitting, setKycSubmitting] = useState(false);
    const kycReadOnly = userData?.kycStatus === 'Submitted' || userData?.kycStatus === 'Verified';

    // ── Orders UI ──
    const [orderSearchQuery, setOrderSearchQuery] = useState('');
    const [orderTab, setOrderTab] = useState('All Orders');

    // ─── Handlers ──────────────────────────────────────────────────────────────

    const handleEditStart = () => {
        setEditData({ userName: userData.userName || '', fatherName: userData.fatherName || '', mobile: userData.mobile || '', gender: userData.gender || '' });
        setEditMode(true);
    };
    const handleEditCancel = () => { setEditMode(false); setEditData({}); };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const payload = { ...editData };
            if (profileImage) payload.profileImage = profileImage;
            const res = await api.put('/profile', payload);
            const updatedUser = res.data.user;
            setUserData(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('storage'));
            setEditMode(false);
            setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update profile', severity: 'error' });
        } finally { setSaving(false); }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);
    };

    const handleKycImageUpload = (e, docType) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setKycData(prev => ({ ...prev, kycDocuments: { ...prev.kycDocuments, [docType]: reader.result } }));
        reader.readAsDataURL(file);
    };

    const handleKycSubmit = async () => {
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
        } finally { setKycSubmitting(false); }
    };

    // ─── Fetch Functions ────────────────────────────────────────────────────────

    const fetchUserOrders = async () => {
        setOrdersLoading(true);
        try { const res = await api.get('/orders/myorders'); setUserOrders(res.data || []); }
        catch (e) { console.error("Error fetching orders:", e); }
        finally { setOrdersLoading(false); }
    };

    const fetchUserGrievances = async (email) => {
        if (!email) return;
        setGrievancesLoading(true);
        try {
            const res = await api.get(`/grievance/user/${email}`);
            if (res.data.success) setUserGrievances(res.data.grievances || []);
        } catch (e) {
            console.error("Error fetching grievances:", e);
            setSnackbar({ open: true, message: 'Error fetching your grievances', severity: 'error' });
        } finally { setGrievancesLoading(false); }
    };

    const fetchUserTransactions = async () => {
        setWalletTxLoading(true);
        try { const res = await api.get('/recharge/my-transactions'); setUserTransactions(res.data || []); }
        catch (e) { console.error("Error fetching transactions:", e); }
        finally { setWalletTxLoading(false); }
    };

    // ── Wallet Transactions API (NEW) ──
    const fetchAllWalletTransactions = async () => {
        setWalletTxLoading(true);
        setWalletTxError(null);
        try {
            const res = await api.get('/wallet/all-transactions');
            if (res.data.success) setAllWalletTransactions(res.data.transactions || []);
        } catch (e) {
            console.error("Error fetching wallet transactions:", e);
            setWalletTxError('Wallet transactions load nahi ho sake.');
        } finally { setWalletTxLoading(false); }
    };

    // ─── useEffect ──────────────────────────────────────────────────────────────

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (!token || !user) { navigate('/login'); return; }
        try {
            const parsedUser = JSON.parse(user);
            setUserData(parsedUser);
            if (parsedUser.profileImage) setProfileImage(parsedUser.profileImage);
            setKycData({
                aadharNumber: parsedUser.aadharNumber || '',
                panNumber: parsedUser.panNumber || '',
                bankDetails: parsedUser.bankDetails || { accountNumber: '', ifscCode: '', bankName: '', upiId: '' },
                kycDocuments: parsedUser.kycDocuments || { aadharFront: '', aadharBack: '', panCard: '', passbook: '' }
            });
            fetchUserGrievances(parsedUser.email);
            fetchUserOrders();
            fetchUserTransactions();
            fetchAllWalletTransactions(); // ← Wallet API call
            setTimeout(() => setShowContent(true), 300);
        } catch (e) { console.error('Error parsing user:', e); localStorage.clear(); navigate('/login'); }
        finally { setLoading(false); }
    }, []);

    // ─── Helpers ────────────────────────────────────────────────────────────────

    const handleLogout = () => {
        localStorage.removeItem('token'); localStorage.removeItem('user');
        setSnackbar({ open: true, message: 'Logged out successfully!', severity: 'success' });
        setTimeout(() => navigate('/login'), 1500);
    };

    const getDisplayName = () => {
        if (!userData) return 'User';
        return userData.userName || userData.name || userData.email?.split('@')[0] || 'User';
    };

    const formatValue = (v) => (v === undefined || v === null || v === '') ? 'Not provided' : v;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <PendingIcon />;
            case 'In Progress': return <HistoryIcon />;
            case 'Resolved': return <CheckCircleIcon />;
            default: return <AssignmentIcon />;
        }
    };

    // ── Filtered wallet transactions ──
    const filteredWalletTx = allWalletTransactions.filter(txn => {
        const matchesFilter = walletTxFilter === 'All' || txn.txType === walletTxFilter.toLowerCase();
        const q = walletTxSearch.toLowerCase();
        const matchesSearch = !q || txn.type?.toLowerCase().includes(q) || txn.source?.toLowerCase().includes(q) || txn.details?.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
    });

    // ─── KYC Form ───────────────────────────────────────────────────────────────

    const renderKycForm = () => (
        <Box>
            <Paper variant="outlined" sx={{ borderRadius: '14px', p: 2.5, mb: 4, bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#333' }}>Verification Status</Typography>
                    <Typography variant="body2" color="textSecondary">Your KYC application status</Typography>
                </Box>
                <StatusChip label={userData.kycStatus || 'Pending'} status={userData.kycStatus || 'Pending'}
                    sx={{ px: 2, py: 2.5, fontSize: '0.9rem', borderRadius: '8px', ...(userData.kycStatus === 'Verified' && { bgcolor: '#0A7A2F', color: 'white' }), ...(userData.kycStatus === 'Rejected' && { bgcolor: '#d32f2f', color: 'white' }), ...(userData.kycStatus === 'Submitted' && { bgcolor: '#F7931E', color: 'white' }), ...(!userData.kycStatus && { bgcolor: '#757575', color: 'white' }) }} />
            </Paper>

            {userData.kycMessage && userData.kycStatus === 'Rejected' && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: '10px' }}>
                    <strong>Rejection Reason:</strong> {userData.kycMessage}
                </Alert>
            )}

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
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="UPI ID"
                            placeholder="e.g., username@upi"
                            value={kycData.bankDetails.upiId}
                            onChange={(e) => setKycData({ ...kycData, bankDetails: { ...kycData.bankDetails, upiId: e.target.value } })}
                            disabled={kycReadOnly}
                            helperText="This UPI ID will be used for your donation link."
                        />
                    </Grid>
                </Grid>
            </Paper>

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
                                            <IconButton size="small" sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white', border: '1px solid #eee', '&:hover': { bgcolor: '#ffebee' } }}
                                                onClick={() => setKycData({ ...kycData, kycDocuments: { ...kycData.kycDocuments, [docType]: '' } })}>
                                                <CancelIcon fontSize="small" sx={{ color: '#d32f2f' }} />
                                            </IconButton>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <CameraAltIcon sx={{ color: '#bdbdbd', fontSize: 36, mb: 1.5 }} />
                                        <Typography variant="body2" sx={{ color: '#555', fontWeight: 500, mb: 1.5 }}>
                                            {docType.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                                        </Typography>
                                        {!kycReadOnly && (
                                            <Button component="label" size="small" variant="outlined" sx={{ textTransform: 'none', borderRadius: '6px', px: 2, color: '#0A7A2F', borderColor: '#0A7A2F' }}>
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
                    <Button variant="contained" size="large" onClick={handleKycSubmit} disabled={kycSubmitting}
                        startIcon={kycSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                        sx={{ bgcolor: '#0A7A2F', '&:hover': { bgcolor: '#085c22' }, py: 1.5, px: 4, borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}>
                        {kycSubmitting ? 'Submitting...' : 'Submit KYC Details'}
                    </Button>
                </Box>
            )}
        </Box>
    );

    // ─── Loading / No User ──────────────────────────────────────────────────────

    if (loading) {
        return (
            <FullPageContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Zoom in={true} timeout={1000}>
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress size={isMobile ? 50 : 60} thickness={4} sx={{ color: '#0A7A2F' }} />
                        <Typography variant={isMobile ? "body1" : "h6"} sx={{ mt: 2, color: '#0A7A2F', fontWeight: 500 }}>Loading your profile...</Typography>
                    </Box>
                </Zoom>
            </FullPageContainer>
        );
    }

    if (!userData) {
        return (
            <FullPageContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Fade in={true} timeout={1000}>
                    <Paper sx={{ p: isMobile ? 3 : 4, textAlign: 'center', borderRadius: '16px', maxWidth: '500px', width: '100%', margin: '0 auto' }}>
                        <Typography variant={isMobile ? "body1" : "h6"} color="error" gutterBottom>No user data found. Please login again.</Typography>
                        <Button variant="contained" sx={{ mt: 2, bgcolor: '#0A7A2F' }} onClick={() => navigate('/login')}>Go to Login</Button>
                    </Paper>
                </Fade>
            </FullPageContainer>
        );
    }

    // ─── Sidebar nav items ──────────────────────────────────────────────────────
    const navItems = [
        { icon: <PersonIcon />, label: 'Profile', index: 0, path: '/my-account/profile' },
        { icon: <LocationOnIcon />, label: 'Address', index: 1, path: '/my-account/address' },
        { icon: <ShoppingCartIcon />, label: 'My Cart', index: -1, path: '/my-account/cart' },
        { icon: <ReceiptIcon />, label: 'Orders', index: 2, path: '/my-account/orders' },
        { icon: <AccountBalanceWalletIcon />, label: 'Transactions', index: 3, path: '/my-account/transactions' },
        { icon: <SupportAgentIcon />, label: 'Grievances', index: 4, path: '/my-account/grievances' },
        { icon: <FingerprintIcon />, label: 'KYC Verification', index: 5, path: '/my-account/kyc' },
    ];

    // ─── Main Render ────────────────────────────────────────────────────────────

    return (
        <FullPageContainer>
            <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1, sm: 2, md: 0 }, height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Welcome Header */}
                <Slide direction="down" in={showContent} timeout={800}>
                    <AnimatedPaper sx={{
                        p: { xs: 3, sm: 5 }, mb: 4,
                        background: 'linear-gradient(135deg, #0A7A2F 0%, #1a8c3a 50%, #065a22 100%)',
                        color: 'white', borderRadius: { xs: '0px', sm: '28px' },
                        position: 'relative', overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(10,122,47,0.25)',
                        display: defaultTab !== undefined ? 'none' : 'block',
                        '&::before': { content: '""', position: 'absolute', top: '-20%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(247,147,30,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', animation: 'pulse 8s infinite alternate' },
                        '@keyframes pulse': { '0%': { transform: 'scale(1) translate(0,0)' }, '100%': { transform: 'scale(1.2) translate(20px,20px)' } }
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={profileImage || undefined} sx={{ bgcolor: '#F7931E', width: { xs: 64, sm: 80 }, height: { xs: 64, sm: 80 }, fontSize: 28, fontWeight: 800, border: '4px solid rgba(255,255,255,0.4)', '&:hover': { transform: 'scale(1.1) rotate(5deg)' }, transition: 'transform 0.3s' }}>
                                    {!profileImage && (userData.userName || 'U')[0].toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 600 }}>Welcome, {getDisplayName()}!</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 3 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><EmailIcon fontSize="small" /><Typography variant="body2">{formatValue(userData.email)}</Typography></Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><PhoneIcon fontSize="small" /><Typography variant="body2">{formatValue(userData.mobile)}</Typography></Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}
                                sx={{ borderColor: 'white', color: 'white', width: { xs: '100%', sm: 'auto' }, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                                Logout
                            </Button>
                        </Box>
                    </AnimatedPaper>
                </Slide>

                {/* Mobile Menu Toggle */}
                {isMobile && defaultTab === undefined && (
                    <Box sx={{ display: 'flex', mb: 1, px: 1 }}>
                        <Button variant="contained" startIcon={<MenuIcon />} onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                            sx={{ bgcolor: '#0A7A2F', borderRadius: '12px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#1a8c3a' } }}>
                            Menu
                        </Button>
                    </Box>
                )}

                {/* Mobile Dropdown Menu */}
                <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={() => setMenuAnchorEl(null)}
                    PaperProps={{ sx: { width: 220, mt: 1.5, borderRadius: '18px', background: 'rgba(10, 122, 47, 0.9)', backdropFilter: 'blur(12px)', color: 'white', '& .MuiList-root': { p: 1.5 } } }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }} anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}>
                    {navItems.map((item) => (
                        <MenuItem key={item.index} onClick={() => { navigate(item.path); setMenuAnchorEl(null); }}
                            sx={{ borderRadius: '8px', py: 1, mb: 0.5, bgcolor: tabValue === item.index ? 'rgba(255,255,255,0.2)' : 'transparent', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
                                {React.cloneElement(item.icon, { sx: { fontSize: 18, color: tabValue === item.index ? '#F7931E' : 'rgba(255,255,255,0.8)' } })}
                            </ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ sx: { fontWeight: tabValue === item.index ? 700 : 500, fontSize: '13px' } }} />
                        </MenuItem>
                    ))}
                </Menu>

                {/* Sidebar + Content */}
                <Fade in={showContent} timeout={800}>
                    <AnimatedPaper sx={{ borderRadius: defaultTab !== undefined ? '0px' : '16px', overflow: 'hidden', display: 'flex', flex: 1, minHeight: 0, boxShadow: defaultTab !== undefined ? 'none' : undefined, border: defaultTab !== undefined ? 'none' : undefined, bgcolor: defaultTab !== undefined ? 'transparent' : undefined }}>
                        {/* Left Sidebar */}
                        <Box sx={{ width: { xs: 0, sm: '220px' }, display: defaultTab !== undefined ? 'none' : { xs: 'none', sm: 'flex' }, flexShrink: 0, background: 'linear-gradient(180deg, #0A7A2F 0%, #1a8c3a 60%, #0A7A2F 100%)', flexDirection: 'column', py: 3, overflowY: 'auto', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px' } }}>
                            {navItems.map((item) => (
                                <Box key={item.index} onClick={() => navigate(item.path)} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 1.5 }, justifyContent: { xs: 'center', sm: 'flex-start' }, px: { xs: 0, sm: 2.5 }, py: 1.75, mx: 1.5, mb: 0.5, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s ease', bgcolor: tabValue === item.index ? 'rgba(255,255,255,0.2)' : 'transparent', borderLeft: tabValue === item.index ? '3px solid #F7931E' : '3px solid transparent', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
                                    <Box sx={{ color: tabValue === item.index ? '#F7931E' : 'rgba(255,255,255,0.8)', display: 'flex' }}>
                                        {React.cloneElement(item.icon, { sx: { fontSize: 22 } })}
                                    </Box>
                                    <Typography sx={{ display: { xs: 'none', sm: 'block' }, color: tabValue === item.index ? 'white' : 'rgba(255,255,255,0.75)', fontWeight: tabValue === item.index ? 700 : 500, fontSize: '14px' }}>
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Right Content Panel */}
                        <Box sx={{ flex: 1, p: defaultTab !== undefined ? { xs: 0, sm: 1, md: 2 } : { xs: 1.5, sm: 2, md: 3 }, overflowY: 'auto', bgcolor: defaultTab !== undefined ? 'transparent' : '#fafafa', height: '100%', position: 'relative' }}>

                            {/* ── Cart ── */}
                            {tabValue === -1 && <Box><CartPage /></Box>}

                            {/* ── Profile ── */}
                            {tabValue === 0 && (
                                <Box>
                                    <Box sx={{ mb: 3, borderRadius: '18px', overflow: 'hidden', border: '1px solid #e8f5e9', boxShadow: '0 4px 20px rgba(10,122,47,0.1)' }}>
                                        <Box sx={{ height: '6px', background: 'linear-gradient(90deg, #0A7A2F, #F7931E, #0A7A2F)' }} />
                                        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, bgcolor: 'white', flexWrap: 'wrap' }}>
                                            <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2.5, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', sm: 'auto' } }}>
                                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                                    <Avatar src={profileImage || undefined} sx={{ width: 80, height: 80, bgcolor: '#0A7A2F', fontSize: 32, fontWeight: 700, border: '3px solid #e8f5e9' }}>
                                                        {!profileImage && (userData.userName || 'U')[0].toUpperCase()}
                                                    </Avatar>
                                                    {editMode && (
                                                        <Tooltip title="Upload photo">
                                                            <Box component="label" htmlFor="profile-image-upload" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#0A7A2F', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white', '&:hover': { bgcolor: '#085c22' } }}>
                                                                <CameraAltIcon sx={{ color: 'white', fontSize: 13 }} />
                                                            </Box>
                                                        </Tooltip>
                                                    )}
                                                    <input id="profile-image-upload" type="file" accept="image/*" hidden disabled={!editMode} onChange={handleImageUpload} />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontWeight: 800, fontSize: '20px', color: '#111', lineHeight: 1.2 }}>{formatValue(userData.userName)}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                                                        <Box sx={{ bgcolor: '#e8f5e9', color: '#0A7A2F', fontWeight: 600, fontSize: '11px', px: 1.5, py: 0.25, borderRadius: '20px' }}>ID: {formatValue(userData.memberId)}</Box>
                                                        <Box sx={{ bgcolor: '#fffbed', color: '#F7931E', fontWeight: 600, fontSize: '11px', px: 1.5, py: 0.25, borderRadius: '20px' }}>{formatValue(userData.position)}</Box>
                                                    </Box>
                                                    <Typography sx={{ color: '#666', fontSize: '13px', mt: 0.5 }}>{formatValue(userData.email)}</Typography>
                                                </Box>
                                            </Box>
                                            {!editMode ? (
                                                <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditStart} size="small" sx={{ borderColor: '#0A7A2F', color: '#0A7A2F', borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: '#e8f5e9' }, ml: { xs: 0, sm: 'auto' } }}>Edit Profile</Button>
                                            ) : (
                                                <Box sx={{ display: 'flex', gap: 1, ml: { xs: 0, sm: 'auto' } }}>
                                                    <Button variant="contained" startIcon={saving ? <CircularProgress size={14} sx={{ color: 'white' }} /> : <SaveIcon />} onClick={handleSaveProfile} disabled={saving} size="small" sx={{ bgcolor: '#0A7A2F', borderRadius: '8px', fontWeight: 600, '&:hover': { bgcolor: '#085c22' } }}>Save</Button>
                                                    <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleEditCancel} size="small" sx={{ borderColor: '#ddd', color: '#666', borderRadius: '8px', fontWeight: 600 }}>Cancel</Button>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Personal Info */}
                                    <Paper variant="outlined" sx={{ borderRadius: '18px', overflow: 'hidden', mb: 3 }}>
                                        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f0f0f0', bgcolor: '#fcfdfc' }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#111' }}>Personal Information</Typography>
                                        </Box>
                                        <Box sx={{ px: 3, py: 1.5 }}>
                                            {editMode ? (
                                                <Grid container spacing={1.5} sx={{ py: 1.5 }}>
                                                    {[{ label: 'User Name', key: 'userName' }, { label: "Father's Name", key: 'fatherName' }, { label: 'Phone', key: 'mobile' }, { label: 'Gender', key: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] }].map((field) => (
                                                        <Grid item xs={12} key={field.key}>
                                                            {field.type === 'select' ? (
                                                                <TextField select fullWidth size="small" label={field.label} value={editData[field.key] || ''} onChange={(e) => setEditData(p => ({ ...p, [field.key]: e.target.value }))} SelectProps={{ native: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
                                                                    <option value=""></option>
                                                                    {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                                                                </TextField>
                                                            ) : (
                                                                <TextField fullWidth size="small" label={field.label} value={editData[field.key] || ''} onChange={(e) => setEditData(p => ({ ...p, [field.key]: e.target.value }))} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                                            )}
                                                        </Grid>
                                                    ))}
                                                    <Grid item xs={12}><TextField fullWidth size="small" label="Email Address" value={formatValue(userData.email)} disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#f9f9f9' } }} /></Grid>
                                                    <Grid item xs={12}><TextField fullWidth size="small" label="Position" value={formatValue(userData.position)} disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#f9f9f9' } }} /></Grid>
                                                </Grid>
                                            ) : (
                                                <Grid container spacing={4} sx={{ py: 3, px: 1 }}>
                                                    {[
                                                        { label: 'Full User Name', value: formatValue(userData.userName), icon: <PersonIcon /> },
                                                        { label: "Father's Name", value: formatValue(userData.fatherName), icon: <GroupsIcon /> },
                                                        { label: 'Official Email Address', value: formatValue(userData.email), icon: <EmailIcon /> },
                                                        { label: 'Contact Phone Number', value: formatValue(userData.mobile), icon: <PhoneIcon /> },
                                                        { label: 'Gender', value: formatValue(userData.gender), icon: <WcIcon /> },
                                                        { label: 'Position / Designation', value: formatValue(userData.position), icon: <BadgeIcon /> },
                                                    ].map((field, fi) => (
                                                        <Grid item xs={12} sm={6} key={fi}>
                                                            <Box sx={{ mb: 1 }}>
                                                                <Typography sx={{ color: '#444', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', mb: 1.2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    {React.cloneElement(field.icon, { sx: { fontSize: 16, color: '#0A7A2F' } })} {field.label}
                                                                </Typography>
                                                                <Box sx={{
                                                                    px: 2.5,
                                                                    py: 1.8,
                                                                    bgcolor: '#f8f9f8',
                                                                    border: '1.5px solid #e0e6e1',
                                                                    borderRadius: '12px',
                                                                    transition: 'all 0.2s ease-in-out',
                                                                    '&:hover': {
                                                                        bgcolor: '#ffffff',
                                                                        borderColor: '#0A7A2F',
                                                                        boxShadow: '0 4px 12px rgba(10,122,47,0.06)'
                                                                    }
                                                                }}>
                                                                    <Typography sx={{ color: '#111', fontSize: '14px', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{field.value}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            )}
                                        </Box>
                                    </Paper>

                                    {/* Account Details */}
                                    <Paper variant="outlined" sx={{ borderRadius: '18px', overflow: 'hidden', mb: 3 }}>
                                        <Box sx={{ px: 3, py: 2, bgcolor: '#f8fbf9', borderBottom: '1px solid #f0f0f0' }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#111', display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                <FingerprintIcon sx={{ fontSize: 22, color: '#0A7A2F' }} /> Account Details
                                            </Typography>
                                        </Box>
                                        <Box sx={{ px: 3, py: 1.5 }}>
                                            <Grid container spacing={4} sx={{ py: 3, px: 1 }}>
                                                {[
                                                    { label: 'Self Sponsor ID', value: formatValue(userData.memberId), icon: <FingerprintIcon />, accent: '#0A7A2F' },
                                                    { label: 'Referrer Member ID', value: formatValue(userData.sponsorId), icon: <GroupsIcon />, accent: '#F7931E' },
                                                    { label: 'Sponsor Full Name', value: formatValue(userData.sponsorName), icon: <PersonIcon />, accent: '#F7931E' },
                                                    { label: 'Registered State', value: formatValue(userData.state), icon: <FlagIcon />, accent: '#F7931E' },
                                                ].map((field, fi) => (
                                                    <Grid item xs={12} sm={6} key={fi}>
                                                        <Box sx={{ mb: 1 }}>
                                                            <Typography sx={{ color: '#444', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', mb: 1.2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                {React.cloneElement(field.icon, { sx: { fontSize: 16, color: field.accent } })} {field.label}
                                                            </Typography>
                                                            <Box sx={{
                                                                px: 2.5,
                                                                py: 1.8,
                                                                bgcolor: field.label === 'Self Sponsor ID' ? '#f8f9f8' : '#fffbf7',
                                                                border: `1.5px solid ${field.label === 'Self Sponsor ID' ? '#e0e6e1' : '#f5ebe0'}`,
                                                                borderRadius: '12px',
                                                                transition: 'all 0.2s ease-in-out',
                                                                '&:hover': {
                                                                    bgcolor: '#ffffff',
                                                                    borderColor: field.accent,
                                                                    boxShadow: `0 4px 12px ${field.label === 'Self Sponsor ID' ? 'rgba(10,122,47,0.06)' : 'rgba(247,147,30,0.06)'}`
                                                                }
                                                            }}>
                                                                <Typography sx={{ color: '#111', fontSize: '14px', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{field.value}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Paper>

                                    {/* KYC in Profile */}
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" sx={{ color: '#0A7A2F', mb: 2, fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FingerprintIcon sx={{ fontSize: 22 }} /> KYC Verification
                                        </Typography>
                                        {renderKycForm()}
                                    </Box>
                                </Box>
                            )}

                            {/* ── Address ── */}
                            {tabValue === 1 && (
                                <Box>
                                    <Box sx={{ mb: 3, borderRadius: '18px', overflow: 'hidden', border: '1px solid #e8f5e9', boxShadow: '0 4px 20px rgba(10,122,47,0.1)' }}>
                                        <Box sx={{ height: '6px', background: 'linear-gradient(90deg, #0A7A2F, #F7931E, #0A7A2F)' }} />
                                        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: 'white', display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Box sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: '12px', bgcolor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <LocationOnIcon sx={{ color: '#0A7A2F', fontSize: { xs: 20, sm: 26 } }} />
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontSize: { xs: '14px', sm: '16px' }, color: '#111' }}>Address Information</Typography>
                                                <Typography sx={{ color: '#666', fontSize: { xs: '11px', sm: '13px' }, mt: 0.25 }}>
                                                    {[userData.village, userData.district, userData.state].filter(Boolean).join(', ') || 'No address on file'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Paper variant="outlined" sx={{ borderRadius: '18px', overflow: 'hidden', mb: 3 }}>
                                        <Box sx={{ px: 3, py: 2, bgcolor: '#f8fbf9', borderBottom: '1px solid #f0f0f0' }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '16px', color: '#111', display: 'flex', alignItems: 'center', gap: 1.2 }}>
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
                                                    <Grid item xs={12} key={fi}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: '12px', bgcolor: '#fcfdfc', border: '1px solid rgba(10,122,47,0.08)', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(10,122,47,0.08)', bgcolor: 'white' } }}>
                                                            <Box sx={{ bgcolor: '#f0f9f1', p: 1, borderRadius: '8px', display: 'flex' }}>{field.icon}</Box>
                                                            <Box>
                                                                <Typography sx={{ color: '#666', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>{field.label}</Typography>
                                                                <Typography sx={{ color: '#111', fontSize: '14px', fontWeight: 700 }}>{field.value}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Paper>

                                    <Paper variant="outlined" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                                        <Box sx={{ px: 2, py: 1.5, bgcolor: '#fffbed', borderBottom: '1px solid #f0f0f0' }}>
                                            <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#111', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationOnIcon sx={{ fontSize: 20, color: '#F7931E' }} /> Shipping Address
                                            </Typography>
                                        </Box>
                                        <Box sx={{ px: 2, py: 1.5, bgcolor: 'white' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <Box sx={{ bgcolor: '#fff8e1', p: 1.5, borderRadius: '10px', display: 'flex' }}><HomeIcon sx={{ color: '#F7931E' }} /></Box>
                                                <Box>
                                                    <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 500, mb: 0.75 }}>Full Address</Typography>
                                                    <Typography sx={{ color: '#111', fontSize: { xs: '14px', sm: '16px' }, fontWeight: 700, lineHeight: 1.6 }}>
                                                        {[userData.shippingAddress, userData.village, userData.villageCouncil, userData.block, userData.district, userData.state].filter(Boolean).join(', ') || 'Address not provided'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Box>
                            )}

                            {/* ── Orders ── */}
                            {tabValue === 2 && (
                                <Box sx={{ bgcolor: 'white', borderRadius: '12px', p: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#111' }}>Orders</Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <TextField size="small" placeholder="Search order, invoice, email" value={orderSearchQuery} onChange={(e) => setOrderSearchQuery(e.target.value)}
                                                sx={{ width: { xs: '100%', sm: '320px' }, '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#aaa', fontSize: 20 }} /></InputAdornment> }} />
                                            <Button variant="contained" onClick={() => navigate('/products')} sx={{ bgcolor: '#f3791e', '&:hover': { bgcolor: '#e0681a' }, borderRadius: '6px', textTransform: 'none', px: 2.5, py: 1, whiteSpace: 'nowrap', fontWeight: 600, boxShadow: 'none' }}>New sales order</Button>
                                        </Box>
                                    </Box>

                                    <Box sx={{ borderBottom: 1, borderColor: '#f0f0f0', mb: 4 }}>
                                        <Tabs value={orderTab} onChange={(e, v) => setOrderTab(v)} variant="scrollable" scrollButtons="auto"
                                            sx={{ minHeight: '44px', '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '14px', minWidth: 'auto', px: 3, py: 1, minHeight: '44px', color: '#666' }, '& .Mui-selected': { color: '#0A7A2F !important' }, '& .MuiTabs-indicator': { backgroundColor: '#0A7A2F', height: 3, borderRadius: '3px 3px 0 0' } }}>
                                            <Tab label="Active" value="Active" />
                                            <Tab label="All Orders" value="All Orders" />
                                            <Tab label="To Invoice" value="To Invoice" />
                                            <Tab label="To Ship" value="To Ship" />
                                            <Tab label="To Backorder" value="To Backorder" />
                                        </Tabs>
                                    </Box>

                                    {ordersLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={40} sx={{ color: '#0A7A2F' }} /></Box>
                                    ) : (
                                        <Box>
                                            {userOrders.length === 0 && (
                                                <Paper variant="outlined" sx={{ borderRadius: '12px', p: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                                    <Box>
                                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#111', mb: 1 }}>Create your first order</Typography>
                                                        <Typography variant="body2" sx={{ color: '#777', maxWidth: '600px', lineHeight: 1.6 }}>Sanyukt Parivaar aggregates orders from all of your different sales channels here.</Typography>
                                                    </Box>
                                                    <Button variant="outlined" onClick={() => navigate('/products')} sx={{ borderRadius: '6px', textTransform: 'none', borderColor: '#d0d0d0', color: '#555', fontWeight: 600 }}>Create a New Sales order</Button>
                                                </Paper>
                                            )}

                                            {userOrders.length > 0 && (() => {
                                                const filteredOrders = userOrders.filter(order => {
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
                                                    return matchesSearch && matchesTab;
                                                });

                                                const getOrderStyle = (status) => {
                                                    const s = status?.toLowerCase() || 'pending';
                                                    if (s === 'processing') return { color: '#e3f2fd', text: '#1565c0', label: 'Processing' };
                                                    if (s === 'shipped') return { color: '#f3e5f5', text: '#7b1fa2', label: 'Shipped' };
                                                    if (s === 'delivered') return { color: '#e8f5e9', text: '#2e7d32', label: 'Delivered' };
                                                    if (s === 'cancelled') return { color: '#ffebee', text: '#c62828', label: 'Cancelled' };
                                                    return { color: '#fff3e0', text: '#e65100', label: 'Pending' };
                                                };

                                                return (
                                                    <>
                                                        {/* Desktop Table */}
                                                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                                            <TableContainer sx={{ border: '1px solid #eee', borderRadius: '16px', overflow: 'hidden' }}>
                                                                <Table sx={{ minWidth: 800 }}>
                                                                    <TableHead sx={{ bgcolor: '#fcfdfc' }}>
                                                                        <TableRow>
                                                                            <TableCell padding="checkbox" sx={{ borderBottom: '1px solid #eee', py: 2 }}><Checkbox size="small" sx={{ color: '#ccc' }} /></TableCell>
                                                                            {['Order ID', 'Product / Item', 'Status', 'Total', 'Date', 'Action'].map(h => (
                                                                                <TableCell key={h} sx={{ color: '#111', fontWeight: 700, fontSize: '13.5px', borderBottom: '1px solid #eee', py: 2 }}>{h}</TableCell>
                                                                            ))}
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {filteredOrders.map((order, index) => {
                                                                            const productName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || 'Item';
                                                                            const s = getOrderStyle(order.status);
                                                                            const total = order.totalAmount || order.total || '0';
                                                                            const date = new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                                                            const statusMatch = order.status?.toLowerCase() || 'pending';
                                                                            return (
                                                                                <TableRow key={order._id || index} hover sx={{ bgcolor: index % 2 === 0 ? '#fcfdfc' : 'white', '&:hover': { bgcolor: '#f4faf5' } }}>
                                                                                    <TableCell padding="checkbox" sx={{ borderBottom: 'none', py: 2 }}><Checkbox size="small" sx={{ color: '#ddd' }} /></TableCell>
                                                                                    <TableCell sx={{ fontWeight: 700, color: '#333', fontSize: '13.5px', borderBottom: 'none' }}>{order._id ? `#${order._id.slice(-8).toUpperCase()}` : `#${String(index + 1).padStart(4, '0')}`}</TableCell>
                                                                                    <TableCell sx={{ color: '#111', fontWeight: 600, fontSize: '13.5px', borderBottom: 'none' }}>{productName}</TableCell>
                                                                                    <TableCell sx={{ borderBottom: 'none' }}><Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, borderRadius: '6px', bgcolor: s.color, color: s.text, fontWeight: 800, fontSize: '11px', textTransform: 'uppercase' }}>{s.label}</Box></TableCell>
                                                                                    <TableCell sx={{ fontWeight: 800, color: '#0A7A2F', fontSize: '14px', borderBottom: 'none' }}>₹{parseFloat(total).toFixed(2)}</TableCell>
                                                                                    <TableCell sx={{ color: '#666', fontSize: '13px', borderBottom: 'none' }}>{date}</TableCell>
                                                                                    <TableCell align="center" sx={{ borderBottom: 'none' }}>
                                                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                                                            <Button size="small" variant="outlined" sx={{ textTransform: 'none', borderRadius: '6px', borderColor: '#0A7A2F', color: '#0A7A2F', fontWeight: 600 }} onClick={() => navigate(`/order-details/${order._id}`)}>Details</Button>
                                                                                            {(statusMatch === 'shipped' || statusMatch === 'delivered') && (
                                                                                                <Button size="small" variant="contained" sx={{ textTransform: 'none', borderRadius: '6px', bgcolor: '#f3791e', fontWeight: 600, boxShadow: 'none' }} onClick={() => window.open(`/api/orders/${order._id}/invoice`, '_blank')}>Invoice</Button>
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
                                                        {/* Mobile Cards */}
                                                        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
                                                            {filteredOrders.map((order, index) => {
                                                                const s = getOrderStyle(order.status);
                                                                const productName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || 'Item';
                                                                const total = order.totalAmount || order.total || '0';
                                                                const statusMatch = order.status?.toLowerCase() || 'pending';
                                                                return (
                                                                    <Paper key={order._id || index} variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: 'white' }}>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                                                            <Box>
                                                                                <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#111' }}>#{order._id?.slice(-8).toUpperCase() || index + 1}</Typography>
                                                                                <Typography sx={{ fontSize: '12px', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Typography>
                                                                            </Box>
                                                                            <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', bgcolor: s.color, color: s.text, fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>{s.label}</Box>
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
                                                    </>
                                                );
                                            })()}
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* ══════════════════════════════════════════════ */}
                            {/* ── Transactions Tab ──                         */}
                            {/* ══════════════════════════════════════════════ */}
                            {tabValue === 3 && (
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#0A7A2F', mb: 3, fontWeight: 700, borderBottom: '3px solid #0A7A2F', pb: 1, display: 'inline-block' }}>
                                        Transaction History
                                    </Typography>

                                    {/* Stats Cards */}
                                    <Grid container spacing={2} sx={{ mb: 4 }}>
                                        <Grid item xs={6} sm={3}>
                                            <Paper sx={{ p: 2, borderRadius: '12px', borderLeft: '4px solid #0A7A2F', bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>Total Orders</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, color: '#111' }}>{userOrders.length}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper sx={{ p: 2, borderRadius: '12px', borderLeft: '4px solid #F7931E', bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>Recharges</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, color: '#111' }}>{userTransactions.filter(t => t.type !== 'donation').length}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper sx={{ p: 2, borderRadius: '12px', borderLeft: '4px solid #e91e63', bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>Donations</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, color: '#111' }}>{userTransactions.filter(t => t.type === 'donation').length}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper sx={{ p: 2, borderRadius: '12px', borderLeft: '4px solid #2196f3', bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>Tickets</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, color: '#111' }}>{userGrievances.length}</Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>

                                    {/* ══ WALLET TRANSACTION REPORT ══ */}
                                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                        <Typography variant="h6" sx={{ color: '#0A7A2F', fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AccountBalanceWalletIcon sx={{ fontSize: 20 }} /> Wallet Transaction Report
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                            {/* Filter Buttons */}
                                            {[
                                                { key: 'All', label: 'All' },
                                                { key: 'credit', label: '↑ Credits' },
                                                { key: 'debit', label: '↓ Debits' },
                                            ].map(f => (
                                                <Button key={f.key} size="small"
                                                    variant={walletTxFilter === f.key ? 'contained' : 'outlined'}
                                                    onClick={() => setWalletTxFilter(f.key)}
                                                    sx={{
                                                        textTransform: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '12px',
                                                        ...(walletTxFilter === f.key
                                                            ? { bgcolor: f.key === 'debit' ? '#d32f2f' : '#0A7A2F', '&:hover': { bgcolor: f.key === 'debit' ? '#b71c1c' : '#085c22' } }
                                                            : { borderColor: f.key === 'debit' ? '#d32f2f' : '#0A7A2F', color: f.key === 'debit' ? '#d32f2f' : '#0A7A2F' })
                                                    }}>
                                                    {f.label}
                                                </Button>
                                            ))}
                                            {/* Search */}
                                            <TextField size="small" placeholder="Search..." value={walletTxSearch} onChange={(e) => setWalletTxSearch(e.target.value)}
                                                sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px' } }}
                                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#aaa' }} /></InputAdornment> }} />
                                        </Box>
                                    </Box>

                                    {/* Wallet Transactions Content */}
                                    {walletTxLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                            <CircularProgress size={36} sx={{ color: '#0A7A2F' }} />
                                        </Box>
                                    ) : walletTxError ? (
                                        <Box sx={{ textAlign: 'center', py: 5, bgcolor: 'white', borderRadius: '12px', border: '1px solid #ffcdd2', mb: 4 }}>
                                            <Typography sx={{ color: '#d32f2f', fontWeight: 600, mb: 1 }}>{walletTxError}</Typography>
                                            <Button variant="outlined" size="small" onClick={fetchAllWalletTransactions} sx={{ borderColor: '#0A7A2F', color: '#0A7A2F', borderRadius: '8px', textTransform: 'none' }}>Try Again</Button>
                                        </Box>
                                    ) : filteredWalletTx.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 5, bgcolor: 'white', borderRadius: '12px', border: '1px solid #eee', mb: 4 }}>
                                            <AccountBalanceWalletIcon sx={{ fontSize: 60, color: '#eee', mb: 1 }} />
                                            <Typography sx={{ color: '#666', fontWeight: 600 }}>
                                                {allWalletTransactions.length === 0 ? 'No Wallet Transactions Yet' : 'No transactions match your filter'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#ccc', mt: 0.5 }}>Income aur withdrawal transactions yahan dikhenge.</Typography>
                                        </Box>
                                    ) : (
                                        <Box sx={{ mb: 4 }}>
                                            {/* Desktop Table */}
                                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                                <TableContainer sx={{ border: '1px solid #eee', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', mb: 1 }}>
                                                    <Table>
                                                        <TableHead sx={{ bgcolor: '#fcfdfc' }}>
                                                            <TableRow>
                                                                {['#', 'Date', 'Type', 'Amount', 'Source / Description', 'Reference'].map(h => (
                                                                    <TableCell key={h} sx={{ color: '#111', fontWeight: 700, fontSize: '13px', borderBottom: '1px solid #eee', py: 2 }}>{h}</TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {filteredWalletTx.map((txn, index) => (
                                                                <TableRow key={txn._id || index} hover sx={{ bgcolor: index % 2 === 0 ? '#fcfdfc' : 'white', '&:hover': { bgcolor: '#f4faf5' } }}>
                                                                    <TableCell sx={{ borderBottom: 'none', color: '#999', fontSize: '12px' }}>{index + 1}</TableCell>
                                                                    <TableCell sx={{ borderBottom: 'none', color: '#666', fontSize: '13px', whiteSpace: 'nowrap' }}>
                                                                        {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderBottom: 'none' }}>
                                                                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.4, borderRadius: '6px', bgcolor: txn.txType === 'credit' ? '#e8f5e9' : '#fff3e0', color: txn.txType === 'credit' ? '#2e7d32' : '#e65100', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase' }}>
                                                                            {txn.txType === 'credit' ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
                                                                            {txn.type}
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderBottom: 'none' }}>
                                                                        <Typography sx={{ fontWeight: 800, fontSize: '15px', color: txn.txType === 'credit' ? '#0A7A2F' : '#d32f2f' }}>
                                                                            {txn.txType === 'credit' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderBottom: 'none', maxWidth: 200 }}>
                                                                        <Typography noWrap sx={{ fontSize: '13px', color: '#444' }}>{txn.source}</Typography>
                                                                    </TableCell>
                                                                    <TableCell sx={{ borderBottom: 'none', color: '#888', fontSize: '12px', fontFamily: 'monospace' }}>{txn.details || '—'}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <Typography variant="caption" sx={{ color: '#999', pl: 1 }}>
                                                    Showing {filteredWalletTx.length} of {allWalletTransactions.length} transactions
                                                </Typography>
                                            </Box>

                                            {/* Mobile Cards */}
                                            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
                                                {filteredWalletTx.map((txn, index) => (
                                                    <Paper key={txn._id || index} variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: 'white', borderLeft: `4px solid ${txn.txType === 'credit' ? '#0A7A2F' : '#d32f2f'}` }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, px: 1.2, py: 0.3, borderRadius: '5px', bgcolor: txn.txType === 'credit' ? '#e8f5e9' : '#fff3e0', color: txn.txType === 'credit' ? '#2e7d32' : '#e65100', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', mb: 0.5 }}>
                                                                    {txn.txType === 'credit' ? <TrendingUpIcon sx={{ fontSize: 12 }} /> : <TrendingDownIcon sx={{ fontSize: 12 }} />}
                                                                    {txn.type}
                                                                </Box>
                                                                <Typography sx={{ fontSize: '13px', color: '#444', fontWeight: 500 }}>{txn.source}</Typography>
                                                                <Typography sx={{ fontSize: '11px', color: '#999', mt: 0.25 }}>
                                                                    {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </Typography>
                                                            </Box>
                                                            <Typography sx={{ fontWeight: 800, fontSize: '17px', color: txn.txType === 'credit' ? '#0A7A2F' : '#d32f2f', flexShrink: 0 }}>
                                                                {txn.txType === 'credit' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 3 }} />

                                    {/* ══ ORDER HISTORY ══ */}
                                    <Typography variant="h6" sx={{ color: '#0A7A2F', mb: 2, fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        🛒 Order History
                                    </Typography>
                                    {ordersLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={36} sx={{ color: '#0A7A2F' }} /></Box>
                                    ) : userOrders.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'white', borderRadius: '12px', border: '1px solid #eee', mb: 4 }}>
                                            <ShoppingBagIcon sx={{ fontSize: 60, color: '#eee', mb: 1 }} />
                                            <Typography sx={{ color: '#666', fontWeight: 600 }}>No Orders Yet</Typography>
                                        </Box>
                                    ) : (
                                        <Box sx={{ mb: 4 }}>
                                            {userOrders.map((order, index) => {
                                                const productName = order.product?.name || order.items?.[0]?.name || order.items?.[0]?.productId?.name || 'Item';
                                                const total = order.totalAmount || order.total || '0';
                                                return (
                                                    <Paper key={order._id || index} variant="outlined" sx={{ p: 0, borderRadius: '14px', mb: 2, overflow: 'hidden', cursor: 'pointer', '&:hover': { boxShadow: '0 6px 18px rgba(10,122,47,0.08)', borderColor: '#0A7A2F' }, transition: 'all 0.3s ease' }} onClick={() => setTabValue(2)}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{ p: 2, bgcolor: '#f4faf5', borderRight: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                                                                <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <ShoppingBagIcon sx={{ color: '#0A7A2F', fontSize: 24 }} />
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ p: 2, flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Box>
                                                                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#111' }}>Order #{order._id?.slice(-8).toUpperCase() || index + 1}</Typography>
                                                                    <Typography sx={{ fontSize: '12px', color: '#888' }}>{productName} • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
                                                                </Box>
                                                                <Box sx={{ textAlign: 'right' }}>
                                                                    <Typography sx={{ fontWeight: 800, color: '#0A7A2F', fontSize: '16px' }}>₹{total}</Typography>
                                                                    <Chip label={(order.status || 'Placed').toUpperCase()} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 800, mt: 0.5, bgcolor: order.status === 'delivered' ? '#0A7A2F' : '#F7931E', color: 'white', borderRadius: '4px' }} />
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Paper>
                                                );
                                            })}
                                        </Box>
                                    )}

                                    {/* ── RECHARGE HISTORY SECTION ── */}
                                    {userTransactions.some(t => t.type !== 'donation') && (
                                        <>
                                            <Typography variant="h6" sx={{ color: '#0A7A2F', mb: 2, fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                ⚡ Recharge History
                                            </Typography>
                                            <Box sx={{ mb: 4 }}>
                                                {userTransactions.filter(txn => txn.type !== 'donation').map((txn, index) => (
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
                                        </>
                                    )}

                                    {/* ── DONATION HISTORY SECTION ── */}
                                    {userTransactions.some(t => t.type === 'donation') && (
                                        <>
                                            <Typography variant="h6" sx={{ color: '#e91e63', mb: 2, fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                🤝 Donation History
                                            </Typography>
                                            <Box sx={{ mb: 4 }}>
                                                {userTransactions.filter(txn => txn.type === 'donation').map((txn, index) => (
                                                    <Paper
                                                        key={txn._id || index}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 0,
                                                            borderRadius: '14px',
                                                            mb: 2,
                                                            overflow: 'hidden',
                                                            '&:hover': { boxShadow: '0 6px 18px rgba(233,30,99,0.06)', borderColor: '#e91e63' },
                                                            transition: 'all 0.3s ease',
                                                            borderLeft: '4px solid #e91e63'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}>
                                                            <Box sx={{
                                                                p: 2,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                bgcolor: '#fff9fb',
                                                                borderRight: { xs: 'none', sm: '1px solid #f0f0f0' },
                                                                borderBottom: { xs: '1px solid #f0f0f0', sm: 'none' },
                                                                justifyContent: { xs: 'center', sm: 'flex-start' }
                                                            }}>
                                                                <Box sx={{
                                                                    width: 44, height: 44, borderRadius: '10px', bgcolor: 'white',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                                                                }}>
                                                                    <ShareIcon sx={{ color: '#e91e63', fontSize: 24 }} />
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ p: 2, flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Box>
                                                                    <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#111', mb: 0.25 }}>
                                                                        Contribution to Sanyukt Parivaar
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                                        <Typography sx={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                            <ShieldIcon sx={{ width: 12, height: 12 }} /> {txn.paymentMethod?.toUpperCase()}
                                                                        </Typography>
                                                                        <Typography sx={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                            <EventIcon sx={{ fontSize: 12 }} /> {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                                <Box sx={{ textAlign: 'right' }}>
                                                                    <Typography sx={{ fontWeight: 800, color: '#e91e63', fontSize: '16px' }}>₹{txn.amount}</Typography>
                                                                    <Chip
                                                                        label={txn.status?.toUpperCase()}
                                                                        size="small"
                                                                        sx={{
                                                                            height: 20, fontSize: '10px', fontWeight: 800, mt: 0.75, px: 0.5,
                                                                            bgcolor: txn.status === 'success' ? '#e91e63' : '#757575',
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
                                        </>
                                    )}

                                    {userTransactions.length === 0 && (
                                        <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                                            <ReceiptIcon sx={{ fontSize: 60, color: '#eee', mb: 1 }} />
                                            <Typography sx={{ color: '#666', fontWeight: 600 }}>No Payments Yet</Typography>
                                            <Typography variant="body2" sx={{ color: '#ccc', mt: 0.5 }}>Your recharges and donations will appear here.</Typography>
                                            <Button variant="outlined" size="small" sx={{ mt: 2, borderColor: '#0A7A2F', color: '#0A7A2F', borderRadius: '8px' }} onClick={() => navigate('/recharge')}>
                                                Make a Payment
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* ── Grievances ── */}
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
                                                                <Box sx={{ p: 3, flex: 1.5 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                                                        <Typography variant="caption" sx={{ color: '#0A7A2F', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: '#e8f5e9', px: 1.5, py: 0.5, borderRadius: '6px' }}>
                                                                            <SupportAgentIcon sx={{ fontSize: 16 }} /> {grievance.ticket}
                                                                        </Typography>
                                                                        {grievance.category && <Chip label={grievance.category} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, color: '#666', bgcolor: '#f0f0f0' }} />}
                                                                    </Box>
                                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111', mb: 1.5, fontSize: '1.15rem' }}>{grievance.subject || 'No Subject Provided'}</Typography>
                                                                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{grievance.message || '—'}</Typography>
                                                                    <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                                                        <Box>
                                                                            <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontWeight: 700, fontSize: '10px' }}>Contact Mobile</Typography>
                                                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>{grievance.mobile || '—'}</Typography>
                                                                        </Box>
                                                                        <Box>
                                                                            <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontWeight: 700, fontSize: '10px' }}>Submitted On</Typography>
                                                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '13px', color: '#333' }}>
                                                                                {new Date(grievance.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                                <Box sx={{ width: { xs: '100%', md: '200px' }, bgcolor: '#fafafa', borderLeft: { xs: 'none', md: '1px solid #eaeaea' }, borderTop: { xs: '1px solid #eaeaea', md: 'none' }, p: { xs: 2.5, sm: 3 }, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                                                    <StatusChip size="medium" icon={getStatusIcon(grievance.status)} label={grievance.status} status={grievance.status} sx={{ width: '100%', py: 2.2, borderRadius: '8px', flex: { xs: 1, md: 'none' } }} />
                                                                    <Button fullWidth variant="contained" startIcon={<HistoryIcon />}
                                                                        sx={{ bgcolor: '#0A7A2F', '&:hover': { bgcolor: '#086325' }, textTransform: 'none', borderRadius: '8px', py: 1.2, fontWeight: 700, boxShadow: 'none', flex: { xs: 1, md: 'none' } }}
                                                                        onClick={() => navigate(`/grievance?ticket=${grievance.ticket}`)}>
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

                            {/* ── KYC ── */}
                            {tabValue === 5 && (
                                <Box>
                                    <Typography variant="h6" sx={{ color: '#0A7A2F', mb: 3, fontWeight: 700, borderBottom: '3px solid #0A7A2F', pb: 1, display: 'inline-block' }}>
                                        KYC Verification
                                    </Typography>
                                    {renderKycForm()}
                                </Box>
                            )}

                        </Box>
                    </AnimatedPaper>
                </Fade>

                {/* Snackbar */}
                <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} TransitionComponent={Slide}>
                    <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled"
                        sx={{ width: '100%', borderRadius: '16px', fontWeight: 800, bgcolor: '#f7931e', color: 'white', '& .MuiAlert-icon': { color: 'white' } }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>

            </Container>
        </FullPageContainer>
    );
};

export default MyAccount;
