import React from 'react';
import { Shield } from 'lucide-react';

const AboutSection = ({ aboutImage, teamImages }) => {
    return (
        <section className="py-12 md:py-16 bg-[#F8FAF5]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0A7A2F] inline-block relative pb-3">
                        Who We Are
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#F7931E]"></span>
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                    <div className="space-y-3 text-gray-700 leading-relaxed order-2 md:order-1">
                        <h3 className="text-lg md:text-xl font-semibold text-[#2F7A32] mb-3">
                            Sanyukt Parivaar & Rich Life Pvt.Ltd.
                        </h3>
                        <p className="text-sm">
                            Sanyukt Parivaar & Rich Life Pvt.Ltd. was founded with a clear vision  to create financial independence through ethical direct selling. We believe in growing together as one family, where every member gets equal opportunity, proper training, and long-term support.
                        </p>
                        <p className="text-sm">
                            Our company focuses on personal development, leadership growth, and community success while promoting reliable lifestyle, wellness, and personal care products.
                        </p>
                    </div>
                    <div className="relative order-1 md:order-2">
                        <img src={aboutImage} alt="About Us" className="rounded-lg shadow-xl w-full h-[300px] md:h-[350px] object-cover" />
                        <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-3 md:p-4 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-100 animate-bounce" style={{ animationDuration: '3s' }}>
                            <div className="bg-green-100 p-2 rounded-full">
                                <Shield className="w-5 h-5 text-[#0A7A2F]" />
                            </div>
                            <div className="flex flex-col pr-2">
                                <span className="text-xl font-black text-[#0A7A2F] leading-none">100%</span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Certified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
