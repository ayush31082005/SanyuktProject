import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import api from '../api';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: '',
        email: ''  // Email field add kiya
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            console.log('Submitting contact form:', formData);

            // Send data to backend
            const response = await api.post('/contact', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message
            });

            console.log('Contact form response:', response.data);

            // Show success message
            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',  // Email bhi clear karo
                phone: '',
                message: ''
            });

            // Hide success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);

        } catch (error) {
            console.error('Contact form error:', error);

            if (error.response) {
                setError(error.response.data.message || 'Failed to send message. Please try again.');
            } else if (error.request) {
                setError('No response from server. Please check your internet connection.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Embed Google Map URL for Chandrapur location
    const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.116773634476!2d79.296244!3d19.979614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd2d8f9b8b8b8b9%3A0x123456789abcdef!2sTukum%2C%20Chandrapur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6 lg:p-8 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Main Heading */}
                <div className="text-center mb-12 animate-slide-down">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Contact Us
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#0A7A2F] to-[#F7931E] mx-auto rounded-full"></div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    {/* Left Column - Contact Form */}
                    <div className="animate-slide-left h-full">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl h-full flex flex-col">
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-[#0A7A2F] to-[#2F7A32] px-6 md:px-8 py-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-white">
                                    Get in Touch
                                </h2>
                                <p className="text-green-50 mt-2 text-sm">
                                    We'd love to hear from you
                                </p>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={handleSubmit} className="p-6 md:p-8 flex-1 flex flex-col">
                                {/* Success Message */}
                                {submitSuccess && (
                                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-slide-down flex items-center space-x-2">
                                        <Send className="h-5 w-5" />
                                        <span>Message sent successfully! We'll get back to you soon.</span>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-slide-down">
                                        鼓鼓 components/ContactUs.jsx                                        {error}
                                    </div>
                                )}

                                <div className="space-y-6 flex-1 flex flex-col">
                                    {/* Your Name */}
                                    <div className="space-y-2 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Your Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent transition-all duration-300 hover:border-[#0A7A2F]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2 animate-slideUp" style={{ animationDelay: '0.15s' }}>
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#0A7A2F] transition-colors duration-300" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent transition-all duration-300 hover:border-[#0A7A2F]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Phone
                                        </label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-[#0A7A2F] transition-colors duration-300" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Enter your phone number"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent transition-all duration-300 hover:border-[#0A7A2F]"
                                            />
                                        </div>
                                    </div>

                                    {/* Your Message */}
                                    <div className="space-y-2 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Your Message... <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Type your message here..."
                                                rows="4"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent transition-all duration-300 hover:border-[#0A7A2F] resize-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Send Message Button */}
                                    <div className="pt-4 mt-auto animate-slideUp" style={{ animationDelay: '0.4s' }}>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full group relative px-8 py-4 bg-gradient-to-r from-[#F7931E] to-[#e07d0b] text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            <span className="relative z-10 flex items-center justify-center space-x-2">
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>SENDING...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>SEND MESSAGE</span>
                                                        <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#e07d0b] to-[#F7931E] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Contact Information with Map */}
                    <div className="animate-slide-right h-full">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl h-full flex flex-col">
                            {/* Info Header */}
                            <div className="bg-gradient-to-r from-[#0A7A2F] to-[#2F7A32] px-6 md:px-8 py-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-white">
                                    Contact Information
                                </h2>
                                <p className="text-green-50 mt-2 text-sm">
                                    Get in touch with us
                                </p>
                            </div>

                            {/* Info Body with Map */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col">
                                <div className="space-y-6 flex-1 flex flex-col">
                                    {/* Address */}
                                    <div className="flex items-start space-x-4 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <MapPin className="h-5 w-5 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1">Head Office</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                Sanyukt Parivaar & Rich Life Pvt.Ltd.,<br />
                                                Bhatiniya, Gopinathpur, Harraiya,<br />
                                                Basti - 272130, Uttar Pradesh
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start space-x-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Phone className="h-5 w-5 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                                            <a href="tel:+917880370057" className="text-gray-600 text-sm hover:text-green-600 transition-colors duration-300">
                                                +91 78803 70057
                                            </a>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start space-x-4 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Mail className="h-5 w-5 text-green-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                                            <a href="mailto:info@sanyuktparivaar.com" className="text-gray-600 text-sm hover:text-green-600 transition-colors duration-300">
                                                info@sanyuktparivaar.com
                                            </a>
                                        </div>
                                    </div>

                                    {/* Google Map */}
                                    <div className="mt-4 pt-2 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                                        <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                                            <div className="relative w-full h-48 md:h-56">
                                                <iframe
                                                    src={mapUrl}
                                                    className="absolute top-0 left-0 w-full h-full"
                                                    style={{ border: 0 }}
                                                    allowFullScreen
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    title="Office Location"
                                                ></iframe>
                                            </div>
                                            <div className="bg-green-50 px-4 py-2 text-center">
                                                <a
                                                    href="https://maps.google.com/?q=Tukum+Chandrapur+Maharashtra"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-green-600 hover:text-green-800 font-medium hover:underline transition-colors duration-300"
                                                >
                                                    View on Google Maps →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ContactUs;