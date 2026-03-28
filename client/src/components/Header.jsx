import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Container,
    Typography,
    Collapse,
    Menu,
    MenuItem,
    Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HistoryIcon from '@mui/icons-material/History';
import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Main Header Styling (Sticky, Full width, 80px desktop, 60px mobile)
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: '#0D0D0D',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
    borderBottom: '1px solid rgba(200, 169, 106, 0.4)',
    minHeight: '72px',
    height: '72px',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    zIndex: 1100,
    [theme.breakpoints.up('md')]: {
        minHeight: '80px',
        height: '80px',
    },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    maxWidth: '220px',
    flexShrink: 0,
    [theme.breakpoints.up('md')]: {
        gap: '12px',
        maxWidth: '350px',
    },
    [theme.breakpoints.up('lg')]: {
        maxWidth: '380px',
    },
    [theme.breakpoints.up('xl')]: {
        maxWidth: '450px',
    },
}));

const LogoImage = styled('img')(({ theme }) => ({
    height: '36px',
    width: 'auto',
    objectFit: 'contain',
    [theme.breakpoints.up('md')]: {
        height: '40px',
    },
    [theme.breakpoints.up('lg')]: {
        height: '48px',
    },
}));

const LogoMain = styled('span')(({ theme }) => ({
    fontFamily: '"Playfair Display", serif',
    fontWeight: 700,
    fontSize: '0.85rem',
    color: '#C8A96A',
    whiteSpace: 'normal',
    lineHeight: 1.2,
    letterSpacing: '0.02em',
    [theme.breakpoints.up('md')]: {
        fontSize: '0.95rem',
        whiteSpace: 'nowrap',
    },
    [theme.breakpoints.up('lg')]: {
        fontSize: '1rem',
    },
}));

const LogoTagline = styled('span')(({ theme }) => ({
    fontFamily: '"Inter", sans-serif',
    fontSize: '0.6rem',
    fontWeight: 500,
    color: '#F5E6C8',
    whiteSpace: 'normal',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    opacity: 0.9,
    [theme.breakpoints.up('md')]: {
        fontSize: '0.7rem',
        whiteSpace: 'nowrap',
    },
    [theme.breakpoints.up('lg')]: {
        fontSize: '0.75rem',
    },
}));

// NavButton with exact styling
const NavButton = styled(Button)(({ theme }) => ({
    fontFamily: '"Inter", sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    color: '#F5E6C8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '4px 8px',
    minWidth: 'auto',
    whiteSpace: 'nowrap',
    borderRadius: '2px',
    '&:hover': {
        color: '#C8A96A',
        backgroundColor: 'rgba(200, 169, 106, 0.05)',
    },
    '&.active': {
        color: '#C8A96A',
        borderBottom: '1px solid #C8A96A',
    },
    transition: 'all 0.3s ease',
}));

// Register Button (#C9A84C, White text)
const RegisterButton = styled(Button)(({ theme }) => ({
    className: 'luxury-button',
    fontFamily: '"Inter", sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    border: '1px solid #C8A96A',
    color: '#0D0D0D',
    background: '#C8A96A',
    padding: '6px 12px',
    borderRadius: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    '&:hover': {
        background: '#F5E6C8',
        borderColor: '#F5E6C8',
    },
    transition: 'all 0.3s ease',
}));

const LoginButton = styled(Button)(({ theme }) => ({
    fontFamily: '"Inter", sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    backgroundColor: 'transparent',
    border: '1px solid rgba(200, 169, 106, 0.5)',
    color: '#C8A96A',
    padding: '6px 12px',
    borderRadius: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    '&:hover': {
        backgroundColor: 'rgba(200, 169, 106, 0.1)',
        borderColor: '#C8A96A',
    },
    transition: 'all 0.3s ease',
}));

// My Account Button (Yellow/Orange theme color)
const MyAccountButton = styled(Button)(({ theme }) => ({
    fontFamily: '"Inter", sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    background: '#C8A96A',
    color: '#0D0D0D',
    padding: '6px 12px',
    borderRadius: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
        background: '#F5E6C8',
    },
    transition: 'all 0.3s ease',
}));

