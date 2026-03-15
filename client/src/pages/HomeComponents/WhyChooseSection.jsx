import React from 'react';

const WhyChooseSection = ({ whyChoosePoints }) => {
    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0A7A2F] mb-2">
                    Why Choose Sanyukt Parivaar?
                </h2>
                <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto text-xs md:text-sm">
                    Discover what makes us the preferred choice for thousands of entrepreneurs
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {whyChoosePoints.map((point, index) => (
                        <div
                            key={index}
                            className="group p-3 bg-[#F8FAF5] rounded-lg hover:shadow-md transition-all duration-300"
                        >
                            <div className="w-8 h-8 bg-[#0A7A2F] rounded-lg flex items-center justify-center text-white mb-2 group-hover:bg-[#F7931E] transition-colors">
                                {point.icon}
                            </div>
                            <p className="text-gray-700 text-xs">{point.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSection;
