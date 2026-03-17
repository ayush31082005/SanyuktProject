import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import api, { API_URL } from '../api';
import {
    Home, UserPlus, Users, ShoppingCart,
    Gift, Package, Wallet, Folder,
    UserCheck, MessageSquare, LogOut, Menu, X, ChevronDown, Bell, Search, Shield,
    ShoppingBag, Globe, Trophy, Monitor, LogIn, Network, Briefcase, Tag, Mail
} from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ── Rank color helper ─────────────────────────────────────────────────────────
const getRankColor = (rank) => {
    const colors = {
        "Member": "#94a3b8", "Bronze": "#cd7f32", "Silver": "#64748b",
        "Gold": "#d97706", "Platinum": "#3b82f6", "Star": "#8b5cf6",
        "Ruby": "#ef4444", "Sapphire": "#06b6d4", "Star Sapphire": "#0ea5e9",
        "Emerald": "#10b981", "Diamond": "#0A7A2F", "MD": "#FFD700",
    };
    return colors[rank] || "#94a3b8";
};

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

        const handleExternalToggle = () => setSidebarOpen(prev => !prev);
        window.addEventListener('toggle-dashboard-sidebar', handleExternalToggle);
        return () => window.removeEventListener('toggle-dashboard-sidebar', handleExternalToggle);
    }, [isMobile, navigate]);

    const fetchStats = async () => {
        try {
            const response = await api.get('/mlm/get-stats');
            if (response.data) {
                setStats(response.data);
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
        { id: 'home', name: 'Home', icon: Monitor, path: '/my-account' },
        { id: 'signup', name: 'New Sign Up', icon: LogIn, path: '/register' },
        {
            id: 'downline',
            name: 'My Downline',
            icon: Users,
            path: '/my-account/downline',
            badge: stats?.totalDownline || '0',
            badgeColor: 'bg-[#EF4444]',
            children: [
                { name: 'My Directs', path: '/my-account/downline/directs', id: 'downline_directs' },
                { name: 'Left Team', path: '/my-account/downline/left-team', id: 'downline_left' },
                { name: 'Right Team', path: '/my-account/downline/right-team', id: 'downline_right' },
                { name: 'All Team', path: '/my-account/downline/all-team', id: 'downline_all' },
                { name: 'Tree View', path: '/my-account/downline/tree-view', id: 'downline_tree' },
            ],
        },
        { id: 'orders', name: 'Product Order', icon: ShoppingCart, path: '/my-account/orders', badge: stats?.totalOrders || '0', badgeColor: 'bg-[#F7931E]' },
        {
            id: 'first_bonus',
            name: 'First Purchase Bonus',
            icon: Briefcase,
            path: '/my-account/bonus/first',
            badge: '0',
            badgeColor: 'bg-[#10B981]',
            children: [
                { name: 'Active Package', path: '/my-account/bonus/first', id: 'first_active' },
                { name: 'Silver Matching', path: '/my-account/bonus/first/silver', id: 'first_silver' },
                { name: 'Gold Matching', path: '/my-account/bonus/first/gold', id: 'first_gold' },
                { name: 'Diamond Matching', path: '/my-account/bonus/first/diamond', id: 'first_diamond' },
            ],
        },
        {
            id: 'repurchase_bonus',
            name: 'Repurchase Bonus',
            icon: Briefcase,
            path: '/my-account/bonus/repurchase/self',
            badge: '0',
            badgeColor: 'bg-[#10B981]',
        },
        {
            id: 'wallet',
            name: 'E-Wallet',
            icon: Briefcase,
            path: '/my-account/wallet',
            badge: stats?.walletBalance ? `₹${Number(stats.walletBalance).toFixed(2)}` : '0',
            badgeColor: 'bg-[#3B82F6]',
            children: [
                { name: 'Deduction Report', path: '/my-account/wallet/deduction-report', id: 'wallet_deduction' },
                { name: 'Withdrawal History', path: '/my-account/wallet/withdrawal-history', id: 'wallet_withdrawal' },
                { name: 'All Transaction Report', path: '/my-account/wallet/all-transactions', id: 'wallet_all_txn' },
                { name: 'Daily Closing Report', path: '/my-account/wallet/daily-closing', id: 'wallet_daily' },
                { name: 'Wallet TopUP', path: '/my-account/wallet/topup', id: 'wallet_topup' },
                { name: 'Wallet Request', path: '/my-account/wallet/withdrawal-request', id: 'wallet_request' },
            ],
        },
        // ✅ MY RANK — naya menu item
        {
            name: 'My Rank',
            icon: Trophy,
            path: '/my-account/rank',
            id: 'my_rank',
            rankBadge: stats?.rank || 'Member',
        },
        {
            id: 'gen_wallet',
            name: 'Generation Wallet',
            icon: Briefcase,
            path: '/my-account/wallet/generation',
            badge: '0',
            badgeColor: 'bg-[#3B82F6]',
        },
        {
            id: 'folder',
            name: 'My Folder',
            icon: Tag,
            path: '/my-account/folder',
            badge: '0',
            badgeColor: 'bg-[#F7931E]',
            children: [
                { name: 'Welcome Letter', path: '/my-account/folder/welcome-letter', id: 'folder_welcome' },
                { name: 'Our Banker', path: '/banker', id: 'folder_banker' },
                { name: 'ID Card', path: '/my-account/folder/id-card', id: 'folder_id' },
            ],
        },
        { id: 'profile', name: 'Profile & KYC', icon: UserCheck, path: '/my-account/profile', badge: '0', badgeColor: 'bg-[#10B981]' },
        { id: 'grievance', name: 'Submit Complain', icon: Mail, path: '/my-account/grievances', badge: '0', badgeColor: 'bg-[#3B82F6]' },
    ];
    ;

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 h-[calc(100vh-60px)] md:h-[calc(100vh-80px)] top-[60px] md:top-[80px] bg-[#0A7A2F] text-white transition-all duration-300 z-50 shadow-none overflow-y-auto no-scrollbar
                    ${sidebarOpen ? 'w-72' : 'w-0 md:w-20 overflow-hidden'}`}
            >
                <div className={`flex flex-col h-full transition-all duration-300 ${sidebarOpen ? 'p-0' : 'p-0 py-6'}`}>
                    {/* Brand / Logo Area */}
                    <div className={`flex items-center mb-6 pt-6 ${sidebarOpen ? 'px-6 justify-between' : 'justify-center'}`}>
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
                    </div>

                    {/* Highly Compact Profile Summary */}
                    {sidebarOpen && (
                        <div className="mb-6 px-6 flex items-center gap-4">
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-full border-2 border-white/20 p-0.5 bg-[#096628] overflow-hidden">
                                    <img
                                        src={userData.profileImage || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80"}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-orange-500 border-2 border-[#0A7A2F] rounded-full"></div>
                            </div>
                            <div className="overflow-hidden flex-1">
                                <h3 className="font-black text-sm uppercase tracking-wide text-white truncate">{userData.userName}</h3>
                                <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">{userData.memberId || 'SPRL0000'}</p>

                                {/* ✅ RANK BADGE — click karo rank page pe jao */}
                                <button
                                    onClick={() => navigate('/my-account/rank')}
                                    className="flex items-center justify-center gap-1.5 mt-1 px-3 py-1 rounded-full transition-all active:scale-95 hover:opacity-90 w-fit"
                                    style={{
                                        backgroundColor: getRankColor(stats?.rank || 'Member') + '25',
                                        border: `1px solid ${getRankColor(stats?.rank || 'Member')}50`,
                                    }}
                                >
                                    <Trophy size={11} style={{ color: getRankColor(stats?.rank || 'Member') }} />
                                    <span
                                        className="text-[10px] font-black uppercase tracking-wider"
                                        style={{ color: getRankColor(stats?.rank || 'Member') }}
                                    >
                                        {stats?.rank || 'Member'}
                                    </span>
                                </button>

                                <div className="flex items-center gap-2 text-white/90 mt-1">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Live Support</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Menu */}
                    <nav className="flex-1">
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
                                        className={`relative w-full flex items-center transition-all duration-300 group border-b border-[#096628]
                                            ${sidebarOpen
                                                ? 'px-5 h-16 !justify-start'
                                                : 'h-16 justify-center'
                                            }
                                            ${active
                                                ? 'bg-[#096628] text-white shadow-inner'
                                                : 'text-white hover:bg-[#096628]'}`}
                                    >
                                        <item.icon className={`${sidebarOpen ? 'w-7 h-7 mr-4' : 'w-7 h-7'} text-white shrink-0 transition-transform duration-300 group-hover:scale-110`} strokeWidth={2.5} />

                                        {sidebarOpen && (
                                            <div className="flex items-center justify-between flex-1 overflow-hidden">
                                                <span className="font-bold text-[17px] tracking-tight whitespace-nowrap">{item.name}</span>
                                                <div className="flex items-center gap-2">
                                                    {/* ✅ Rank badge in menu item */}
                                                    {item.rankBadge && (
                                                        <span
                                                            className="text-[9px] px-2 py-0.5 rounded-full font-black"
                                                            style={{
                                                                backgroundColor: getRankColor(item.rankBadge) + '30',
                                                                color: active ? getRankColor(item.rankBadge) : '#fff',
                                                                border: `1px solid ${getRankColor(item.rankBadge)}60`,
                                                            }}
                                                        >
                                                            {item.rankBadge}
                                                        </span>
                                                    )}
                                                    {item.badge !== undefined && item.badge !== null && (
                                                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-black text-white ${item.badgeColor || 'bg-white/20'}`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    {hasChildren && (
                                                        <ChevronDown
                                                            size={18}
                                                            className={`text-white/70 transition-transform duration-300 ${openDropdown === item.id ? 'rotate-180' : ''}`}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {!sidebarOpen && (
                                            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-xl border border-white/10 pointer-events-none">
                                                {item.name}
                                                {item.badge && <span className="ml-2 bg-orange-500 px-1 rounded text-[9px]">{item.badge}</span>}
                                                {item.rankBadge && <span className="ml-2 bg-white/20 px-1 rounded text-[9px]">{item.rankBadge}</span>}
                                            </div>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {hasChildren && sidebarOpen && openDropdown === item.id && (
                                        <div className="bg-black/20 py-1.5 space-y-0.5 mx-2 rounded-2xl border border-white/5 my-1">
                                            {item.children.map((child) => {
                                                const childActive = location.pathname === child.path;
                                                return (
                                                    <Link
                                                        key={child.id}
                                                        to={child.path}
                                                        onClick={() => isMobile && setSidebarOpen(false)}
                                                        className={`block pl-12 pr-4 py-2 text-[13px] transition-all rounded-xl mx-2 ${childActive
                                                            ? 'text-emerald-400 font-bold bg-emerald-500/10'
                                                            : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
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

                        {/* Logout at the end of the menu */}
                        <div className="w-full">
                            <button
                                onClick={handleLogout}
                                className={`relative w-full flex items-center transition-all duration-300 group
                                    ${sidebarOpen ? 'px-6 h-12 !justify-start mb-6' : 'h-16 justify-center'}
                                    text-slate-400 hover:text-white hover:bg-white/5`}
                            >
                                <LogOut className={`${sidebarOpen ? 'w-5 h-5 mr-3' : 'w-6 h-6'} shrink-0 transition-all group-hover:text-emerald-400`} strokeWidth={2} />
                                {sidebarOpen && <span className="font-bold text-[14px] tracking-wide">Logout Account</span>}
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-xl border border-white/10 pointer-events-none">
                                        Logout
                                    </div>
                                )}
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className={`flex-1 flex flex-col transition-all duration-300 min-h-[calc(100vh-80px)]
                    ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}
            >
                <div className="flex-1 px-4 md:px-8 pb-8 pt-0 animate-fadeIn relative">
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

            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-[#0A7A2F]/20 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                /* Selection Color */
                ::selection { background: #10b98133; color: #10b981; }
            `}</style>
        </div>
    );
};

export default UserDashboardLayout;