// Admin Dashboard Button (Orange/Different color - for admins)
const AdminDashboardButton = styled(Button)(({ theme }) => ({
    fontFamily: '"Inter", sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    background: '#C8A96A',
    color: '#0D0D0D',
    padding: '6px 12px',
    borderRadius: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
        background: '#F5E6C8',
    },
    transition: 'all 0.3s ease',
}));

// Logout Menu Item
const LogoutMenuItem = styled(MenuItem)({
    color: '#d32f2f',
    '&:hover': {
        backgroundColor: 'rgba(211, 47, 47, 0.08)',
    },
});




// Regular List item for mobile drawer
const StyledListItemButton = styled(ListItemButton)({
    '&:hover': {
        backgroundColor: 'rgba(200, 169, 106, 0.1)',
        '& .MuiListItemText-primary': {
            color: '#C8A96A',
        },
    },
    transition: 'all 0.2s ease-in-out',
});

const Header = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const checkAuthStatus = () => {
        console.log("Checking auth status..."); // Debug log

        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        console.log("Token:", token); // Debug log
        console.log("User from localStorage:", user); // Debug log

        if (token && user) {
            try {
                const parsedUser = JSON.parse(user);
                console.log("Parsed user:", parsedUser); // Debug log

                setIsLoggedIn(true);
                setUserData(parsedUser);

                // Check user role - adjust based on your actual user data structure
                // Try different possible role field names
                const role = parsedUser.role ||
                    parsedUser.userType ||
                    parsedUser.type ||
                    (parsedUser.isAdmin ? 'admin' : 'user') ||
                    'user';

                setUserRole(role);
                console.log("User role set to:", role); // Debug log
            } catch (error) {
                console.error("Error parsing user data:", error);
                setIsLoggedIn(false);
                setUserData(null);
                setUserRole(null);
            }
        } else {
            console.log("No token or user found"); // Debug log
            setIsLoggedIn(false);
            setUserData(null);
            setUserRole(null);
        }
    };

    // Check authentication status on component mount and when localStorage changes
    useEffect(() => {
        checkAuthStatus();

        // Listen for storage events (in case user logs in/out in another tab)
        window.addEventListener('storage', checkAuthStatus);

        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

    // Also check when component mounts and after any navigation
    useEffect(() => {
        checkAuthStatus();
    }, [navigate]);

    // Franchise Dropdown State (Desktop)
    const [anchorElFranchise, setAnchorElFranchise] = useState(null);
    const openFranchiseMenu = Boolean(anchorElFranchise);

    // Mobile Submenu State (Accordion: 'company', 'franchise', 'account', or null)
    const [mobileSubmenu, setMobileSubmenu] = useState(null);

    // Company Dropdown State (Desktop)
    const [anchorElCompany, setAnchorElCompany] = useState(null);
    const openCompanyMenu = Boolean(anchorElCompany);

    // User Menu State
    const openUserMenu = Boolean(anchorElUser);

    // Exact Menu Order
    const menuItems = [
        { name: 'Home', path: '/' },
        { name: 'Recharge', path: '/recharge' },
        { name: 'Grievance', path: '/grievance' },
        { name: 'Products', path: '/products' },
        { name: 'Opportunities', path: '/opportunities' },
        { name: 'My Cart', path: '/my-account/cart' },
    ];

    // Trailing non-auth menus
    const trailItems = [
        { name: 'Contact Us', path: '/contact' },
    ];

    const companySubItems = [
        { name: 'About Us', path: '/company/about' },
        { name: 'Legal', path: '/company/legal' },
    ];

    const franchiseSubItems = [
        { name: 'Franchise List', path: '/franchise/list' },
        { name: 'Franchise Login', path: '/franchise/login' },
    ];

    const accountSubItems = [
        { name: 'My Profile', path: '/my-account/profile', icon: <PersonIcon fontSize="small" /> },
        { name: 'My Orders', path: '/my-account/orders', icon: <ReceiptIcon fontSize="small" /> },
        { name: 'Transactions', path: '/my-account/transactions', icon: <HistoryIcon fontSize="small" /> },
        { name: 'KYC Status', path: '/my-account/kyc', icon: <FingerprintIcon fontSize="small" /> },
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileOpen(false);
        setMobileSubmenu(null);
    };

    const handleLogoError = () => {
        setLogoError(true);
    };

    const isActive = (path) => window.location.pathname === path;

    const isFranchiseActive = () => franchiseSubItems.some(item => isActive(item.path));
    const isCompanyActive = () => companySubItems.some(item => isActive(item.path));

    // Desktop Menu Handlers
    const handleFranchiseClick = (event) => {
        setAnchorElFranchise(event.currentTarget);
    };

    const handleFranchiseClose = () => {
        setAnchorElFranchise(null);
    };

    const handleFranchiseItemClick = (path) => {
        handleFranchiseClose();
        handleNavigation(path);
    };

    const handleCompanyClick = (event) => {
        setAnchorElCompany(event.currentTarget);
    };

    const handleCompanyClose = () => {
        setAnchorElCompany(null);
    };

    const handleCompanyItemClick = (path) => {
        handleCompanyClose();
        handleNavigation(path);
    };


    // User Menu Handlers
    const handleUserMenuClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setAnchorElUser(null);
    };


    const handleAdminDashboardClick = () => {
        handleUserMenuClose();
        navigate('/admin/dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserData(null);
        setUserRole(null);
        handleUserMenuClose();
        navigate('/');
    };

    // Mobile Collapse Handlers (Accordion Logic)
    const handleMobileFranchiseToggle = () => {
        setMobileSubmenu(mobileSubmenu === 'franchise' ? null : 'franchise');
    };

    const handleMobileCompanyToggle = () => {
        setMobileSubmenu(mobileSubmenu === 'company' ? null : 'company');
    };

    const handleMobileAccountToggle = () => {
        setMobileSubmenu(mobileSubmenu === 'account' ? null : 'account');
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (userData?.userName) {
            return userData.userName.charAt(0).toUpperCase();
        }
        if (userData?.name) {
            return userData.name.charAt(0).toUpperCase();
        }
        if (userData?.email) {
            return userData.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    // Get display name for button
    const getDisplayName = () => {
        if (userData?.userName) {
            return userData.userName;
        }
        if (userData?.name) {
            return userData.name;
        }
        if (userData?.email) {
            // Show first part of email
            return userData.email.split('@')[0];
        }
        return isAdmin() ? 'Admin' : 'My Account';
    };

    // Check if user is admin
    const isAdmin = () => {
        return userRole === 'admin' ||
            userRole === 'administrator' ||
            userRole === 'Admin' ||
            userRole === 'ADMIN';
    };

    // Debug render
    console.log("Render - isLoggedIn:", isLoggedIn, "userRole:", userRole, "isAdmin:", isAdmin()); // Debug log

    // Mobile Drawer
    const drawer = (
        <Box sx={{ width: 280, pt: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo inside drawer to always keep it visible */}
            <Box sx={{ px: 2, pb: 2, borderBottom: '1px solid rgba(201,168,76,0.3)', mb: 1 }}>
                <LogoContainer onClick={() => handleNavigation('/')}>
                    {!logoError && (
                        <LogoImage src="/logo.png" alt="Sanyukt Parivaar Logo" onError={handleLogoError} />
                    )}
                    {/* <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.2 }}>
                        <LogoMain>Sanyukt Parivaar <span style={{ fontSize: '0.9rem' }}>&</span> Rich Life</LogoMain>
                        <LogoTagline>Together We Grow, Together We Prosper</LogoTagline>
                    </Box> */}
                </LogoContainer>
            </Box>

            <List sx={{ flexGrow: 1 }}>
                {/* Home */}
                <ListItem disablePadding>
                    <StyledListItemButton onClick={() => handleNavigation('/')}>
                        <ListItemText
                            primary="Home"
                            sx={{
                                '& .MuiTypography-root': {
                                    fontFamily: '"Poppins", "Roboto", sans-serif',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: isActive('/') ? '#C8A96A' : '#C8A96A'
                                }
                            }}
                        />
                    </StyledListItemButton>
                </ListItem>

                {/* Company Submenu (Mobile Drawer) */}
                <ListItem disablePadding sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <StyledListItemButton onClick={handleMobileCompanyToggle} sx={{ width: '100%' }}>
                        <ListItemText
                            primary="Sanyukt Parivaar"
                            sx={{
                                '& .MuiTypography-root': {
                                    fontFamily: '"Poppins", "Roboto", sans-serif',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: isCompanyActive() ? '#C8A96A' : '#C8A96A'
                                }
                            }}
                        />
                        {mobileSubmenu === 'company' ? <ExpandLess sx={{ color: '#C8A96A' }} /> : <ExpandMore sx={{ color: '#C8A96A' }} />}
                    </StyledListItemButton>
                    <Collapse in={mobileSubmenu === 'company'} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                        <List component="div" disablePadding>
                            {companySubItems.map((subItem) => (
                                <StyledListItemButton
                                    key={subItem.name}
                                    sx={{ pl: 4 }}
                                    onClick={() => handleNavigation(subItem.path)}
                                >
                                    <ListItemText
                                        primary={subItem.name}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontFamily: '"Poppins", "Roboto", sans-serif',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                color: isActive(subItem.path) ? '#C8A96A' : '#C8A96A'
                                            }
                                        }}
                                    />
                                </StyledListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </ListItem>

                {/* Other Menu Items mapping */}
                {menuItems.slice(1).map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <StyledListItemButton onClick={() => handleNavigation(item.path)}>
                            <ListItemText
                                primary={item.name}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontFamily: '"Poppins", "Roboto", sans-serif',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: isActive(item.path) ? '#C8A96A' : '#C8A96A'
                                    }
                                }}
                            />
                        </StyledListItemButton>
                    </ListItem>
                ))}

                {/* Franchise Submenu (Mobile Drawer) */}
                <ListItem disablePadding sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <StyledListItemButton onClick={handleMobileFranchiseToggle} sx={{ width: '100%' }}>
                        <ListItemText
                            primary="Franchise"
                            sx={{
                                '& .MuiTypography-root': {
                                    fontFamily: '"Poppins", "Roboto", sans-serif',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: isFranchiseActive() ? '#C8A96A' : '#C8A96A'
                                }
                            }}
                        />
                        {mobileSubmenu === 'franchise' ? <ExpandLess sx={{ color: '#C8A96A' }} /> : <ExpandMore sx={{ color: '#C8A96A' }} />}
                    </StyledListItemButton>
                    <Collapse in={mobileSubmenu === 'franchise'} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                        <List component="div" disablePadding>
                            {franchiseSubItems.map((subItem) => (
                                <StyledListItemButton
                                    key={subItem.name}
                                    sx={{ pl: 4 }}
                                    onClick={() => handleNavigation(subItem.path)}
                                >
                                    <ListItemText
                                        primary={subItem.name}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontFamily: '"Poppins", "Roboto", sans-serif',
                                                fontSize: '13px',
                                                fontWeight: 500,
                                                color: isActive(subItem.path) ? '#C8A96A' : '#C8A96A'
                                            }
                                        }}
                                    />
                                </StyledListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </ListItem>

                {trailItems.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <StyledListItemButton onClick={() => handleNavigation(item.path)}>
                            <ListItemText
                                primary={item.name}
                                sx={{
                                    '& .MuiTypography-root': {
                                        fontFamily: '"Poppins", "Roboto", sans-serif',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: isActive(item.path) ? '#C8A96A' : '#C8A96A'
                                    }
                                }}
                            />
                        </StyledListItemButton>
                    </ListItem>
                ))}

                {/* Auth Buttons or Role-Based Buttons in Mobile Drawer */}
                <Box sx={{ px: 2, mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {isLoggedIn ? (
                        <>
                            {isAdmin() ? (
                                // Admin View
                                <>
                                    <AdminDashboardButton
                                        onClick={() => handleNavigation('/admin/dashboard')}
                                        sx={{ ml: 0, width: '100%', justifyContent: 'center' }}
                                    >
                                        <DashboardIcon sx={{ mr: 1 }} />
                                        Admin Dashboard
                                    </AdminDashboardButton>
                                    <LoginButton
                                        onClick={handleLogout}
                                        sx={{ ml: 0, width: '100%', borderColor: '#d32f2f', color: '#d32f2f' }}
                                    >
                                        <LogoutIcon sx={{ mr: 1 }} />
                                        Logout
                                    </LoginButton>
                                </>
                            ) : (
                                // Regular User View
                                <>
                                    <ListItem disablePadding sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <StyledListItemButton onClick={handleMobileAccountToggle} sx={{ width: '100%', justifyContent: 'center' }}>
                                            <AccountCircleIcon sx={{ mr: 1, color: '#C8A96A' }} />
                                            <ListItemText
                                                primary={getDisplayName()}
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        fontFamily: '"Poppins", "Roboto", sans-serif',
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        color: '#C8A96A'
                                                    }
                                                }}
                                            />
                                            {mobileSubmenu === 'account' ? <ExpandLess sx={{ color: '#C8A96A' }} /> : <ExpandMore sx={{ color: '#C8A96A' }} />}
                                        </StyledListItemButton>
                                        <Collapse in={mobileSubmenu === 'account'} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                                            <List component="div" disablePadding>
                                                {accountSubItems.map((subItem) => (
                                                    <StyledListItemButton
                                                        key={subItem.name}
                                                        sx={{ pl: 4 }}
                                                        onClick={() => handleNavigation(subItem.path)}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#C8A96A' }}>
                                                            {subItem.icon}
                                                            <ListItemText
                                                                primary={subItem.name}
                                                                sx={{
                                                                    '& .MuiTypography-root': {
                                                                        fontFamily: '"Poppins", "Roboto", sans-serif',
                                                                        fontSize: '13px',
                                                                        fontWeight: 500,
                                                                        color: isActive(subItem.path) ? '#C8A96A' : '#C8A96A'
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                    </StyledListItemButton>
                                                ))}
                                                <StyledListItemButton
                                                    sx={{ pl: 4 }}
                                                    onClick={() => handleNavigation('/my-account')}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#C8A96A' }}>
                                                        <DashboardIcon fontSize="small" />
                                                        <ListItemText
                                                            primary="Dashboard Home"
                                                            sx={{
                                                                '& .MuiTypography-root': {
                                                                    fontFamily: '"Poppins", "Roboto", sans-serif',
                                                                    fontSize: '13px',
                                                                    fontWeight: 500,
                                                                    color: isActive('/my-account') ? '#C8A96A' : '#C8A96A'
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                </StyledListItemButton>
                                            </List>
                                        </Collapse>
                                    </ListItem>
                                    <LoginButton
                                        onClick={handleLogout}
                                        sx={{ ml: 0, width: '100%', borderColor: '#d32f2f', color: '#d32f2f', mt: 1 }}
                                    >
                                        <LogoutIcon sx={{ mr: 1 }} />
                                        Logout
                                    </LoginButton>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <RegisterButton onClick={() => handleNavigation('/register')} sx={{ ml: 0, width: '100%' }}>
                                Register
                            </RegisterButton>
                            <LoginButton onClick={() => handleNavigation('/login')} sx={{ ml: 0, width: '100%' }}>
                                Login
                            </LoginButton>
                        </>
                    )}
                </Box>
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <StyledAppBar position="fixed">
                <Container maxWidth={false} sx={{ px: { xs: 2, sm: 2.5, lg: 3 } }}>
                    <Toolbar disableGutters sx={{
                        height: '100%',
                        position: 'relative',
                        justifyContent: { xs: 'space-between', lg: 'center' },
                        gap: { lg: 3, xl: 4 }
                    }}>

                        {/* LEFT SPACER (MOBILE/TABLET) */}
                        <Box
                            sx={{
                                display: { xs: 'flex', lg: 'none' },
                                width: { xs: '64px', sm: '68px' },
                                flexShrink: 0,
                            }}
                        />

                        {/* LEFT - NAVIGATION (DESKTOP) */}
                        <Box sx={{
                            display: { xs: 'none', lg: 'flex' },
                            alignItems: 'center',
                            gap: { lg: 1, xl: 2 },
                            flexWrap: 'nowrap',
                            justifyContent: 'flex-start'
                        }}>

                            <NavButton
                                className={isActive('/') ? 'active' : ''}
                                onClick={() => handleNavigation('/')}
                            >
                                Home
                            </NavButton>

                            {/* Company Dropdown (Desktop) */}
                            <Box sx={{ position: 'relative' }}>
                                <NavButton
                                    className={isCompanyActive() ? 'active' : ''}
                                    onClick={handleCompanyClick}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                >
                                    Sanyukt Parivaar
                                    <ExpandMore
                                        sx={{
                                            fontSize: '18px',
                                            transform: openCompanyMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s'
                                        }}
                                    />
                                </NavButton>

                                <Menu
                                    anchorEl={anchorElCompany}
                                    open={openCompanyMenu}
                                    onClose={handleCompanyClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    MenuListProps={{
                                        sx: {
                                            padding: '8px',
                                        }
                                    }}
                                    slotProps={{
                                        paper: {
                                            elevation: 0,
                                            sx: {
                                                mt: 1.5,
                                                minWidth: '180px',
                                                boxShadow: '0px 10px 40px rgba(0,0,0,0.6)',
                                                border: '1px solid rgba(201,168,76,0.2)',
                                                borderRadius: '12px',
                                                overflow: 'visible',
                                                '&:before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 24,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: '#1A1A1A',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                    borderTop: '1px solid rgba(201,168,76,0.2)',
                                                    borderLeft: '1px solid rgba(201,168,76,0.2)',
                                                },
                                            }
                                        }
                                    }}
                                    disableScrollLock
                                >
                                    {companySubItems.map((item) => (
                                        <MenuItem
                                            key={item.name}
                                            onClick={() => handleCompanyItemClick(item.path)}
                                            sx={{
                                                fontFamily: '"Poppins", "Roboto", sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: isActive(item.path) ? '#C9A84C' : '#C9A84C',
                                                borderRadius: '8px',
                                                py: 1,
                                                px: 1.5,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(201,168,76,0.1)',
                                                    color: '#C9A84C',
                                                }
                                            }}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>

                            {menuItems.slice(1, -1).map((item) => (
                                <NavButton
                                    key={item.name}
                                    className={isActive(item.path) ? 'active' : ''}
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    {item.name}
                                </NavButton>
                            ))}
                        </Box>

                        {/* CENTER - LOGO */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: { xs: 'absolute', lg: 'static' },
                            left: { xs: '50%', lg: 'auto' },
                            transform: { xs: 'translateX(-50%)', lg: 'none' },
                            width: { xs: 'calc(100% - 112px)', sm: 'auto' },
                            maxWidth: { xs: '230px', sm: '260px', lg: 'none' },
                        }}>
                            <LogoContainer onClick={() => handleNavigation('/')}>
                                {!logoError && (
                                    <LogoImage src="/logo.png" alt="Sanyukt Parivaar Logo" onError={handleLogoError} />
                                )}
                            </LogoContainer>
                        </Box>

                        {/* RIGHT - NAVIGATION (DESKTOP) */}
                        <Box sx={{
                            display: { xs: 'none', lg: 'flex' },
                            alignItems: 'center',
                            gap: { lg: 1, xl: 2 },
                            flexWrap: 'nowrap',
                            justifyContent: 'flex-end'
                        }}>
                            {/* "My Cart" moved to the right side */}
                            {menuItems.slice(-1).map((item) => (
                                <NavButton
                                    key={item.name}
                                    className={isActive(item.path) ? 'active' : ''}
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    {item.name}
                                </NavButton>
                            ))}
                            {/* Franchise Dropdown (Desktop) */}
                            <Box sx={{ position: 'relative' }}>
                                <NavButton
                                    className={isFranchiseActive() ? 'active' : ''}
                                    onClick={handleFranchiseClick}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                                >
                                    Franchise
                                    <ExpandMore
                                        sx={{
                                            fontSize: '18px',
                                            transform: openFranchiseMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s'
                                        }}
                                    />
                                </NavButton>

                                <Menu
                                    anchorEl={anchorElFranchise}
                                    open={openFranchiseMenu}
                                    onClose={handleFranchiseClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    MenuListProps={{
                                        sx: {
                                            padding: '8px',
                                        }
                                    }}
                                    slotProps={{
                                        paper: {
                                            elevation: 0,
                                            sx: {
                                                mt: 1.5,
                                                minWidth: '180px',
                                                boxShadow: '0px 10px 40px rgba(0,0,0,0.6)',
                                                border: '1px solid rgba(201,168,76,0.2)',
                                                borderRadius: '12px',
                                                overflow: 'visible',
                                                '&:before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 24,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: '#1A1A1A',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                    borderTop: '1px solid rgba(201,168,76,0.2)',
                                                    borderLeft: '1px solid rgba(201,168,76,0.2)',
                                                },
                                            }
                                        }
                                    }}
                                    disableScrollLock
                                >
                                    {franchiseSubItems.map((item) => (
                                        <MenuItem
                                            key={item.name}
                                            onClick={() => handleFranchiseItemClick(item.path)}
                                            sx={{
                                                fontFamily: '"Poppins", "Roboto", sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                                color: isActive(item.path) ? '#C9A84C' : '#C9A84C',
                                                borderRadius: '8px',
                                                py: 1,
                                                px: 1.5,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(201,168,76,0.1)',
                                                    color: '#C9A84C',
                                                }
                                            }}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>

                            {trailItems.map((item) => (
                                <NavButton
                                    key={item.name}
                                    className={isActive(item.path) ? 'active' : ''}
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    {item.name}
                                </NavButton>
                            ))}

                            {/* Conditional rendering based on login status and role */}
                            {isLoggedIn ? (
                                <>

                                    {isAdmin() ? (
                                        // Admin View
                                        <AdminDashboardButton
                                            onClick={handleUserMenuClick}
                                            startIcon={<AdminPanelSettingsIcon />}
                                        >
                                            {getDisplayName()}
                                        </AdminDashboardButton>
                                    ) : (
                                        // Regular User View
                                        <MyAccountButton
                                            onClick={handleUserMenuClick}
                                            startIcon={
                                                <Avatar
                                                    src={userData?.profileImage || undefined}
                                                    sx={{ width: 24, height: 24, bgcolor: 'rgba(201,168,76,0.25)', fontSize: 12, fontWeight: 700 }}
                                                >
                                                    {!userData?.profileImage && getUserInitials()}
                                                </Avatar>
                                            }
                                        >
                                            {getDisplayName()}
                                        </MyAccountButton>
                                    )}

                                    <Menu
                                        anchorEl={anchorElUser}
                                        open={openUserMenu}
                                        onClose={handleUserMenuClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        MenuListProps={{
                                            sx: {
                                                padding: '10px',
                                                minWidth: '220px',
                                            }
                                        }}
                                        slotProps={{
                                            paper: {
                                                elevation: 0,
                                                sx: {
                                                    mt: 1.5,
                                                    boxShadow: '0px 10px 40px rgba(0,0,0,0.7)',
                                                    border: '1px solid rgba(201,168,76,0.2)',
                                                    borderRadius: '12px',
                                                    overflow: 'visible',
                                                    '&:before': {
                                                        content: '""',
                                                        display: 'block',
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 28,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: '#1A1A1A',
                                                        transform: 'translateY(-50%) rotate(45deg)',
                                                        zIndex: 0,
                                                        borderTop: '1px solid rgba(201,168,76,0.2)',
                                                        borderLeft: '1px solid rgba(201,168,76,0.2)',
                                                    },
                                                }
                                            }
                                        }}
                                    >
                                        {isAdmin() ? (
                                            // Admin Menu Items
                                            <MenuItem
                                                onClick={handleAdminDashboardClick}
                                                sx={{
                                                    fontFamily: '"Poppins", "Roboto", sans-serif',
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    color: '#C9A84C',
                                                    borderRadius: '4px',
                                                    gap: 1.5,
                                                    py: 1.2,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(201,168,76,0.1)',
                                                        color: '#C9A84C',
                                                    }
                                                }}
                                            >
                                                <DashboardIcon fontSize="small" />
                                                Admin Dashboard
                                            </MenuItem>
                                        ) : (
                                            // Regular User Menu Items
                                            [
                                                { label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/my-account' },
                                                { label: 'My Orders', icon: <ReceiptIcon fontSize="small" />, path: '/my-account/orders' },
                                                { label: 'My Profile', icon: <PersonIcon fontSize="small" />, path: '/my-account/profile' },
                                                { label: 'Transactions', icon: <HistoryIcon fontSize="small" />, path: '/my-account/transactions' },
                                                { label: 'KYC Status', icon: <FingerprintIcon fontSize="small" />, path: '/my-account/kyc' },
                                            ].map((item) => (
                                                <MenuItem
                                                    key={item.label}
                                                    onClick={() => handleNavigation(item.path)}
                                                    sx={{
                                                        fontFamily: '"Poppins", "Roboto", sans-serif',
                                                        fontSize: '14px',
                                                        fontWeight: 500,
                                                        color: '#C9A84C',
                                                        borderRadius: '8px',
                                                        gap: 2,
                                                        py: 1.2,
                                                        px: 1.5,
                                                        mb: 0.5,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(201,168,76,0.1)',
                                                            color: '#C9A84C',
                                                            '& .MuiSvgIcon-root': {
                                                                color: '#C9A84C',
                                                            }
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: '20px',
                                                            color: '#C9A84C',
                                                            transition: 'color 0.2s',
                                                        }
                                                    }}
                                                >
                                                    {item.icon}
                                                    {item.label}
                                                </MenuItem>
                                            ))
                                        )}

                                        <LogoutMenuItem
                                            onClick={handleLogout}
                                            sx={{
                                                fontFamily: '"Poppins", "Roboto", sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                borderRadius: '8px',
                                                gap: 2,
                                                py: 1.2,
                                                px: 1.5,
                                                mt: 0.5,
                                                borderTop: '1px solid rgba(201,168,76,0.2)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: '20px',
                                                }
                                            }}
                                        >
                                            <LogoutIcon />
                                            Logout
                                        </LogoutMenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <>
                                    <RegisterButton onClick={() => handleNavigation('/register')} sx={{ ml: 1 }}>
                                        Register
                                    </RegisterButton>

                                    <LoginButton onClick={() => handleNavigation('/login')} sx={{ ml: 1 }}>
                                        Login
                                    </LoginButton>
                                </>
                            )}
                        </Box>

                        {/* RIGHT - HAMBURGER (MOBILE/TABLET) */}
                        <Box sx={{
                            display: { xs: 'flex', lg: 'none' },
                            width: { xs: '64px', sm: '68px' },
                            flexShrink: 0,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            zIndex: 10,
                            pr: { xs: 0.75, sm: 1 }
                        }}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{
                                    color: '#C9A84C',
                                    p: 1,
                                    mr: { xs: 0.5, sm: 0.75 },
                                }}
                            >
                                <MenuIcon sx={{ fontSize: { xs: '30px', sm: '32px' } }} />
                            </IconButton>
                        </Box>

                    </Toolbar>
                </Container>
            </StyledAppBar>

            {/* Mobile Drawer */}
            <Box component="nav">
                <Drawer
                    variant="temporary"
                    anchor="right"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, backgroundColor: '#111111' },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
};

export default Header;
