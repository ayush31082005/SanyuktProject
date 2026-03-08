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
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUserData(JSON.parse(user));
        } else {
            navigate('/login');
        }

        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [isMobile, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { name: 'Home', icon: Home, path: '/my-account', id: 'home' },
        { name: 'New Sign Up', icon: UserPlus, path: '/register', id: 'signup' },
        { name: 'My Downline', icon: Users, path: '/my-account/downline', id: 'downline', badge: 5 },
        { name: 'Product Order', icon: ShoppingCart, path: '/my-account/orders', id: 'orders', badge: 6 },
        { name: 'First Purchase Bonus', icon: Gift, path: '/my-account/bonus/first', id: 'first_bonus', badge: 3 },
        { name: 'Repurchase Bonus', icon: Package, path: '/my-account/bonus/repurchase', id: 'repurchase_bonus', badge: 10 },
        { name: 'Our Products', icon: ShoppingBag, path: '/products', id: 'shop' },
        { name: 'E-Wallet', icon: Wallet, path: '/my-account/wallet', id: 'wallet', badge: 4 },
        { name: 'Generation Wallet', icon: Wallet, path: '/my-account/wallet/generation', id: 'gen_wallet', badge: 4 },
        { name: 'My Folder', icon: Folder, path: '/my-account/folder', id: 'folder', badge: 4 },
        { name: 'Profile & KYC', icon: UserCheck, path: '/my-account/profile', id: 'profile', badge: 4 },
        { name: 'Submit Complain', icon: MessageSquare, path: '/my-account/grievances', id: 'grievance', badge: 2 },
    ];

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-white flex">
            {/* Sidebar */}
            <aside 
                className={`fixed left-0 h-[calc(100vh-60px)] md:h-[calc(100vh-80px)] top-[60px] md:top-[80px] bg-[#0A7A2F] text-white transition-all duration-300 z-50 shadow-none overflow-y-auto no-scrollbar
                    ${sidebarOpen ? 'w-72' : 'w-0 md:w-20 overflow-hidden'}`}
            >
                <div className="p-6 flex flex-col h-full">
                    {/* Brand / Logo Area */}
                    <Link to="/" className="flex items-center space-x-3 mb-10 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        {sidebarOpen && (
                            <div className="leading-tight text-white">
                                <h2 className="font-bold text-lg whitespace-nowrap">SANYUKT</h2>
                                <p className="text-[10px] text-white/70 uppercase tracking-widest">Parivaar</p>
                            </div>
                        )}
                    </Link>

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
                                <p className="text-[10px] text-white/50 font-black tracking-widest uppercase">Member ID: {userData.memberId || 'SPRL0000'}</p>
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
                            const active = location.pathname === item.path || (item.path === '/my-account' && location.pathname === '/my-account/');
                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${active ? 'bg-white text-[#0A7A2F]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                                >
                                    <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-[#0A7A2F]' : 'group-hover:text-white'}`} />
                                    {sidebarOpen && (
                                        <div className="flex items-center justify-between flex-1 overflow-hidden">
                                            <span className="font-bold text-[13px] whitespace-nowrap">{item.name}</span>
                                            {item.badge && (
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black
                                                    ${active ? 'bg-orange-600 text-white' : 'bg-white/10 text-white/50'}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout at bottom */}
                    <div className="mt-auto pt-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-white/50 hover:text-orange-400 hover:bg-white/5 rounded-xl transition-all"
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            {sidebarOpen && <span className="font-bold text-[13px]">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main 
                className={`flex-1 flex flex-col transition-all duration-300 min-h-[calc(100vh-80px)]
                    ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}
            >
                {/* Dashboard Sub-Header (Toggle Only) */}
                <div className="h-12 bg-white flex items-center px-6 border-b border-gray-100">
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-black flex items-center gap-2"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0A7A2F]">{sidebarOpen ? 'Close Menu' : 'Open Menu'}</span>
                    </button>
                    <div className="ml-auto flex items-center gap-4">
                         <span className="text-[10px] font-black text-[#0A7A2F] uppercase tracking-[0.2em] hidden sm:block">Dashboard Mode</span>
                         <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    </div>
                </div>

                {/* Dynamic Page Content */}
                <div className="flex-1 animate-fadeIn">
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
