

import Footer from '../../component/layouts/Footer';
import { motion } from 'motion/react';

export const PrivacyPolicy = () => {
    const sections = [
        {
            id: "01",
            title: "Overview",
            subtitle: "Our Commitment",
            content: "At TripPlanner AI, we believe privacy is a fundamental human right. We are committed to being transparent about how we collect, use, and protect your data. This policy outlines our practices and your choices regarding your personal information."
        },
        {
            id: "02",
            title: "Collection",
            subtitle: "Data We Gather",
            items: [
                { title: "Identity", desc: "Name, email, and profile preferences." },
                { title: "Travel Data", desc: "Destinations, dates, and group sizes." },
                { title: "Technical", desc: "IP address, browser type, and device info." },
                { title: "Interactions", desc: "How you use our AI planner and tools." }
            ]
        },
        {
            id: "03",
            title: "Usage",
            subtitle: "How We Use It",
            points: [
                "Personalizing AI-generated itineraries based on your style.",
                "Improving our machine learning models for better suggestions.",
                "Processing secure payments and booking confirmations.",
                "Providing 24/7 customer support for your active trips.",
                "Sending important updates about your travel plans."
            ]
        },
        {
            id: "04",
            title: "Security",
            subtitle: "Data Protection",
            content: "We employ industry-standard encryption and security protocols to ensure your data remains private and secure. Our systems are regularly audited to maintain the highest level of protection for our global community of travelers."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">

            <main className="flex-grow">
                {/* Dark Hero Section - Matching Services/Contact */}
                <section className="relative pt-40 pb-32 px-6 overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:40px_40px]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-[10vw] lg:text-[6vw] font-black text-white mb-8 tracking-tighter leading-[0.85]">

                                <span className="text-indigo-400"> Privacy <br /> Protocol</span>
                            </h1>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Last Updated: April 12, 2026</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Content Sections - White Background Pattern */}
                <div className="max-w-6xl mx-auto px-6 py-40 space-y-32">
                    {sections.map((section, idx) => (
                        <motion.section
                            key={section.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: idx * 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-12 gap-16"
                        >
                            <div className="md:col-span-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-5xl font-black text-slate-100">{section._id}</span>
                                    <div className="h-px flex-grow bg-slate-100"></div>
                                </div>
                                <h2 className="text-xs font-black uppercase tracking-[0.5em] text-indigo-600 mb-4">{section.title}</h2>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{section.subtitle}</h3>
                            </div>

                            <div className="md:col-span-8">
                                {section.content && (
                                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                        {section.content}
                                    </p>
                                )}

                                {section.items && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        {section.items.map((item, i) => (
                                            <div key={i} className="p-10 rounded-[48px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group">
                                                <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {section.points && (
                                    <ul className="space-y-6">
                                        {section.points.map((point, i) => (
                                            <li key={i} className="flex items-start gap-6 group">
                                                <span className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-black shrink-0 mt-1">
                                                    {i + 1}
                                                </span>
                                                <p className="text-lg text-slate-600 font-medium pt-3">{point}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </motion.section>
                    ))}

                    {/* Information Section - No Form */}

                    <div className="relative p-12 md:p-20 rounded-[60px] 
bg-gradient-to-br from-[#1e2a4a] via-[#0f172a] to-[#020617] 
text-white overflow-hidden shadow-2xl">

                        {/* subtle pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] 
    bg-[radial-gradient(circle,white_1px,transparent_1px)] 
    [background-size:40px_40px]"></div>
                        </div>

                        <div className="relative z-10 text-center max-w-3xl mx-auto">

                            {/* small tag */}
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-300 mb-4">
                                05. Sovereignty
                            </p>

                            {/* heading */}
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                                Your Data, <br /> Your Rules.
                            </h2>

                            {/* description */}
                            <p className="text-slate-300 text-lg leading-relaxed mb-10">
                                To ensure the highest level of security and verification, we do not use automated forms for data requests.
                                If you wish to export, modify, or erase your digital footprint, please contact our dedicated privacy team directly.
                            </p>

                            {/* bottom badge */}
                            <div className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-300">
                                <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                                GDPR & CCPA Compliant
                            </div>

                        </div>
                    </div>
                    {/* Contact Footer */}
                    <div className="text-center pt-20">
                        <p className="text-slate-400 font-black mb-8 uppercase tracking-[0.3em] text-xs">Need further clarification?</p>
                        <a href="mailto:privacy@tripplanner.ai" className="inline-flex items-center gap-6 text-xl md:text-4xl font-black text-slate-900 hover:text-indigo-600 transition-colors group tracking-tighter">
                            privacy@tripplanner.ai
                            <span className="text-3xl group-hover:translate-x-4 transition-transform">&rarr;</span>
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
