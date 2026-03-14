import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const formatDate = (value) => {
    const date = value ? new Date(value) : new Date();
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const WelcomeLetter = () => {
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

    return (
        <div className="mx-auto max-w-5xl bg-[#f3f4f6] px-4 py-6 md:px-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between print:hidden">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">My Folder</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome Letter</h1>
                </div>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    <Download size={16} />
                    Download / Print
                </button>
            </div>

            <div className="mx-auto max-w-4xl border border-slate-300 bg-white px-8 py-10 shadow-sm print:border-none print:shadow-none md:px-14 md:py-14">
                <div className="border-b border-slate-300 pb-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold uppercase tracking-[0.08em] text-slate-900 md:text-3xl">
                            Sanyukt Parivaar & Rich Life Private Limited
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">Welcome Letter</p>
                    </div>
                </div>

                <div className="pt-8 text-[15px] leading-8 text-slate-800">
                    <div className="mb-8 flex flex-col gap-2 text-sm md:flex-row md:items-start md:justify-between">
                        <div>
                            <p><span className="font-semibold">Name:</span> {userData?.userName || 'Member'}</p>
                            <p><span className="font-semibold">Member ID:</span> {userData?.memberId || 'SPRL0000'}</p>
                        </div>
                        <div className="text-left md:text-right">
                            <p><span className="font-semibold">Date:</span> {formatDate(userData?.joinDate || userData?.createdAt)}</p>
                        </div>
                    </div>

                    <div>
                        <p className="mb-4 font-semibold">Subject: Welcome to Sanyukt Parivaar & Rich Life Private Limited</p>
                        <p className="mb-6">Dear {userData?.userName || 'Member'},</p>

                        <p className="mb-5">
                            We are pleased to welcome you to Sanyukt Parivaar & Rich Life Private Limited.
                            Your registration has been successfully completed, and your membership profile has been created in our system.
                        </p>

                        <p className="mb-5">
                            Your official Member ID is <span className="font-semibold">{userData?.memberId || 'SPRL0000'}</span>.
                            Please keep this Member ID safe, as it will be required for login, account verification,
                            support requests, and future communication related to your account.
                        </p>

                        <p className="mb-5">
                            We are confident that your association with our organization will be productive and rewarding.
                            We wish you success and a positive journey ahead with our team.
                        </p>

                        <p className="mb-10">
                            If you need any assistance, please contact the support team through your account dashboard.
                        </p>

                        <div className="mt-12">
                            <p>Yours sincerely,</p>
                            <p className="mt-8 font-semibold">Authorized Signatory</p>
                            <p>Sanyukt Parivaar & Rich Life Private Limited</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeLetter;
