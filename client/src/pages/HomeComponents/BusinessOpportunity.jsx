import React from 'react';
import { Check } from 'lucide-react';

const BusinessOpportunity = ({ businessHighlights, businessImage, handleNavigation }) => {
    return (
        <section className="py-12 md:py-16 bg-gradient-to-r from-[#0A7A2F] to-[#2F7A32] text-white" >
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3">
                        <h2 className="text-xl md:text-2xl font-bold">
                            A Powerful Business Opportunity
                        </h2>
                        <p className="text-gray-200 text-xs md:text-sm leading-relaxed">
                            Sanyukt Parivaar & Rich Life Private Limited offers a proven MLM business plan that allows individuals to earn through product sales, team building, and leadership development. Whether you are a student, professional, homemaker, or entrepreneur — this opportunity is open to all.
                        </p>
                        <div className="space-y-1">
                            {businessHighlights.map((highlight, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Check className="w-3 h-3 text-[#F7931E] flex-shrink-0" />
                                    <span className="text-xs">{highlight}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => handleNavigation('/opportunity')}
                            className="inline-block px-4 py-2 bg-[#F7931E] text-white text-xs font-semibold rounded-lg hover:bg-[#e07d0b] transform hover:-translate-y-1 transition-all"
                        >
                            View Opportunities
                        </button>
                    </div>
                    <div className="relative">
                        <img src={businessImage} alt="Business Opportunity" className="rounded-lg shadow-2xl w-full h-48 md:h-64 object-cover" />
                        <div className="absolute -top-2 -right-2 bg-[#F7931E] p-3 rounded-lg shadow-xl">
                            <div className="text-base font-bold">Unlimited</div>
                            <div className="text-xs">Income Potential</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessOpportunity;
