import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const UserTable = ({ title, type, endpoint }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let sourceEndpoint = endpoint || 'mlm/get-stats';

                if (sourceEndpoint.startsWith('/')) {
                    sourceEndpoint = sourceEndpoint.substring(1);
                }

                const res = await api.get(sourceEndpoint);

                if (res.data) {
                    setData(Array.isArray(res.data) ? res.data : []);
                }
            } catch (err) {
                console.error(`Error fetching ${title}:`, err);
                toast.error(`Failed to load ${title}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, title, type]);

    useEffect(() => {
        setPage(1);
    }, [search, data.length]);

    const filteredData = data.filter((item) =>
        Object.values(item).some((val) =>
            String(val).toLowerCase().includes(search.toLowerCase())
        )
    );

    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
    const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const renderMemberStatus = (item) => (
        <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${item.activeStatus ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${item.activeStatus ? 'text-emerald-600' : 'text-slate-400'}`}>
                {item.activeStatus ? 'Active' : 'Inactive'}
            </span>
        </div>
    );

    const renderIncomeCard = (item, idx) => (
        <div
            key={idx}
            className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Record {(page - 1) * itemsPerPage + idx + 1}
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-900">
                        {item.type || 'Income'}
                    </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    {new Date(item.date).toLocaleDateString()}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</p>
                    <p className="mt-1 font-black text-slate-900">Rs. {Number(item.amount || 0).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Source</p>
                    <p className="mt-1 font-bold text-slate-700">{item.fromUserId?.userName || 'System'}</p>
                </div>
            </div>
        </div>
    );

    const renderMemberCard = (item, idx) => (
        <div
            key={idx}
            className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Member {(page - 1) * itemsPerPage + idx + 1}
                    </p>
                    <p className="mt-1 break-words text-sm font-black text-slate-900">
                        {item.userName || 'Unnamed Member'}
                    </p>
                </div>
                {renderMemberStatus(item)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Member ID</p>
                    <p className="mt-1 break-all font-black text-slate-900">{item.memberId || '-'}</p>
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rank</p>
                    <p className="mt-1 break-words font-bold text-slate-700">{item.rank || 'Member'}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-50 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="mb-1 text-[14px] font-black uppercase tracking-[0.15em] text-slate-900">{title}</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Records: {filteredData.length}</p>
                </div>

                <div className="flex w-full items-center gap-3 md:w-auto">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-100 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 md:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="min-h-[400px] flex-1">
                {loading ? (
                    <div className="flex h-full min-h-[400px] items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-emerald-500"></div>
                    </div>
                ) : currentData.length === 0 ? (
                    <div className="flex h-full min-h-[400px] items-center justify-center text-center text-[12px] font-bold uppercase tracking-widest text-slate-400">
                        No records found
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 md:hidden">
                            {currentData.map((item, idx) =>
                                type === 'income' ? renderIncomeCard(item, idx) : renderMemberCard(item, idx)
                            )}
                        </div>

                        <div className="hidden min-h-[400px] overflow-x-auto md:block">
                            <table className="w-full min-w-[720px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">#</th>
                                        {type === 'income' ? (
                                            <>
                                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Source</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Member ID</th>
                                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rank</th>
                                                <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                            </>
                                        )}
                                        <th className="px-4 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((item, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                                            <td className="px-4 py-4 text-[12px] font-bold text-slate-500">{(page - 1) * itemsPerPage + idx + 1}</td>
                                            {type === 'income' ? (
                                                <>
                                                    <td className="px-4 py-4 text-[12px] font-bold text-slate-900">{new Date(item.date).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4">
                                                        <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">{item.type}</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-[12px] font-black text-slate-900">Rs. {Number(item.amount || 0).toFixed(2)}</td>
                                                    <td className="px-4 py-4 text-[12px] font-bold text-slate-500">{item.fromUserId?.userName || 'System'}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-4 py-4 text-[12px] font-black text-slate-900">{item.memberId}</td>
                                                    <td className="px-4 py-4 text-[12px] font-bold text-slate-900">{item.userName}</td>
                                                    <td className="px-4 py-4 text-[12px] font-bold text-slate-500">{item.rank}</td>
                                                    <td className="px-4 py-4">{renderMemberStatus(item)}</td>
                                                </>
                                            )}
                                            <td className="px-4 py-4">
                                                <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100" aria-label="View details">
                                                    <FileText size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex justify-end gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="rounded-lg border border-slate-100 p-2 transition-all hover:bg-slate-50 disabled:opacity-50"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="rounded-lg border border-slate-100 p-2 transition-all hover:bg-slate-50 disabled:opacity-50"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
