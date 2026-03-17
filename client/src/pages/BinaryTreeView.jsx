import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ChevronDown, ChevronRight, Search, ZoomIn, ZoomOut, Maximize, User, ShieldCheck, Award, Star } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const RankBadge = ({ rank }) => {
    const configs = {
        "Member": { color: "slate", icon: User },
        "Bronze": { color: "orange", icon: Award },
        "Silver": { color: "gray", icon: Award },
        "Gold": { color: "yellow", icon: Star },
        "Platinum": { color: "blue", icon: ShieldCheck },
        "Diamond": { color: "indigo", icon: ShieldCheck },
        "MD": { color: "emerald", icon: ShieldCheck }
    };
    
    // Fallback logic
    const config = configs[rank] || { color: "emerald", icon: Award };
    const Icon = config.icon;
    
    return (
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider
            bg-${config.color}-50 border-${config.color}-200 text-${config.color}-600 shadow-sm`}>
            <Icon size={10} className="shrink-0" />
            {rank}
        </div>
    );
};

const TreeNode = ({ node }) => {
    if (!node) return null;

    return (
        <div className="flex flex-col items-center relative">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative z-10"
            >
                <div className={`p-5 rounded-[2rem] border shadow-2xl backdrop-blur-md text-center min-w-[200px] transition-all duration-500
                    ${node.rank === 'Member' 
                        ? 'bg-white/80 border-slate-200/50' 
                        : 'bg-gradient-to-br from-emerald-50 to-white/90 border-emerald-200/50'
                    }`}
                >
                    {/* User Avatar Circle */}
                    <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 mb-3 border-4 border-white shadow-inner flex items-center justify-center overflow-hidden">
                        {node.profileImage ? (
                            <img src={node.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-slate-400 font-black text-xl">{node.name?.charAt(0)}</div>
                        )}
                    </div>

                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                        {node.memberId}
                    </div>
                    <div className="text-[15px] font-black text-slate-900 truncate mb-2">
                        {node.name}
                    </div>
                    
                    <div className="flex justify-center mb-4">
                        <RankBadge rank={node.rank} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100">
                        <div className="flex flex-col bg-slate-50 p-2 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Left PV</span>
                            <span className="text-[12px] font-black text-emerald-600">{node.leftPV || 0}</span>
                        </div>
                        <div className="flex flex-col bg-slate-50 p-2 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Right PV</span>
                            <span className="text-[12px] font-black text-emerald-600">{node.rightPV || 0}</span>
                        </div>
                    </div>
                </div>
                
                {/* Decorative pulse for high ranking members */}
                {node.rank !== 'Member' && (
                    <div className="absolute inset-0 rounded-[2rem] bg-emerald-400/10 animate-ping -z-10 blur-xl"></div>
                )}
            </motion.div>

            {node.children && node.children.length > 0 && (
                <div className="flex flex-col items-center w-full mt-10">
                    {/* Connection lines handled by SVG or simple divs */}
                    <div className="h-10 w-0.5 bg-gradient-to-b from-slate-200 to-slate-100 -mt-10 mb-0"></div>
                    
                    <div className="flex justify-center gap-16 w-full relative">
                        {/* Horizontal Bridge Line */}
                        {node.children.length > 1 && (
                            <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-slate-200 rounded-full"></div>
                        )}
                        
                        {node.children.map((child, index) => (
                            <div key={child.id} className="flex flex-col items-center">
                                <div className="h-10 w-0.5 bg-slate-200"></div>
                                <TreeNode node={child} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const BinaryTreeView = () => {
    const [treeData, setTreeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                if (!user) return;

                const res = await api.get(`/mlm/binary-tree/${user._id}`);
                setTreeData(res.data);
            } catch (err) {
                console.error("Error fetching tree data:", err);
                toast.error("Failed to load binary tree");
            } finally {
                setLoading(false);
            }
        };

        fetchTree();
    }, []);

    if (loading) return (
        <div className="p-10 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="bg-white rounded-[3rem] p-4 md:p-10 shadow-2xl border border-slate-100 overflow-hidden min-h-[700px] flex flex-col relative">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(#000 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 relative z-10">
                <div className="text-center md:text-left">
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-emerald-100">
                        Network Overview
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2 italic">Genealogy Tree</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Explore and manage your binary network</p>
                </div>
                
                {/* Sleek Floating Toolbar */}
                <div className="flex items-center gap-1 bg-white/50 backdrop-blur-xl p-2 rounded-3xl border border-slate-200 shadow-xl">
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} 
                        className="p-3 hover:bg-slate-100 rounded-2xl text-slate-600 transition-all active:scale-90" title="Zoom Out">
                        <ZoomOut size={20} />
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button onClick={() => setZoom(1)} 
                        className="px-4 py-3 hover:bg-slate-100 rounded-2xl text-[12px] font-black text-slate-600 uppercase transition-all active:scale-95">
                        {Math.round(zoom * 100)}%
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-1"></div>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} 
                        className="p-3 hover:bg-slate-100 rounded-2xl text-slate-600 transition-all active:scale-90" title="Zoom In">
                        <ZoomIn size={20} />
                    </button>
                    <button onClick={() => setZoom(1)} 
                        className="p-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl text-white transition-all shadow-lg shadow-emerald-200 active:scale-90 ml-1">
                        <Maximize size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-12 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 inner-shadow custom-scrollbar relative z-10">
                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="transition-transform duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)]">
                    {treeData ? <TreeNode node={treeData} /> : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 italic">
                            <Users size={48} className="mb-4 opacity-20" />
                            <p className="font-bold uppercase tracking-widest text-[11px]">No network structure found</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .inner-shadow {
                    box-shadow: inset 0 2px 20px 0 rgba(0,0,0,0.02);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};

export default BinaryTreeView;
