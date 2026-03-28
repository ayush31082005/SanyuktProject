import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const TreeNode = ({ node }) => {
    if (!node) return null;

    return (
        <div className="flex flex-col items-center">
            <div
                className={`min-w-[108px] rounded-xl border-2 bg-white p-3 text-center shadow-sm sm:min-w-[120px] ${
                    node.rank === 'Member' ? 'border-slate-200' : 'border-emerald-500'
                }`}
            >
                <div className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
                    {node.memberId}
                </div>
                <div className="max-w-[120px] truncate text-[12px] font-bold text-slate-800">
                    {node.name}
                </div>
                <div className="mt-1 text-[10px] font-black uppercase text-emerald-600">
                    {node.rank}
                </div>
                <div className="mt-2 flex justify-between border-t border-slate-50 pt-2">
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase text-slate-400">L: {node.leftPV}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase text-slate-400">R: {node.rightPV}</span>
                    </div>
                </div>
            </div>

            {node.children && node.children.length > 0 && (
                <div className="flex w-full flex-col items-center">
                    <div className="h-4 w-px bg-slate-200"></div>

                    {node.children.length > 1 && (
                        <div className="h-px w-[55%] bg-slate-200"></div>
                    )}

                    <div className="flex w-full justify-center gap-4 sm:gap-8">
                        {node.children.map((child) => (
                            <div key={child.id} className="flex flex-col items-center">
                                <div className="h-4 w-px bg-slate-200"></div>
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
    const hasDescendants = Array.isArray(treeData?.children) && treeData.children.length > 0;

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                if (!user) return;

                const res = await api.get(`/mlm/binary-tree/${user._id}`);
                setTreeData(res.data);
            } catch (err) {
                console.error('Error fetching tree data:', err);
                toast.error('Failed to load binary tree');
            } finally {
                setLoading(false);
            }
        };

        fetchTree();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-10">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[520px] flex-col rounded-[1.5rem] border border-slate-50 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6 lg:min-h-[600px] lg:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="mb-1 text-[14px] font-black uppercase tracking-[0.15em] text-slate-900">Genealogy Tree</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Visual representation of your network
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                        className="rounded-lg border border-slate-100 p-2 text-slate-400 transition-colors hover:bg-slate-50"
                        aria-label="Zoom out"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <button
                        onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                        className="rounded-lg border border-slate-100 p-2 text-slate-400 transition-colors hover:bg-slate-50"
                        aria-label="Zoom in"
                    >
                        <ZoomIn size={18} />
                    </button>
                    <button
                        onClick={() => setZoom(1)}
                        className="rounded-lg border border-slate-100 p-2 text-slate-400 transition-colors hover:bg-slate-50"
                        aria-label="Reset zoom"
                    >
                        <Maximize size={18} />
                    </button>
                </div>
            </div>

            <div className={`mb-4 rounded-2xl px-4 py-3 text-[11px] font-bold sm:hidden ${hasDescendants ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                {hasDescendants
                    ? 'Swipe left and right to explore the tree. You can also use the zoom controls to adjust the view.'
                    : 'Your tree currently shows only the root profile. Branches will appear here as your network grows.'}
            </div>

            <div
                className={`flex-1 overflow-auto rounded-2xl border border-slate-50 bg-slate-50/30 p-4 sm:p-6 lg:p-10 ${
                    hasDescendants ? '' : 'flex items-center justify-center'
                }`}
            >
                {treeData ? (
                    hasDescendants ? (
                        <div
                            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                            className="inline-flex min-w-max justify-center transition-transform duration-200"
                        >
                            <TreeNode node={treeData} />
                        </div>
                    ) : (
                        <div className="flex w-full max-w-md flex-col items-center justify-center text-center">
                            <div className="mb-5 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-amber-700">
                                Root Node Only
                            </div>
                            <TreeNode node={treeData} />
                            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-4 text-center shadow-sm">
                                <p className="text-sm font-bold text-slate-700">
                                    No left or right member is currently linked to your binary tree.
                                </p>
                                <p className="mt-2 text-xs leading-6 text-slate-500">
                                    As new downline members are added, this tree will automatically expand with new branches here.
                                </p>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="text-center text-slate-400">No tree data available</div>
                )}
            </div>
        </div>
    );
};

export default BinaryTreeView;
