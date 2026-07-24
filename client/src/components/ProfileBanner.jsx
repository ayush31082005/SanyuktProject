import React, { useMemo, useState } from 'react';
import {
    CalendarDays,
    CheckCircle2,
    MessageCircle,
    Package2,
    User,
    Users,
    Copy,
    Check,
    Coins,
    Gem,
} from 'lucide-react';
import toast from 'react-hot-toast';

const profileFallback =
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80';

const formatDate = (value) => {
    if (!value) return 'N/A';

    try {
        return new Date(value).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return 'N/A';
    }
};

const InfoRow = ({ icon: Icon, label, value, badge, canCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!value || value === 'N/A') return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success(`${label} copied!`, {
            style: {
                background: '#111111',
                color: '#c8a96a',
                border: '1px border-[#c8a96a]/20',
                fontSize: '12px',
            },
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2 border-b border-[#c8a96a]/12 bg-[#171717] px-2.5 py-2.5 text-[11px] font-bold text-[#c8a96a]/75 sm:text-[12px]">
            <Icon size={14} className="shrink-0 text-[#c8a96a]/65" />
            <span className="min-w-0 flex-1 truncate">{label}</span>
            <div className="flex items-center gap-2">
                <span className="max-w-[140px] truncate text-right text-[11px] font-black uppercase tracking-[0.06em] text-[#f5e6c8] sm:text-[12px]">
                    {value}
                </span>
                {canCopy && (
                    <button
                        onClick={handleCopy}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c8a96a]/10 text-[#c8a96a] transition-all hover:bg-[#c8a96a]/20 active:scale-95"
                    >
                        {copied ? <Check size={10} /> : <Copy size={10} />}
                    </button>
                )}
            </div>
            {badge ? (
                <span className="ml-1 rounded-sm border border-[#f4b5b5] bg-[#f45e61] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.06em] text-white">
                    {badge}
                </span>
            ) : null}
        </div>
    );
};

const ActionStrip = ({ colorClass, borderClass, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center justify-center gap-2 border px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-white sm:text-[11px] ${colorClass} ${borderClass}`}
    >
        <MessageCircle size={13} />
        {label}
    </button>
);

const PACKAGES_MAP = {
    "599": "Silver",
    "1299": "Gold",
    "2699": "Diamond",
};

const ProfileBanner = ({ userData, stats, matchingReport }) => {
    const referralLinks = useMemo(() => {
        if (!userData?.memberId) {
            return { left: '', right: '' };
        }

        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const memberId = encodeURIComponent(userData.memberId);

        return {
            left: `${origin}/register?ref=${memberId}&pos=left`,
            right: `${origin}/register?ref=${memberId}&pos=right`,
        };
    }, [userData?.memberId]);

    if (!userData) return null;

    const packageName = userData.activeStatus
        ? (PACKAGES_MAP[userData.packageType] || userData.packageType || 'Not Active')
        : 'Not Active';

    const infoRows = [
        {
            label: 'User ID',
            value: userData.memberId || 'N/A',
            icon: User,
            badge: stats?.rank || userData?.rank || 'Member',
            canCopy: true,
        },
        {
            label: 'Sponsor ID',
            value: userData.sponsorId || 'N/A',
            icon: Users,
            canCopy: true,
        },
        {
            label: 'Joining Date',
            value: formatDate(userData.joinDate || userData.createdAt),
            icon: CalendarDays,
        },
        {
            label: 'Active Package',
            value: packageName === 'none' ? 'Not Active' : packageName,
            icon: Package2,
        },
        {
            label: 'Rank Achievement',
            value: stats?.rank || userData?.rank || 'Member',
            icon: CheckCircle2,
            badge: userData.activeStatus ? 'YES' : 'NO',
        },
        {
            label: 'L/R PV Carry',
            value: `${Number(matchingReport?.availableLeftPV || 0).toFixed(2)} / ${Number(matchingReport?.availableRightPV || 0).toFixed(2)}`,
            icon: Gem,
        },
        {
            label: 'Personal PV',
            value: Number(stats?.pv || userData?.pv || 0).toFixed(2),
            icon: Gem,
        },
        {
            label: 'Personal BV',
            value: Number(stats?.bv || userData?.bv || 0).toLocaleString('en-IN'),
            icon: Coins,
        },
    ];

    const shareOnWhatsApp = (position, link) => {
        if (!link) return;
        const message = `Join my network from ${position} side: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="overflow-hidden rounded-[2px] border border-[#c8a96a]/18 bg-[#111111] shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
            <div className="bg-[linear-gradient(135deg,#214358_0%,#66add3_52%,#bde8ff_100%)] px-3 py-3">
                <div className="flex min-h-[248px] flex-col items-center justify-center text-center">
                    <div className="flex h-[180px] w-[180px] items-center justify-center overflow-hidden rounded-full border-[6px] border-black bg-black shadow-[0_10px_24px_rgba(0,0,0,0.24)]">
                        <img
                            src={userData.profileImage || profileFallback}
                            alt="Member"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="mt-3 text-[20px] sm:text-[22px] font-black uppercase tracking-[0.08em] text-[#7a560f]">
                        {userData.userName || 'Member'}
                    </div>
                    <div className="mt-1 text-[12px] sm:text-[13px] font-bold text-[#8a6315]">
                        {userData.email || userData.memberId || ''}
                    </div>
                </div>
            </div>

            <div className="bg-[#151515]">
                {infoRows.map((row) => (
                    <InfoRow key={row.label} {...row} />
                ))}
            </div>

            <div className="space-y-1 border-t border-[#c8a96a]/12 bg-[#111111] p-2">
                <ActionStrip
                    colorClass="bg-[#ff4d4f]"
                    borderClass="border-[#f5b5b5]"
                    label="Share WhatsApp Link (Left)"
                    onClick={() => shareOnWhatsApp('left', referralLinks.left)}
                />
                <ActionStrip
                    colorClass="bg-[#35ca69]"
                    borderClass="border-[#a7e4b7]"
                    label="Share WhatsApp Link (Right)"
                    onClick={() => shareOnWhatsApp('right', referralLinks.right)}
                />
            </div>
        </div>
    );
};

export default ProfileBanner;

