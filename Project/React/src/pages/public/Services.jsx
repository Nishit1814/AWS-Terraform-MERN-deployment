
import Footer from '../../component/layouts/Footer';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Services = () => {
    const navigate = useNavigate();
    const services = [
        {
            title: "AI Trip Planning",
            description: "Our advanced AI algorithms analyze your preferences to create the perfect, personalized itinerary for your next adventure.",
            icon: "🤖",
            color: "bg-indigo-500/10 text-indigo-400",
            tag: "Popular"
        },
        {
            title: "Group Adventures",
            description: "Join like-minded explorers on curated group trips. Make new friends while discovering the hidden gems of India.",
            icon: "👥",
            color: "bg-blue-500/10 text-blue-400",
            tag: "Social"
        },
        {
            title: "Culinary Trails",
            description: "Experience the diverse flavors of India with our specialized food tours, from street food to fine dining.",
            icon: "🍲",
            color: "bg-orange-500/10 text-orange-400",
            tag: "Foodie"
        },
        {
            title: "Cultural Compass",
            description: "Deep dive into India's rich heritage with expert-led tours of historical monuments and spiritual sites.",
            icon: "⛩️",
            color: "bg-emerald-500/10 text-emerald-400",
            tag: "Heritage"
        },
        {
            title: "Seamless Bookings",
            description: "From flights to hotels and local transport, we handle all the logistics so you can focus on the journey.",
            icon: "💳",
            color: "bg-purple-500/10 text-purple-400",
            tag: "Easy"
        },
        {
            title: "24/7 Support",
            description: "Our dedicated support team is always available to assist you during your travels, ensuring a worry-free experience.",
            icon: "📞",
            color: "bg-rose-500/10 text-rose-400",
            tag: "Secure"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white selection:bg-indigo-500 selection:text-white">

            <main className="flex-grow">
                {/* Premium Hero Section */}
                <section className="relative pt-40 pb-24 px-6 overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:40px_40px]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="lg:col-span-8"
                            >
                                <h1 className="text-[7vw] lg:text-[5vw] font-black text-white mb-8 tracking-tighter leading-[0.85]">
                                    Elevating <br />
                                    <span className="text-indigo-400">The Journey</span>
                                </h1>
                                <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                                    We merge high-precision AI with deep-rooted local wisdom to craft travel experiences that are as unique as you are.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="lg:col-span-4 hidden lg:block"
                            >
                                <div className="relative group">
                                    <div className="absolute -inset-3 bg-indigo-500/20 rounded-[60px] blur-3xl group-hover:bg-indigo-500/30 transition-all"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2021"
                                        alt="Premium Travel"
                                        className="relative z-10 rounded-[60px] shadow-2xl grayscale group-hover:grayscale-11 transition-all duration-700"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="max-w-7xl mx-auto px-6 py-40">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative p-12 rounded-[64px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500"
                            >
                                <div className="absolute top-10 right-10">
                                    <span className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                        {service.tag}
                                    </span>
                                </div>
                                <div className={`w-20 h-20 ${service.color} rounded-3xl flex items-center justify-center text-4xl mb-12 group-hover:scale-110 transition-transform`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">{service.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed text-lg">
                                    {service.description}
                                </p>
                                <div className="mt-10 pt-10 border-t border-slate-200/50">
                                    <button
                                        onClick={() => navigate("/register")}
                                        className="text-indigo-600 font-black uppercase tracking-widest text-xs flex items-center gap-3 group/btn">
                                        Explore Service <span className="group-hover/btn:translate-x-2 transition-transform">&rarr;</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-6 py-40">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] 
                        rounded-[70px] p-16 md:p-28 text-center text-white overflow-hidden 
                        shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] border border-white/5"
                    >

                        {/* GLOW EFFECTS (clean, no dots) */}
                        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full"></div>
                        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full"></div>

                        {/* SOFT CENTER LIGHT */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">

                            {/* HEADING */}
                            <h2 className="text-4xl md:text-4xl font-black tracking-tight mb-6 leading-tight">
                                Ready to write your next chapter? <br />
                            </h2>

                            {/* SUBTEXT */}
                            <p className="text-slate-400 text-lg md:text-xl mb-12 leading-relaxed">
                                Join thousands of explorers discovering India with AI-powered journeys crafted just for you.
                            </p>

                            {/* BUTTONS */}
                            <div className="flex flex-col sm:flex-row gap-5 justify-center">

                                {/* PRIMARY BUTTON */}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-10 py-4 rounded-2xl font-bold uppercase tracking-wider text-sm bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 transition-all shadow-lg shadow-indigo-500/30" >
                                    Plan My Trip
                                </button>

                                {/* SECONDARY BUTTON */}
                                <button
                                    onClick={() => navigate("/contact")}
                                    className="px-10 py-4 rounded-2xl font-bold uppercase tracking-wider text-sm bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all">
                                    Contact Support
                                </button>

                            </div>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};


