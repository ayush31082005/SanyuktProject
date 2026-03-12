import React, { useState } from 'react';
import { Building2, CreditCard, User, MapPin, QrCode, Copy, CheckCircle, Smartphone } from 'lucide-react';

const OurBanker = () => {
    const [copied, setCopied] = useState('');

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(''), 2000);
    };
    const bankDetails = [
        { label: 'Bank Name', value: 'CENTRAL BANK OF INDIA', icon: Building2, color: 'from-green-600 to-emerald-500' },
        { label: 'A/C Number', value: '5935938755', icon: CreditCard, color: 'from-green-500 to-teal-500' },
        { label: 'A/C Name', value: 'SAYUKT PARIVAR AND RICH LIFE PVT LTD', icon: User, color: 'from-emerald-600 to-green-500' },
        { label: 'Branch Name', value: 'LALPUR', icon: MapPin, color: 'from-teal-500 to-green-400' },
        { label: 'IFSC Code', value: 'CBIN0282390', icon: QrCode, color: 'from-green-700 to-emerald-600' },
    ];

    // QR Code Display Component
    const QRCodeDisplay = () => (
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-green-100">
            {/* Simulated QR Code */}
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-green-50 to-white rounded-xl p-2">
                <div className="grid grid-cols-7 gap-0.5">
                    {[...Array(49)].map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-sm ${Math.random() > 0.6 ? 'bg-green-800' : 'bg-green-100'
                                }`}
                        ></div>
                    ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-md">
                        <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                    </div>
                </div>
            </div>
            <p className="text-xs text-center mt-2 text-gray-500 font-medium">Scan to Pay</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto mb-12">
                <div className="text-center">
                    <nav className="text-sm text-gray-500 mb-4">
                        <span className="hover:text-green-600 cursor-pointer transition-colors">Home</span>
                        <span className="mx-2">›</span>
                        <span className="text-green-600 font-medium">Our Banker</span>
                    </nav>

                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent px-6 py-3">
                        Our Banker
                    </h1>
                </div>

                {/* Email Badge */}
                <div className="mt-8 flex justify-center">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative px-8 py-3 bg-white rounded-full flex items-center space-x-3 shadow-md border border-green-100">
                            <span className="text-sm md:text-base font-mono text-gray-700">
                                20260325575843-iservuqrsbrp@cbin
                            </span>
                            <button
                                onClick={() => copyToClipboard('20260325575843-iservuqrsbrp@cbin', 'email')}
                                className="text-gray-400 hover:text-green-600 transition-colors"
                            >
                                {copied === 'email' ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bank Details Grid */}
            <div className="max-w-4xl mx-auto">
                <div className="grid gap-6 md:grid-cols-2">
                    {bankDetails.map((detail, index) => (
                        <div key={detail.label} className="group relative">
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${detail.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300`}></div>

                            <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-3 bg-gradient-to-br ${detail.color} rounded-xl text-white shadow-lg`}>
                                            <detail.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">
                                                {detail.label}
                                            </p>
                                            <p className="text-base md:text-lg font-semibold text-gray-800 mt-1 break-all">
                                                {detail.value}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => copyToClipboard(detail.value, detail.label)}
                                        className="text-gray-400 hover:text-green-600 transition-colors p-2 hover:bg-green-50 rounded-lg"
                                    >
                                        {copied === detail.label ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* QR Code Section */}
                <div className="mt-12">
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Left Side - Payment Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center justify-center md:justify-start space-x-2 mb-4">
                                    <Smartphone className="w-6 h-6 text-green-600" />
                                    <h2 className="text-2xl font-semibold text-gray-800">Quick Pay with QR</h2>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Scan this QR code with any UPI app to make instant payments
                                </p>

                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-700">Google Pay</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-700">PhonePe</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-700">Paytm</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - QR Code */}
                            <div className="flex-shrink-0">
                                <QRCodeDisplay />
                            </div>
                        </div>

                        {/* UPI ID */}
                        <div className="mt-6 pt-6 border-t border-green-100">
                            <div className="flex items-center justify-between bg-green-50 rounded-xl p-4">
                                <div className="flex items-center space-x-3">
                                    <QrCode className="w-5 h-5 text-green-600" />
                                    <span className="text-sm text-gray-600">UPI ID:</span>
                                    <span className="font-mono font-medium text-gray-800">20260325575843-iservuqrsbrp@cbin</span>
                                </div>
                                <button
                                    onClick={() => copyToClipboard('20260325575843-iservuqrsbrp@cbin', 'upi')}
                                    className="text-gray-400 hover:text-green-600 transition-colors"
                                >
                                    {copied === 'upi' ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Secure banking details • Verified • UPI Enabled</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurBanker;
