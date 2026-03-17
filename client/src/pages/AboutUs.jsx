import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, Users, Target, Eye, TrendingUp, Shield, Star, Heart, Award, MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const AboutUsPage = () => {
    const navigate = useNavigate();
    // Sample image URLs (replace with actual images)
    const seminarImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const teamImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const trainingImage = "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

    // Mission & Vision images
    const missionImage = "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const visionImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

    // Why Sanyukt Parivaar images
    const familyImage = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const successImage = "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const trainingImage2 = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const growthImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80";

    // Core Values images
    const integrityImage = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80";
    const teamworkImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80";
    const customerImage = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const learningImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80";
    const ethicalImage = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
    const growthValueImage = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

    const coreValues = [
        {
            title: "Integrity & Transparency",
            traits: ["Honesty", "Reliability", "Accountability", "Diligence"],
            image: integrityImage
        },
        {
            title: "Teamwork & Unity",
            traits: ["Collaboration", "Support", "Togetherness", "Cooperation"],
            image: teamworkImage
        },
        {
            title: "Customer Satisfaction",
            traits: ["Quality Service", "Responsiveness", "Value Creation", "Trust"],
            image: customerImage
        },
        {
            title: "Continuous Learning",
            traits: ["Skill Development", "Innovation", "Adaptability", "Growth"],
            image: learningImage
        },
        {
            title: "Ethical Direct Selling",
            traits: ["Fair Practices", "Transparency", "Compliance", "Respect"],
            image: ethicalImage
        },
        {
            title: "Long-Term Growth",
            traits: ["Sustainability", "Stability", "Future Focus", "Scaling"],
            image: growthValueImage
        }
    ];

    return (
        <div className="bg-[#F8FAF5] font-sans">
            {/* Hero Banner Section */}
            <header className="relative h-[280px] bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
                <div className="absolute inset-0 bg-black/65"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-3 animate-fade-in">
                        About Us
                    </h1>
                    <div className="flex items-center text-white/90 text-sm md:text-base">
                        <span className="hover:text-white transition-colors">Home</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-white">About Us</span>
                    </div>
                </div>
            </header>

            {/* Intro Heading Section - Main Heading (H2) and Sub-line */}
            <section className="py-8 md:py-16 px-4 max-w-7xl mx-auto text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-[#0A7A2F] mb-4 animate-slide-up">
                    Welcome to Sanyukt Parivaar & Rich Life Pvt.Ltd.
                </h2>
                <p className="text-lg text-[#222222] font-medium mb-6">
                    A People-Centric Multi-Level Marketing Organization
                </p>
                <div className="w-[60px] h-[3px] bg-[#0A7A2F] mx-auto"></div>
            </section>

            {/* ABOUT US - CONTENT + IMAGE (2 COLUMN LAYOUT) */}
            <section className="py-8 md:py-12 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start">
                    {/* Left Content */}
                    <div className="space-y-6 animate-slide-right">
                        <article className="prose max-w-none">
                            <p className="text-[#222222] leading-relaxed max-w-[720px]">
                                Sanyukt Parivaar & Rich Life Pvt.Ltd. is a rapidly growing direct selling and multi-level marketing organization built on the foundation of trust, transparency, and teamwork. We were established with a clear purpose - to empower individuals and families by providing a reliable platform for financial independence and personal growth.
                            </p>
                            <p className="text-[#222222] leading-relaxed max-w-[720px] mt-4">
                                At Sanyukt Parivaar, we believe success is best achieved together. Our "Parivaar" culture encourages mutual support, ethical business practices, and long-term relationships. We offer high-quality lifestyle, wellness, personal care, and daily-use products that create real value for customers and sustainable income opportunities for our partners.
                            </p>
                            <p className="text-[#222222] leading-relaxed max-w-[720px] mt-4">
                                Through structured training, leadership development, and a proven compensation plan, we help individuals from all walks of life - students, professionals, homemakers, and entrepreneurs - build a stable and scalable business with confidence.
                            </p>
                        </article>
                    </div>

                    {/* Right Image - Company / Seminar Image */}
                    <div className="space-y-4 animate-slide-left">
                        <img
                            src={seminarImage}
                            alt="Company Seminar"
                            className="w-full h-auto rounded-[12px] shadow-lg hover:shadow-xl transition-shadow duration-300"
                            loading="lazy"
                        />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <img
                                src={teamImage}
                                alt="Team Standing Together"
                                className="w-full h-32 object-cover rounded-[12px] shadow-md hover:shadow-lg transition-shadow duration-300"
                                loading="lazy"
                            />
                            <img
                                src={trainingImage}
                                alt="Product Launch Training"
                                className="w-full h-32 object-cover rounded-[12px] shadow-md hover:shadow-lg transition-shadow duration-300"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* MISSION & VISION SECTION (CARD STYLE) WITH IMAGES */}
            <section className="py-8 md:py-16 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Mission Card with Image */}
                    <article
                        className="bg-white rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
                       hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 
                       animate-fade-in overflow-hidden"
                    >
                        {/* Mission Image */}
                        <div className="h-48 overflow-hidden">
                            <img
                                src={missionImage}
                                alt="Mission - Team Training"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />
                        </div>

                        {/* Mission Content */}
                        <div className="p-[30px]">
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="w-8 h-8 text-[#0A7A2F]" />
                                <h3 className="text-2xl font-bold text-[#0A7A2F]">Our Mission</h3>
                            </div>
                            <p className="text-[#222222] leading-relaxed">
                                Our mission is to create opportunities for financial independence and personal
                                development by offering a transparent and ethical MLM platform. We aim to nurture
                                our community through continuous training, strong leadership support, and high-quality
                                products while maintaining honesty, integrity, and fairness in all our business operations.
                            </p>
                        </div>
                    </article>

                    {/* Vision Card with Image */}
                    <article
                        className="bg-white rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
                       hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 
                       animate-fade-in animation-delay-200 overflow-hidden"
                    >
                        {/* Vision Image */}
                        <div className="h-48 overflow-hidden">
                            <img
                                src={visionImage}
                                alt="Vision - Future Growth"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />
                        </div>

                        {/* Vision Content */}
                        <div className="p-[30px]">
                            <div className="flex items-center gap-3 mb-4">
                                <Eye className="w-8 h-8 text-[#0A7A2F]" />
                                <h3 className="text-2xl font-bold text-[#0A7A2F]">Our Vision</h3>
                            </div>
                            <p className="text-[#222222] leading-relaxed">
                                Our vision is to become a trusted and respected leader in the direct selling industry
                                by building a sustainable business model that benefits our partners, customers, and society.
                                We strive to inspire positive change, encourage entrepreneurship, and create long-lasting
                                value through innovation and responsible growth.
                            </p>
                        </div>
                    </article>
                </div>
            </section >

            {/* CORE VALUES SECTION WITH IMAGES */}
            < section className="py-8 md:py-16 px-4 max-w-7xl mx-auto" >
                <h2 className="text-2xl md:text-4xl font-bold text-center text-[#0A7A2F] mb-6 md:mb-12 animate-slide-up">
                    Our Core Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                    {coreValues.map((value, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-[14px] shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in overflow-hidden group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Value Image */}
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={value.image}
                                    alt={value.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>

                            {/* Value Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="w-5 h-5 text-[#0A7A2F]" />
                                    <h3 className="text-xl font-bold text-[#0A7A2F]">{value.title}</h3>
                                </div>

                                {/* Traits List */}
                                <ul className="space-y-2">
                                    {value.traits.map((trait, traitIndex) => (
                                        <li key={traitIndex} className="flex items-center gap-2 text-[#222222]">
                                            <span className="w-1.5 h-1.5 bg-[#F7931E] rounded-full"></span>
                                            {trait}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section >

            {/* Why Sanyukt Parivaar Section WITH IMAGES */}
            < section className="py-8 md:py-16 px-4 bg-white" >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
                        {/* Left Content with Images */}
                        <div className="space-y-6 animate-slide-right">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#0A7A2F] mb-6">
                                Why Sanyukt Parivaar & Rich Life Pvt.Ltd.?
                            </h2>
                            <p className="text-[#222222] leading-relaxed max-w-[720px]">
                                We are more than a company - we are a family committed to growth and empowerment. Our business model focuses on stability, repeat income through quality products, and leadership-driven success. With regular training programs, transparent policies, and a strong support ecosystem, we ensure that every partner has the tools to succeed.
                            </p>

                            {/* Image Grid inside content */}
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="relative group overflow-hidden rounded-[12px] shadow-md">
                                    <img
                                        src={familyImage}
                                        alt="Family Culture"
                                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                        <span className="text-white text-sm font-medium">Family Culture</span>
                                    </div>
                                </div>
                                <div className="relative group overflow-hidden rounded-[12px] shadow-md">
                                    <img
                                        src={successImage}
                                        alt="Success Stories"
                                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                        <span className="text-white text-sm font-medium">Success Stories</span>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Highlights */}
                            <div className="flex flex-wrap gap-3 mt-4">
                                <div className="flex items-center gap-2 bg-[#F8FAF5] px-4 py-2 rounded-full shadow-sm">
                                    <Award className="w-4 h-4 text-[#0A7A2F]" />
                                    <span className="text-sm font-medium">Certified Training</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#F8FAF5] px-4 py-2 rounded-full shadow-sm">
                                    <Heart className="w-4 h-4 text-[#0A7A2F]" />
                                    <span className="text-sm font-medium">Family Culture</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Stats and Images */}
                        <div className="space-y-6 animate-slide-left">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#F8FAF5] p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                                    <Users className="w-10 h-10 text-[#0A7A2F] mx-auto mb-3" />
                                    <h4 className="font-bold text-[#222222] text-xl mb-1">Financial Freedom</h4>
                                    <p className="text-sm text-gray-600">Empowering 20,000+ partners nationwide.</p>
                                </div>
                                <div className="bg-[#F8FAF5] p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                                    <Star className="w-10 h-10 text-[#F7931E] mx-auto mb-3" />
                                    <h4 className="font-bold text-[#222222] text-xl mb-1">Premium Wellness</h4>
                                    <p className="text-sm text-gray-600">100+ Natural & Ayurvedic products.</p>
                                </div>
                                <div className="bg-[#F8FAF5] p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                                    <TrendingUp className="w-10 h-10 text-[#0A7A2F] mx-auto mb-3" />
                                    <h4 className="font-bold text-[#222222] text-xl mb-1">Success Legacy</h4>
                                    <p className="text-sm text-gray-600">500+ successful seminars across India.</p>
                                </div>
                                <div className="bg-[#F8FAF5] p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                                    <Shield className="w-10 h-10 text-[#F7931E] mx-auto mb-3" />
                                    <h4 className="font-bold text-[#222222] text-xl mb-1">Ethical Vision</h4>
                                    <p className="text-sm text-gray-600">100% Transparent & Legal business model.</p>
                                </div>
                            </div>

                            {/* Additional Images */}
                            <div className="grid grid-cols-2 gap-4">
                                <img
                                    src={trainingImage2}
                                    alt="Training Session"
                                    className="w-full h-32 object-cover rounded-[12px] shadow-md hover:shadow-lg transition-shadow duration-300"
                                    loading="lazy"
                                />
                                <img
                                    src={growthImage}
                                    alt="Growth Chart"
                                    className="w-full h-32 object-cover rounded-[12px] shadow-md hover:shadow-lg transition-shadow duration-300"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Final CTA Section - Light Green */}
            < section className="py-10 md:py-20 px-4 bg-gradient-to-r from-[#A8D5BA] to-[#C8E6C9]" >
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0A7A2F] mb-8">
                        Join a Growing Community That Believes in Shared Success
                    </h2>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-[#F9A826] hover:bg-[#F8B84A] text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-bounce-subtle"
                    >
                        Join Sanyukt Parivaar Today
                    </button>
                </div>
            </section >
        </div >
    );
};

export default AboutUsPage;