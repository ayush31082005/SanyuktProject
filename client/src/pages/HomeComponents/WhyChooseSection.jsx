import React from 'react';

const WhyChooseSection = ({ whyChoosePoints }) => {
    return (
        <section className="py-10 md:py-16 bg-[#0D0D0D] relative border-y border-[#C8A96A]/10">
            <div className="container mx-auto px-4">
                <h2 className="text-xl md:text-3xl font-serif font-bold text-center text-[#F5E6C8] mb-2 uppercase tracking-widest">
                    Why Choose <span className="text-[#C8A96A]">Sanyukt Parivaar</span>?
                </h2>
                <div className="w-16 h-[1px] bg-[#C8A96A]/40 mx-auto mb-6"></div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
                    {whyChoosePoints.map((point, index) => (
                        <div
                            key={index}
                            className="luxury-box p-3 md:p-4 flex items-start gap-3 hover:border-[#C8A96A]/60 transition-colors duration-500"
                        >
                            <div className="w-8 h-8 bg-[#C8A96A]/10 border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A] flex-shrink-0">
                                {React.cloneElement(point.icon, { className: "w-4 h-4" })}
                            </div>
                            <p className="text-[#F5E6C8]/80 text-[11px] md:text-xs font-medium leading-snug uppercase tracking-tight">{point.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
