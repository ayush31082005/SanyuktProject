import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import {
    Home, UserPlus, Users, ShoppingCart,
    Gift, Package, Wallet, Folder,
    UserCheck, MessageSquare, LogOut, Menu, X, ChevronDown, Bell, Search, Shield,
    ShoppingBag, Globe
} from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const UserDashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                setUserData(JSON.parse(user));
                fetchStats();
            } catch (error) {
                console.error("Error parsing user data in dashboard layout:", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }

        if (isMobile) {
            setSidebarOpen(false);
        }

        // Global listener for cross-component toggle
        const handleExternalToggle = () => setSidebarOpen(prev => !prev);
        window.addEventListener('toggle-dashboard-sidebar', handleExternalToggle);
        return () => window.removeEventListener('toggle-dashboard-sidebar', handleExternalToggle);
    }, [isMobile, navigate]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/mlm/get-stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching stats in layout:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { name: 'Home', icon: Home, path: '/my-account', id: 'home' },
        { name: 'New Sign Up', icon: UserPlus, path: '/register', id: 'signup' },
        {
            name: 'My Downline',
            icon: Users,
            path: '/my-account/downline',
            id: 'downline',
            badge: stats?.totalDownline || 0,
            children: [
                { name: 'My Directs', path: '/my-account/downline/directs', id: 'downline_directs' },
                { name: 'Left Team', path: '/my-account/downline/left-team', id: 'downline_left' },
                { name: 'Right Team', path: '/my-account/downline/right-team', id: 'downline_right' },
                { name: 'All Team', path: '/my-account/downline/all-team', id: 'downline_all' },
                { name: 'Tree View', path: '/my-account/downline/tree-view', id: 'downline_tree' },
            ],
        },
        { name: 'Product Order', icon: ShoppingCart, path: '/my-account/orders', id: 'orders' },
        {
            name: 'First Purchase Bonus',
            icon: Gift,
            path: '/my-account/bonus/first',
            id: 'first_bonus',
            children: [
                { name: 'Silver Matching', path: '/my-account/bonus/first/silver', id: 'first_silver' },
                { name: 'Gold Matching', path: '/my-account/bonus/first/gold', id: 'first_gold' },
                { name: 'Diamond Matching', path: '/my-account/bonus/first/diamond', id: 'first_diamond' },
            ],
        },
        {
            name: 'Repurchase Bonus',
            icon: Package,
            path: '/my-account/bonus/repurchase',
            id: 'repurchase_bonus',
            children: [
                { name: 'Self Repurchase Income', path: '/my-account/bonus/repurchase/self', id: 'repurchase_self' },
                { name: 'Repurchase Level Income', path: '/my-account/bonus/repurchase/level', id: 'repurchase_level' },
                { name: 'Sponsor Income', path: '/my-account/bonus/repurchase/sponsor', id: 'repurchase_sponsor' },
                { name: 'Royalty Bonus', path: '/my-account/bonus/repurchase/royalty', id: 'repurchase_royalty' },
                { name: 'Director Bonus', path: '/my-account/bonus/repurchase/director', id: 'repurchase_director' },
                { name: 'House Fund', path: '/my-account/bonus/repurchase/house', id: 'repurchase_house' },
                { name: 'Leadership Fund', path: '/my-account/bonus/repurchase/leadership', id: 'repurchase_leadership' },
                { name: 'Car Fund', path: '/my-account/bonus/repurchase/car', id: 'repurchase_car' },
                { name: 'Travel Fund', path: '/my-account/bonus/repurchase/travel', id: 'repurchase_travel' },
                { name: 'Bike Fund', path: '/my-account/bonus/repurchase/bike', id: 'repurchase_bike' },
            ],
        },
        { name: 'Our Products', icon: ShoppingBag, path: '/products', id: 'shop' },
        {
            name: 'E-Wallet',
            icon: Wallet,
            path: '/my-account/wallet',
            id: 'wallet',
            badge: stats?.walletBalance ? `₹${stats.walletBalance}` : null,
            children: [
                { name: 'Deduction Report', path: '/my-account/wallet/deduction-report', id: 'wallet_deduction' },
                { name: 'Withdrawal History', path: '/my-account/wallet/withdrawal-history', id: 'wallet_withdrawal' },
                { name: 'All Transaction Report', path: '/my-account/wallet/all-transactions', id: 'wallet_all_txn' },
                { name: 'Daily Closing Report', path: '/my-account/wallet/daily-closing', id: 'wallet_daily' },
            ],
        },
        {
            name: 'Generation Wallet',
            icon: Wallet,
            path: '/my-account/wallet/generation',
            id: 'gen_wallet',
            children: [
                { name: 'Deduction Report', path: '/my-account/wallet/generation/deduction-report', id: 'gen_deduction' },
                { name: 'Withdrawal History', path: '/my-account/wallet/generation/withdrawal-history', id: 'gen_withdrawal' },
                { name: 'All Transaction Report', path: '/my-account/wallet/generation/all-transactions', id: 'gen_all_txn' },
                { name: 'Monthly Closing Report', path: '/my-account/wallet/generation/monthly-closing', id: 'gen_monthly' },
            ],
        },
        {
            name: 'My Folder',
            icon: Folder,
            path: '/my-account/folder',
            id: 'folder',
            children: [
                { name: 'Welcome Letter', path: '/my-account/folder/welcome-letter', id: 'folder_welcome' },
                { name: 'Download Files', path: '/my-account/folder/download-files', id: 'folder_downloads' },
                { name: 'Our Banker', path: '/my-account/folder/our-banker', id: 'folder_banker' },
                { name: 'ID Card', path: '/my-account/folder/id-card', id: 'folder_id' },
            ],
        },
        { name: 'Profile & KYC', icon: UserCheck, path: '/my-account/profile', id: 'profile' },
        { name: 'Submit Complain', icon: MessageSquare, path: '/my-account/grievances', id: 'grievance' },
    ];

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 h-[calc(100vh-60px)] md:h-[calc(100vh-80px)] top-[60px] md:top-[80px] bg-[#0A7A2F] text-white transition-all duration-300 z-50 shadow-none overflow-y-auto no-scrollbar
                    ${sidebarOpen ? 'w-72' : 'w-0 md:w-20 overflow-hidden'}`}
            >
                <div className={`flex flex-col h-full transition-all duration-300 ${sidebarOpen ? 'p-6' : 'p-0 py-6'}`}>
                    {/* Brand / Logo Area */}
                    <div className={`flex items-center mb-10 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
                        <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'flex-col space-y-4'}`}>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all active:scale-95
                                    ${sidebarOpen ? 'bg-white/5 hover:bg-white/10' : 'bg-white/20 hover:bg-white/30'}`}
                                title={sidebarOpen ? "Toggle Menu" : "Open Menu"}
                            >
                                {sidebarOpen ? <Shield className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                            </button>
                            {sidebarOpen && (
                                <Link to="/" className="leading-none text-white hover:opacity-80 transition-opacity flex flex-col pt-1">
                                    <h2 className="font-black text-2xl whitespace-nowrap uppercase tracking-tighter">SANYUKT</h2>
                                    <p className="text-[10px] text-white/80 uppercase tracking-[0.4em] font-black -mt-0.5">Parivaar</p>
                                </Link>
                            )}
                        </div>
                        {sidebarOpen && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-xl hover:bg-black/10 text-white transition-all"
                                title="Close Menu"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Profile Summary in Sidebar */}
                    {sidebarOpen && (
                        <div className="mb-10 text-center px-4">
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 rounded-full border-2 border-white/20 p-1 bg-[#096628] overflow-hidden">
                                    <img
                                        src={userData.profileImage || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80"}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-orange-500 border-2 border-[#0A7A2F] rounded-full"></div>
                            </div>
                            <h3 className="font-black text-lg leading-tight uppercase tracking-wide text-white">{userData.userName}</h3>
                            <div className="flex flex-col gap-1 mt-2">
                                <p className="text-[11px] text-white/90 font-black tracking-widest uppercase">Member ID: {userData.memberId || 'SPRL0000'}</p>
                                <div className="flex items-center justify-center gap-2 text-white/90">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Live Support</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Menu */}
                    <nav className="flex-1 space-y-1">
                        {menuItems.map((item) => {
                            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                            const isActiveDirect = location.pathname === item.path || (item.path === '/my-account' && location.pathname === '/my-account/');
                            const isChildActive = hasChildren && item.children.some(child => location.pathname === child.path);
                            const active = isActiveDirect || isChildActive;

                            return (
                                <div key={item.id} className="w-full">
                                    <button
                                        onClick={() => {
                                            if (hasChildren && sidebarOpen) {
                                                setOpenDropdown(prev => prev === item.id ? null : item.id);
                                            } else {
                                                navigate(item.path);
                                                if (isMobile) setSidebarOpen(false);
                                            }
                                        }}
                                        className={`relative w-full flex items-center transition-all duration-300 group
                                            ${sidebarOpen
                                                ? 'px-4 mx-0 rounded-xl space-x-3 mb-1 h-12 !justify-start'
                                                : 'mx-2.5 rounded-[1.5rem] mb-3 h-14 justify-center'
                                            }
                                            ${active
                                                ? 'bg-white text-[#0A7A2F] shadow-lg shadow-black/5'
                                                : 'text-white/90 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <item.icon className={`shrink-0 transition-transform duration-300 ${sidebarOpen ? 'w-5 h-5' : 'w-6 h-6'} 
                                            ${active ? 'text-[#0A7A2F]' : 'group-hover:scale-110'}`} />

                                        {sidebarOpen && (
                                            <div className="flex items-center justify-between flex-1 overflow-hidden">
                                                <span className="font-bold text-[13px] whitespace-nowrap">{item.name}</span>
                                                <div className="flex items-center gap-2">
                                                    {item.badge && (
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-black
                                                            ${active ? 'bg-orange-600 text-white' : 'bg-white/20 text-white'}`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    {hasChildren && (
                                                        <ChevronDown
                                                            size={14}
                                                            className={`transition-transform duration-300 ${openDropdown === item.id ? 'rotate-180' : ''}`}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {!sidebarOpen && (
                                            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-xl border border-white/10 pointer-events-none">
                                                {item.name}
                                                {item.badge && <span className="ml-2 bg-orange-500 px-1 rounded text-[9px]">{item.badge}</span>}
                                            </div>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {hasChildren && sidebarOpen && openDropdown === item.id && (
                                        <div className="ml-12 mr-4 border-l border-white/20 mb-2 py-1 space-y-1">
                                            {item.children.map((child) => {
                                                const childActive = location.pathname === child.path;
                                                return (
                                                    <Link
                                                        key={child.id}
                                                        to={child.path}
                                                        onClick={() => isMobile && setSidebarOpen(false)}
                                                        className={`block px-4 py-1.5 text-[12px] rounded-lg transition-all ${childActive
                                                                ? 'text-white font-black bg-white/10'
                                                                : 'text-white/85 hover:text-white hover:bg-white/5 font-bold'
                                                            }`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    <div className={`mt-auto pt-6 ${sidebarOpen ? '' : 'px-2'}`}>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center h-12 rounded-xl transition-all group w-full
                                ${sidebarOpen ? 'px-4 space-x-3 text-white/90 hover:text-orange-400 hover:bg-white/5' : 'justify-center text-white/90 hover:text-orange-400 hover:bg-white/5'}`}
                        >
                            <LogOut className={`shrink-0 ${sidebarOpen ? 'w-5 h-5' : 'w-6 h-6'}`} />
                            {sidebarOpen && <span className="font-bold text-[13px]">Logout</span>}

                            {!sidebarOpen && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-xl border border-white/10 pointer-events-none">
                                    Logout
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className={`flex-1 flex flex-col transition-all duration-300 min-h-[calc(100vh-80px)]
                    ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}
            >
                <div className="flex-1 px-4 md:px-8 pb-8 pt-0 animate-fadeIn relative">
                    {/* Mobile Menu Action Bar - Only visible when sidebar is closed on mobile */}
                    {!sidebarOpen && isMobile && (
                        <div className="py-5 mb-4 flex items-center space-x-4 text-[#0A7A2F] md:hidden">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="w-14 h-14 flex items-center justify-center bg-white shadow-xl shadow-black/5 border border-slate-100 rounded-[2rem] active:scale-95 transition-all text-[#0A7A2F]"
                            >
                                <Menu size={28} />
                            </button>
                            <div className="flex flex-col leading-none">
                                <span className="font-black text-2xl tracking-tighter uppercase">Menu</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation</span>
                            </div>
                        </div>
                    )}
                    <Outlet />
                </div>
            </main>

            {/* Global Overlay for mobile when sidebar is open */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-[#0A7A2F]/20 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default UserDashboardLayout;
