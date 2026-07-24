export const companyBankDetails = {
    accountName: 'SAYUKT PARIVAR AND RICH LIFE PVT. LTD.',
    accountNumber: '5935938755',
    ifsc: 'CBIN0282390',
    bankName: 'CENTRAL BANK OF INDIA',
    branch: 'LALPUR',
    upiId: '20260325575843-iservuqrsbrp@cbin',
};

export const buildCompanyUpiUri = ({ amount } = {}) => {
    const params = new URLSearchParams({
        pa: companyBankDetails.upiId,
        pn: companyBankDetails.accountName,
        cu: 'INR',
    });

    if (amount) {
        params.set('am', String(amount));
    }

    return `upi://pay?${params.toString()}`;
};

export const buildCompanyUpiQrUrl = ({ amount, size = 250 } = {}) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(buildCompanyUpiUri({ amount }))}`;
