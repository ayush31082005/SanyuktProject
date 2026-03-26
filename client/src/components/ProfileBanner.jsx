import React from 'react';
import { motion } from 'framer-motion';
import {
    Users, Calendar, Star, Activity,
    Copy, Mail, Map, Award, User,
    Shield, Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileBanner = ({ userData }) => {
    if (!userData) return null;

    const copyToClipboard = async (text) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }
        toast.success(`Copied to clipboard!`, {
            style: {
                borderRadius: '12px',
                background: '#0f172a',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600'
            },
        });
    };

    const details = [
        { label: "Sponsor ID", value: userData.sponsorId || 'Not Set', icon: Users },
        { label: "Joining Date", value: userData.joinDate ? new Date(userData.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'), icon: Calendar },
        { label: "Current Rank", value: userData.rank || 'Member', icon: Award },
        { label: "Member Status", value: userData.activeStatus ? 'Active' : 'Inactive', icon: Activity },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-[#1A1A1A] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative"
        >
            {/* Minimalist Top Accent */}
            <div className="h-1 w-full bg-white/10"></div>

            <div className="p-6 lg:p-10 flex flex-col gap-8">
                {/* Tier 1: Identity Focus */}
                <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10">
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-xl border-4 border-[#1A1A1A] ring-1 ring-white/10 bg-slate-800">
                            <img
                                src={userData.profileImage || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&h=400&q=80"}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col text-center md:text-left gap-2 flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase">
                                {userData.userName}
                            </h1>
                        </div>
                        <div className="flex flex-col items-center md:items-start leading-tight space-y-1">
                            <span className="text-[15px] font-black text-[#C8A96A] uppercase tracking-[0.2em]">
                                Premium Membership
                            </span>
                            <span className="text-[14px] font-bold text-gray-400 tracking-wide">
                                {userData.email}
                            </span>
                            <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <Award size={12} className="text-[#C8A96A]" />
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                    {userData.position || 'Right Wing'} Position
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tier 2: Official Identification */}
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#C8A96A]/10 text-[#C8A96A] border border-[#C8A96A]/20 mb-1">
                            <Shield size={14} className="fill-[#C8A96A]/10" />
                            <span className="text-[11px] font-black uppercase tracking-widest">{userData.status || 'Verified Active'}</span>
                        </div>
                        <span className="text-[12px] font-black text-gray-500 uppercase tracking-[0.25em]">Member ID</span>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl lg:text-3xl font-black text-white tracking-tighter">
                                {userData.memberId}
                            </span>
                            <button
                                onClick={() => copyToClipboard(userData.memberId)}
                                className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:text-[#C8A96A] hover:bg-white/10 hover:shadow-lg transition-all border border-white/10 active:scale-95"
                                title="Copy Member ID"
                            >
                                <Copy size={22} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tier 3: Logistic Details (Clean Grid) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-white/10">
                    {details.slice(0, 4).map((item, idx) => ( // Using slice(0,4) to match the original 4 items
                        <div key={idx} className="flex flex-col gap-2 group cursor-default">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-[#C8A96A]/10 group-hover:text-[#C8A96A] transition-all">
                                    <item.icon size={16} />
                                </div>
                                <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                                    {item.label}
                                </span>
                            </div>
                            <span className="text-[18px] lg:text-[20px] font-black text-white tracking-tight group-hover:text-[#C8A96A] transition-colors truncate pl-10">
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5"></div>
        </motion.div>
    );
};

export default ProfileBanner;
