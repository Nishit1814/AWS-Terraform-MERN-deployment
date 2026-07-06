import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createMessage } from "../../services/messageServices";
import { motion } from 'motion/react';
import Footer from "../../component/layouts/Footer";

const Contact = () => {
    const { user, } = useAuth()
    const [formState, setFormState] = useState('idle');

    const formik = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            phone: '',
            subject: 'General Inquiry',
            message: ''
        },
        validationSchema: Yup.object({
            fullname: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            phone: Yup.string().matches(/^[0-9+\s-]{10,15}$/, 'Invalid phone number').required('Required'),
            subject: Yup.string().required('Required'),
            message: Yup.string().required('Required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            setFormState('submitting');
            try {
                await createMessage({
                    ...values,
                    userId: user?._id || 'GUEST',
                    type: 'CONTACT'
                });
                console.log("values:", values);
                setFormState('success');
                resetForm();
            } catch (err) {
                console.error(err);
                alert("Failed to send message. Please try again.");
                setFormState('idle');
            }
        },
    });

    const contactInfo = [
        { label: "Our Office", value: "123 Explorer Way, New Delhi, India", icon: "📍" },
        { label: "Phone Number", value: "+91 98765 43210", icon: "📞" },
        { label: "Email Us", value: "hello@incredibleindia.com", icon: "✉️" }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-32 px-6 overflow-hidden bg-slate-900 text-white">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:40px_40px]"></div>
                    </div>
                    <div className="max-w-7xl mx-auto relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none">
                                <span className="text-indigo-400">Let&apos;s Connect</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                                Whether you have a question about a trip or want to partner with us, our AI-powered support team is ready to help.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-32">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Form Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-7 bg-white p-12 md:p-16 rounded-[64px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100"
                        >
                            <h2 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Send a Message</h2>

                            {formState === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-20 text-center"
                                >
                                    <div className="text-7xl mb-8">🚀</div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Message Transmitted!</h3>
                                    <p className="text-slate-500 font-medium text-lg mb-10">Our neural network has received your inquiry. Expect a response within 24 hours.</p>
                                    <button
                                        onClick={() => setFormState('idle')}
                                        className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
                                    >
                                        Send Another Message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={formik.handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Full Name</label>
                                            <input
                                                id="fullname"
                                                name="fullname"
                                                type="text"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.fullname}
                                                placeholder="John Doe"
                                                className={`w-full px-8 py-5 text-slate-700 bg-slate-50 border ${formik.touched.fullname && formik.errors.fullname ? 'border-rose-400' : 'border-slate-100'} rounded-[32px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium`}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Email Address</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.email}
                                                placeholder="john@example.com"
                                                className={`w-full px-8 py-5 text-slate-700 bg-slate-50 border ${formik.touched.email && formik.errors.email ? 'border-rose-400' : 'border-slate-100'} rounded-[32px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium`}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Phone Number</label>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.phone}
                                                placeholder="+91 98765 43210"
                                                className={`w-full px-8 py-5 text-slate-700 bg-slate-50 border ${formik.touched.phone && formik.errors.phone ? 'border-rose-400' : 'border-slate-100'} rounded-[32px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium`}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Subject</label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.subject}
                                                className={`w-full px-8 py-5 text-slate-700 bg-slate-50 border ${formik.touched.subject && formik.errors.subject ? 'border-rose-400' : 'border-slate-100'} rounded-[32px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium appearance-none`}
                                            >
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Trip Planning">Trip Planning</option>
                                                <option value="Booking Support">Booking Support</option>
                                                <option value="Payment Issue">Payment Issue</option>
                                                <option value="Cancellation">Cancellation</option>
                                                <option value="Partnership">Partnership</option>
                                                <option value="Feedback">Feedback</option>
                                                <option value="Group Tour Inquiry">Group Tour Inquiry</option>
                                                <option value="Corporate Travel">Corporate Travel</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black  text-slate-400 uppercase tracking-[0.3em] ml-6">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="5"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.message}
                                            placeholder="Tell us what's on your mind..."
                                            className={`w-full px-8 py-5 text-slate-700 bg-slate-50 border ${formik.touched.message && formik.errors.message ? 'border-rose-400' : 'border-slate-100'} rounded-[32px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium resize-none`}
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                        className="w-full py-6 bg-indigo-600 text-white rounded-[32px] font-black uppercase tracking-widest text-sm hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100 disabled:opacity-50"
                                    >
                                        {formik.isSubmitting ? 'Transmitting...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Info Section */}
                        <div className="lg:col-span-5 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-slate-900 p-12 rounded-[64px] text-white shadow-2xl shadow-slate-200 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                <h3 className="text-3xl font-black mb-10 tracking-tight relative z-10">Contact Info</h3>
                                <div className="space-y-10 relative z-10">
                                    {contactInfo.map((info, i) => (
                                        <div key={i} className="flex items-start gap-6 group">
                                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                {info?.icon}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">{info?.label}</p>
                                                <p className="text-lg font-bold leading-tight">{info?.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <section className="mt-40">
                        <div className="text-center mb-24">
                            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Support</h2>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Frequently Asked Questions</h3>
                        </div>
                        <div className="max-w-4xl mx-auto space-y-6">
                            {[
                                { q: "How does the AI trip planning work?", a: "Our AI analyzes thousands of data points including weather, local events, and user preferences to generate a custom itinerary in seconds." },
                                { q: "Can I modify my itinerary after it's generated?", a: "Yes! You can manually edit any part of your trip, add new stops, or ask the AI to regenerate specific days." },
                                { q: "Is my payment information secure?", a: "Absolutely. We use industry-standard encryption and secure payment gateways to ensure your data is always protected." },
                                { q: "Do you offer group discounts?", a: "We do! For groups of 10 or more, please contact our corporate travel team for special rates." }
                            ].map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    <h4 className="text-xl font-black text-slate-900 mb-4">{faq?.q}</h4>
                                    <p className="text-slate-500 font-medium leading-relaxed">{faq?.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
