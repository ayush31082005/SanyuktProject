import React, { useEffect, useState } from 'react';
import { Download, CreditCard, User, Shield, Award, CheckCircle } from 'lucide-react';

const IdCard = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            setUserData(storedUser ? JSON.parse(storedUser) : null);
        } catch (error) {
            console.error('Error parsing user data:', error);
            setUserData(null);
        }
    }, []);

    const handlePrint = () => window.print();
    const initials = (userData?.userName || 'U').charAt(0).toUpperCase();

    return (
        <div className="mx-auto max-w-5xl bg-gray-50 px-4 py-6 min-h-screen">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between print:hidden">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-green-600">My Folder</p>
                    <h1 className="mt-1 text-2xl md:text-3xl font-bold text-gray-800">ID Card</h1>
                </div>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 active:bg-green-800"
                >
                    <Download size={18} />
                    Download / Print
                </button>
            </div>

            {/* ID Card - Professional Design */}
            <div className="mx-auto flex max-w-md justify-center">
                <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
                    {/* Card Header - Simple Green Bar */}
                    <div className="bg-green-600 px-5 py-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-green-100">Sanyukt Parivaar</p>
                                <h2 className="text-sm font-bold text-white flex items-center gap-1">
                                    MEMBERSHIP CARD
                                    {userData?.activeStatus && <CheckCircle className="w-4 h-4 text-white fill-green-600" />}
                                </h2>
                            </div>
                            <div className="text-white opacity-80">
                                <Shield className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                        {/* Profile Section */}
                        <div className="flex items-start gap-4">
                            {/* Photo */}
                            <div className="flex-shrink-0">
                                {userData?.profileImage ? (
                                    <img
                                        src={userData.profileImage}
                                        alt={userData?.userName || 'Member'}
                                        className="w-20 h-20 rounded border border-gray-200 object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                                        <span className="text-xl font-medium text-gray-500">{initials}</span>
                                    </div>
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-gray-800 truncate">
                                    {userData?.userName || 'Member Name'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">
                                    {userData?.email || 'email@example.com'}
                                </p>
                                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                    {userData?.activeStatus ? 'Active Member' : 'Registered'}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="border-b border-gray-100 pb-2">
                                <p className="text-xs text-gray-500">Member ID</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5">{userData?.memberId || 'SPRL0000'}</p>
                            </div>
                            <div className="border-b border-gray-100 pb-2">
                                <p className="text-xs text-gray-500">Sponsor ID</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5">{userData?.sponsorId || '-'}</p>
                            </div>
                            <div className="border-b border-gray-100 pb-2">
                                <p className="text-xs text-gray-500">Mobile</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5">{userData?.mobile || '-'}</p>
                            </div>
                            <div className="border-b border-gray-100 pb-2">
                                <p className="text-xs text-gray-500">Joined</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5">
                                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-GB') : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <CreditCard className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-400">ID: {userData?.memberId?.slice(-4) || '0000'}</span>
                                </div>
                                <span className="text-xs text-gray-400">Valid for official use</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    body {
                        background: white;
                    }
                    .print\\:hidden {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default IdCard;
