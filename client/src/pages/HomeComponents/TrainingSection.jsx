import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const TrainingSection = ({ supportItems, trainingImage, handleNavigation }) => {
    return (
        <section className="py-12 md:py-16 bg-white" >
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3 order-2 md:order-1">
                        <h2 className="text-xl md:text-2xl font-bold text-[#0A7A2F] relative inline-block pb-1">
                            Training & Support System
                            <span className="absolute bottom-0 left-0 w-10 h-1 bg-[#F7931E]"></span>
                        </h2>
                        <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                            We believe success comes with knowledge and guidance. That’s why we provide structured training programs, online resources, offline seminars, and continuous mentorship to help every partner grow confidently.
                        </p>
                        <h3 className="text-sm font-bold text-[#0A7A2F] mt-4 mb-2">Support Includes</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {supportItems.map((item, index) => (
                                <div key={index} className="flex items-center space-x-1">
                                    <div className="w-1 h-1 bg-[#F7931E] rounded-full"></div>
                                    <span className="text-xs text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => handleNavigation('/training')}
                            className="inline-block text-[#0A7A2F] text-xs font-medium hover:text-[#F7931E] transition-colors"
                        >
                            Learn More <ArrowRight className="w-3 h-3 inline ml-1" />
                        </button>
                    </div>
                    <div className="relative order-1 md:order-2">
                        <img src={trainingImage} alt="Training" className="rounded-lg shadow-xl w-full h-48 md:h-64 object-cover" />
                        <div className="absolute -bottom-3 -left-3 bg-white p-3 rounded-lg shadow-md">
                            <div className="flex items-center space-x-2">
                                <Play className="w-5 h-5 text-[#F7931E]" />
                                <div>
                                    <div className="font-bold text-xs">Leadership Programs</div>
                                    <div className="text-xs text-gray-600">Top 10 in India</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrainingSection;
