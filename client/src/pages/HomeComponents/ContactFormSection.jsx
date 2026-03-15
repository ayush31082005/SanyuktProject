import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Twitter, Check } from 'lucide-react';

const ContactFormSection = ({ 
    contactForm, 
    setContactForm, 
    handleContactSubmit, 
    contactSubmitting, 
    contactSuccess 
}) => {
    return (
        <section className="py-16 bg-white" >
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[#F7931E] font-semibold text-sm tracking-wider uppercase mb-2 block">Get In Touch</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A7A2F] mb-3">Contact Us</h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-sm">Have questions about joining our family or our products? We're here to help you every step of the way.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-start">
                    {/* LEFT — Contact info cards */}
                    <div className="space-y-5">
                        {/* Info cards */}
                        {[
                            {
                                icon: Phone,
                                title: 'Call Us',
                                lines: ['+91 96281 45157'],
                                sub: 'Mon–Sat, 9 AM – 7 PM',
                                color: 'bg-green-50 text-[#0A7A2F]',
                            },
                            {
                                icon: Mail,
                                title: 'Email Us',
                                lines: ['info@sanyuktparivaar.com'],
                                sub: 'We reply within 24 hours',
                                color: 'bg-orange-50 text-[#F7931E]',
                            },
                            {
                                icon: MapPin,
                                title: 'Visit Us',
                                lines: ['Sanyukt Parivaar & Rich Life Private Limited,  Near Main Business Hub, India'],
                                sub: 'Head Office',
                                color: 'bg-blue-50 text-blue-600',
                            },
                            {
                                icon: Clock,
                                title: 'Business Hours',
                                lines: ['Monday – Saturday: 9:00 AM – 7:00 PM', 'Sunday: 10:00 AM – 4:00 PM'],
                                sub: 'IST (Indian Standard Time)',
                                color: 'bg-purple-50 text-purple-600',
                            },
                        ].map(({ icon: Icon, title, lines, sub, color }, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 bg-[#F8FAF5] rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 mb-1">{title}</div>
                                    {lines.map((l, j) => <div key={j} className="text-sm text-gray-700">{l}</div>)}
                                    <div className="text-xs text-gray-400 mt-1">{sub}</div>
                                </div>
                            </div>
                        ))}

                        {/* Social links */}
                        <div className="p-5 bg-[#0A7A2F] rounded-2xl">
                            <div className="text-white font-bold mb-3">Follow Us</div>
                            <div className="flex gap-3">
                                {[
                                    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/share/1CLin8tmY3/' },
                                    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/sanyukt_parivaar_rich_life_57?igsh=dDJlMDd0d241amRx' },
                                    { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@Sanyuktparivaarrichlife' },
                                    { icon: Twitter, label: 'X', href: 'https://x.com/sprichlife_57' },
                                ].map(({ icon: Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all"
                                        title={label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Quick Contact Form */}
                    <div className="bg-[#F8FAF5] rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-extrabold text-gray-900 mb-1">Send a Message</h3>
                        <p className="text-gray-400 text-sm mb-6">Fill in your details and we'll get back to you.</p>

                        <form className="space-y-4" onSubmit={handleContactSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block">First Name</label>
                                    <input type="text" placeholder="Ravi" value={contactForm.firstName} onChange={e => setContactForm(p => ({ ...p, firstName: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-[#0A7A2F] outline-none transition" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Last Name</label>
                                    <input type="text" placeholder="Sharma" value={contactForm.lastName} onChange={e => setContactForm(p => ({ ...p, lastName: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-[#0A7A2F] outline-none transition" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address</label>
                                <input type="email" placeholder="ravi@example.com" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-[#0A7A2F] outline-none transition" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone Number</label>
                                <input type="tel" placeholder="+91 98765 43210" value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-[#0A7A2F] outline-none transition" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Enquiry Type</label>
                                <select value={contactForm.enquiryType} onChange={e => setContactForm(p => ({ ...p, enquiryType: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-[#0A7A2F] outline-none transition text-gray-700">
                                    <option>Product Enquiry</option>
                                    <option>Business Opportunity</option>
                                    <option>Recharge Support</option>
                                    <option>Franchise / Distributor</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Message</label>
                                <textarea rows={4} placeholder="Write your message here..." value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-[#0A7A2F] outline-none transition resize-none" />
                            </div>
                            {contactSuccess && (
                                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span>Your message has been sent successfully! We will get back to you soon.</span>
                                </div>
                            )}
                            <motion.button
                                type="submit"
                                disabled={contactSubmitting}
                                whileHover={{ scale: contactSubmitting ? 1 : 1.02 }}
                                whileTap={{ scale: contactSubmitting ? 1 : 0.98 }}
                                className="w-full bg-[#0A7A2F] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#086326] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Mail className="w-4 h-4" />
                                {contactSubmitting ? 'Sending...' : 'Send Message'}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactFormSection;
